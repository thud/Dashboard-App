# AllianzGI-Dashboard
AllianzGI-Dashboard is a local web-app written in NodeJS and the Blazor .NET Framework.
It consists of 2 sub-projects:
1. **SqlApi** - Middleware written in Node that interfaces with the database.
2. **Dashboard** - Data visualisaton dashboard for graphing data. Interfaces with SqlApi via a RESTful API.

## **SqlApi**
This is a subproject written in node with Javacript. Its purpose is to interact with an SQL server via queries in order to gather data for visualisation. It uses simple `npm` libraries to establish and simplify this interaction.

##### **HOWEVER** - PLEASE NOTE THAT THIS WAS WRITTEN TO INTERFACE WITH **MySQL AND NOT MS SQL Server** 
##### **THEREFORE** - some modification is required to have this work. **IT WILL NOT WORK ON THE FIRST TRY!**
The SqlApi node project should be modified first and then tested fully before any attempt to modify the Blazor app: Dashboard.

### Prerequisites
To run the SqlApi app, you will need:
1. [**NodeJS**](https://nodejs.org/ "nodejs.org")
2. [**npm**](https://www.npmjs.com/ "npmjs.org")


### Download
To download, simply use the following cli command or download as a .zip and extract.
`git clone https://github.com/x-JP/AllianzGI-Dashboard.git`

### Initial Testing:
**If you want to test this project before any modification**, then you will have to create a new MySQL database from the MySqlDump: `SAdb.sql`
To check that this is working, a `MySQL server` instance must be setup and running  on the user's computer.
To spin up the exact database that I used during development, use the following command in a terminal app. Then enter your password for the MySQL **root** user (when prompted).
`$ mysql -u root -p SystemAvailability < SAdb.sql`

For simplicity I used the **root** user. All the database credentials and connection details for a MySQL instance can be found inside of `SqlApi/index.js` in the 'dbCreds' variable.
```javascript
const dbCreds = {
    host: 'localhost',
    user: 'root',
    password: 'your_password_here',
    database: 'SystemAvailability'
}
```
I called my Database `SystemAvailability` but in theory it could be anything and eventually will be called something similar to `Trader.dbo`.

**You will also have to run the following command in the SqlApi directory to install all the required packages:**
`npm i`

### Modification:
As I wrote before, modification is **required** for this to run successfully on anything other than the exact setup I used for development. This is because it currently interfaces with a MySQL server and in the future it will need to interact with an [MS SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-2019 "SQL Server 2019"). This will not only involve changing the way the connection works but also potentially changing the SQL queries too.

##### Transferring to SQL Server (mssql)
The project currently uses an `npm` package called `mysql` to interface with the database.
To transfer over to mssql, a new `npm` package will be required. For this I would recommend (at first look) [`mssql`](https://www.npmjs.com/package/mssql "mssql npm package") which is very similar syntactically to the `mysql` package however you will have to look through the docs to find the necessary modifications to code.
You can install this package with the following command in the SqlApi directory (assuming npm and node are already installed):
`npm i mssql`

You may also wish to uninstall the now redundant `mysql` package which can be done with the following command though not strictly necessary for the project to function properly and may cause undesired effects: `npm uninstall mysql`

Having installed this new package, you will now have to crawl through the docs and change all the function names in my code to fit the new package. This may also require changing the structure of the code. For example, I think the `mssql` package uses a different way of storing connection credentials but I may be wrong.

You may also have to change the queries.
These can be found in `SqlApi/index.js`. For example:
```javascript
const durations_Querystring = `select tb.TradeBatchId,
    gtpa.BatchGuid,
    timediff(gtpa.Started, gtpa.Queued) as QueueDuration,
    timediff(gtpa.Processed, gtpa.Started) as ExecDuration,
    timediff(gtpa.Processed, gtpa.Queued) as OverallDuration,
    gtpa.*
    from   GLSTradeProcessAudit gtpa
    inner join TradeBatches tb on tb.BatchGuid = gtpa.BatchGUID
    where  gtpa.Queued >= '20190101';`
```

### Interaction with API:
There are 6 endpoints defined for this API. They are all accessed via simple **GET requests** returning data in **JSON** format.
They are as follows:
- **"http://localhost:3000/api/guidelinecheckdurations"** - Returns `QueueDuration, ExecDuration and OverallDuration` for each and every batch. 
- **"http://localhost:3000/api/guidelinecheckdurations/<BatchGUID>"** - Returns `QueueDuration, ExecDuration and OverallDuration` *for 1 particular Batch*.
- **"http://localhost:3000/api/tradeinformationonbatches/"** - Returns list of trades with information on each.
- **"http://localhost:3000/api/tradeinformationonbatches/<BatchGUID>"** - Returns list of trades with information on each *for just 1 Batch*.
- **"http://localhost:3000/api/accountscheckedinbatch/"** - Returns list of batches with a quantity of accounts checked in each.
- **"http://localhost:3000/api/accountscheckedinbatch/<BatchGUID>"** - Returns number of accounts checked in a specified Batch.

### Actually Running The API
To actually run SqlApi, simply run this command from the `SqlApi` directory:
`npm run start`
This uses the npm package `nodemon` to improve development effiency so you may find that you get an error unless you install it. To install `nodemon` globally use ths command:
`npm i -g nodemon`

*NOTE: Node will throw an error if you try to run the project with `node index.js` because I'm using es6 syntax with [BabelJS](https://babeljs.io/ "BabelJS")
You can also edit the npm `start` scipt by editing the `package.json`.*
