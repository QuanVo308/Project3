from http.client import HTTPResponse
from urllib import request
from django.forms import GenericIPAddressField
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
from django.db.models import CharField, GenericIPAddressField
from django.db.models import  Q
from .pagination import *
from rest_framework.decorators import action
# from django_filters.rest_framework import OrderingFilter 
from rest_framework import filters
import operator

def index(request):
    return HttpResponse("Hello, world!!!!")

def test(request):
    # print(Province.objects.filter(name = request.GET['area']))
    # province = Province.objects.filter(area = '1').values()

    fields = [f for f in Device._meta.fields if isinstance(f, CharField)]
    for f in fields:
        print(f.name)
    # queries = [Q(**{f.name: 'H'}) for f in fields]
    queries = [Q(('%s__icontains' % f.name, 'GC')) for f in fields]
    queries.append(Q(brand__name__icontains = 'HW'))
    qs = Q()
    
    for query in queries:
        qs = qs | query
    print( qs)
    province = Device.objects.filter(qs).values()

    # print(province)
    
    return JsonResponse({'data': list(province), 'status': status.HTTP_201_CREATED})

def search_device(request):
    value = request.GET['search'].upper()
    fields = [f for f in Device._meta.fields if (isinstance(f, CharField) or isinstance(f, GenericIPAddressField))]
    queries = [Q(('%s__icontains' % f.name, value)) for f in fields]
    queries.append(Q(brand__name__icontains = value))
    qs = Q()
    
    for query in queries:
        qs = qs | query
    province = Device.objects.filter(qs).values()

    p = list(province)
    for i in p:
        i['pop_name'] = Pop.objects.filter(id = i['pop_id'])[0].name
        i['brand_name'] = Brand.objects.filter(id = i['brand_id'])[0].name
    
    return JsonResponse({'data': list(province), 'status': status.HTTP_201_CREATED})

def search_pop(request):
    value = request.GET['search'].upper()
    fields = [f for f in Pop._meta.fields if (isinstance(f, CharField) or isinstance(f, GenericIPAddressField))]
    # for f in fields:
    #     print(f.name)
    # queries = [Q(**{f.name: 'H'}) for f in fields]
    queries = [Q(('%s__icontains' % f.name, value)) for f in fields]
    queries.append(Q(popPlus__name__icontains = value))
    queries.append(Q(province__name__icontains = value))
    try:
        va = int(value)
        queries.append(Q(sequence_ring = value))
    except:
        print()
    qs = Q()
    
    for query in queries:
        qs = qs | query
    # print( qs)
    province = Pop.objects.filter(qs).values()
    p = list(province)
    for i in p:
        i['popPlus_name'] = PopPlus.objects.filter(id = i['popPlus_id'])[0].name
        i['province_name'] = Province.objects.filter(id = i['province_id'])[0].name


    # print(province)
    
    return JsonResponse({'data': list(province), 'status': status.HTTP_201_CREATED})

def search_popp(request):
    value = request.GET['search'].upper()
    fields = [f for f in PopPlus._meta.fields if (isinstance(f, CharField) or isinstance(f, GenericIPAddressField))]
    # for f in fields:
    #     print(f.name)
    # queries = [Q(**{f.name: 'H'}) for f in fields]
    queries = [Q(('%s__icontains' % f.name, value)) for f in fields]
    queries.append(Q(branch__name = value))
    
    try:
        va = int(value)
        queries.append(Q(area_OSPF = value))
        queries.append(Q(octet2_ip_OSPF_MGMT = value))
        queries.append(Q(octet2_ip_MGMT = value))
        queries.append(Q(octet3_ip_MGMT = value))
        queries.append(Q(vlan_PPPoE = value))
    except:
        print()

    qs = Q()
    
    for query in queries:
        qs = qs | query
    print( qs)
    province = PopPlus.objects.filter(qs).values()

    # print(province)
    
    return JsonResponse({'data': list(province), 'status': status.HTTP_201_CREATED})

def update_device_all(request):
    update_devices()
    return HttpResponse(status.HTTP_200_OK)

