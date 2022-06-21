from urllib import request
from django.http import HttpResponse, JsonResponse
from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import *
# from .utils import *
from .utils.device import *
from .utils.pop import *
from .utils.popplus import *
from .serializers import *
from .models import *


def index(request):
    return HttpResponse("Hello, world!!!!")

def test(request):
    # print(Province.objects.filter(name = request.GET['area']))
    province = Province.objects.filter(area = request.GET['area']).values()
    return JsonResponse({'data': list(province), 'status': status.HTTP_201_CREATED})

def get_province_in_area(request):
    id = Area.objects.get(name = request.GET['name'])
    province = Province.objects.filter(area = id).values()
    return JsonResponse({'data': list(province), 'status': status.HTTP_201_CREATED})

def get_branch_in_province(request):
    id = Province.objects.get(name = request.GET['name'])
    branch = Branch.objects.filter(province = id).values()
    return JsonResponse({'data': list(branch), 'status': status.HTTP_201_CREATED})

def get_popplus_in_branch(request):
    id = Branch.objects.get(name = request.GET['name'])
    popplus = PopPlus.objects.filter(branch = id).values()
    return JsonResponse({'data': list(popplus), 'status': status.HTTP_201_CREATED})

def get_pop_in_popplus(request):
    id = PopPlus.objects.get(name = request.GET['name'])
    pop = Pop.objects.filter(popPlus = id).values()
    return JsonResponse({'data': list(pop), 'status': status.HTTP_201_CREATED})


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


    # def list(self, request, *args, **kwargs):
    #     queryset = self.filter_queryset(self.get_queryset())

    #     page = self.paginate_queryset(queryset)
    #     if page is not None:
    #         serializer = self.get_serializer(page, many=True)
    #         return self.get_paginated_response(serializer.data)

        
    #     serializer = self.get_serializer(queryset, many=True)
    #     for se in serializer.data:
    #         se['branch_name'] = Branch.objects.filter(id = se['branch'])[0].name
    #     return Response(serializer.data)

    def create(self, request):
        print(request.data)
        request.data._mutable = True


        t = request.data.copy()
        t._mutable = True
        t['branch'] = Branch.objects.filter(name = request.data['branch'])[0]

        pp = PopPlus()
        for i in t:
            setattr(pp, i, t[i])
        
        request.data['name'] = get_popplus_name(pp, request.data['tail1'], request.data['tail2'])
        pp.name = request.data['name']
        # print(request.data['name'])

        request.data['branch'] = pp.branch.id

        # print(validate_popplus(pp))

        if validate_popplus(pp):
            s = self.serializer_class(data=request.data)
            # print('zxczxczxc')
            s.is_valid(raise_exception=True)
            self.perform_create(s)
            headers = self.get_success_headers(s.data)
            return Response(s.data, status= status.HTTP_201_CREATED, headers=headers)
        
        else:
            return HttpResponse('fail')


class PopViewSet(viewsets.ModelViewSet):
    queryset = Pop.objects.all()
    serializer_class = PopSerializer

    # def list(self, request, *args, **kwargs):
    #     queryset = self.filter_queryset(self.get_queryset())

    #     page = self.paginate_queryset(queryset)
    #     if page is not None:
    #         serializer = self.get_serializer(page, many=True)
    #         return self.get_paginated_response(serializer.data)

        
    #     serializer = self.get_serializer(queryset, many=True)
    #     for se in serializer.data:
    #         se['province_name'] = Province.objects.filter(id = se['province'])[0].name
    #         se['popplus_name'] = PopPlus.objects.filter(id = se['popPlus'])[0].name
    #     return Response(serializer.data)
    
    def create(self, request):
        request.data._mutable = True
        request.data['province'] = PopPlus.objects.filter(name = request.data['popPlus'])[0].branch.province.id
        request.data['popPlus'] = PopPlus.objects.filter(name = request.data['popPlus'])[0].id
        t = request.data.copy()
        t._mutable = True
        t['province'] = Province.objects.filter(id = request.data['province'])[0]
        t['popPlus'] = PopPlus.objects.filter(id = request.data['popPlus'])[0]

        
        

        pp = Pop()
        for i in t:
            setattr(pp, i, t[i])
        # setattr(pp, 'ip', get_pop_rangeIP(pp))

        pp.range_ip = get_pop_rangeIP(pp)
        request.data['range_ip'] = get_pop_rangeIP(pp)

        request.data['name'] = get_pop_name(pp, request.data['tail1'], request.data['tail2'])
        pp.name = request.data['name']

        request.data['ring'] = get_pop_ring(pp)
        pp.ring = request.data['ring']

        print(request.data['ring'])
        # print(pp.ip)
        

        if validate_pop(pp):
            s = self.serializer_class(data=request.data)
            # print('check')
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

    # def list(self, request, *args, **kwargs):
    #     queryset = self.filter_queryset(self.get_queryset())

    #     page = self.paginate_queryset(queryset)
    #     if page is not None:
    #         serializer = self.get_serializer(page, many=True)
    #         return self.get_paginated_response(serializer.data)

        
    #     serializer = self.get_serializer(queryset, many=True)
    #     for se in serializer.data:
    #         se['brand_name'] = Brand.objects.filter(id = se['brand'])[0].name
    #         se['pop_name'] = Pop.objects.filter(id = se['pop'])[0].name
    #     return Response(serializer.data)
    
    def create(self, request):
        request.data._mutable = True
        # print(get_device_name(request.data))
        request.data['name'] = get_device_name(request.data)

        t = request.data.copy()
        t._mutable = True

        if not Brand.objects.filter(name = request.data['brand']) or not Pop.objects.filter(name = request.data['pop'])[0]:
            # print('check')
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
            print('out of ip')
            return HttpResponse('fail')

        try:
            print(request.data['tnew'])
            request.data['subnet'] = get_device_subnet(pp, int(request.data['tnew']))
            request.data['gateway'] = get_device_gateway(pp, int(request.data['tnew']))
        except:
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
            self.perform_create(s)
            headers = self.get_success_headers(s.data)
            return Response(s.data, status= status.HTTP_201_CREATED, headers=headers)
        
        else:
            # print('zxczxczxc')
            return HttpResponse('fail')



class BrandViewSet(viewsets.ModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    
