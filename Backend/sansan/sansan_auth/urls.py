from django.urls import path, include
from .views import userRegisterView, UserLoginView, UserDataView

urlpatterns = [
    path('register/', userRegisterView.as_view(), name='user_register'),
    path('login/', UserLoginView.as_view(), name='user_login'),
    path('profile/<int:userprofile_id>', UserDataView.as_view(), name='user_data'),
]