def get_popplus_name_api(request):
    popp = PopPlus()
    popp.branch = Branch.objects.filter(id = request.GET['branch'])[0]
    print(get_popplus_name(popp, request.GET['tail1'], request.GET['tail2']))
    name = get_popplus_name(popp, request.GET['tail1'], request.GET['tail2'])
    return JsonResponse({'name': name, 'status': status.HTTP_201_CREATED})

def get_pop_name_api(request):
    pop= Pop()
    pop.popPlus = PopPlus.objects.filter(id = request.GET['popPlus'])[0]
    name = get_pop_name(pop, request.GET['tail1'], request.GET['tail2'])
    return JsonResponse({'name': name, 'status': status.HTTP_201_CREATED})

def get_device_name_api(request):
    device = Device()
    device.pop = Pop.objects.filter(id = request.GET['pop'])[0]
    device.role = request.GET['role']
    if device.role == 'AGG':
        device.type = request.GET['type']
    device.metro = device.pop.metro
    device.popp = device.pop.popPlus.name
    device.area = device.pop.province.area
    device.province = device.pop.province
    device.brand = Brand.objects.filter(id = request.GET['brand'])[0]
    device.name = request.GET['name']
    name = get_device_name(device)
    return JsonResponse({'name': name, 'status': status.HTTP_201_CREATED})

def get_power_ip_api(request):
    device = Device()
    subnet = ''
    gateway = ''
    device.pop = Pop.objects.filter(id = int(request.GET['pop']))[0]
    device.role = 'POWER'
    if int(request.GET['tnew']) == 1:
        subnet = '255.255.255.248'
        gateway = get_device_gateway(device, True)
    else:
        subnet = '255.255.255.0'
        gateway = get_device_gateway(device, False)
    return JsonResponse({'subnet': subnet, 'gateway': gateway, 'status': status.HTTP_201_CREATED})


def update_pop_all(request):
    update_pops()
    return HttpResponse(status.HTTP_200_OK)

def get_branch_by_name(request):
    branch = Branch.objects.filter(name = request.GET['id']).values()
    return JsonResponse({'data': list(branch), 'status': status.HTTP_201_CREATED})




def get_province_in_area(request):
    id = Area.objects.get(id = request.GET['id'])
    province = Province.objects.filter(area = id).values()
    return JsonResponse({'data': list(province), 'status': status.HTTP_201_CREATED})

def get_branch_in_province(request):
    id = Province.objects.get(id = request.GET['id'])
    branch = Branch.objects.filter(province = id).values()
    return JsonResponse({'data': list(branch), 'status': status.HTTP_201_CREATED})

def get_popplus_in_branch(request):
    id = Branch.objects.get(id = request.GET['id'])
    # print(id.name)
    popplus = PopPlus.objects.filter(branch = id).values()
    return JsonResponse({'data': list(popplus), 'status': status.HTTP_201_CREATED})

def get_pop_in_popplus(request):
    id = PopPlus.objects.get(id = request.GET['id'])
    pop = Pop.objects.filter(popPlus = id).values()
    return JsonResponse({'data': list(pop), 'status': status.HTTP_201_CREATED})

def get_brand_of_device(request):
    # device = Device.objects.filter(name = request.GET['name'])[0]
    if request.GET['role'] == 'AGG':
        return JsonResponse({'data': list(Brand.objects.filter(name__icontains='HW').values()), 'status': status.HTTP_201_CREATED})
    elif request.GET['role'] == 'OLT':
        return JsonResponse({'data': list(Brand.objects.filter(company__icontains='GC').values()), 'status': status.HTTP_201_CREATED})   
    elif request.GET['role'] == "POWER":
        return JsonResponse({'data': list(Brand.objects.filter(name__icontains='PWE').values()), 'status': status.HTTP_201_CREATED})
    elif request.GET['role'] == "SW-BB":
        return JsonResponse({'data': list(Brand.objects.filter(Q(name__icontains='HW') | Q(name__icontains='DF') | Q(name__icontains='DS')).values()), 'status': status.HTTP_201_CREATED})
    else :
        return HttpResponse(status.HTTP_404_NOT_FOUND)

