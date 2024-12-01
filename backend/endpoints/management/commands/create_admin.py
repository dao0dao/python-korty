from django.core.management.base import BaseCommand
from django.contrib.auth.hashers import make_password
from ...models.administrator import Administrator

class Command(BaseCommand):
    help = 'Tworzy admina o takim samym loginie i haśle - admin'
    
    def handle(self, *args, **options):
        Administrator.objects.create(
            name='Administrator',
            login='admin',
            password=make_password('admin'),
            is_admin=True
        )
        self.stdout.write(self.style.SUCCESS('Stworzono Admina'))
        