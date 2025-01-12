from datetime import timedelta
from django.http import HttpRequest, HttpResponse
from django.utils.timezone import now

class ExtendedSessionMiddleware:
    def __init__ (self, get_response: HttpResponse):
        self.get_response = get_response
        self.extension_duration = timedelta(minutes=60)
    
    def __call__(self, request: HttpRequest):
        response = self.get_response(request)
        
        if request.session.get_expiry_age() > 0:
            new_expiry = now() + self.extension_duration
            request.session.set_expiry(new_expiry)
            
        return response