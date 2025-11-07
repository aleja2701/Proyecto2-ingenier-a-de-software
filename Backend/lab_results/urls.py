from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import LabResultViewSet

router = DefaultRouter()
router.register(r'results', LabResultViewSet)

urlpatterns = [
    path('', include(router.urls)),
]