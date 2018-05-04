# reverseABtester -- Monitors a web page for changes

This script sends an email notification if the HTML files at URL changed.

On linux environments, you can use services like sendEmail and ssmtp (https://doc.ubuntu-fr.org/ssmtp).

- Sleep command is in seconds.

# Starting the script
## From the command line
- `chmod +x script.sh` then `./monitor.sh`
- `nohup ./monitor.sh &` for background stuff (http://manpages.ubuntu.com/manpages/xenial/fr/man1/nohup.1.html)

## On boot
We are using a linux environment and systemd.

In your `/etc/systemd/system/`folder, run these commands one by one:
```
  touch trackerName.service
  sudo nano trackerName.service
  ```

Copy this content :
```
[Unit]
Description=Dameon to start nohup script for reverseABtester 
After=network.target

[Service]
ExecStart=/usr/bin/nohup /path/to/your/monitor.sh
Type=oneshot
RemainAfterExit=yes


[Install]
WantedBy=multi-user.target
```

Then enable and start the service :
```
systemctl enable trackerName
systemctl status trackerName
systemctl start trackerName
```

Now the script will launch on every boot of the machine.

