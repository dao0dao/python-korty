from django.urls import path

from .all_endpoints import LoginEndpoint

urlpatterns = [
    path('login', LoginEndpoint.as_view(), name='LoginEndpoint')
]