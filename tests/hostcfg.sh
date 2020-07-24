#!/bin/bash
IP=`ip addr s eth0 |grep "inet "|awk '{print $2}' |awk -F "/" '{print $1}'`

#echo $IP
sudo sed "s/reg.mydomain.com/$IP/" -i make/harbor.yml

echo "https:" >> make/harbor.yml
echo "  certificate: /data/cert/server.crt" >> make/harbor.yml
echo "  private_key: /data/cert/server.key" >> make/harbor.yml