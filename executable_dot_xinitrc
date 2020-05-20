#!/bin/sh
#
# ~/.xinitrc
#
# Executed by startx (run your window manager from here)

sxhkd -c "$HOME"/.config/berry/sxhkdrc &
exec berry -d -f 'Dina-9' > /tmp/log.txt 2>&1
exec berry -c ~/.config/berry/berryrc

dunst -config "$HOME/.config/dunst/dunstrc" &
picom -config "$HOME"/babyjesus/picom.conf &
run volumeicon &

xset dpms 0 0 0 &
picom &
numlockx on &
rofi &

[[ $(fgconsole 2>/dev/null) == 1 ]] && exec startx -- vt1 &> /dev/null
