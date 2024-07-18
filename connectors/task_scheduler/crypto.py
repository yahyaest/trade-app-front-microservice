import json
import requests
import os
from task_scheduler_app import settings
from task_scheduler_app.clients.gateway import Gateway
from task_scheduler_app.tools.helpers import *


class Crypto:
    def __init__(self) -> None:
        self.crypto_base_url = os.getenv('CRYPTO_BASE_URL')
        self.coins_url = f'{self.crypto_base_url}/api/coins'
        self.token = None
    
    def get_coins(self):
        try:
            if not self.token:
                raise ValueError("No token was provided. Failed to get coins")
            
            headers = {}
            headers['Content-Type'] = 'application/json'
            headers['Authorization'] = f'Bearer {self.token}'
            
            response = requests.get(url=self.coins_url, verify=False, headers=headers)
            if response.status_code == 200:
                coins = response.json()
                return coins
            else:
                logger.error("=====> get coins failed --> failed")
                logger.error(response.status_code)
                logger.error(response.text)
            return None
        except Exception as error:
            logger.error(f"Failed to get coins: {error}")
    
    def get_coin(self, coin_id):
        try:
            if not self.token:
                raise ValueError("No token was provided. Failed to get coin")
            
            headers = {}
            headers['Content-Type'] = 'application/json'
            headers['Authorization'] = f'Bearer {self.token}'
            
            response = requests.get(url=f'{self.coins_url}/{coin_id}', verify=False, headers=headers)
            if response.status_code == 200:
                coin = response.json()
                return coin
            else:
                logger.error("=====> get coin failed --> failed")
                logger.error(response.status_code)
                logger.error(response.text)
            return None
        except Exception as error:
            logger.error(f"Failed to get coin: {error}")
