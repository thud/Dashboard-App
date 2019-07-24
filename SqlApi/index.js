import express from 'express';
import mysql from 'mysql';
import DummyDatabasePopulator from './dummyDatabasePopulator';

const app = express();
const PORT = 3000;

// bypass CORS protection
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
})


app.get("/", (req, res, next) => {
    res.send("JP - July 2019  ;)");
})

//////////////// MySQL Connection Below /////////////////

const dbCreds = {
    host: 'localhost',
    user: 'root',
    password: 'Your_password_here',
    database: 'SystemAvailability'
}


/* 
let tempConn = mysql.createConnection(dbCreds);
DummyDatabasePopulator.connect(tempConn);
//DummyDatabasePopulator.populateTB();
//DummyDatabasePopulator.populateTST();
//DummyDatabasePopulator.populateT();
//DummyDatabasePopulator.updateGTPA();
tempConn.end();
 */





const durations_Querystring = `select tb.TradeBatchId,
gtpa.BatchGuid,
       timediff(gtpa.Started, gtpa.Queued) as QueueDuration,
       timediff(gtpa.Processed, gtpa.Started) as ExecDuration,
       timediff(gtpa.Processed, gtpa.Queued) as OverallDuration,
       gtpa.*
from   GLSTradeProcessAudit gtpa
inner join TradeBatches tb on tb.BatchGuid = gtpa.BatchGUID
where  gtpa.Queued >= '20190101';`
//--And datediff(ss, gtpa.Started, gtpa.Processed)>200

const tradeinformation_QueryString = `select ts.BatchGuid,  t.TradeID, t.SecID, ca.ClientAcctNo, ca.ReportName from TradeSet ts
inner join TradeSetTrades tst on ts.TradeSetId = tst.TradeSetId
inner join Trades t on t.TradeId = tst.TradeId
inner join TradeAllocations ta on ta.TradeID = tst.TradeId
inner join ClientAccounts ca on ta.AccountID = ca.AccountID`


const accountschecked_QueryString = `select ts.BatchGuid,  count(distinct ta.AccountID) as AccountsCheckedInBatch from TradeSet ts
inner join TradeSetTrades tst on ts.TradeSetId = tst.TradeSetId
inner join Trades t on t.TradeId = tst.TradeId
inner join TradeAllocations ta on ta.TradeID = tst.TradeId`

/////////////////// MySQL Connection above //////////////////////


//// API BELOW ////

app.get("/api/guidelinecheckdurations", (req, res, next) => {
    let connection = mysql.createConnection(dbCreds);

    connection.connect((err) => {
        if (err) {
            console.log("Unable to connect to database correctly! ");
            throw err;
        }
        console.log("Connected to database successfully");
    });

    connection.query(durations_Querystring,
        (err, results, fields) => {
            if (err) throw err;
            res.send(
                JSON.stringify(
                    results.map((record) => {
                        return {
                            QueueDuration: record.QueueDuration,
                            ExecDuration: record.ExecDuration,
                            OverallDuration: record.OverallDuration,
                            Queued: record.Queued,
                            BatchGUID: record.BatchGUID,
                        }
                    })
                )
            );
        });

    connection.end();
});

app.get("/api/tradeinformationonbatches/:BatchGUID", (req, res, next) => {
    let connection = mysql.createConnection(dbCreds);

    connection.connect((err) => {
        if (err) {
            console.log("Unable to connect to database correctly! ");
            throw err;
        }
        console.log("Connected to database successfully");
    });

    connection.query(tradeinformation_QueryString + " where ts.BatchGUID=" + req.params.BatchGUID,
        (err, results, fields) => {
            if (err) throw err;

            if (JSON.stringify(results) === "[]") {
                res.send(JSON.stringify({
                    nodata: true
                }));
            } else {
                res.send(
                    JSON.stringify(
                        results.map((record) => {
                            return {
                                BatchGuid: record.BatchGuid,
                                TradeId: record.TradeID,
                                SecId: record.SecID,
                                ClientAcctNo: record.ClientAcctNo,
                                ReportName: record.ReportName,
                            }
                        })
                    )
                );
            }

            connection.end();
        });
});

app.get("/api/tradeinformationonbatches", (req, res, next) => {
    let connection = mysql.createConnection(dbCreds);

    connection.connect((err) => {
        if (err) {
            console.log("Unable to connect to database correctly! ");
            throw err;
        }
        console.log("Connected to database successfully");
    });

    connection.query(tradeinformation_QueryString + " order by ts.BatchGUID;",
        (err, results, fields) => {
            if (err) throw err;
            res.send(
                JSON.stringify(
                    results.map((record) => {
                        return {
                            BatchGuid: record.BatchGuid,
                            TradeId: record.TradeID,
                            SecId: record.SecID,
                            ClientAcctNo: record.ClientAcctNo,
                            ReportName: record.ReportName,
                        }
                    })
                )
            );
        });

    connection.end();
});

app.get("/api/accountscheckedinbatch/:BatchGUID", (req, res, next) => {
    console.log(req.params);
    let connection = mysql.createConnection(dbCreds);

    connection.connect((err) => {
        if (err) {
            console.log("Unable to connect to database correctly! ");
            throw err;
        }
        console.log("Connected to database successfully");
    });

    connection.query(accountschecked_QueryString + " WHERE ts.BatchGuid=" + req.params.BatchGUID + ";",
        (err, results, fields) => {
            if (err) throw err;
            res.send(
                JSON.stringify(
                    results.map((record) => {
                        return {
                            BatchGuid: record.BatchGuid,
                            AccountsCheckedInBatch: record.AccountsCheckedInBatch,
                        }
                    })
                )
            );
        });

    // null data packet looks like { BatchGuid: null, AccountsCheckedInBatch: 0 }

    connection.end();
});

app.get("/api/tradeinformationonbatches", (req, res, next) => {
    let connection = mysql.createConnection(dbCreds);

    connection.connect((err) => {
        if (err) {
            console.log("Unable to connect to database correctly! ");
            throw err;
        }
        console.log("Connected to database successfully");
    });

    connection.query(tradeinformation_QueryString,
        (err, results, fields) => {
            if (err) throw err;
            res.send(
                JSON.stringify(
                    results.map((record) => {
                        return {
                            BatchGuid: record.BatchGuid,
                            TradeId: record.TradeID,
                            SecId: record.SecID,
                            ClientAcctNo: record.ClientAcctNo,
                            ReportName: record.ReportName,
                        }
                    })
                )
            );
        });

    connection.end();
});


app.get("/api/accountscheckedinbatch", (req, res, next) => {
    let connection = mysql.createConnection(dbCreds);

    connection.connect((err) => {
        if (err) {
            console.log("Unable to connect to database correctly! ");
            throw err;
        }
        console.log("Connected to database successfully");
    });

    connection.query(accountschecked_QueryString + " group by ts.BatchGuid;",
        (err, results, fields) => {
            if (err) throw err;
            res.send(
                JSON.stringify(
                    results.map((record) => {
                        return {
                            BatchGuid: record.BatchGuid,
                            AccountsCheckedInBatch: record.AccountsCheckedInBatch,
                        }
                    })
                )
            );
        });

    connection.end();
});

/* {
            queueDuration: '00:04:00',
            ExecDuration: '-04:19:00',
            OverallDuration: '-04:15:00',
            Queued: '2019-05-05T13:10:10.000Z',
            BatchGUID: 'testGUID'
        } */


app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`)
});
