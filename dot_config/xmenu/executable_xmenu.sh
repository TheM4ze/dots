#!/bin/sh

# ignore hup signal
trap "" 1 15

cat <<EOF | xmenu | sh &
Applications
	Web Browser	firefox
	Image editor gimp

Shutdown		poweroff
Reboot			reboot
EOF
