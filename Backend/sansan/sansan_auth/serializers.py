from rest_framework import serializers
from .models import UserProfile

class userSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id' ,'first_name', 'last_name', 'profile_picture', 'bio']
