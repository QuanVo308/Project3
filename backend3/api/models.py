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
    name = models.CharField(max_length=20, unique=True)
    branch = models.ForeignKey(Branch, on_delete=models.PROTECT)
    area_OSPF = models.IntegerField()
    octet2_ip_OSPF_MGMT = models.IntegerField()
    octet2_ip_MGMT = models.IntegerField()
    octet3_ip_MGMT = models.IntegerField()
    vlan_PPPoE = models.IntegerField()

    def __str__(self) :
        return self.name


class Pop(models.Model):
    name = models.CharField(max_length=20, unique=True)
    ring = models.CharField(max_length=20)
    range_ip = models.GenericIPAddressField(unique=True)
    vlan_PPPoE = models.CharField(max_length=20)
    metro = models.CharField(max_length=20)
    popPlus = models.ForeignKey(PopPlus, on_delete=models.PROTECT)
    province = models.ForeignKey(Province, on_delete=models.PROTECT)
    sequence_ring = models.IntegerField()

    def __str__(self) :
        return self.name


class Brand(models.Model):
    name = models.CharField(max_length=30, unique=True)
    company = models.CharField(max_length=30)

    def __str__(self) :
        return self.name


class Device(models.Model):
    pop= models.ForeignKey(Pop, on_delete=models.PROTECT)
    name = models.CharField(max_length=50, unique=True)
    role = models.CharField(max_length=20)
    ip = models.GenericIPAddressField(unique=True)
    brand = models.ForeignKey(Brand, on_delete=models.PROTECT )

    def __str__(self) :
        return self.name

