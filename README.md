# NTUA ECE Software Engineering 2021 Project

This project's goal is to produce software that is responsible for the interoperability on motorway tolls.

## Team 23 - Members
* [**Deligiannis Gerasimos**](https://github.com/GerasimosDel)
* [**Garos Apostolis**](https://github.com/ApostolisGaros)
* [**Kyriakopoulos George**](https://github.com/geokyr)
* [**Tzelepis Serafeim**](https://github.com/sertze)
* [**Vlachakis Nikos**](https://github.com/NikosVlachakis)

## Tools
For the development of the application, we used the following tools:

* Design and architecture: Visual Paradigm CE
* Development: Node.js, Express.js, React.js, argparse
* Database: MongoDB
* Source code: GitHub
* Testing: Jest, pytest

## Prerequisites
* Make sure that you have the latest version of Node.js installed. Otherwise, download [Node.js](https://nodejs.org/en/download/).
* Make sure that you have the latest version of MongoDB installed. Otherwise, download [MongoDB](https://www.mongodb.com/try/download/community).

## Instructions
* Clone the [project repository](https://github.com/geokyr/TL21-23)
```
$ git clone https://github.com/geokyr/TL21-23
```

* Make sure the ```mongod``` process is running

* To download and install node_modules, navigate to **/backend** and run:
```
$ npm install
```

* To download and install node_modules, navigate to **/api** and run: 
```
$ npm install
```

* To download and install node_modules, navigate to **/frontend** and run: 
```
$ npm install
```

* To start the nodejs server and connect to the database, navigate to **/backend** and run:
```
$ npm start
```

* To start the frontend, navigate to **/frontend** and run: 
```
$ npm start
```

* To restore the database from the database dump run:
```
$ mongorestore -d tldb database
```

* Then, you will have a copy of the database and the server running on your local machine

* If you wish to use the **CLI**, please follow the instructions documented on the **/cli** README.md.

* If you wish to test the **API**, **backend** or **CLI**, please follow the instruction documented on the **/test-api**, **/test-backend** or **/test-cli** README.md.
