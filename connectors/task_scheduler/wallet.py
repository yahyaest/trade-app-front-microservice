import json
import requests
import os
from task_scheduler_app import settings
from task_scheduler_app.clients.gateway import Gateway
from task_scheduler_app.clients.crypto import Crypto
from task_scheduler_app.tools.helpers import *


class Wallet:
    def __init__(self) -> None:
        self.wallet_base_url = os.getenv('WALLET_BASE_URL')
        self.wallets_url = f'{self.wallet_base_url}/api/wallets'
        self.assets_url = f'{self.wallet_base_url}/api/assets'
        self.history_url = f'{self.wallet_base_url}/api/histories'
        self.token = None
    
    def get_assets(self, query: dict = None):
        try:
            query_params = ""
            if query:
                query_params = "?"
                for key in query:
                    query_params += f"{key}={query[key]}&"
                query_params = query_params[:-1]  # Remove the last '&' character

            wallets_url = f"{self.wallets_url}{query_params}"

            if not self.token:
                raise ValueError("No token was provided. Failed to get assets data")

            headers = {
                'Authorization': f'Bearer {self.token}'
            }

            # Get user wallets
            wallets_response = requests.get(wallets_url, headers=headers)
            wallets = wallets_response.json()

            # Get users assets
            crypto = Crypto()
            crypto.token = self.token
            assets = []
            for wallet in wallets:
                payload = {
                    'username': wallet['username'],
                    'walletName': wallet['name'],
                    'walletId': wallet['id'],
                    'type': wallet['type']
                }

                assets_response = requests.post(self.assets_url, json=payload, headers=headers)
                wallet_assets = assets_response.json()

                # Get wallet transactions
                for asset in wallet_assets:
                    query = {
                        'coinImage': True,
                        'type': asset['type'],
                        'wallet': asset['walletName'],
                        'name': asset['name'],
                        'symbol': asset['symbol']
                    }
                    # Assuming getTransactions(token, query) is defined elsewhere
                    asset_transactions = crypto.get_transactions(query)
                    asset['transactions'] = asset_transactions

                assets.extend(wallet_assets)

            return assets

        except Exception as e:
            logger.error(f"Error fetching assets: {e}")
            return []

    def add_wallet_history(self, payload: dict):
        try:
            if not self.token:
                raise ValueError("No token was provided. Failed to post wallet history")

            headers = {
                'Authorization': f'Bearer {self.token}'
            }

            response = requests.post(self.history_url, json=payload, headers=headers)
            
            if response.status_code == 201:
                wallet = response.json()
                return wallet
            else:
                logger.error("=====> posting wallet history failed --> failed")
                logger.error(response.status_code)
                logger.error(response.text)
            return None
        

        except Exception as error:
            logger.error("Error posting wallet history:", error)
    
    
