var mysql = require("mysql");

export default class DummyDatabasePopulator {
    static connect(connection) {
        this.connection = connection;
    }

    static populateGTPA() {
        for (let j = 1; j < 103; j++) {
            let i = j % 10;
            if (j % 10 == 0) i = 1;
            this.connection.query("INSERT INTO GLSTradeProcessAudit ( Queued, Started, Processed )" +
                " VALUES(" +
                "'2019-05-0" + i + "T14:0" + i * 2 + ":10', '2019-05-0" + i + "T14:0" + (i + 1) + ":10', '2019-05-0" + i + "T18:25:10'" +
                ");",
                function (error, results, fields) {
                    if (error) {
                        console.log("An error occurred querying the database.");
                        throw error;
                    };
                    console.log('results: ', results);
                });
        }
    }

    static populateTB() {
        for (let j = 1; j < 103; j++) {
            this.connection.query("INSERT INTO TradeBatches ( BatchGUID )" +
                " VALUES(" + (j + 900) + ");",
                function (error, results, fields) {
                    if (error) {
                        console.log("An error occurred querying the database.");
                        throw error;
                    };
                    console.log('results: ', results);
                });
        }
    }

    static _randomText(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    static populateTS() {
        for (let j = 1; j < 103; j++) {
            let i = j % 10;
            if (j % 10 == 0) i = 1;
            let query = "INSERT INTO TradeSet ( BatchGUID, Trader, Description, createdBy )" +
                " VALUES( " + (i + 900) + ", \"" + this._randomText(5) +
                "\", \"" + this._randomText(40) + "\", \"" + this._randomText(5) +
                "\" );"

            console.log("Queried: - ..." + query) //.slice(79)
            this.connection.query(query,
                function (error, results, fields) {
                    if (error) {
                        console.log("An error occurred querying the database.");
                        throw error;
                    };
                    console.log('results: ', results);
                });
        }
    }

    static populateTST() {
        for (let j = 1; j < 103; j++) {
            //let i = j % 10;
            //if (j % 10 == 0) i = 1;
            let query = "INSERT INTO TradeSetTrades ( TradeId )" +
                " VALUES( " + j + " );"

            console.log("Queried: - ..." + query) //.slice(79)
            this.connection.query(query,
                function (error, results, fields) {
                    if (error) {
                        console.log("An error occurred querying the database.");
                        throw error;
                    };
                    console.log('results: ', results);
                });
        }
    }

    static populateTA() {
        for (let j = 1; j < 103; j++) {
            //let i = j % 10;
            //if (j % 10 == 0) i = 1;
            let query = "INSERT INTO TradeAllocations ( TradeId, AccountId )" +
                " VALUES( " + j + "," + (Math.floor(Math.random() * 100) + 1) + " );"

            console.log("Queried: - ..." + query) //.slice(79)
            this.connection.query(query,
                function (error, results, fields) {
                    if (error) {
                        console.log("An error occurred querying the database.");
                        throw error;
                    };
                    console.log('results: ', results);
                });
        }
    }

    static populateCA() {
        for (let j = 1; j < 103; j++) {
            //let i = j % 10;
            //if (j % 10 == 0) i = 1;
            let query = "INSERT INTO ClientAccounts ( AccountId, ClientAcctNo, ReportName )" +
                " VALUES( " + j + ", " + (Math.floor(Math.random() * 100) + 1) + ", " + "\"repname-" + this._randomText(20) + "\" );"

            console.log("Queried: - ..." + query) //.slice(79)
            this.connection.query(query,
                function (error, results, fields) {
                    if (error) {
                        console.log("An error occurred querying the database.");
                        throw error;
                    };
                    console.log('results: ', results);
                });
        }
    }

    static populateT() {
        for (let j = 1; j < 103; j++) {
            //let i = j % 10;
            //if (j % 10 == 0) i = 1;
            let query = "INSERT INTO Trades ( TradeId, SecId )" +
                " VALUES( " + j + ", " + (Math.floor(Math.random() * 1000) + 1) + " );"

            console.log("Queried: - ..." + query) //.slice(79)
            this.connection.query(query,
                function (error, results, fields) {
                    if (error) {
                        console.log("An error occurred querying the database.");
                        throw error;
                    };
                    console.log('results: ', results);
                });
        }
    }



    static updateGTPA() {
        let query = "UPDATE GLSTradeProcessAudit " +
            "SET Started=date_add(Queued, INTERVAL ((((BatchGUID DIV 1.1) MOD 10) + 60) * 5) MOD 19 MINUTE )," + //+ (Math.floor(Math.random() * 40) + 1) + " MINUTE );"
            "Processed=date_add(Queued, INTERVAL ((BatchGUID DIV 1.1) MOD 10)+60 MINUTE );"
        console.log("Queried: - ..." + query) //.slice(79)
        this.connection.query(query,
            function (error, results, fields) {
                if (error) {
                    console.log("An error occurred querying the database.");
                    throw error;
                };
                console.log('results: ', results);
            });

    }
}