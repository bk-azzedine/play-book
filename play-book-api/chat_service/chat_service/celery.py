from dotenv import load_dotenv
import os
import kombu.utils.text
from celery import Celery

load_dotenv()


def patched_version_string_as_tuple(version_string):
    parts = version_string.split('.')[:5]
    return kombu.utils.text._unpack_version(*parts)


kombu.utils.text.version_string_as_tuple = patched_version_string_as_tuple

# Set the default Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chat_service.settings')

app = Celery('chat_service')

if os.name == 'nt':
    import asyncio

    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

if os.name == 'nt':
    app.conf.update(
        worker_pool='threads',  # Use threads on Windows
        worker_concurrency=4,  # Limit concurrency
    )

app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()