def update_device_gateway(request):
    device = Device.objects.filter(name = request.GET['name'])[0]
    # print(device.role)
    if device.role == 'POWER':
        device.gateway = get_device_gateway(device, request.GET['tnew'])
    else:
        device.gateway = get_device_gateway(device)
    device.save()
    return HttpResponse(device.gateway)


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
    pagination_class = CustomPageNumberPagination

    def add_field(self, serializer):
        for se in serializer.data:
            se['branch_name'] = Branch.objects.filter(id = se['branch'])[0].name
            se['province'] = Branch.objects.filter(id = se['branch'])[0].province.id
            se['province_name'] = Branch.objects.filter(id = se['branch'])[0].province.name
            se['area'] = Branch.objects.filter(id = se['branch'])[0].province.area.id
            se['area_name'] = Branch.objects.filter(id = se['branch'])[0].province.area.name
        return serializer

    @action(detail=False)
    def search(self, request):
        value = request.GET['search'].upper()
        fields = [f for f in PopPlus._meta.fields if (isinstance(f, CharField) or isinstance(f, GenericIPAddressField))]
        # for f in fields:
        #     print(f.name)
        # queries = [Q(**{f.name: 'H'}) for f in fields]
        queries = [Q(('%s__icontains' % f.name, value)) for f in fields]
        queries.append(Q(branch__name = value))

        sort = 'id'
        reverse = False
        try:
            sort = request.GET['sort']
            reverse = int(request.GET['reverse'])
        except:
            None
        
        try:
            va = int(value)
            queries.append(Q(area_OSPF = value))
            queries.append(Q(octet2_ip_OSPF_MGMT = value))
            queries.append(Q(octet2_ip_MGMT = value))
            queries.append(Q(octet3_ip_MGMT = value))
            queries.append(Q(vlan_PPPoE = value))
        except:
            print()

        qs = Q()
        
        for query in queries:
            qs = qs | query
        # print( qs)
        province = PopPlus.objects.filter(qs)

        for i in province:
            i.branch_name = Branch.objects.filter(id = i.branch.id)[0].name
            i.province = i.branch.province.id
            i.province_name = i.branch.province.name
            i.area = i.branch.province.area.id
            i.area_name = i.branch.province.area.name
        province = sorted(province, key=operator.attrgetter(sort), reverse=int(reverse))

        # print(province)
        page = self.paginate_queryset(province)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            # print(serializer.data)
            serializer = self.add_field(serializer)

            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(province, many=True)
        serializer = self.add_field(serializer)
        
        return Response(serializer.data)


    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        sort = 'id'
        reverse = False
        try:
            sort = request.GET['sort']
            reverse = int(request.GET['reverse'])
        except:
            None

        for i in queryset:
            i.branch_name = Branch.objects.filter(id = i.branch.id)[0].name
            i.province = i.branch.province.id
            i.province_name = i.branch.province.name
            i.area = i.branch.province.area.id
            i.area_name = i.branch.province.area.name
        # print(type(queryset))
        # queryset = self.filter_queryset(queryset)
        queryset = sorted(queryset, key=operator.attrgetter(sort), reverse=int(reverse))

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            serializer = self.add_field(serializer)
            return self.get_paginated_response(serializer.data)

        
        serializer = self.get_serializer(queryset, many=True)
        serializer = self.add_field(serializer)
        
        return Response(serializer.data)

    def create(self, request):
        print(request.data)
        request.data._mutable = True


        t = request.data.copy()
        print(request.data['branch'])
        t._mutable = True
        t['branch'] = Branch.objects.filter(id = request.data['branch'])[0]

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
    pagination_class = CustomPageNumberPagination
    filter_backends = [filters.OrderingFilter]
    ordering_fields = '__all__'

    def add_field(self, serializer):
        for se in serializer.data:
            se['area_name'] = Area.objects.filter(id = Province.objects.filter(name = se['province_name'])[0].area.id)[0].name
            se['branch_name'] = Branch.objects.filter(id = PopPlus.objects.filter(name = se['popPlus_name'])[0].branch.id)[0].name
            se['area'] = Area.objects.filter(id = Province.objects.filter(name = se['province_name'])[0].area.id)[0].id
            se['branch'] = Branch.objects.filter(id = PopPlus.objects.filter(name = se['popPlus_name'])[0].branch.id)[0].id
        return serializer

    @action(detail=False)
    def search(self, request):
        value = request.GET['search'].upper()
        fields = [f for f in Pop._meta.fields if (isinstance(f, CharField) or isinstance(f, GenericIPAddressField))]
        
        sort = 'id'
        reverse = False
        try:
            sort = request.GET['sort']
            reverse = int(request.GET['reverse'])
        except:
            None

        queries = [Q(('%s__icontains' % f.name, value)) for f in fields]
        queries.append(Q(popPlus__name__icontains = value))
        queries.append(Q(province__name__icontains = value))
        try:
            va = int(value)
            queries.append(Q(sequence_ring = value))
        except:
            print()
        qs = Q()
        
        for query in queries:
            qs = qs | query
        # print( qs)
        province = Pop.objects.filter(qs)

        for i in province:
            i.province_name = i.province.name
            i.popPlus_name = i.popPlus.name
            i.branch_name = i.popPlus.branch.name
            i.area_name =i.province.area.name
        province = sorted(province, key=operator.attrgetter(sort), reverse=int(reverse))

        # province = self.filter_queryset(province)
        page = self.paginate_queryset(province)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            # print(serializer.data)
            serializer = self.add_field(serializer)
            return self.get_paginated_response(serializer.data)

        # p = list(province)
        serializer = self.get_serializer(province, many=True)
        # serializer = self.add_field(serializer)
        serializer = self.add_field(serializer)

        # print(province)
    
        return Response(serializer.data)
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        sort = 'id'
        reverse = False
        try:
            sort = request.GET['sort']
            reverse = int(request.GET['reverse'])
        except:
            None

        for i in queryset:
            i.province_name = i.province.name
            i.popPlus_name = i.popPlus.name
            i.branch_name = i.popPlus.branch.name
            i.area_name =i.province.area.name
        # print(type(queryset))
        # queryset = self.filter_queryset(queryset)
        queryset = sorted(queryset, key=operator.attrgetter(sort), reverse=int(reverse))
        

        

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            serializer = self.add_field(serializer)
            return self.get_paginated_response(serializer.data)

        
        serializer = self.get_serializer(queryset, many=True)
        serializer = self.add_field(serializer)
        return Response(serializer.data)

    def create(self, request):
        request.data._mutable = True
        request.data['province'] = PopPlus.objects.filter(id = request.data['popPlus'])[0].branch.province.id
        request.data['popPlus'] = PopPlus.objects.filter(id = request.data['popPlus'])[0].id
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

        request.data['vlan_PPPoE'] = get_pop_vlan(pp)
        pp.vlan_PPPoE = request.data['vlan_PPPoE']
        print("PPP", vars(pp))

        # print(pp.ip)
        

        if validate_pop(pp):
            s = self.serializer_class(data=request.data)
            print('check')
            print(s.is_valid(raise_exception=True))
            self.perform_create(s)
            headers = self.get_success_headers(s.data)

            # return HttpResponse('success')
            return Response(s.data, status= status.HTTP_201_CREATED, headers=headers)
        
        else:
            return HttpResponse('fail')


