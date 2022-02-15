// const app = require("../src/app");
// const request = require("supertest");
// const mongoose = require("mongoose");

// describe("PassesAnalysis", () => {
//   test("should get passes analysis", async () => {
//     await request(app)
//       .get("/PassesAnalysis")
//       .query({
//         op1_ID: "aodos",
//         op2_ID: "kentriki_odos",
//         date_from: "20211005",
//         date_to: "20211110",
//         format: "csv",
//       })
//       .expect(200);
//   });
// });

// describe("PassesPerStation", () => {
//   test("should get all passes", async () => {
//     await request(app)
//       .get("/PassesPerStation")
//       .query({
//         stationID: "KO01",
//         date_from: "20190101",
//         date_to: "20190110",
//         format: "csv",
//       })
//       .expect(200);
//   });

//   test("should not get all passes beacause of wrong stationID", async () => {
//     await request(app)
//       .get("/PassesPerStation")
//       .query({
//         stationID: "dsajhda",
//         date_from: "20190101",
//         date_to: "20180110",
//         format: "csv",
//       })
//       .expect(400);
//   });

//   test("should not get all passes beacause of wrong format and stationID", async () => {
//     await request(app)
//       .get("/PassesPerStation")
//       .query({
//         stationID: "dsajhda",
//         date_from: "20190101",
//         date_to: "20180110",
//         format: "fhdsajk",
//       })
//       .expect(400);
//   });
// });
