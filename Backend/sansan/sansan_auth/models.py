from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from blog.models import Category

# ข้อมูลโปรไฟล์ของผู้ใช้
class UserProfile(models.Model):
    # เชื่อมกับโมเดล User ของ Django
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    categories = models.ManyToManyField(Category)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    bio = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
