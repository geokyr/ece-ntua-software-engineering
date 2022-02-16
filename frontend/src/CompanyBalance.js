import "./styles/companyBalance.css";
// import { Button } from 'react-materialize';
import { useState } from "react";
import CompanySelector from "./CompanySelector";
import BalanceTable from "./BalanceTable";

import * as React from 'react';

const dummy = [
  {
    "name": "Εθνική οδός"    
  },
  {
    "name": "Αττική οδός"    
  },
  {
    "name": "Εγνατία οδός"    
  },
  {
    "name": "Ολυμπία οδός"    
  },
  {
    "name": "Ιερά οδός"    
  },
  {
    "name": "Κορινθία οδός"    
  }
]

const dummyTable = [
  {
    "name": "Εθνική οδός",
    "balance": 100
  },
  {
    "name": "Αττική οδός",
    "balance": 200
  },
  {
    "name": "Ολυμπία οδός",
    "balance": -10
  },
  {
    "name": "Κορινθία οδός",
    "balance": 23
  },
  {
    "name": "Ιερά οδός",
    "balance": 10
  },

];



function CompanyBalance(props) {
  const [selectedComp, setSelectedComp] = useState(dummy[0].name);

  return (
    <div className="pickerScreenContainer">
      <div className="titleContainer">
        <p className="title">Select operator:</p>
        <CompanySelector companies={dummy} setSelectedComp={setSelectedComp} selectedComp={selectedComp} />
      </div>
      <div className="scrollview">
        <BalanceTable data={dummyTable} />
      </div>
    </div>
  );
}

export default CompanyBalance;
