#!/bin/bash
set -e

# Author	:	TheM4ze



git init
git config --global user.name "Bojan Suton"
git config --global user.email "bslinux@protonmail.com"
sudo git config --system core.editor nano
git config --global credential.helper cache
git config --global credential.helper 'cache --timeout=25000'
git config --global push.default simple
