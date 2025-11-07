from rest_framework import viewsets
from .models import LabResult
from .serializers import LabResultSerializer

class LabResultViewSet(viewsets.ModelViewSet):
    queryset = LabResult.objects.all()
    serializer_class = LabResultSerializer
    
    def get_queryset(self):
        queryset = LabResult.objects.all()
        admission_code = self.request.query_params.get('admission_code', None)
        if admission_code is not None:
            queryset = queryset.filter(patient__admission_code=admission_code)
        return queryset
