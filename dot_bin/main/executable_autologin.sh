#!/bin/bash
set -e

echo "THIS SCRIPT WILL ASK YOUR LOGINNAME "
echo "AND WILL USE IT TO ADD YOU TO THE AUTOLOGIN GROUP "
echo "https://wiki.archlinux.org/index.php/LightDM#Enabling_autologin"

##Change your username here
read -p "What is your login? It will be used to add this user to the group autologin : " choice
sudo gpasswd -a $choice autologin

sudo sed -i 's/'#autologin-user='/'autologin-user=$choice'/g' /etc/lightdm/lightdm.conf
sudo sed -i 's/'#autologin-session='/'autologin-session=berry'/g' /etc/lightdm/lightdm.conf
