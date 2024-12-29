from django.conf import settings
from django.http import HttpRequest, JsonResponse
from django.views import View
import json
from django.middleware.csrf import get_token
from django.contrib.auth.hashers import check_password
from ..models.administrator import Administrator


class LoginEndpoint(View):
    def get(_self, request: HttpRequest):
        
        try:
            user_id = request.session['user_id']
            
            try:
                admin = Administrator.objects.get(id=user_id)
                response_data = {"isLogin": True, "isAdmin": admin.is_admin, "user": admin.name}
                response = JsonResponse(response_data)

            except:
                response_data = {'isLogin': False}
                response = JsonResponse(response_data, status=404)
                
        except KeyError:
            response_data = {'isLogin': False}
            csrf_token = get_token(request)
            response = JsonResponse(response_data, status=404)
            response.set_cookie(
                'csrftoken', 
                csrf_token, 
                httponly=False,
                secure=not settings.DEBUG
            )
        
        return response
    
    def post(_self, request: HttpRequest):
        
        try:
            body = json.loads(request.body)
            login = body.get('login')
            password = body.get('password')
            
            if not login or not password:
                response = JsonResponse({"error": "Niekompletne dane"})
                return response
            
            try:
                admin = Administrator.objects.get(login=login)
            except Administrator.DoesNotExist:
                return response
            
            if not check_password(password, admin.password):
                return JsonResponse({"error": "błędne dane logowania"})
            
            response_data = {"isLogin": True, "isAdmin": admin.is_admin, "user": admin.name}                
            response = JsonResponse(response_data) 
            request.session['user_id']=str(admin.id)
            return response
            
        except json.JSONDecodeError:
            response = JsonResponse({"error": "Invalid JSON"}, status=400)
            return response