from rest_framework import serializers
from .models import Patient

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ['id', 'document', 'admission_code', 'first_name', 'last_name', 'address', 'phone']
        read_only_fields = ['admission_code']  # El código de admisión se generará automáticamente