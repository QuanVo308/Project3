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
    # path('', views.index, name='index'),
    # path('test', views.test, name='test'),
]
