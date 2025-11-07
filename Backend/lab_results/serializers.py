from rest_framework import serializers
from .models import LabResult
from patients.serializers import PatientSerializer
from lab_specialists.serializers import LabSpecialistSerializer

class LabResultSerializer(serializers.ModelSerializer):
    patient_details = PatientSerializer(source='patient', read_only=True)
    specialist_details = LabSpecialistSerializer(source='specialist', read_only=True)

    class Meta:
        model = LabResult
        fields = ['id', 'patient', 'specialist', 'total_cholesterol', 'hdl_cholesterol', 
                 'ldl_cholesterol', 'triglycerides', 'created_at', 
                 'patient_details', 'specialist_details']
        read_only_fields = ['created_at']