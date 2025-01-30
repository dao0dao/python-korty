from datetime import timedelta
from django.http import HttpRequest, HttpResponse
from django.contrib.sessions.models import Session
from django.utils.timezone import now
from django.core.cache import cache



class SessionCleanerMiddleware:
    def __init__(self, get_response: HttpResponse):
        self.get_response = get_response
        self.extension_duration = timedelta(minutes=60)
        
    def __call__(self, request: HttpRequest):
        response = self.get_response(request)
        last_session_cleanup = cache.get("last_session_cleanup")        
        if not last_session_cleanup or now() - last_session_cleanup > timedelta(seconds=300):
            Session.objects.filter(expire_date__lt=now()).delete()
            cache.set(key="last_session_cleanup", value=now(), timeout=300)
        
        return response