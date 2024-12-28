from django.http import HttpRequest, JsonResponse
from django.views import View
import json
from django.contrib.auth.hashers import check_password
from ..models.administrator import Administrator


class LoginEndpoint(View):
    def get(_self, request: HttpRequest):
        response_data = {"status": "ok"}
        response = JsonResponse(response_data)
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
            return response
            
        except json.JSONDecodeError:
            response = JsonResponse({"error": "Invalid JSON"}, status=400)
            return response