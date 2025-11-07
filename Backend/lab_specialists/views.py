from rest_framework import viewsets
from .models import LabSpecialist
from .serializers import LabSpecialistSerializer

class LabSpecialistViewSet(viewsets.ModelViewSet):
    queryset = LabSpecialist.objects.all()
    serializer_class = LabSpecialistSerializer
    
    def get_queryset(self):
        queryset = LabSpecialist.objects.all()
        internal_code = self.request.query_params.get('internal_code', None)
        if internal_code is not None:
            queryset = queryset.filter(internal_code=internal_code)
        return queryset
