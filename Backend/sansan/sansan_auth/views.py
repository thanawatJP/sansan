from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.db import transaction
from django.db.models import Q
from .serializers import userSerializer
from .models import UserProfile
from rest_framework_simplejwt.authentication import JWTAuthentication
import os
from django.conf import settings
from django.core.files.storage import default_storage

class userRegisterView(APIView):
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    @transaction.atomic
    def post(self, request):
        user = User.objects.create_user(
            username=request.data.get('username'),
            password=request.data.get('password'),
            email=request.data.get('email')
        )
        
        serializer = userSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user)  # เชื่อมโยงกับตาราง User
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
def generate_token_response(user, role):
    refresh = RefreshToken.for_user(user)
    return {
        'message': 'Login successful',
        'role': role,
        'access': str(refresh.access_token),
        'refresh': str(refresh)
    }
    
class UserLoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = User.objects.get(Q(username=username) | Q(email=username))
        user = authenticate(username=user.username, password=password)

        if not user:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        
        if user.is_superuser:
            return Response(generate_token_response(user, 'admin'), status=status.HTTP_200_OK)

        try:
            # userLogin = UserProfile.objects.get(user__username=username)
            userLogin = UserProfile.objects.get(user=user)
        except UserProfile.DoesNotExist:
            return Response({'error': 'Username not found'}, status=status.HTTP_404_NOT_FOUND)

        token_response = generate_token_response(user, 'user')
        token_response.update({
            'user_auth_id': user.id,
            'userprofile_id': userLogin.id,
            'username': userLogin.user.username,
        })
        return Response(token_response, status=status.HTTP_200_OK)

class UserDataView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    def get(self, request, userprofile_id):
        try:
            userData = UserProfile.objects.get(id=userprofile_id)
            if userData.user != request.user:
                return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

            serializer = userSerializer(userData)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except UserProfile.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
    def put(self, request, userprofile_id):
        try:
            userData = UserProfile.objects.get(id=userprofile_id)
            if userData.user != request.user:
                return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

            # ลบรูปภาพเก่าหากมีการอัปโหลดรูปภาพใหม่
            if 'profile_picture' in request.data:
                old_img_path = os.path.join(settings.MEDIA_ROOT, str(userData.profile_picture))
                if os.path.exists(old_img_path):
                    os.remove(old_img_path)  # ลบรูปภาพเก่า

            # อัปเดตข้อมูลผู้ใช้
            serializer = userSerializer(userData, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except UserProfile.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)