class DeviceViewSet(viewsets.ModelViewSet):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer
    pagination_class = CustomPageNumberPagination

    def add_field(self, serializer):
        for se in serializer.data:
            se['popPlus_name'] = PopPlus.objects.filter(id = Pop.objects.filter(name = se['pop_name'])[0].popPlus.id)[0].name
            se['branch_name'] = Branch.objects.filter(id = PopPlus.objects.filter(name = se['popPlus_name'])[0].branch.id)[0].name
            se['province_name'] = Province.objects.filter(id = Branch.objects.filter(name = se['branch_name'])[0].province.id)[0].name
            se['area_name'] = Area.objects.filter(id = Province.objects.filter(name = se['province_name'])[0].area.id)[0].name
            
            se['popPlus'] = PopPlus.objects.filter(id = Pop.objects.filter(name = se['pop_name'])[0].popPlus.id)[0].id
            se['branch'] = Branch.objects.filter(id = PopPlus.objects.filter(name = se['popPlus_name'])[0].branch.id)[0].id
            se['province'] = Province.objects.filter(id = Branch.objects.filter(name = se['branch_name'])[0].province.id)[0].id
            se['area'] = Area.objects.filter(id = Province.objects.filter(name = se['province_name'])[0].area.id)[0].id
            se['pop_name'] = Pop.objects.filter(id = se['pop'])[0].name
            se['brand_name'] = Brand.objects.filter(id = se['brand'])[0].name
            if se['role'] == 'POWER':
                print(se['subnet'][12:])
                if se['subnet'][12:] == '0':
                    se['tnew'] = 0
                else:
                    se['tnew'] = 1
        return serializer


    @action(detail=False)
    def search(self, request):
        value = request.GET['search'].upper()
        fields = [f for f in Device._meta.fields if (isinstance(f, CharField) or isinstance(f, GenericIPAddressField))]
        queries = [Q(('%s__icontains' % f.name, value)) for f in fields]
        queries.append(Q(brand__name__icontains = value))
        qs = Q()

        sort = 'id'
        reverse = False
        try:
            sort = request.GET['sort']
            reverse = int(request.GET['reverse'])
        except:
            None
        
        for query in queries:
            qs = qs | query
        province = Device.objects.filter(qs)

        for i in province:
            i.brand_name = i.brand.name
            i.pop_name = i.pop.name
            i.popPlus_name = i.pop.popPlus.name
            i.branch_name = i.pop.popPlus.branch.name
            i.province_name = i.pop.province.name
            i.area_name = i.pop.province.area.name
        province = sorted(province, key=operator.attrgetter(sort), reverse=int(reverse))

        page = self.paginate_queryset(province)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            # print(serializer.data)
            serializer = self.add_field(serializer)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(province, many=True)
        serializer = self.add_field(serializer)
     
        
        return Response(serializer.data)
        

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        sort = 'id'
        reverse = False
        try:
            sort = request.GET['sort']
            reverse = int(request.GET['reverse'])
        except:
            None

        for i in queryset:
            i.brand_name = i.brand.name
            i.pop_name = i.pop.name
            i.popPlus_name = i.pop.popPlus.name
            i.branch_name = i.pop.popPlus.branch.name
            i.province_name = i.pop.province.name
            i.area_name = i.pop.province.area.name

        # print(type(queryset))
        # queryset = self.filter_queryset(queryset)
        queryset = sorted(queryset, key=operator.attrgetter(sort), reverse=int(reverse))

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            serializer = self.add_field(serializer)
            # print('page')
            return self.get_paginated_response(serializer.data)

        
        serializer = self.get_serializer(queryset, many=True)
        serializer = self.add_field(serializer)
        return Response(serializer.data)

    def create(self, request):
        pp = Device()
        request.data._mutable = True
        # print(get_device_name(request.data))
        request.data['metro'] = Pop.objects.filter(id = request.data['pop'])[0].metro
        request.data['popp'] = Pop.objects.filter(id = request.data['pop'])[0].popPlus.name
        request.data['province'] = Pop.objects.filter(id = request.data['pop'])[0].province.name
        request.data['area'] = Pop.objects.filter(id = request.data['pop'])[0].province.area.name

        t = request.data.copy()
        t['brand'] = Brand.objects.filter(name = request.data['brand'])[0]
        t['pop'] = Pop.objects.filter(id = request.data['pop'])[0]
        for i in t:
            setattr(pp, i, t[i])

        request.data['name'] = get_device_name(pp)
        pp.name = request.data['name']
        t['name'] =request.data['name']

        
        t._mutable = True

        if not Brand.objects.filter(name = request.data['brand']) or not Pop.objects.filter(id = request.data['pop'])[0]:
            # print('check')
            return HttpResponse('fail')


        request.data['pop'] = Pop.objects.filter(id = request.data['pop'])[0].id
        request.data['brand'] = Brand.objects.filter(name = request.data['brand'])[0].id

        
        if len(get_device_ips(pp, int(request.data['tnew']))) != 0:
            pp.ip = get_device_ips(pp, int(request.data['tnew']))[0]
            request.data['ip'] = pp.ip
            # print(pp.ip)
        else:
            print('out of ip')
            return HttpResponse('fail')

        try:
            # print(request.data['tnew'])
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
    
