#!/bin/sh

# Retrieve the IP address of the gateway, crypto and wallet services from DNS resolution
gateway_ip=$(getent hosts gateway | awk '{ print $1 }')
crypto_ip=$(getent hosts crypto | awk '{ print $1 }')
wallet_ip=$(getent hosts wallet | awk '{ print $1 }')


# Update /etc/hosts file with the gateway, crypto and wallet IP address
# echo "$gateway_ip gateway" >> /etc/hosts
# echo "$crypto_ip crypto" >> /etc/hosts
# echo "$wallet_ip wallet" >> /etc/hosts

# Export the IP addresses as environment variables

export GATEWAY_BASE_URL=http://$gateway_ip:3000
export CRYPTO_BASE_URL=http://$crypto_ip:3000
export WALLET_BASE_URL=http://$wallet_ip:3000


env

npm run dev

exec "$@"