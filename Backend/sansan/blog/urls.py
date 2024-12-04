from django.urls import path, include
from .views import *

urlpatterns = [
    path('home/', ThreadList.as_view(), name='home'),
    path('thread/', UserThreadView.as_view(), name='userThread'),
    path('mythread/<int:user_id>/', UserThreadList.as_view(), name='userThreadList'),
    path('mythread/edit/<int:thread_id>/', EditThread.as_view(), name='edit-thread'),
    path('mythread/delete/<int:thread_id>/', EditThread.as_view(), name='edit-thread'),
    path('category/', CategoryView.as_view(), name='category'),
    path("threads/reacts/<int:thread_id>/", LikeDislikeView.as_view(), name="like"),
    path('search-results/', SearchView.as_view(), name='search'),
    path('search-results/categories/<int:category_id>/', CategorySearchView.as_view(), name='cat-search'),
    path('subscribe/', SubscriptionView.as_view(), name='subscribe'),
    path('subscribe/<int:category_id>/', SubscriptionView.as_view(), name='manage-subscribe'),
    path('thread/<int:thread_id>/', ThreadView.as_view(), name='thread'),
    path('comments/<int:thread_id>/', CommentThreadList.as_view(), name='comments'),
    path('comment/<int:thread_id>/', CommentThread.as_view(), name='comment'),
    path('comment/like/<int:comment_id>/', ReactionComment.as_view(), name='reation_comment'),
]
