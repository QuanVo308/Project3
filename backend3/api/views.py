from urllib import request
from django.http import HttpResponse
from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import *
from .utils import *
from .serializers import *
from .models import *


def index(request):
    return HttpResponse("Hello, world!!!!")

def test(request):
    pop = Pop.objects.filter()[0]
    # print(get_pop_rangeIP(pop))
    devices = Device.objects.filter()
    # print(Device.objects.filter(pop = device.pop))
    for device in devices:
        print(device.id)
        print(validate_device(device))
        print(get_device_ips(device))
        print("gateway", get_device_gateway(device))
        print('subnet', get_device_subnet(device))
        device.gateway = get_device_gateway(device)
        device.subnet = get_device_subnet(device)
        device.save()
        print('\n\n')
    return HttpResponse("Test")


class AreaViewSet(viewsets.ModelViewSet):
    queryset = Area.objects.all()
    serializer_class = AreaSerializer


class ProvinceViewSet(viewsets.ModelViewSet):
    queryset = Province.objects.all()
    serializer_class = ProvinceSerializer


class BranchViewSet(viewsets.ModelViewSet):
    queryset = Branch.objects.all()
    serializer_class = BranchSerializer


class PopPlusViewSet(viewsets.ModelViewSet):
    queryset = PopPlus.objects.all()
    serializer_class = PopPlusSerializer


    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        
        serializer = self.get_serializer(queryset, many=True)
        for se in serializer.data:
            se['branch_name'] = Branch.objects.filter(id = se['branch'])[0].name
        return Response(serializer.data)

    def create(self, request):
        t = request.data.copy()
        t._mutable = True
        t['branch'] = Branch.objects.filter(name = request.data['branch'])[0]

        pp = PopPlus()
        for i in t:
            setattr(pp, i, t[i])

        request.data._mutable = True
        request.data['branch'] = pp.branch.id

        # print(validate_popplus(pp))

        if validate_popplus(pp):
            s = self.serializer_class(data=request.data)
            # print('zxczxczxc')
            s.is_valid(raise_exception=True)
            self.perform_create(s)
            return HttpResponse('success')
        
        else:
            return HttpResponse('fail')


class PopViewSet(viewsets.ModelViewSet):
    queryset = Pop.objects.all()
    serializer_class = PopSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        
        serializer = self.get_serializer(queryset, many=True)
        for se in serializer.data:
            se['province_name'] = Province.objects.filter(id = se['province'])[0].name
            se['popplus_name'] = PopPlus.objects.filter(id = se['popPlus'])[0].name
        return Response(serializer.data)
    
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
            self.perform_create(s)
            headers = self.get_success_headers(s.data)

            # return HttpResponse('success')
            return Response(s.data, status= status.HTTP_201_CREATED, headers=headers)
        
        else:
            return HttpResponse('fail')


class DeviceViewSet(viewsets.ModelViewSet):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        
        serializer = self.get_serializer(queryset, many=True)
        for se in serializer.data:
            se['brand_name'] = Brand.objects.filter(id = se['brand'])[0].name
            se['pop_name'] = Pop.objects.filter(id = se['pop'])[0].name
        return Response(serializer.data)
    
    def create(self, request):
        request.data._mutable = True
        print(get_device_name(request.data))
        request.data['name'] = get_device_name(request.data)

        t = request.data.copy()
        t._mutable = True

        if not Brand.objects.filter(name = request.data['brand']) or not Pop.objects.filter(name = request.data['pop'])[0]:
            return HttpResponse('fail')

        t['brand'] = Brand.objects.filter(name = request.data['brand'])[0]
        t['pop'] = Pop.objects.filter(name = request.data['pop'])[0]


        request.data['pop'] = Pop.objects.filter(name = request.data['pop'])[0].id
        request.data['brand'] = Brand.objects.filter(name = request.data['brand'])[0].id

        pp = Device()
        for i in t:
            setattr(pp, i, t[i])
        
        if len(get_device_ips(pp)) != 0:
            pp.ip = get_device_ips(pp)[0]
            request.data['ip'] = pp.ip
            # print(pp.ip)
        else:
            return HttpResponse('fail')

        request.data['subnet'] = get_device_subnet(pp)
        request.data['gateway'] = get_device_gateway(pp)
        pp.subnet = request.data['subnet']
        pp.gateway = request.data['gateway']

        # print(request.data)
        # print(vars(pp))

        if validate_device(pp):
            s = self.serializer_class(data=request.data)
            # print('zxczxczxc')
            s.is_valid(raise_exception=True)
            # self.perform_create(s)
            return HttpResponse('success')
        
        else:
            return HttpResponse('fail')



class BrandViewSet(viewsets.ModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    
