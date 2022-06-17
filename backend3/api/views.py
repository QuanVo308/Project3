from django.http import HttpResponse
from rest_framework import viewsets
# from rest_framework import Response
from .models import *
from .ultility import *
from .serializers import *
from .models import *


def index(request):
    return HttpResponse("Hello, world!!!!")

def test(request):
    pop = Pop.objects.filter()[0]
    print(validate_pop(pop))
    return HttpResponse("Test")


class AreaViewSet(viewsets.ModelViewSet):
    queryset = Area.objects.all()
    serializer_class = AreaSerializer

    def get_Area(self):
        return self.list()


class ProvinceViewSet(viewsets.ModelViewSet):
    queryset = Province.objects.all()
    serializer_class = ProvinceSerializer


class BranchViewSet(viewsets.ModelViewSet):
    queryset = Branch.objects.all()
    serializer_class = BranchSerializer


class PopPlusViewSet(viewsets.ModelViewSet):
    queryset = PopPlus.objects.all()
    serializer_class = PopPlusSerializer


class PopViewSet(viewsets.ModelViewSet):
    queryset = Pop.objects.all()
    serializer_class = PopSerializer


class DeviceViewSet(viewsets.ModelViewSet):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer


class BrandViewSet(viewsets.ModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    
