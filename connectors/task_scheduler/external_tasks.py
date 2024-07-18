import time
import random
import glob
import os
from django_celery_results.models import TaskResult
from django_celery_beat.models import PeriodicTask
from task_scheduler_app.tools.helpers import logger
from task_scheduler_app.decorators.task_decorator import task_autoretry
from task_scheduler_app.api.models import Task
from task_scheduler_app.celery import app
from celery import shared_task
from task_scheduler_app.clients.gateway import Gateway
from task_scheduler_app.clients.notification import Notification
from task_scheduler_app.clients.crypto import Crypto


# This is a Celery task that will be executed by the Celery worker.
# This celery tasks file will be empty as it will be loaded by replacing it content from the task_scheduler_app/api/tasks.py file from the docker container volume like this:
# volumes:
#   - ./task_scheduler_app/api/tasks.py:/code/task_scheduler_app/api/tasks.py

@task_autoretry(bind=True)
def hello_ko(self, *args, **kwargs):
    logger.info("Hello World --> Failure Sample")
    logger.info("The given arguments are:")
    logger.info(kwargs)

    # Try with a file that never exists
    with open("/code/never_exists_file", "r") as file:
        data = file.read()


### Test Tasks ###
@task_autoretry(bind=True, priority=10)
def hello_ok(self, *args, **kwargs):
    logger.info('Executing task id {0.id}, args: {0.args!r} kwargs: {0.kwargs!r}'.format(
        self.request))
    logger.info("Hello World --> Success Sample")
    logger.info("The given arguments are:")
    logger.info(kwargs)


@task_autoretry(bind=True)
def purge_task_results(self, *args, **kwargs):
    try:
        logger.info(f"Executing task id {self.request.id}, args: {self.request.args!r} kwargs: {self.request.kwargs!r}")
        logger.info("Purging successfull task results")
        TaskResult.objects.filter(status="SUCCESS").delete()
    except Exception as e:
        logger.error(f"Error purging task results: {e}")
        raise e


### System Tasks ###
@task_autoretry(bind=True)
def purge_celrery_workers_logs(self, *args, **kwargs):
    try:
        logger.info(f"Executing task id {self.request.id}, args: {self.request.args!r} kwargs: {self.request.kwargs!r}")
        logger.info("Purging Celery workers logs")
        
        # Get a list of all the .txt and .log files
        files = glob.glob('/code/logs/*.txt') + glob.glob('/code/logs/*.log')

        for file_name in files:
            logger.info(f"Purging file: {file_name}")
            with open(file_name, 'w') as file:
                file.write("")
    except Exception as e:
        logger.error(f"Error purging Celery workers logs: {e}")
        raise e


### Trade App Tasks ###
@task_autoretry(bind=True)
def price_alert(self, *args, **kwargs):
    try:
        logger.info("Start Executing Price Alert Task")
        logger.info(f"Executing task id {self.request.id}, args: {self.request.args!r} kwargs: {self.request.kwargs!r}")
        logger.info("The given kwargs are:")
        logger.info(kwargs)
        logger.info("The given args are:")
        logger.info(args)
        
        coin = kwargs.get("coin", None)
        coin_id = coin.get("id", None)
        
        task_scheduler_credentials = {
            "email" : os.environ.get("TASK_SCHEDULER_USERNAME"), 
            "password" : os.environ.get("TASK_SCHEDULER_PASSWORD")
            }

        gateway = Gateway()
        gateway.login(task_scheduler_credentials)
        token = gateway.token
        
        if not token:
            raise ValueError("No token was provided. Failed executing price alert task")
        
        logger.info(f"YMA ===> Token: {token}")
        
        crypto = Crypto()
        crypto.token = token
        coin = crypto.get_coin(coin_id=coin_id)
        
        logger.info(f"YMA ===> Coin: {coin}")
        
    except Exception as e:
        logger.error(f"Error executing price alert task: {e}")
        raise e 