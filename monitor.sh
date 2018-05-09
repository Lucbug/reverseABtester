#!/bin/bash

USERNAME="me@gmail.com"
PASSWORD="itzasecret"
URL="http://thepage.com/that/I/want/to/monitor"

for (( ; ; )); do
    mv new.html old.html 2> /dev/null
    curl $URL -L --compressed -s > new.html
    DIFF_OUTPUT="$(diff new.html old.html)"
    if [ "0" != "${#DIFF_OUTPUT}" ]; then
        echo "<p>Visit it at <a href=" $URL ">" "$URL</a></p><p>h1>Diff :</h1><p>" $DIFF_OUTPUT "<p>" | mail -s "Web page changed" -a "Content-type: text/html;" $USERNAME
        sleep 1800
    fi
done
