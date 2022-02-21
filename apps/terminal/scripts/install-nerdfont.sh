#!/bin/sh

echo "Installing Nerd Font..."
INSTALL_PATH="/usr/share/fonts/truetype"

if [ ! -d "$INSTALL_PATH" ]; then
	mkdir -p "$INSTALL_PATH"
fi

# Can be replaced by a Nerd Font of your choice from https://www.nerdfonts.com/font-downloads
NERD_FONT_VERSION="v2.1.0"
NERD_FONT_NAME="CascadiaCode"
NERD_FONT_URL="https://github.com/ryanoasis/nerd-fonts/releases/download/$NERD_FONT_VERSION/$NERD_FONT_NAME.zip"

cd "$HOME/Downloads" && curl -L -O "$NERD_FONT_URL"
sudo apt-get install unzip -y
sudo unzip "$NERD_FONT_NAME.zip" -d "$INSTALL_PATH"
sudo rm "$NERD_FONT_NAME.zip"

# Install the Nerd Font to the system
fc-cache -f
cd $HOME

# TODO: Find a way to get the default font indicator, so this guide can be
# used to change the default font:
# https://www.linux.com/topic/desktop/how-change-your-linux-console-fonts/
