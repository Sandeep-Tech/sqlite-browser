import  sql from 'mssql';

class ExternalDb {
  constructor() {
    this.config = {};
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


  handleConnect = async (details) => {
    this.setConfig(details);
    
    try {
      const connection = await sql.connect(this.config);
      if (connection) return true;
    } catch (err) {
      console.log('Failed to connect to database');
      // err: { code, originalError, name }
      return err;
    }
  }

  handler = async (evt, action) => {
    switch (action.type) {
      case 'setup-config': return this.setConfig(action.data);
      case 'connect': return this.handleConnect(action.data);
    }
  } 
}

const externaldb = new ExternalDb();

// externalDbActionsHandler
export default externaldb.handler;
