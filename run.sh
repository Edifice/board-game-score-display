#!/bin/bash

#close running Midori windows
killall midori

git pull

midori -e Fullscreen -a http://localhost/index.html
