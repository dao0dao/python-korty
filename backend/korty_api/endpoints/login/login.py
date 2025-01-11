from django.http import HttpRequest, JsonResponse
from django.views import View
import json
from django.contrib.auth.hashers import check_password
from ...models.administrator import Administrator


class LoginEndpoint(View):
    def get(_self, request: HttpRequest):
        
        try:
            user_id = request.session['user_id']
            
            try:
                administrator = Administrator.objects.get(id=user_id)
                response_data = {"isLogin": True, "isAdmin": administrator.is_admin, "user": administrator.name}
                response = JsonResponse(response_data)

            except:
                response_data = {'isLogin': False}
                response = JsonResponse(response_data, status=404)
                
        except KeyError:
            response_data = {'isLogin': False}
            response = JsonResponse(response_data, status=404)
        
        return response
    
    def post(_self, request: HttpRequest):
        
        try:
            body = json.loads(request.body)
            login = body.get('login')
            password = body.get('password')
            
            if not login or not password:
                response = JsonResponse({"error": "Niekompletne dane"},  status=400)
                return response
            
            try:
                administrator = Administrator.objects.get(login=login)
            except Administrator.DoesNotExist:
                return JsonResponse({"error": "błędne dane logowania"}, status=400)
            
            if not check_password(password, administrator.password):
                return JsonResponse({"error": "błędne dane logowania"},  status=400)
            
            response_data = {"isLogin": True, "isAdmin": administrator.is_admin, "user": administrator.name}                
            response = JsonResponse(response_data) 
            request.session['user_id']=str(administrator.id)
            return response
            
        except json.JSONDecodeError:
            response = JsonResponse({"error": "Invalid JSON"}, status=400)
            return response