import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

import { fetchMonitoringCriteria } from './appData';

class InternalDb {
  constructor(path) {
    this.handler = this.handler.bind(this);
    this.doesRootPathExist = this.doesRootPathExist.bind(this);
    this.fetchDb = this.fetchDb.bind(this);
    this.fetchTable = this.fetchTable.bind(this);
    this.path = path;
    this.db = null;
  }

  doesRootPathExist = () => {
    try {
      if (fs.existsSync(this.path)) return true;
      return false;
    } catch (err) {
      console.error('Error: failed to check weather the internal DB root folder exists');
      console.error(err);
      return null;
    }
  }

  doesDbExist = () => {
    try {
      const dbPath = path.join(this.path, 'internal.db');
      if (fs.existsSync(dbPath)) return true;
      return false;
    } catch (err) {
      console.error('Error: failed to check weather the internal DB root folder exists');
      console.error(err);
      return null;
    }
  }

  createRootPath = () => {
    fs.mkdir(
      this.path, 
      (err) => {
        if (err) {
          console.error('Error: failed to create the DB root dir');
          console.error(err);
          return false;
        } else {
          console.log('DB root folder created');
          return true;
        }
      },
    );
  }

  fetchDb = () => {
    const createDbObj = () => {
      const dbPath = path.join(this.path, 'internal.db');
      const db = new sqlite3.Database(
        dbPath,
        (err) => {
          if (err) {
            console.error('Error: Failed to create db object');
            console.error(err);
            return null;
          }
        }
      );
      console.log(`DB object for internal DB created`);
      return db;
    }

    if (!this.doesDbExist()) {
      if (!this.doesRootPathExist) this.createRootPath();
    }

    return createDbObj();
  }

  fetchTable = () => {
    const db = this.fetchDb();
    const monitoringCriteria = fetchMonitoringCriteria();

    if (db && monitoringCriteria) {
      // console.log(monitoringCriteria);
      // console.log(db);

      // use a meta table to determine with current extrnal db config that the table in sqlite is the same
      const selectStmt = `SELECT * FROM ${monitoringCriteria.tablename}`;
      db.all(selectStmt, [], (err, rows) => {
        if (err) {
          console.error(err);
        }
        // process rows
        console.log(rows);
      });
    }
  };

  handler = (evt, action) => {
    switch (action.type) {
      case 'fetch-table': return this.fetchTable();
    }
  };
}

export default InternalDb;
