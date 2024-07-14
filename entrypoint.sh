#!/bin/sh

# Retrieve the IP address of the gateway, crypto and wallet services from DNS resolution
gateway_ip=$(getent hosts gateway | awk '{ print $1 }')
crypto_ip=$(getent hosts crypto | awk '{ print $1 }')
wallet_ip=$(getent hosts wallet | awk '{ print $1 }')
notification_ip=$(getent hosts notification | awk '{ print $1 }')
task_scheduler_ip=$(getent hosts task_scheduler | awk '{ print $1 }')


# Update /etc/hosts file with the gateway, crypto and wallet IP address
# echo "$gateway_ip gateway" >> /etc/hosts
# echo "$crypto_ip crypto" >> /etc/hosts
# echo "$wallet_ip wallet" >> /etc/hosts

# Export the IP addresses as environment variables

export GATEWAY_BASE_URL=http://$gateway_ip:3000
export CRYPTO_BASE_URL=http://$crypto_ip:3000
export WALLET_BASE_URL=http://$wallet_ip:3000
export NOTIFICATION_BASE_URL=http://$notification_ip:8000
export TASK_SCHEDULER_BASE=http://$task_scheduler_ip:5000


env

npm run dev

exec "$@"