from this import d

from pydantic import NoneBytes
from .models import *
from django.core.validators import validate_ipv4_address
import ipaddress

def validate_ip_octet(octet):
    # if type(octet) == int:
    octet = int(octet)
    if octet <= 255 and octet >=0:
        return True
    return False


def validate_popplus_name(popplus):
    # print("branchID: ", popplus.branchID.id)
    branch = popplus.branch
    province = branch.province
    character = ['P', 'M']
    if province.acronym != popplus.name[0:3]:
        print("acronym wrong", province.acronym, popplus.name[0:3])
        return False
    if popplus.name[3] not in character:
        print("letter wrong", popplus.name[3])
        return False
    if len(popplus.name[4:]) != 3: 
        print("last number wrong", popplus.name[4:])
        return False
    if int(popplus.name[4:]) < 0 or int(popplus.name[4:]) > 999:
        print("last number wrong", popplus.name[4:])
        return False
    
    return True

def validate_popplus_vlan(popplus):
    # if type(popplus.vlan_PPPoE) == int:
    popplus.vlan_PPPoE = int(popplus.vlan_PPPoE)
    if popplus.vlan_PPPoE <= 39 and popplus.vlan_PPPoE >= 30:
        return True
    
    print("popplus pppoe wrong")
    return False

def validate_popplus_area(popplus):
    # if type(popplus.area_OSPF) == int:
    popplus.area_OSPF = int(popplus.area_OSPF)
    if popplus.area_OSPF <= 9 and popplus.area_OSPF >= 1:
        return True
    
    print("popplus area ospf wrong")
    return False

def validate_popplus(popplus):
    # print(popplus.id)
    # popplus.name = 'HNIL331'
    # popplus.area_OSPF = 9
    if (validate_popplus_name(popplus) 
    and validate_popplus_vlan(popplus)
    and validate_ip_octet(popplus.octet2_ip_OSPF_MGMT)
    and validate_ip_octet(popplus.octet2_ip_MGMT)
    and validate_ip_octet(popplus.octet3_ip_MGMT)
    and validate_popplus_area(popplus)):
        return True
    return False

def validate_pop_name(pop):
    # print("branchID: ", pop.branchID.id)
    popplus = pop.popPlus
    province = pop.province
    character = ['P', 'M', 'K', 'V', 'B']
    if province.acronym != pop.name[0:3]:
        print("acronym wrong", province.acronym, pop.name[0:3])
        return False
    if pop.name[3] not in character:
        print("letter wrong", pop.name[3])
        return False
    if len(pop.name[4:]) != 3: 
        print("last number wrong", pop.name[4:])
        return False
    if int(pop.name[4:]) < 0 or int(pop.name[4:]) > 999:
        print("last number wrong", pop.name[4:])
        return False
    
    return True

def validate_metro(metro):
    if metro[0:2] != 'MP':
        return False
    if len(metro[2:]) != 2:
        return False
    if int(metro[2:]) < 1 or int(metro[2:]) > 13:
        return False
    return True

def validate_pop_ring(pop):
    if pop.ring[0:3] != pop.province.acronym:
        print("wrong province", pop.ring[0:3], pop.province.acronym )
        return False
    if not validate_metro(pop.metro):
        return False
    if pop.ring[3:7] != pop.metro:
        print('metro')
        return False
    # print(pop.ring[7:11], pop.popPlus.name[3:] )
    if pop.ring[7:11] != pop.popPlus.name[3:]:
        print('popplus')
        return False
    if pop.ring[11] != 'R':
        print('R')
        return False
    if len(pop.ring[12:]) != 2:
        print('sequence')
        return False
    if int(pop.ring[12:]) < 0 or int(pop.ring[12:]) > 63:
        print("sequence")
        return False
    return True

def validate_pop_rangeIP(pop):
    try:
        # print(pop.range_ip)
        ipaddress.ip_address(pop.range_ip)
    except:
        print('wrong ip address')
        return False

    return True 

