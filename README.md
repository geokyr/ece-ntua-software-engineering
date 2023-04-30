# ntua-software-engineering

Semester Project for the [**Software Engineering**](https://www.ece.ntua.gr/en/undergraduate/courses/3205) course, during the 7th semester of the **School of Electrical and Computer Engineering at the National Technical University of Athens**.

## Team 23 - Members
- [**Deligiannis Gerasimos**](https://github.com/GerasimosDel)
- [**Garos Apostolis**](https://github.com/ApostolisGaros)
- [**Kyriakopoulos Georgios**](https://github.com/geokyr)
- [**Tzelepis Serafeim**](https://github.com/sertze)
- [**Vlachakis Nikos**](https://github.com/NikosVlachakis)

## Project Description

This project's goal is to produce an **information system** that is responsible for the **interoperability on motorway tolls**. This will include a **backend** that will support data management functions between the different toll operators, a **CLI** that will be used to interact with the system, operating as a client on the backend's REST API and a **Web Application** that will be used to present the data to the end user, operating as a client on the backend's REST API, as well.

## Tools
For the development of the application, we used the following tools:

- Design and architecture: [**Visual Paradigm CE**](https://www.visual-paradigm.com/download/community.jsp)
- Development: [**Node.js**](https://nodejs.org/en), [**Express.js**](https://expressjs.com/), [**React.js**](https://react.dev/), [**argparse**](https://docs.python.org/3/library/argparse.html)
- Database: [**MongoDB**](https://www.mongodb.com/)
- Source code: [**GitHub**](https://github.com/)
- Testing: [**Jest**](https://jestjs.io/), [**pytest**](https://docs.pytest.org/en/7.3.x/)

## Instructions
- Make sure that you have the latest version of **Node.js** and **MongoDB** installed
- Clone the project repository
- Make sure the `mongod` process is running
- To download and install node_modules, navigate to `/backend`, `/api` and `/frontend` and run the following command on each directory:
```
npm install
```
- To start the Node.js server and connect to the database and then start the Web Application, navigate to `/backend` and `/frontend` and run the following command on each directory:
```
npm start
```
- To restore the database from the database dump run:
```
mongorestore -d tldb database
```
- Then, you will have a copy of the database and the server running on your local machine
- If you wish to use the **CLI**, please follow the instructions documented under the `/cli` directory.
- If you wish to test the **API**, **backend** or **CLI**, please follow the instructions documented under the `/test-api`, `/test-backend` or `/test-cli` directories.