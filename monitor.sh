#!/bin/bash

USERNAME="me@gmail.com"
PASSWORD="itzasecret"
URL="http://thepage.com/that/I/want/to/monitor"

for (( ; ; )); do
    mv new.html old.html 2> /dev/null
    curl $URL -L --compressed -s > new.html
    DIFF_OUTPUT="$(diff new.html old.html)"
    if [ "0" != "${#DIFF_OUTPUT}" ]; then
        mail \
            -t $USERNAME \
            -o tls=yes -u "Web page changed" \
            -m 'Visit it at <a href="$URL">$URL</a>'
        sleep 
    fi
done
