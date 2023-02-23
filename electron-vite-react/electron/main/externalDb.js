import  sql from 'mssql';
import { fetchExternalDbConfig, fetchMonitoringCriteria } from './appData';

class ExternalDb {
  constructor() {
    this.setConfig = this.setConfig.bind(this);
    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.handler = this.handler.bind(this);
    this.config = {
      user: null,
      password: null,
      database: null,
      server: null,
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
    this.connection = null;
  }

  setConfig = ({
    port,
    dbname,
    username,
    password,
    servername,
  }) => {
    this.config = {
      user: username,
      password: password,
      database: dbname,
      server: servername,
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
        port: port ?? 1433,
      }
    }
    return this.config;
  }

  connect = async () => {
    try {
      const connection = await sql.connect(this.config);
      if (connection) {
        this.connection = connection;
        console.log(`connected to external db server ${this.config.server}`);
        return true;
      }
    } catch (err) {
      console.log('Failed to connect to database');
      // err: { code, originalError, name }
      throw new Error(err);
    }
  }

  disconnect = async () => {
    if (this.connection) this.connection.close();
  }

  selectAllFromChoosenTable = async () => {
    if (!this.config) {
      console.error(`Error: Unable to fetch table ${tablename}, external server not configured`);
      return null;
    }

    const monitoringCriteria = fetchMonitoringCriteria();
    if (monitoringCriteria && await this.connect()) {
      const selectStmt = `SELECT * FROM ${monitoringCriteria.tablename}`;

      try {
        const result = await this.connection.request().query(selectStmt);
        return result.recordset;
      } catch (error) {
        console.error(`Error: Failed to fetch data from server: ${this.config.server} , table: ${monitoringCriteria.tablename}`);
        return null;
      }

    }
  }

  handler = async (evt, action) => {
    switch (action.type) {
      case 'set-config': return this.setConfig(action.data);
      case 'connect': return this.connect();
      case 'disconnect': return this.disconnect();
    }
  }
}

const externaldb = new ExternalDb();

const init = () => {
  // Fetch config from local Store and populate
  const savedExternalDbConfig = fetchExternalDbConfig();
  if (savedExternalDbConfig) externaldb.setConfig(savedExternalDbConfig);
}
init();

const selectAllFromChoosenTable = externaldb.selectAllFromChoosenTable;

export {
  selectAllFromChoosenTable
};

// externalDbActionsHandler
export default externaldb.handler;
