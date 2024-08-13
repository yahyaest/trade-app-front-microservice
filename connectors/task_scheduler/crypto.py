import json
import requests
import os
from task_scheduler_app import settings
from task_scheduler_app.clients.gateway import Gateway
from task_scheduler_app.tools.helpers import *


class Crypto:
    def __init__(self) -> None:
        self.base_url = os.getenv('BASE_URL')
        self.coins_url = f'{self.base_url}/trade-crypto/api/coins'
        self.transactions_url = f'{self.base_url}/trade-crypto/api/transactions'
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

    def get_coin_by_name(self, coin_name):
        try:
            if not self.token:
                raise ValueError("No token was provided. Failed to get coin")
            
            headers = {}
            headers['Content-Type'] = 'application/json'
            headers['Authorization'] = f'Bearer {self.token}'
            
            response = requests.get(url=f'{self.coins_url}?name={coin_name}', verify=False, headers=headers)
            if response.status_code == 200:
                coins = response.json()
                coin = coins[0] if coins else None
                return coin
            else:
                logger.error("=====> get coin failed --> failed")
                logger.error(response.status_code)
                logger.error(response.text)
            return None
        except Exception as error:
            logger.error(f"Failed to get coin {coin_name}: {error}")
    
    def get_transactions(self, query: dict = None):
        try:
            query_params = ""
            if query:
                query_params = "?"
                for key in query:
                    query_params += f"{key}={query[key]}&"
                query_params = query_params[:-1]  # Remove the last '&' character

            transactions_url = f"{self.transactions_url}{query_params}"

            if not self.token:
                raise ValueError("No token was provided. Failed to get transactions data")

            headers = {
                'Authorization': f'Bearer {self.token}'
            }

            response = requests.get(transactions_url, headers=headers)
            transactions = response.json()

            return transactions

        except Exception as error:
            logger.error(f"Failed to get transactions: {error}")
            return []

    def post_transaction(self, payload: dict):
        try:
            if not self.token:
                raise ValueError("No token was provided. Failed to post transaction data")

            headers = {
                'Authorization': f'Bearer {self.token}',
                'Content-Type': 'application/json'
            }

            response = requests.post(self.transactions_url, headers=headers, data=json.dumps(payload))

            if response.status_code != 201:
                logger.error(f"Failed to post transaction")
                logger.error(response.status_code)
                logger.error(response.text)
                return False
            transaction = response.json()
            return transaction

        except Exception as error:
            logger.error(f"Failed to post transaction: {error}")
            return False
