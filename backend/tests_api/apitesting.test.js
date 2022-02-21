const app = require("../src/app");
const request = require("supertest");
const mongoose = require("mongoose");

describe("apitesting", () => {
    beforeAll(async () => {
        // A connection to a test database is created.
        connection = mongoose.createConnection(process.env.MONGODB_URL);
        db = mongoose.connection;
    });

    afterAll(async () => {
        await db.dropDatabase();
        await db.close();
        await connection.close;
        //we reset the timeout value in the default value
        jest.setTimeout(5 * 1000);
    });

    // -------- Testing for "healthcheck endpoint" --------------------------------------------------------
    describe("healthcheck should be connected", () => {
        it("should return that db is connected", async () => {
            const response = await request(app).get("/admin/healthcheck");
            expect(200);
        });
    });

    // -------- Testing for "resetpasses endpoint" --------------------------------------------------------
    describe("resetpasses", () => {
      //we use setTimeout because the default value is (5000ms), so we modify it beacuse its a long running test
      jest.setTimeout(100000);
      it("should return that passes added in db", async () => {
        const response = await request(app).post("/admin/resetpasses");
        expect(200);
      });
    });

    // -------- Testing for "resetvehicles endpoint" --------------------------------------------------------
    describe("resetvehicles", () => {
      it("should return that vehciles added in db", async () => {
        const response = await request(app).post("/admin/resetvehicles");
        expect(200);
      });
    });

    // -------- Testing for "resetstations endpoint" --------------------------------------------------------
    describe("resetstations", () => {
      it("should return that stations added in db", async () => {
        const response = await request(app).post("/admin/resetstations");
        expect(200);
      });
    });

    // -------- Testing for "PassesPerStation endpoint" --------------------------------------------------------
    describe("PassesPerStation for a specific station", () => {
        it("should get a bunch of passes for that specific station", async () => {
            const response = await request(app)
                .get("/PassesPerStation/KO01/20190101/20190110")
                .query({
                    format: "json",
                });
            expect(response.body.NumberOfPasses).toBe(7);
        });
    });

    describe("PassesPerStation check ascending order in the list", () => {
        it("should return that list is sorted", async () => {
            const response = await request(app)
                .get("/PassesPerStation/KO01/20190101/20290312")
                .query({
                    format: "json",
                });
            let result = 1;
            for (let i = 0; i < response.body.PassesList.length - 1; i++) {
                if (
                    new Date(response.body.PassesList[i].PassTimeStamp) >
                    new Date(response.body.PassesList[i + 1].PassTimeStamp)
                )
                    result = 0;
            }
            expect(result).toBe(1);
        });
    });

    describe("PassesPerStation with wrong dates", () => {
        it("should get 0 passes because date_to is less than date_from", async () => {
            const response = await request(app)
                .get("/PassesPerStation/KO01/20200110/20190101")
                .query({
                    format: "json",
                });
            expect(response.status).toBe(400);
        });
    });

    describe("should not get all passes because of wrong stationID", () => {
        it("should not get all passes", async () => {
            const response = await request(app)
                .get("/PassesPerStation/ggdsgkvghjk/20190110/20190101")
                .query({
                    format: "json",
                });
            expect(response.status).toBe(400);
        });
    });

    describe("should not get all passes because of wrong format and stationID", () => {
        it("should not get all passes", async () => {
            const response = await request(app)
                .get("/PassesPerStation/KO0ccghc1/20190110/20190101")
                .query({
                    format: "cghfcg",
                });
            expect(response.status).toBe(400);
        });
    });

    describe("should not get passes because everything is wrong", () => {
        it("should get 0 passes", async () => {
            const response = await request(app)
                .get("/PassesPerStation/vvvvv/vgvkj/hgfgcghfcdgdfg")
                .query({
                    format: "hfcfcffg",
                });
            expect(response.status).toBe(400);
        });
    });

    // -------- Testing for "PassesAnalysis endpoint" --------------------------------------------------------
    describe("successful PassesAnalysis for two operators ", () => {
        it("should get 10 passes for the two operators", async () => {
            const response = await request(app)
                .get("/PassesAnalysis/aodos/kentriki_odos/20211005/20211110")
                .query({
                    format: "json",
                });
            expect(response.body.NumberOfPasses).toBe(10);
        });
    });

    describe("PassesAnalysis check ascending order in the list", () => {
        it("should return that list is sorted", async () => {
            const response = await request(app)
                .get("/PassesAnalysis/aodos/kentriki_odos/20211005/20211110")
                .query({
                    format: "json",
                });
            let result = 1;
            for (let i = 0; i < response.body.PassesList.length - 1; i++) {
                if (
                    new Date(response.body.PassesList[i].PassTimeStamp) >
                    new Date(response.body.PassesList[i + 1].PassTimeStamp)
                )
                    result = 0;
            }
            expect(result).toBe(1);
        });
    });

    describe("fail PassesAnalysis for two operators ", () => {
        it("should not return anything due to date_from is bigger than date_to", async () => {
            const response = await request(app)
                .get("/PassesAnalysis/aodos/kentriki_odos/20261005/20211005")
                .query({
                    format: "csv",
                });
            expect(response.body).toEqual({});
        });
    });

    describe("fail PassesAnalysis for two operators ", () => {
        it("should not return anything due to wrong inputs", async () => {
            const response = await request(app)
                .get(
                    "/PassesAnalysis/sadf/kentrifdsfski_odos/fdsfd/2021fdsfds1005"
                )
                .query({
                    format: "fdsfdfs",
                });
            expect(response.status).toBe(400);
        });
    });

    // -------- Testing for "PassesCost endpoint" --------------------------------------------------------
    describe("Successful PassesCost between two operators ", () => {
        it("should return a numberOfPasses greater than 0", async () => {
            const response = await request(app)
                .get("/PassesCost/aodos/gefyra/20211005/20211110")
                .query({
                    format: "json",
                });
            expect(response.body.NumberOfPasses).toBeGreaterThan(0);
        });
    });

    describe("fail PassesCost between two operators ", () => {
        it("should not return anything because of wrong inputs", async () => {
            const response = await request(app)
                .get("/PassesCost/fd/fsdfds/fdsfdsfd/fdsfdsfdsfds")
                .query({
                    format: "dsfsfasdsfs",
                });
            expect(response.status).toBe(400);
        });
    });

    describe("fail PassesCost between two operators ", () => {
        it("should not return anything because of wrong dates(date_from is bigger than date_to)", async () => {
            const response = await request(app)
                .get("/PassesCost/aodos/gefyra/20291005/20211110")
                .query({
                    format: "dsfsfasdsfs",
                });
            expect(response.status).toBe(400);
        });
    });

    // -------- Testing for "ChargesBy endpoint" --------------------------------------------------------
    describe("success ChargesBy for a specific operator ", () => {
        it("should return PPOList greater than 0", async () => {
            const response = await request(app)
                .get("/ChargesBy/aodos/20211005/20211110")
                .query({
                    format: "json",
                });
            expect(response.body.PPOList.length).toBeGreaterThan(0);
        });
    });

    describe("fail ChargesBy for a specific operator ", () => {
        it("should return empty PPOList because of wrong dates", async () => {
            const response = await request(app)
                .get("/ChargesBy/aodos/20291005/20211110")
                .query({
                    format: "json",
                });
            expect(response.status).toBe(400);
        });
    });

    describe("fail ChargesBy for a specific operator ", () => {
        it("should return empty PPOList because of invalid operator", async () => {
            const response = await request(app)
                .get("/ChargesBy/aodos12345/20211005/20211110")
                .query({
                    format: "json",
                });
            expect(response.status).toBe(400);
        });
    });

    describe("fail ChargesBy for a specific operator ", () => {
        it("should return nothing because of wrong inputs", async () => {
            const response = await request(app)
                .get("/ChargesBy/aod/fsdfsdf/20211110")
                .query({
                    format: "fdaslkfasd",
                });
            expect(response.status).toBe(400);
        });
    });

    describe("fail ChargesBy for a specific operator ", () => {
        it("should return a list with specific length", async () => {
            const response = await request(app)
                .get("/ChargesBy/aodos/20211005/20211110")
                .query({
                    format: "json",
                });
            expect(response.body.PPOList.length).toBe(6);
        });
    });

    // -------- Testing for "OperatorBalances endpoint" --------------------------------------------------------
    describe("Testing OperatorBalances", () => {
        it("should fail because of wrong dates", async () => {
            const response = await request(app)
                .get("/OperatorBalances/aodos/20191005/20171110")
                .query({
                    format: "json",
                });
            expect(response.status).toBe(400);
        });
    });

    describe("Testing OperatorBalances", () => {
        it("should fail because of invalid operator", async () => {
            const response = await request(app)
                .get("/OperatorBalances/aodos12345/20211005/20211110")
                .query({
                    format: "json",
                });
            expect(response.status).toBe(400);
        });
    });

    describe("Testing OperatorBalances", () => {
        it("should fail because of wrong inputs", async () => {
            const response = await request(app)
                .get("/OperatorBalances/aod/fsdfsdf/20211110")
                .query({
                    format: "fdaslkfasd",
                });
            expect(response.status).toBe(400);
        });
    });

    describe("Testing OperatorBalances", () => {
        it("should return a Balances array specific values", async () => {
            let correctResult = [
                { abbr: "EG", balance: 15.2 },
                { abbr: "AO", balance: 0 },
                { abbr: "NE", balance: 9.6 },
                { abbr: "OO", balance: 11.4 },
                { abbr: "KO", balance: 12.3 },
                { abbr: "GF", balance: 2 },
                { abbr: "MR", balance: 6.9 },
            ];

            const response = await request(app)
                .get("/OperatorBalances/aodos/20211001/20211031")
                .query({
                    format: "json",
                });
            expect(response.body.Balances).toEqual(correctResult);
        });
    });

    // -------- Testing for "YearlyPassesCount endpoint" --------------------------------------------------------
    describe("Testing YearlyPassesCount", () => {
        it("should fail because of wrong dates", async () => {
            const response = await request(app)
                .get("/YearlyPassesCount/aodos/egnatia/20191005/20171110")
                .query({
                    format: "json",
                });
            expect(response.status).toBe(400);
        });
    });

    describe("Testing YearlyPassesCount", () => {
        it("should fail because of invalid operator", async () => {
            const response = await request(app)
                .get("/YearlyPassesCount/aodos12345/egnatia/20211005/20211110")
                .query({
                    format: "json",
                });
            expect(response.status).toBe(400);
        });
    });

    describe("Testing YearlyPassesCount", () => {
        it("should fail because of wrong inputs", async () => {
            const response = await request(app)
                .get("/YearlyPassesCount/aod/sad/fsdfsdf/20211110")
                .query({
                    format: "fdaslkfasd",
                });
            expect(response.status).toBe(400);
        });
    });

    describe("Testing YearlyPassesCount", () => {
        it("should return a PassesPerMonth array specific values", async () => {
            let correctResult = [5, 12, 11, 5, 9, 5, 7, 11, 10, 9, 5, 0];

            const response = await request(app)
                .get("/YearlyPassesCount/aodos/egnatia/20210101/20211231")
                .query({
                    format: "json",
                });
            expect(response.body.PassesPerMonth).toEqual(correctResult);
        });
    });

    // -------- Testing for "passesupd endpoint" --------------------------------------------------------
    describe("Testing passesupd", () => {
        it("should fail because wrong file type (.csv)", async () => {
            const response = await request(app).post("/admin/passesupd").query({
                filepath: "../passesTesting.pdf",
            });
            expect(400);
        });
        it("should fail because of missing file", async () => {
            const response = await request(app).post("/admin/passesupd").query({
                filepath: "../NonExistentFile.csv",
            });
            expect(400);
        });

        it("passes should be added in db added in db", async () => {
            const response = await request(app).post("/admin/passesupd").query({
                filepath: "../passesTesting.csv",
            });
            expect(200);
        });
    });
});
