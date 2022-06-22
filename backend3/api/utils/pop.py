from .utils import *

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
        print('sequence1')
        return False
    if int(pop.ring[12:]) < 0 or int(pop.ring[12:]) > 63:
        print("sequence2")
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

# done
def validate_ip_address(ip):
    try:
        # print(pop.range_ip)
        ipaddress.ip_address(ip)
    except:
        print('wrong ip address')
        return False

    return True 

def get_pop_rangeIP(pop):
    ip = '10.'
    ip += str(pop.popPlus.octet2_ip_MGMT) + '.'
    # print(int(pop.sequence_ring)*64//255)
    ip += str(int(pop.popPlus.octet3_ip_MGMT) + int(pop.sequence_ring)*64//255) + '.'
    # print('check',int(pop.sequence_ring)*64%256)
    ip += str(int(pop.sequence_ring)*64%256)
    return ip

def get_pop_name(pop, tail1, tail2):
    name = ''
    name += str(Province.objects.filter(name = pop.popPlus.branch.province)[0].acronym)
    name += tail1 + f"{int(tail2):03}"
    return name

def get_pop_ring(pop):
    ring=''
    ring += str(Province.objects.filter(name = pop.province)[0].acronym)
    ring += str(pop.metro)
    ring += str(pop.popPlus.name[3:])
    ring += 'R' + str(f"{int(pop.sequence_ring):02}")

    return ring

def get_pop_vlan(pop):
    vlan = ''
    # print(pop.popPlus)
    vlan += str(PopPlus.objects.filter(name = pop.popPlus)[0].vlan_PPPoE) + str(f"{int(pop.sequence_ring):02}")
    return vlan


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

def update_pops():
    pops = Pop.objects.filter()
    for i in pops:
        print(i.id)
        print(validate_pop(i))
        # print(i.name)
        # print(get_pop_name(i, i.name[3], i.name[4:]))
        i.name = get_pop_name(i, i.name[3], i.name[4:])
        # print(i.ring)
        # print(get_pop_ring(i))
        i.ring = get_pop_ring(i)
        # print(i.vlan_PPPoE)
        # print(get_pop_vlan(i))
        i.vlan_PPPoE = get_pop_vlan(i)
        # print(i.range_ip)
        # print(get_pop_rangeIP(i))
        i.range_ip = get_pop_rangeIP(i)
        print(validate_pop(i), '\n')
        i.save()
    print('ok')