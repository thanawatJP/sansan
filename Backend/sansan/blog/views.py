from django.shortcuts import render, get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
from .serializers import *
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.db import transaction
from .models import *
from django.db.models import Q, Count
from rest_framework_simplejwt.authentication import JWTAuthentication
from sansan_auth.models import UserProfile
import random

def check_user(user_data, user_request):
    if user_data != user_request:
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
    return True

class ThreadList(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        threads = Thread.objects.all().order_by('-created_at')
        serializer = ThreadSerializer(threads, many=True, context={'request': request})
        return Response(serializer.data)

class UserThreadView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = UserThreadSerializer(data=request.data)
        if serializer.is_valid():
            # สร้างอินสแตนซ์ของ Thread โดยไม่บันทึก categories ทันที
            thread = serializer.save()

            # แปลง categories ให้เป็น array หากจำเป็น
            categories = request.data.getlist('categories')  # ใช้ getlist() เพื่อดึงค่าหลายค่า
            if categories:
                thread.categories.set(categories)  # ใช้ set() เพื่อเพิ่ม categories
            thread.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserThreadList(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        threads = Thread.objects.filter(author=user_id)
        serializer = ThreadSerializer(threads, many=True)
        return Response(serializer.data)
    
class EditThread(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def put(self, request, thread_id):
        try:
            thread = Thread.objects.get(id=thread_id, author=request.user)
        except Thread.DoesNotExist:
            return Response(
                {'error': 'Thread not found or you do not have permission to edit this thread.'},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ThreadWriteSerializer(thread, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()

            # จัดการกับ categories
            categories = request.data.get('categories')
            if categories is not None:
                thread.categories.set(categories)  # ใช้ set() แทน add/remove เพื่อกำหนดใหม่ทั้งหมด

            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, thread_id):
        try:
            thread = Thread.objects.get(id=thread_id, author=request.user)
        except Thread.DoesNotExist:
            return Response({'error': 'Thread not found or you do not have permission to delete this thread.'}, status=status.HTTP_404_NOT_FOUND)

        thread.delete()
        return Response({'message': 'Thread deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
    
class CategoryView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        category = Category.objects.all()
        serializer = CategoriesSerializer(category, many=True)
        return Response(serializer.data)

class SubscriptionView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        # ไม่ต้องล็อกอินก็เข้าถึงได้
        try:
            userData = UserProfile.objects.get(user_id=request.user.id) if request.user.is_authenticated else None
            subscribed_categories = userData.categories.all().order_by('name') if userData else []
            serializer_1 = CategoriesSerializer(subscribed_categories, many=True)
            unsub_categories = Category.objects.exclude(id__in=subscribed_categories.values_list('id', flat=True)) if userData else Category.objects.all()
            serializer_2 = CategoriesSerializer(unsub_categories.order_by('name'), many=True)
            return Response({'sub_categories': serializer_1.data, 'unsub_categories': serializer_2.data}, status=status.HTTP_200_OK)
        except UserProfile.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
    def put(self, request, category_id):
        # ต้องล็อกอินเพื่อใช้งาน
        try:
            userData = UserProfile.objects.get(user_id=request.user.id)
            category = Category.objects.get(id=category_id)
            check_user(userData.user, request.user)
            if category in userData.categories.all():
                userData.categories.remove(category)
                return Response({'message': 'Successfully unfollowed the category'}, status=status.HTTP_200_OK)
            else:
                userData.categories.add(category)
                return Response({'message': 'Successfully followed the category'}, status=status.HTTP_200_OK)  
        except UserProfile.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


class ThreadView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, thread_id):
        thread = get_object_or_404(Thread, id=thread_id)
        serializer = ThreadSerializer(thread)
        return Response(serializer.data)

class CommentThreadList(APIView):
    permission_classes = [AllowAny]

    def get(self, request, thread_id):
        comments = Comment.objects.filter(thread_id=thread_id).order_by('-created_at')
        print(request.user.id)
        serializer = CommentSerializer(comments, many=True, context={'request': request})
        return Response(serializer.data)

class CommentThread(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request, thread_id):
        thread = get_object_or_404(Thread, id=thread_id)
        data = request.data.copy()
        data['thread'] = thread.id
        serializer = CommentSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            serializer.save(author=request.user, thread=thread)
            thread.increment_comments()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, thread_id):
        comment = get_object_or_404(Comment, id=thread_id)
        serializer = CommentSerializer(comment, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @transaction.atomic
    def delete(self, request, thread_id):
        comment = get_object_or_404(Comment, id=thread_id)
        thread = comment.thread
        comment.delete()
        thread.decrement_comments()
        return Response(status=status.HTTP_204_NO_CONTENT)

class ReactionComment(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    @transaction.atomic
    def post(self, request, comment_id):
        comment = get_object_or_404(Comment, id=comment_id)
        user = request.user

        is_like = request.data.get('is_like')
        try:
            # Check if the user already liked/disliked this comment
            comment_like_dislike = LikeDislikeComment.objects.get(user=user, comment=comment)
            # If the user is trying to do the same action, delete the record to "unlike" or "undislike"
            if comment_like_dislike.is_like == is_like:
                comment_like_dislike.delete()
                comment.decrement_likes() if is_like else comment.decrement_dislikes()
                return Response({"message": "Removed like/dislike."}, status=status.HTTP_204_NO_CONTENT)
            else:
                # Update the action if it's different from the previous one
                comment_like_dislike.is_like = is_like
                comment_like_dislike.save()
                if is_like:
                    comment.increment_likes()
                    comment.decrement_dislikes()
                else:
                    comment.increment_dislikes()
                    comment.decrement_likes()
                return Response({"message": "Updated to like/dislike."}, status=status.HTTP_200_OK)
        except LikeDislikeComment.DoesNotExist:
            # Create a new like/dislike record if none exists
            LikeDislikeComment.objects.create(user=user, comment=comment, is_like=is_like)
            if is_like:
                comment.increment_likes()
            else:
                comment.increment_dislikes()
            return Response({"message": "Liked/disliked comment."}, status=status.HTTP_201_CREATED)

class LikeDislikeView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        elif self.request.method == 'POST':
            return [IsAuthenticated()]
        return super().get_permissions()

    def get(self, request, thread_id):
        serializer = LikeDislikeSerializer(LikeDislike.objects.filter(thread=thread_id), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, thread_id):
        is_like = request.data.get('like')
        reacted = LikeDislike.objects.filter(user=request.user, thread_id=thread_id).first()
        thread = Thread.objects.get(id=thread_id)

        if reacted:
            if reacted.is_like == is_like:
                if is_like:
                    thread.likes -= 1
                else:
                    thread.dislikes -= 1
                thread.save()
                reacted.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)

            reacted.is_like = is_like
            reacted.save()
            if is_like:
                thread.likes += 1
                thread.dislikes -= 1
            else:
                thread.dislikes += 1
                thread.likes -= 1
            thread.save()
            return Response(status=status.HTTP_200_OK)

        LikeDislike.objects.create(user=request.user, thread_id=thread_id, is_like=is_like)

        if is_like:
            thread.likes += 1
        else:
            thread.dislikes += 1
        thread.save()

        return Response(status=status.HTTP_201_CREATED)

class SearchView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        query = request.GET.get('search')
        threads = Thread.objects.filter(content__icontains=query)

        serializer = ThreadSerializer(threads, many=True, context = {'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

class CategorySearchView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, category_id):
        threads = Thread.objects.filter(categories__id=category_id)

        serializer = ThreadSerializer(threads, many=True, context = {'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)