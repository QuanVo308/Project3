from rest_framework import serializers
from .models import *


class AreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Area
        fields = '__all__'

class ProvinceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Province
        fields = '__all__'

class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = '__all__'

class PopPlusSerializer(serializers.ModelSerializer):
    branch_name = serializers.ReadOnlyField(source='branch.name')
    class Meta:
        model = PopPlus
        fields = '__all__'


class PopSerializer(serializers.ModelSerializer):
    popPlus_name = serializers.ReadOnlyField(source='popPlus.name')
    province_name = serializers.ReadOnlyField(source='province.name')
    class Meta:
        model = Pop
        fields = '__all__'
        


class DeviceSerializer(serializers.ModelSerializer):
    pop_name = serializers.ReadOnlyField(source='pop.name')
    brand_name = serializers.ReadOnlyField(source='brand.name')
    class Meta:
        model = Device
        fields = '__all__'


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = '__all__'