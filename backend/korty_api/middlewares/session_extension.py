from datetime import timedelta
from django.http import HttpRequest, HttpResponse
from django.utils.timezone import now
from django.contrib.sessions.models import Session

class ExtendedSessionMiddleware:
    def __init__ (self, get_response: HttpResponse):
        self.get_response = get_response
        self.extension_duration = timedelta(minutes=60)
    
    def __call__(self, request: HttpRequest):
        response = self.get_response(request)
        
        
        if 'sessionid' in request.COOKIES:
            print(request.COOKIES['sessionid'])
            session = Session.objects.filter(session_key=request.COOKIES['sessionid']).first()
            if session:
                new_expiry = now() + self.extension_duration
                request.session.set_expiry(new_expiry)              
        else:
            request.session.delete()
            print('nie ma ciasteczka')
        
        # if request.session.get_expiry_age() > 0:
            
        return response