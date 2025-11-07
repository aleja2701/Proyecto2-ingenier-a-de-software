from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import LabSpecialistViewSet

router = DefaultRouter()
router.register(r'specialists', LabSpecialistViewSet)

urlpatterns = [
    path('', include(router.urls)),
]