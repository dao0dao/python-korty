from django.http import HttpRequest, JsonResponse
from django.views import View


class LoginEndpoint(View):
    def get(_self, request: HttpRequest):
        response_data = {"status": "ok"}
        response = JsonResponse(response_data)
        return response