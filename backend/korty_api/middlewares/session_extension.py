from datetime import timedelta
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.utils.timezone import now
from django.contrib.sessions.models import Session

class ExtendedSessionMiddleware:
    def __init__ (self, get_response: HttpResponse):
        self.get_response = get_response
        self.extension_duration = timedelta(minutes=60)
        self.not_login_response = JsonResponse({'isLogin': False}, status=404)
    
    def __call__(self, request: HttpRequest):
        response = self.get_response(request)
        
        if not 'sessionid' in request.COOKIES:
            return self.not_login_response
        
        session = Session.objects.filter(session_key=request.COOKIES['sessionid']).first()
        
        if not session or session.expire_date < now():
            request.session.delete()
            return self.not_login_response
        
        new_expiry = now() + self.extension_duration
        request.session.set_expiry(new_expiry)              
            
        return response