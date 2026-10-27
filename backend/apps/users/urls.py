from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, LoginView, MeView, AddressViewSet, StaffListView, SyncPasswordView

router = DefaultRouter()
router.register('addresses', AddressViewSet, basename='address')

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='auth-register'),
    path('auth/login/', LoginView.as_view(), name='auth-login'),
    path('auth/me/', MeView.as_view(), name='auth-me'),
    path('auth/sync-password/', SyncPasswordView.as_view(), name='auth-sync-password'),
    path('users/sync-password/', SyncPasswordView.as_view(), name='users-sync-password'),
    path('staff/', StaffListView.as_view(), name='staff-list'),
    path('', include(router.urls)),
]
