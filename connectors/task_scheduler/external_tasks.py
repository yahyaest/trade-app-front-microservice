import time
import random
import glob
import os
import json
import asyncio
import websockets
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
from task_scheduler_app.clients.wallet import Wallet



# This is a Celery task that will be executed by the Celery worker.
# This celery tasks file will be empty as it will be loaded by replacing it content from the task_scheduler_app/api/tasks.py file from the docker container volume like this:
# volumes:
#   - ./task_scheduler_app/api/tasks.py:/code/task_scheduler_app/api/tasks.py

async def send_websoket_message(email, message):
    """
    Sends a message to a specific user on the WebSocket server.
    """
    server_url = f"ws://task-scheduler:8765?source={email}"
    async with websockets.connect(server_url) as websocket:
        try:
            await websocket.send(message)
        except Exception as e:
            logger.error(f"Error sending message to {email}: {e}")


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
        coin_name = coin.get("name", None)
        price_direction = kwargs.get("priceDirection", None)
        price_alert = kwargs.get("alertPrice", None)
        
        task_scheduler_credentials = {
            "email" : os.environ.get("TASK_SCHEDULER_USERNAME"), 
            "password" : os.environ.get("TASK_SCHEDULER_PASSWORD")
            }

        gateway = Gateway()
        gateway.login(task_scheduler_credentials)
        token = gateway.token
        
        if not token:
            raise ValueError("No token was provided. Failed executing price alert task")
        
        # Get latest coin info
        logger.info(f"Getting coin with name {coin_name}")
        crypto = Crypto()
        crypto.token = token
        coin = crypto.get_coin(coin_id=coin_id)
        current_coin_price = coin.get("price", None)
        
        if price_direction == "over" and float(current_coin_price) <= float(price_alert):
            logger.info(f"Coin {coin_name} current price {current_coin_price} $ is still under price alert {price_alert} $")
            return
        
        if price_direction == "under" and float(current_coin_price) >= float(price_alert):
            logger.info(f"Coin {coin_name} current price {current_coin_price} $ is still over {price_alert} $")
            return
        
        # Send notification
        logger.info(f"Sending price alert notification for coin {coin_name}")
        user = kwargs.get("user", None)
        notification = Notification()
        notification.token = token
        notification_payload = {
            "message": f"The coin {coin_name} with price alert {'over' if price_direction == 'over' else 'under'} {round(price_alert, 2)} $ has reached the price of {round(float(current_coin_price), 2)} $",
            "sender": user.get('email', None),
            "title": f"Price Alert for coin {coin_name}",
            "userId": user.get('id', None),
            "username": user.get('username', None),
            "userEmail": user.get('email', None),
            "userImage": user.get('avatarUrl', None).split("/")[-1],
            "externalArgs": json.dumps({"sender_name" : user.get('username', None)})
        }
        notification = notification.add_user_notification(payload=notification_payload)
        
        # Send websocket notification
        notification_payload["id"] = notification.get("id", None)
        logger.info(f"Sending websocket notification for coin {coin_name} for user {user.get('email', None)}")
        asyncio.run(send_websoket_message(
            email=user.get('email', None), 
            message=json.dumps(notification_payload)
            ))

    except Exception as e:
        logger.error(f"Error executing price alert task: {e}")
        raise e 
    

