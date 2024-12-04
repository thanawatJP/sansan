# blog/models.py
from django.db import models
from django.conf import settings

# หมวดหมู่กระทู้
class Category(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    picture = models.ImageField(upload_to='category_pics/', blank=True, null=True)
    
    def __str__(self):
        return self.name

# กระทู้
class Thread(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    categories = models.ManyToManyField(Category)
    content = models.TextField()
    image = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    likes = models.PositiveIntegerField(default=0)
    dislikes = models.PositiveIntegerField(default=0)
    comments = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.content
    
    def increment_comments(self):
        self.comments += 1
        self.save(update_fields=['comments'])

    def decrement_comments(self):
        self.comments -= 1
        self.save(update_fields=['comments'])

# ความคิดเห็นในกระทู้
class Comment(models.Model):
    thread = models.ForeignKey(Thread, on_delete=models.CASCADE)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    likes = models.PositiveIntegerField(default=0)
    dislikes = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.author} on {self.thread.title}"
    
    def increment_likes(self):
        self.likes += 1
        self.save(update_fields=['likes'])
    
    def decrement_likes(self):
        self.likes -= 1
        self.save(update_fields=['likes'])

    def increment_dislikes(self):
        self.dislikes += 1
        self.save(update_fields=['dislikes'])

    def decrement_dislikes(self):
        self.dislikes -= 1
        self.save(update_fields=['dislikes'])

# การ Like/Dislike กระทู้
class LikeDislike(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    thread = models.ForeignKey(Thread, on_delete=models.CASCADE)
    is_like = models.BooleanField()

    class Meta:
        unique_together = ('user', 'thread')  # ไม่ให้ผู้ใช้เดียวกัน Like หรือ Dislike ซ้ำ

    def __str__(self):
        return f"{'Like' if self.is_like else 'Dislike'} by {self.user} on {self.thread.title}"
    
class LikeDislikeComment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE)
    is_like = models.BooleanField()

    class Meta:
        unique_together = ('user', 'comment')  # ไม่ให้ผู้ใช้เดียวกัน Like หรือ Dislike ซ้ำ

    def __str__(self):
        return f"{'Like' if self.is_like else 'Dislike'} by {self.user} on {self.comment}"

# การรายงานกระทู้
class Report(models.Model):
    thread = models.ForeignKey(Thread, on_delete=models.CASCADE)
    reporter = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    reason = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Report by {self.reporter} on {self.thread.title}"
