from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('test/', include('testapp.urls')),
    path('testrest/', include('snippets.urls')),
    path('admin/', admin.site.urls),
    path('api', include('api.urls'))
]

urlpatterns += [
    path('api-auth/', include('rest_framework.urls')),
]