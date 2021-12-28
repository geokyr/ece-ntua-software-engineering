# Software Engineering team: TL21-23

## Project concept
This project's goal is to produce software that is responsible for the interoperability on motorway tolls.

## Prerequisites
- Make sure that you have the latest version of Node.js installed. Otherwise, download [Node.js](https://nodejs.org/en/download/).
- Make sure that you have the latest version of MongoDB installed. Otherwise, download [MongoDB](https://www.mongodb.com/try/download/community).

## Instructions
- Clone the [project repository](https://github.com/ntua/TL21-23)
```
$ git clone https://github.com/ntua/TL21-23
```

- Make sure the ```mongod``` process is running

- To download and install node_modules, navigate to **/backend** and run:
```
$ npm install
``` 

- To download and install node_modules, navigate to **/api** and run: 
```
$ npm install
``` 

- To start the nodejs server and connect to the database, navigate to **/backend** and run: 
```
$ npm start
``` 

- To restore the database from the database dump run:
```
$ mongorestore -d tldb database
```

- Then, you will have a copy of the database and the server running on your local machine