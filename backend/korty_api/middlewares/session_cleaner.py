from datetime import timedelta
from django.http import HttpRequest, HttpResponse
from django.contrib.sessions.models import Session
from django.utils.timezone import now



class SessionCleanerMiddleware:
    def __init__(self, get_response: HttpResponse):
        self.get_response = get_response
        self.extension_duration = timedelta(minutes=60)
        
    def __call__(self, request: HttpRequest):
        response = self.get_response(request)
        
        all_sessions = Session.objects.all()
        
        for session in all_sessions:
            if session.expire_date > now() + self.extension_duration:
                session.delete()
        
        return response