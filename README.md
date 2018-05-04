# reverseABtester -- Monitors a web page for changes

This script sends an email notification if the HTML files at URL changed.

On linux environments, you can use services like sendEmail and ssmtp (https://doc.ubuntu-fr.org/ssmtp).

- Sleep command is in seconds.
- `chmod +x script.sh` then `./monitor.sh`
- `nohup ./monitor.sh &` for background stuff (http://manpages.ubuntu.com/manpages/xenial/fr/man1/nohup.1.html)
