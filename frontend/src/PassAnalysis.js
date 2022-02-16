import "./styles/passAnalysis.css";
import CompanySelector from "./CompanySelector";
import {
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    LabelList,
    Label
} from "recharts";

const data = [
    { date: "Jan", uv: 1400 },
    { date: "Feb", uv: 200 },
    { date: "Mar", uv: 30 },
    { date: "Apr", uv: 400 },
    { date: "May", uv: 200 },
    { date: "Jun", uv: 400 },
    { date: "Jul", uv: 200 },
    { date: "Aug", uv: 30 },
    { date: "Sep", uv: 400 },
    { date: "Oct", uv: 200 },
    { date: "Nov", uv: 300 },
    { date: "Dec", uv: 250 },

];

const dummy = [
    {
        name: "Εθνική οδός",
    },
    {
        name: "Αττική οδός",
    },
    {
        name: "Εγνατία οδός",
    },
    {
        name: "Ολυμπία οδός",
    },
    {
        name: "Ιερά οδός",
    },
    {
        name: "Κορινθία οδός",
    },
];

function PassAnalysis() {
    return (
        <div className="companyBalanceContainer">
            <p style={{ top: 0, textAlign: "center", color: "black" }}>
                Plot last year's pass analysis between two operators
            </p>
            <div
                style={{
                    flex: 1,
                    width: "100%",
                    // backgroundColor: "red",
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "nowrap",
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                <div className="titleBox">
                    <p className="titleText">Station operator:</p>
                    <CompanySelector
                        companies={dummy}
                        setSelectedComp={() => console.log("Kap")}
                        selectedComp={"Kap"}
                    />
                </div>
                <div style={{width:30 }}></div>
                <div className="titleBox">
                    <p className="titleText">Tag operator:</p>
                    <CompanySelector
                        companies={dummy}
                        setSelectedComp={() => console.log("Kap")}
                        selectedComp={"Kap"}
                    />
                </div>
            </div>
            <div
                style={{
                    flex: 5,
                    padding: 20,
                    marginTop: 20,
                    display: "flex",
                    backgroundColor: "white",
                    flexDirection:'column',
                    borderRadius: "1vw",
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                <p style={{color:'black', fontFamily:'Roboto', fontWeight:700, }}>2021</p>
                <BarChart width={900} height={250} data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis  />
                    {/* <Tooltip /> */}
                    {/* <Legend /> */}
                    <Bar dataKey="uv" fill="black" >
                        <LabelList dataKey="uv" position="top" />
                    </Bar>
                </BarChart>
            </div>
        </div>
    );
}

export default PassAnalysis;