def get_pop_rangeIP(pop):
    ip = '10.'
    ip += str(pop.popPlus.octet2_ip_MGMT) + '.'
    # print(int(pop.sequence_ring)*64//255)
    ip += str(int(pop.popPlus.octet3_ip_MGMT) + int(pop.sequence_ring)*64//255) + '.'
    print('check',int(pop.sequence_ring)*64%256)
    ip += str(int(pop.sequence_ring)*64%256)
    return ip

def validate_pop(pop):
    # print(type(pop.range_ip))

    # t = Pop()
    # t.popPlus = PopPlus.objects.filter()[0]
    # print(get_pop_rangeIP(pop))

    if(validate_pop_name(pop)
    and validate_pop_ring(pop)
    and validate_pop_rangeIP(pop)):
        return True
    return False

def popp_format(name):
    shortened = False

    for index, i in enumerate(name):
        # print(i, index)
        if i=='0' and not shortened:
           name = name[:index] + name[index+1:]
           shortened = True

    # print(name)

    return name


def get_device_sequence(dtype, pop):

    # dtype = name[2:]
    devices = Device.objects.filter(pop=pop, name__icontains=dtype)
    sequences=[]
    # print(dtype)
    
    for i in devices:
        # print(i.name[len(i.name)-7:len(i.name)-5])
        sequences.append(int(i.name[len(i.name)-2:]))
    sequences.sort()
    
    s = 0
    while(True):
        if s not in sequences:
            return f"{s:02}"
        s+=1

    return -1

def validate_device_name(device):
    # print(device.role)
    if device.role == 'AGG':

        type = ['DI','DA','CE']
        if not device.name[0:2] in type:
            print("AGG role begin")
            return False

        if device.pop.province.area.name != device.name[2]:
            print("AGG role area")
            return False

        if device.name[3:5] != device.pop.metro[2:]:
            print("AGG role metro")
            return False

        popp = device.pop.popPlus.name[3:]
        popp = popp_format(popp)
        next = len(popp)+5
        if(device.name[5:next] != popp):
            print("AGG role popplus")
            return False

        if(device.name[next:next+3] != device.pop.province.acronym):
            print("AGG role province")
            return False
        next+=3

        if(device.name[next:next+4] != device.pop.name[3:]):
            print("AGG role pop")
            return False
        next+=6

        if not Brand.objects.filter(name = device.name[next:]):
            print("AGG role brand")
            return False 

        return True
    else:
        if(device.name[0:3] != device.pop.province.acronym):
            print("Device role province")
            return False
        if(device.name[3:7] != device.pop.name[3:]):
            print("Device role pop")
            return False

        if not Brand.objects.filter(name = device.name[9:]):
            print("Device role brand")
            return False 
        return True

def get_device_ips(device, tnew=True):
    ips=[]
  
    # print(device.pop.range_ip)
    if device.role == 'AGG':
        # print(device.role)
        i = 1
        while(i <= 9):
            # print(i)
            octet1 = '10.'
            octet2 = str(device.pop.popPlus.octet2_ip_MGMT) + '.'
            octet3 = str(int(device.pop.popPlus.octet3_ip_MGMT) + ((int(device.pop.sequence_ring)*64)+i)//255) + '.'
            octet4 = str(((int(device.pop.sequence_ring)*64)+i)%256)
            ip = octet1 + octet2 + octet3 + octet4
            if not Device.objects.filter(pop = device.pop, ip = ip):
                ips.append(ip)
            ip=''
            i+=1
    elif device.role == "OLT":
        # print(device.role)
        i = 11
        while(i <= 19):
            # print(i)
            octet1 = '10.'
            octet2 = str(device.pop.popPlus.octet2_ip_MGMT) + '.'
            octet3 = str(int(device.pop.popPlus.octet3_ip_MGMT) + ((int(device.pop.sequence_ring)*64)+i)//255) + '.'
            octet4 = str(((int(device.pop.sequence_ring)*64)+i)%256)
            ip = octet1 + octet2 + octet3 + octet4
            if not Device.objects.filter(pop = device.pop, ip = ip):
                ips.append(ip)
            ip=''
            i+=1
    elif device.role == "SW-BB":
        # print(device.role)
        i = 21
        while(i <= 29):
            # print(i)
            octet1 = '10.'
            octet2 = str(device.pop.popPlus.octet2_ip_MGMT) + '.'
            octet3 = str(int(device.pop.popPlus.octet3_ip_MGMT) + ((int(device.pop.sequence_ring)*64)+i)//255) + '.'
            octet4 = str(((int(device.pop.sequence_ring)*64)+i)%256)
            ip = octet1 + octet2 + octet3 + octet4
            if not Device.objects.filter(pop = device.pop, ip = ip):
                ips.append(ip)
            ip=''
            i+=1
    elif device.role == "POWER":
        # print(device.role)
        if tnew:
            i = 34
            while(i <= 38):
                # print(i)
                octet1 = '10.'
                octet2 = str(device.pop.popPlus.octet2_ip_MGMT) + '.'
                octet3 = str(int(device.pop.popPlus.octet3_ip_MGMT) + ((int(device.pop.sequence_ring)*64)+i)//255) + '.'
                octet4 = str(((int(device.pop.sequence_ring)*64)+i)%256)
                ip = octet1 + octet2 + octet3 + octet4
                if not Device.objects.filter(pop = device.pop, ip = ip):
                    ips.append(ip)
                ip=''
                i+=1
        else:
            octet1 = '25.'
            octet2 = str(device.pop.popPlus.octet2_ip_MGMT) + '.'
            octet3 = str(int(device.pop.sequence_ring)) + '.'
            octet4 = '2'
            ip = octet1 + octet2 + octet3 + octet4
            ips.append(ip)

    return ips

def get_device_gateway(device, tnew = True):
    if device.role == 'AGG' :
        return None
    elif device.role == 'OLT' or device.role == 'SW-BB':
        agg = Device.objects.filter(pop = device.pop, role='AGG')[0]
        return agg.ip
    elif device.role == 'POWER':
        if tnew:
            octet1 = '10.'
            octet2 = str(device.pop.popPlus.octet2_ip_MGMT) + '.'
            octet3 = str(int(device.pop.popPlus.octet3_ip_MGMT) + ((int(device.pop.sequence_ring)*64)+33)//255) + '.'
            octet4 = str(((int(device.pop.sequence_ring)*64)+33)%256)
            ip = octet1 + octet2 + octet3 + octet4
            return ip
        else:
            octet1 = '25.'
            octet2 = str(device.pop.popPlus.octet2_ip_MGMT) + '.'
            octet3 = str(int(device.pop.sequence_ring)) + '.'
            octet4 = '1'
            ip = octet1 + octet2 + octet3 + octet4
            return ip
            
    
def get_device_subnet(device, tnew = True):
    if device.role == 'AGG' or device.role == 'SW-BB' or device.role == 'OLT':
        return '255.255.255.224'
    elif device.role == 'POWER':
        return '255.255.255.248' if tnew else '255.255.255.0'


def validate_device(device):
    # iter = 0
    # if device.name[8].isnumeric():
    #     iter = 18
    # else:
    #     iter = 17

    if( validate_device_name(device)):
        return True
    return False
