from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views


router = DefaultRouter()
router.register(r'popplus', views.PopPlusViewSet,basename="popplus")
router.register(r'pop', views.PopViewSet,basename="pop")
router.register(r'device', views.DeviceViewSet,basename="device")
router.register(r'area', views.AreaViewSet,basename="area")
router.register(r'province', views.ProvinceViewSet,basename="province")
router.register(r'branch', views.BranchViewSet,basename="branch")
router.register(r'brand', views.BrandViewSet,basename="brand")


urlpatterns = [
    path('', include(router.urls)),
    path('', views.index, name='index'),
    path('test', views.test, name='test'),
    path('provincearea', views.get_province_in_area, name='province_area'),
    path('branchprovince', views.get_branch_in_province, name='branch_province'),
    path('popplusbrnach', views.get_popplus_in_branch, name='popplus_branch'),
    path('poppopplus', views.get_pop_in_popplus, name='pop_popplus'),
    path('updategateway/', views.update_device_gateway, name='update_gateway'),
    path('branddevice/', views.get_brand_of_device, name='brand_of_device'),
    path('updatedevice/', views.update_device_all, name='update_device'), 
    path('updatepop/', views.update_pop_all, name='update_pop'),
    path('branchname/', views.get_branch_by_name, name='branch_by_name'), 
    path('poppname/', views.get_popplus_name_api, name='get_popp_name'), 
    path('popname/', views.get_pop_name_api, name='get_pop_name'),
    path('devicename/', views.get_device_name_api, name='get_device_name'),
    path('searchdevice/', views.search_device, name='search_device'),
    path('searchpop/', views.search_pop, name='search_pop'),
    path('searchpopp/', views.search_popp, name='search_popp'),
    path('powerdeviceupdate/', views.get_power_ip_api, name='update_power_device'),
]
