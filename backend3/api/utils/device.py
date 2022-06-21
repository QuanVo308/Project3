from .utils import *

def get_device_sequence(dtype, pop):

    # dtype = name[2:]
    devices = Device.objects.filter(pop=pop, name__icontains=dtype)
    sequences=[]
    # print(dtype)

    
    for i in devices:
        iter = 0
        if i.name[8].isnumeric():
            iter = 16
        else:
            iter = 15
        # print(i.name[len(i.name)-7:len(i.name)-5])
        sequences.append(int(i.name[iter:iter+2]))
    # print(sequences)
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

def get_device_name(dinfo):
    name = ''
    if dinfo['role'] == 'AGG':
        name += dinfo['type']
        name += str(dinfo['area'])
        name += str(dinfo['metro'][2:])
        name += str(popp_format(dinfo['popp'][3:]))
        name += str(Province.objects.filter(name = dinfo['province'])[0].acronym )
        name += str(dinfo['pop'][3:])
        # print(dinfo['brand'][:2], Pop.objects.filter(name = dinfo['pop'])[0])
        name += str(get_device_sequence(dinfo['brand'][:2], Pop.objects.filter(name = dinfo['pop'])[0]))
        name += str(dinfo['brand'])
    return name


def validate_device(device):
    # iter = 0
    # if device.name[8].isnumeric():
    #     iter = 16
    # else:
    #     iter = 15

    if( validate_device_name(device) 
    and validate_ip_address(device.ip)):
        return True
    return False
