# ece-ntua-software-engineering

Semester Project and Exam Answers for the [Software Engineering](https://www.ece.ntua.gr/en/undergraduate/courses/3205) course, during the 7th semester of the School of Electrical and Computer Engineering at the National Technical University of Athens.

## Contributors
- [Apostolis Garos](https://github.com/ApostolisGaros)
- [Georgios Kyriakopoulos](https://github.com/geokyr)
- [Gerasimos Deligiannis](https://github.com/GerasimosDel)
- [Nikos Vlachakis](https://github.com/NikosVlachakis)
- [Serafeim Tzelepis](https://github.com/sertze)

## Project Description

This project's goal is to produce an information system that is responsible for the interoperability on motorway tolls. This will include a backend that will support data management functions between the different toll operators, a CLI that will be used to interact with the system, operating as a client on the backend's REST API and a Web Application that will be used to present the data to the end user, operating as a client on the backend's REST API, as well.

## Tools

For the development of the application, we used the following tools:

- Design and architecture: [Visual Paradigm CE](https://www.visual-paradigm.com/download/community.jsp)
- Development: [Node.js](https://nodejs.org/en), [Express.js](https://expressjs.com/), [React.js](https://react.dev/), [argparse](https://docs.python.org/3/library/argparse.html)
- Database: [MongoDB](https://www.mongodb.com/)
- Source code: [GitHub](https://github.com/)
- Testing: [Jest](https://jestjs.io/), [pytest](https://docs.pytest.org/en/7.3.x/)

## Documentation

- Hackolade - Database schema
- Visual Paradigm file - Required documentation diagrams
- SRS Document - Software Requirements Specification
- StRS Documents - Stakeholders Requirements Specification

## Deployment

- Make sure that you have the latest version of Node.js and MongoDB installed
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

## CLI Instructions

- Install [python3](https://www.python.org/downloads/), if not already installed.
- Install the `requests` python package, if not already installed:
```
pip install requests
```
- Add the CLI path to your OS `$PATH` to be able to run the CLI commands without the prefix `./` for the executables (e.g. as shown below, valid for one session):
```
PATH=$PATH:/home/username/ntua-software-engineering/cli
```
- Make sure the `mongod` process is running, that you have started the server and that it has connected to the database, as shown in the project's `README.md`.
- Use the CLI as specified in the documents, some examples are shown below:
```
se2123 healthcheck
se2123 passesperstation --station AO10 --datefrom 20201101 --dateto 20201231 --format json
se2123 passesanalysis --op1 aodos --op2 kentriki_odos --datefrom 20200101 --dateto 20200331 --format json
se2123 passescost --op1 gefyra --op2 kentriki_odos --datefrom 20190101 --dateto 20201231 --format csv
se2123 chargesby --op1 aodos --datefrom 20190101 --dateto 20190930 --format json
se2123 admin --passesupd --source ./passes.csv
```

## API Testing

### Disclaimer

- Due to limitations from the Jest testing framework, test suites have to be inside the `/api` folder.
- The `apitesting.test.js` file present in this folder is a copy of the file used for testing that resides in the `/api/test_api` folder. It is not used during testing.

### Instructions

- In the `/api` folder run:
```
npm run test_api
```

## Backend Testing

### Disclaimer

- Due to limitations from the Jest testing framework, test suites have to be inside the `/backend` folder.
- The `db-connection.test` file present in this folder is a copy of the file used for testing that resides in the `/backend/test_backend` folder. It is not used during testing.

### Instructions

- In the `/backend` folder run:
```
npm run test_backend
```

## CLI Testing

- Follow the instructions documented on the CLI's `README.md`
- This time, use the `tldb-test` database, by running the following on `/backend`:
```
npm run test_cli
```
- Install the `pytest` framework, if not already installed:
```
pip install pytest
```
- Run the `admin` and `main` tests using `pytest`, as shown below (follow this order):
```
pytest admin.py
pytest main.py
```

## Exam Answers

There was 1 exam in total. The naming convention is `YYx-identifier` where:
- `YY` is the year of the exam
- `x` is the exam type (a for the regural one and b for the retake one)
- `identifier` is the identifier of the file (answers or questions)
