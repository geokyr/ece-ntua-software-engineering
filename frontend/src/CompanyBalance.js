import "./styles/companyBalance.css";
// import { Button } from 'react-materialize';
import { useState, useEffect } from "react";
import CompanySelector from "./CompanySelector";
import BalanceTable from "./BalanceTable";
import DatePicker from "./DatePicker";
import * as React from "react";
import moment from 'moment'

const companies = [
    {
        name: "Εγνατία οδός",
        title: "egnatia",
        abbreviation: "EG",
    },
    {
        name: "Αττική οδός",
        title: "aodos",
        abbreviation: "AO",
    },
    {
        name: "Νέα οδός",
        title: "nea_odos",
        abbreviation: "NE",
    },
    {
        name: "Ολυμπία οδός",
        title: "olympia_odos",
        abbreviation: "OO",
    },
    {
        name: "Κεντρική οδός",
        title: "kentriki_odos",
        abbreviation: "KO",
    },
    {
        name: "Γέφυρα",
        title: "gefyra",
        abbreviation: "GF",
    },
    {
        name: "Μορέας",
        title: "moreas",
        abbreviation: "MR",
    },
];

const dummyTable = [
    {
        name: "Εθνική οδός",
        balance: 100,
    },
    {
        name: "Αττική οδός",
        balance: 200,
    },
    {
        name: "Ολυμπία οδός",
        balance: -10,
    },
    {
        name: "Κορινθία οδός",
        balance: 23,
    },
    {
        name: "Ιερά οδός",
        balance: 10,
    },
];

function CompanyBalance(props) {
    const [selectedComp, setSelectedComp] = useState(companies[0]);
    const [dateFrom, setDateFrom] = useState("20190101");
    const [dateTo, setDateTo] = useState("20200101");

    const [tableData, setTableData] = useState(null);

    const formatDate = (date) => {
      return moment(date).format('YYYYMMDD');
    }

    const formatTableData = (obj) => {
      let arr = obj.PPOList.map((operator) => {
          return { "name": operator.VisitingOperator, "balance": operator.PassesCost }
      })
      return arr;
    }


    // Get balances of the selected company with every other company operator
    const fetchBalances = () => {
        let balances = [];

        fetch(`http://localhost:9103/ChargesBy/${selectedComp.title}/${formatDate(dateFrom)}/${formatDate(dateTo)}?format=json`)
          .then(res => res.json())
          .then(response =>  setTableData(formatTableData(response)))
          .catch(err => { console.error(err)})
    };

    useEffect(fetchBalances, [selectedComp, dateFrom, dateTo]);

    return (
        <div className="pickerScreenContainer">
            <p style={{ top: 0, textAlign: "center", color: "black" }}>
                Display balance between a selected operator and every other
                company
            </p>
            <div style={{ display: "flex", flexDirection: "row" }}>
                <div className="titleContainer">
                    <p className="title">Operator:</p>
                    <CompanySelector
                        companies={companies}
                        setSelectedComp={setSelectedComp}
                        selectedComp={selectedComp}
                    />
                </div>
                <div style={{ width: 30 }}></div>
                <div className="titleContainer">
                    <p className="title">From:</p>
                    <DatePicker value={dateFrom} setValue={setDateFrom} />
                </div>
                <div style={{ width: 30 }}></div>
                <div className="titleContainer">
                    <p className="title">To:</p>
                    <DatePicker value={dateTo} setValue={setDateTo} />
                </div>
            </div>

            <div className="scrollview">
                <BalanceTable data={tableData} />
            </div>
        </div>
    );
}

export default CompanyBalance;