@task_autoretry(bind=True)
def wallet_history(self, *args, **kwargs):
    try:
        logger.info("Start Executing Wallet History Task")
        logger.info(f"Executing task id {self.request.id}, args: {self.request.args!r} kwargs: {self.request.kwargs!r}")
        logger.info("The given kwargs are:")
        logger.info(kwargs)
        logger.info("The given args are:")
        logger.info(args)
        
        # Get Token
        task_scheduler_credentials = {
            "email" : os.environ.get("TASK_SCHEDULER_USERNAME"), 
            "password" : os.environ.get("TASK_SCHEDULER_PASSWORD")
            }

        gateway = Gateway()
        gateway.login(task_scheduler_credentials)
        token = gateway.token
        
        if not token:
            raise ValueError("No token was provided. Failed executing price alert task")
        
        # Set Wallets History
        wallets = kwargs.get("wallets", None)
        
        if not wallets:
            logger.warning("No wallets were provided. Nothing to do")
            return
        
        wallet_connector = Wallet()
        wallet_connector.token = token
        crypto = Crypto()
        crypto.token = token
        
        for wallet in wallets:
            wallet_name = wallet.get("name", None)
            logger.info(f"Setting history for wallet with name {wallet_name}")

            wallet_intial_value = wallet.get("intialValue", None)
            wallet_current_value = wallet.get("currentValue", None)
            
            asset_query = {'name': wallet_name, 'username' : wallet.get('username', None)}
            wallet_assets = wallet_connector.get_assets(asset_query)
            
            non_sold_assets_value = 0

            for asset in wallet_assets:
                asset_bought_amount = asset.get('boughtAmount', None)
                asset_sold_amount = asset.get('soldAmount', None)
                if asset_bought_amount - asset_sold_amount > 0:
                    logger.info(f"===> Parsing asset {asset.get('name', None)} of wallet {wallet_name}")
                    
                    asset_coin = crypto.get_coin_by_name(asset.get('name', None))
                    current_coin = crypto.get_coin(asset_coin.get('id', None))
                    
                    non_sold_assets_value = non_sold_assets_value + (asset_bought_amount - asset_sold_amount) * float(current_coin.get('price', None))

            margin = (((float(wallet_current_value) + non_sold_assets_value - float(wallet_intial_value)) / float(wallet_intial_value)) * 100)
            margin = round(margin, 2)
            marginAmount = (float(wallet_intial_value) / 100) * float(margin)

            payload = {
                'username': wallet.get('username', None),
                'walletName': wallet_name,
                'walletId': wallet.get('id', None),
                'intialValue': float(wallet_intial_value),
                'currentValue': float(wallet_current_value),
                'nonSoldAssetsValue': float(non_sold_assets_value),
                'margin': float(margin),
                'marginAmount': marginAmount,
            }
            logger.info(f"Adding wallet history with payload {payload} for wallet with name {wallet_name}")
            wallet_connector.add_wallet_history(payload)
        
    except Exception as e:
        logger.error(f"Error executing wallet history task: {e}")
        raise e 

