
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from patients.views import PatientViewSet
from lab_specialists.views import LabSpecialistViewSet
from lab_results.views import LabResultViewSet

# Crear el router principal
router = routers.DefaultRouter()
router.register(r'patients', PatientViewSet)
router.register(r'specialists', LabSpecialistViewSet)
router.register(r'results', LabResultViewSet)

# URLs de la API
urlpatterns = [
    path('', include(router.urls)),  # Ruta raíz redirige a la API
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    # Añadir la autenticación de la API
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]
