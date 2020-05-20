

# Themes are into ~/.oh-my-zsh/themes/
# Optionally, if you set this to "random", it'll load a random theme each time
#ZSH_THEME="spaceship"

# Enable colors and change prompt:
autoload -U colors && colors	# Load colors

# Path to your oh-my-zsh installation.
export ZSH="/home/babyjesus/.oh-my-zsh"

# Disable bi-weekly auto-update checks.
DISABLE_AUTO_UPDATE="true"

# User configuration
source $ZSH/oh-my-zsh.sh
source ~ / .bash_profile

# Load aliases and shortcuts if existent.
[ -f "$HOME/aliasrc" ] && source "$HOME/aliasrc"


# Plugin list in ~/.oh-my-zsh/plugins
plugins=(
    zsh-syntax-highlighting
    zsh-autosuggestions
    adb
    zsh_reload
    sudo
)


export PATH="/usr/lib/ccache/bin/:$PATH"
export PATH="${PATH}:${HOME}/.local/bin/"


eval $(thefuck --alias)
# You can use whatever you want as an alias, like for Mondays:
eval $(thefuck --alias f)


#unset GREP_OPTIONS
#test -r ~/.dircolors && eval "$(dircolors -b ~/.dircolors)" || \
#    eval "$(dircolors -b)"


#StarShip
eval "$(starship init zsh)"

source /home/babyjesus/.oh-my-zsh/plugins/sudo/sudo.plugin.zsh
source ~/.zsh/zsh-autosuggestions/zsh-autosuggestions.zsh
source /home/babyjesus/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
