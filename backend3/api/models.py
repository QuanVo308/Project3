from django.db import models

# Create your models here.


from django.db import models

# Create your models here.
class Area(models.Model):
    name = models.CharField(max_length=10, unique=True)
    
    def __str__(self) :
        return self.name


class Province(models.Model):
    name = models.CharField(max_length=30, unique=True)
    acronym = models.CharField(max_length=3, default="", unique=True)
    area = models.ForeignKey(Area, on_delete=models.PROTECT)

    def __str__(self) :
        return self.name


class Branch(models.Model):
    province = models.ForeignKey(Province, on_delete=models.PROTECT)
    name = models.CharField(max_length=30, unique=True)

    def __str__(self) :
        return self.name


class PopPlus(models.Model):
    name = models.CharField(max_length=20, unique=True, default=None)
    branch = models.ForeignKey(Branch, on_delete=models.PROTECT, default=None)
    area_OSPF = models.IntegerField(default=None)
    octet2_ip_OSPF_MGMT = models.IntegerField(default=None)
    octet2_ip_MGMT = models.IntegerField(default=None)
    octet3_ip_MGMT = models.IntegerField(default=None)
    vlan_PPPoE = models.IntegerField(default=None)

    def __str__(self) :
        return self.name


class Pop(models.Model):
    name = models.CharField(max_length=20, unique=True, default=None)
    ring = models.CharField(max_length=20, default=None)
    range_ip = models.GenericIPAddressField(unique=True, default=None)
    vlan_PPPoE = models.CharField(max_length=20, default=None)
    metro = models.CharField(max_length=20, default=None)
    popPlus = models.ForeignKey(PopPlus, on_delete=models.PROTECT, default=None)
    province = models.ForeignKey(Province, on_delete=models.PROTECT, default=None)
    sequence_ring = models.IntegerField(default=None)

    def __str__(self) :
        return self.name


class Brand(models.Model):
    name = models.CharField(max_length=30, unique=True, default=None)
    company = models.CharField(max_length=30, default=None)

    def __str__(self) :
        return self.name


class Device(models.Model):
    pop= models.ForeignKey(Pop, on_delete=models.PROTECT, default=None)
    name = models.CharField(max_length=50, unique=True, default=None)
    role = models.CharField(max_length=20, default=None)
    ip = models.GenericIPAddressField(default=None)
    brand = models.ForeignKey(Brand, on_delete=models.PROTECT, default=None )
    subnet = models.GenericIPAddressField(default=None, null=True)
    gateway = models.GenericIPAddressField(default=None, null=True)

    def __str__(self) :
        return self.name

