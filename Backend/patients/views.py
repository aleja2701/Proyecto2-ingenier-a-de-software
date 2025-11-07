from rest_framework import viewsets
from .models import Patient
from .serializers import PatientSerializer
import datetime

class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    
    def perform_create(self, serializer):
        # Generar código de admisión automáticamente
        today = datetime.date.today()
        count = Patient.objects.filter(
            admission_code__startswith=f'ADM{today.year}{today.month:02d}'
        ).count()
        
        admission_code = f'ADM{today.year}{today.month:02d}{(count + 1):04d}'
        serializer.save(admission_code=admission_code)
