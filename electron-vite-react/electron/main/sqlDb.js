import  sql from 'mssql';

// FYI: need to populate these value to make it work
const sqlConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  server: 'localhost',
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    // encrypt: true, // for azure
    trustServerCertificate: true, // change to true for local dev / self-signed certs
    cryptoCredentialsDetails: {
      minVersion: 'TLSv1'
    },
    port: 1433,
  }
}
const connect = async () => {
 try {
  // make sure that any items are correctly URL encoded in the connection string
  await sql.connect(sqlConfig)
  const result = await sql.query`select * from myTable`
  console.dir(result)
 } catch (err) {
  // ... error checks
  console.error('Error connecting to db');
  console.error(err);
 }
}

// connect();
