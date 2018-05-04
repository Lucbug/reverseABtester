#!/bin/bash

USERNAME="me@gmail.com"
PASSWORD="itzasecret"
URL="http://thepage.com/that/I/want/to/monitor"

for (( ; ; )); do
    mv new.html old.html 2> /dev/null
    curl $URL -L --compressed -s > new.html
    DIFF_OUTPUT="$(diff new.html old.html)"
    if [ "0" != "${#DIFF_OUTPUT}" ]; then
        echo 'Visit it at <a href="$URL">$URL</a>' | mail -s "Web page changed" $USERNAME
        sleep 1800
    fi
done
