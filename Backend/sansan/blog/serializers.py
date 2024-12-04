from rest_framework import serializers
from .models import *
from sansan_auth.models import UserProfile
from django.utils.timesince import timesince
from datetime import datetime, timedelta
from django.utils import timezone
from django.contrib.auth.models import User

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']

class ThreadWriteSerializer(serializers.ModelSerializer):
    categories = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), many=True)

    class Meta:
        model = Thread
        fields = ['content', 'categories']

class UserThreadSerializer(serializers.ModelSerializer):
    author = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    categories = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), many=True)

    class Meta:
        model = Thread
        fields = ['id', 'author', 'categories', 'content', 'image', 'likes', 'dislikes', 'comments', 'created_at']



class ThreadSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()
    created = serializers.SerializerMethodField()
    categories = CategorySerializer(many=True)
    reacted = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    class Meta:
        model = Thread
        fields = ['id', 'author', 'categories', 'content', 'image', 'likes', 'dislikes', 'comments', 'created', 'reacted']

    def get_author(self, obj):
        # ดึงข้อมูลของผู้เขียนในรูปแบบที่กำหนดเอง
        profile = UserProfile.objects.get(user=obj.author)
        return {
            'id': obj.author.id,
            'name': f"{profile.first_name} {profile.last_name}",
            'image': profile.profile_picture.url if profile.profile_picture else "https://as2.ftcdn.net/v2/jpg/00/75/13/21/1000_F_75132173_Q2qwAkjh3iJ6erWAGEghioG0FrdGKNja.jpg"
        }
    
    def get_created(self, obj):
        delta = timezone.now() - obj.created_at

        if delta < timedelta(minutes=60):
            minutes = int(delta.total_seconds() // 60)
            return f"{minutes} นาทีที่แล้ว"
        elif delta < timedelta(hours=24):
            hours = int(delta.total_seconds() // 3600)
            return f"{hours} ชั่วโมงที่แล้ว"
        elif delta < timedelta(days=7):
            days = delta.days
            return f"{days} วันที่แล้ว"
        elif delta < timedelta(days=30):
            weeks = delta.days // 7
            return f"{weeks} อาทิตย์ที่แล้ว"
        elif delta < timedelta(days=365):
            months = delta.days // 30
            return f"{months} เดือนที่แล้ว"
        else:
            years = delta.days // 365
            return f"{years} ปีที่แล้ว"

    def get_reacted(self, obj):
        request = self.context.get('request')
        print(request)
        if request and request.user.is_authenticated:
            reacted = LikeDislike.objects.filter(user=request.user, thread_id=obj.id).first()
            if reacted:
                return reacted.is_like
            return None
        return None
    
    def get_image(self, obj):
        return obj.image.url if obj.image else None

class CommentSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()
    created = serializers.SerializerMethodField()
    user_reaction = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'author', 'content', 'likes', 'dislikes', 'created', 'user_reaction']

    def get_author(self, obj):
        # ดึงข้อมูลของผู้เขียนในรูปแบบที่กำหนดเอง
        profile = UserProfile.objects.get(user=obj.author)
        return {
            'id': obj.author.id,
            'name': f"{profile.first_name} {profile.last_name}",
            'image': profile.profile_picture.url if profile.profile_picture else "https://ichef.bbci.co.uk/ace/ws/640/cpsprodpb/291b/live/5899ec60-3055-11ee-8f52-fbf70e4bf742.jpg.webp"
        }
    
    def get_created(self, obj):
        delta = timezone.now() - obj.created_at

        if delta < timedelta(minutes=60):
            minutes = int(delta.total_seconds() // 60)
            return f"{minutes} นาทีที่แล้ว"
        elif delta < timedelta(hours=24):
            hours = int(delta.total_seconds() // 3600)
            return f"{hours} ชั่วโมงที่แล้ว"
        elif delta < timedelta(days=7):
            days = delta.days
            return f"{days} วันที่แล้ว"
        elif delta < timedelta(days=30):
            weeks = delta.days // 7
            return f"{weeks} อาทิตย์ที่แล้ว"
        elif delta < timedelta(days=365):
            months = delta.days // 30
            return f"{months} เดือนที่แล้ว"
        else:
            years = delta.days // 365
            return f"{years} ปีที่แล้ว"
    
    def get_user_reaction(self, obj):
        user = self.context.get('request').user
        if user.is_authenticated:
            # Try to get the user's reaction to this comment
            try:
                reaction = LikeDislikeComment.objects.get(user=user, comment=obj)
                return reaction.is_like  # Returns True if like, False if dislike
            except LikeDislikeComment.DoesNotExist:
                return None  # If no reaction exists, return None
        return None

class LikeDislikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LikeDislike
        fields = '__all__'

class CategoriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category  # กำหนดโมเดลที่ใช้
        fields = ['id', 'name', 'description', 'picture']
    
class LikeDislikeCommentSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=UserProfile.objects.all())
    comment = serializers.PrimaryKeyRelatedField(queryset=Comment.objects.all())

    class Meta:
        model = LikeDislikeComment
        fields = ['user', 'comment', 'is_like']
