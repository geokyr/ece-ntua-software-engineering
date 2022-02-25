# CLI

## Instructions
- Install [python3](https://www.python.org/downloads/), if not already installed.

- Install requests python package, if not already installed:
```
$ pip install requests
``` 

- Add the CLI path to your OS $PATH to be able to run the CLI commands without the prefix "./" for the executables (e.g. as shown below, valid for one session):
```
$ PATH=$PATH:/home/username/TL21-23/cli
```

- Make sure the ```mongod``` process is running and that you have started the server and that it has connected to the database, as shown in the project README.md.

- Use the CLI as specified in the documents, examples shown below:
```
$ se2123 healthcheck
$ se2123 chargesby --op1 aodos --datefrom 20211005 --dateto 20211110 --format json
$ se2123 admin --passesupd --source /home/username/TL21-23/backend/passes.csv
```