@task_autoretry(bind=True)
def buy_crypto_coin(self, *args, **kwargs):
    try:
        logger.info("Start Executing Buy Crypto Coin Task")
        logger.info(f"Executing task id {self.request.id}, args: {self.request.args!r} kwargs: {self.request.kwargs!r}")
        logger.info("The given kwargs are:")
        logger.info(kwargs)
        logger.info("The given args are:")
        logger.info(args)
        
        # Get Token
        task_scheduler_credentials = {
            "email" : os.environ.get("TASK_SCHEDULER_USERNAME"), 
            "password" : os.environ.get("TASK_SCHEDULER_PASSWORD")
            }

        gateway = Gateway()
        gateway.login(task_scheduler_credentials)
        token = gateway.token
        
        if not token:
            raise ValueError("No token was provided. Failed executing price alert task")
        
        # Set Wallets History
        wallet = kwargs.get("wallet", None)
        coin = kwargs.get("coin", None)
        coin_amount = kwargs.get("coinAmount", None)
        user = kwargs.get("user", None)
        
        if not user:
            logger.warning("No user were provided. Nothing to do")
            return
        
        if not wallet:
            logger.warning("No wallet were provided. Nothing to do")
            return
        
        if not coin:
            logger.warning("No coin were provided. Nothing to do")
            return
        
        if not coin_amount:
            logger.warning("No coin amount were provided. Nothing to do")
            return
        
        wallet_connector = Wallet()
        wallet_connector.token = token
        crypto = Crypto()
        crypto.token = token
        
        # Check if wallet has enough money
        wallet_id = wallet.get('id', None)
        wallet = wallet_connector.get_wallet(wallet_id) # Get latest wallet info
        wallet_current_value = float(wallet.get('currentValue', None))
        coin = crypto.get_coin(coin_id=coin.get('id', None)) # Get latest coin info
        logger.info(f"Coin price: {coin.get('price', None)}")
        transaction_cost = float(coin.get('price', None)) * coin_amount
        logger.info(f"Transaction cost: {transaction_cost}")
        if wallet_current_value < transaction_cost:
            logger.warning(f"Wallet {wallet.get('name', None)} with value {wallet_current_value} has not enough money to buy {coin_amount} {coin.get('name', None)} coins with a total cost of {transaction_cost}")
            
            # Disable task and related periodic task
            task_id = kwargs.get("task_id", None)
            logger.info(f"Disabling task with id {task_id}")
            task= Task.objects.get(id=task_id)
            if task.cron_expression:
                logger.info(f"Disabling periodic task with id {task.periodic_task}")
                task.enabled = False
                task.save()
                periodic_task_id = task.periodic_task
                periodic_task = PeriodicTask.objects.get(pk=periodic_task_id)
                periodic_task.enabled = False
                periodic_task.save()
            else:
                logger.info(f"Task is not a periodic task, nothing to do")
            return
        
        # Post transaction
        logger.info(f"Buying {coin_amount} {coin.get('name', None)} for wallet {wallet.get('name', None)}")
                
        transaction_payload = {
            "wallet": wallet.get('name', None),
            "username": user.get('email', None),
            "action": "BUY",
            "type": "CRYPTO",
            "amount": coin_amount,
            "name": coin.get('name', None),
            "symbol": coin.get('symbol', None),
            "unit_price": coin.get('price', None),
            "value": str(transaction_cost),
        }
        
        transaction = crypto.post_transaction(transaction_payload)
        if transaction :
            logger.info(f"Transaction for {coin_amount} {coin.get('name', None)} for wallet {wallet.get('name', None)} was successfully created")
        
        # Update wallet
        logger.info(f"Updating wallet {wallet.get('name', None)}")
        
        wallet_current_value = float(wallet.get('currentValue', None))
        wallet_current_value = wallet_current_value - transaction_cost
        
        logger.info(f"New wallet value: {wallet_current_value}")
        
        wallet_update_payload = {
            "currentValue": str(wallet_current_value)
        }
        
        wallet_response = wallet_connector.update_wallet(wallet_id, wallet_update_payload)
        if wallet_response:
            logger.info(f"Wallet {wallet.get('name', None)} was successfully updated")
        
        # Send notification
        logger.info(f"Sending buy crypto coin notification for coin {coin.get('name', None)}")
        notification = Notification()
        notification.token = token
        notification_payload = {
            "message": f"Bought {coin_amount} {coin.get('name', None)} for wallet {wallet.get('name', None)} at a total cost of {round(transaction_cost, 2)} $",
            "sender": user.get('email', None),
            "title": f"Buy {coin_amount} {coin.get('name', None)} Crypto {'Coins' if coin_amount > 1 else 'Coin'}",
            "userId": user.get('id', None),
            "username": user.get('username', None),
            "userEmail": user.get('email', None),
            "userImage": user.get('avatarUrl', None).split("/")[-1],
            "externalArgs": json.dumps({"sender_name" : user.get('username', None)})
        }
        
        notification = notification.add_user_notification(payload=notification_payload)
        
        # Send websocket notification
        
        notification_payload["id"] = notification.get("id", None)
        logger.info(f"Sending websocket notification for buy crypto coin for user {user.get('email', None)}")
        asyncio.run(send_websoket_message(
            email=user.get('email', None), 
            message=json.dumps(notification_payload)
            ))

    except Exception as e:
        logger.error(f"Error executing buy crypto coin task: {e}")
        raise e