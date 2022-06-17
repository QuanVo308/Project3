from re import T
from django.http import HttpResponse
from rest_framework import viewsets
# from rest_framework import Response
from .models import *
from .utils import *
from .serializers import *
from .models import *
from rest_framework import status
from rest_framework.response import Response
from rest_framework.settings import api_settings


def index(request):
    return HttpResponse("Hello, world!!!!")

def test(request):
    pop = Pop.objects.filter()[0]
    popp = PopPlus.objects.filter()[0]
    print(validate_pop(pop))
    print(validate_popplus(popp))
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

    def create(self, request):
        t = request.data.copy()
        t._mutable = True
        t['branch'] = Branch.objects.filter(id = request.data['branch'])[0]

        pp = PopPlus()
        for i in t:
            setattr(pp, i, t[i])

        print(validate_popplus(pp))

        if validate_popplus(pp):
            s = self.serializer_class(data=request.data)
            s.is_valid(raise_exception=True)
            self.perform_create(s)
            return HttpResponse('success')
        
        else:
            return HttpResponse('fail')


class PopViewSet(viewsets.ModelViewSet):
    queryset = Pop.objects.all()
    serializer_class = PopSerializer
    
    def create(self, request):
        t = request.data.copy()
        t._mutable = True
        t['province'] = Province.objects.filter(id = request.data['province'])[0]
        t['popPlus'] = PopPlus.objects.filter(id = request.data['popPlus'])[0]

        pp = Pop()
        for i in t:
            setattr(pp, i, t[i])
        # setattr(pp, 'ip', get_pop_rangeIP(pp))
        pp.range_ip = get_pop_rangeIP(pp)
        request.data._mutable = True
        request.data['range_ip'] = get_pop_rangeIP(pp)
        # print(pp.ip)

        if validate_pop(pp):
            s = self.serializer_class(data=request.data)
            s.is_valid(raise_exception=True)
            # self.perform_create(s)
            headers = self.get_success_headers(s.data)

            # return HttpResponse('success')
            return Response(s.data, status=status.HTTP_201_CREATED, headers=headers)
        
        else:
            return HttpResponse('fail')


class DeviceViewSet(viewsets.ModelViewSet):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer


class BrandViewSet(viewsets.ModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    