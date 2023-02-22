import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

// import { fetchInternalDb, saveInternalDb } from './appData';

// const DB_ROOT_PATH = path.join(__dirname, '../../db-root');

// const checkIfDbRootExists = () => {
//   try {
//     if (fs.existsSync(DB_ROOT_PATH)) {
//       return true;
//     } else {
//       return false;
//     }
//   } catch (err) {
//     console.error('Error: failed to check weather the DB root folder exists');
//     console.error(err);
//     return null;
//   }
// }

// const createDbRoot = () => {
//   fs.mkdir(DB_ROOT_PATH, (err) => {
//     if (err) {
//       console.error('Error: failed to create the db root folder', err);
//       return false;
//     } else {
//       console.log('db root folder created');
//       return true;
//     }
//   });
// }

// // todo: check about using async-await here as file-reading is an async operation
// const fetchAllDbs = () => {
//   if (!checkIfDbRootExists()) {
//     createDbRoot();
//     return null;
//   };

//   fs.readdir(DB_ROOT_PATH, (err, files) => {
//     if (err) {
//       console.error('Failed to read directory:', err);
//       return null;
//     }  
//     console.log(files);
//     const sqliteFiles = files.filter(file => file.endsWith('.db'));
//     return sqliteFiles;
//   });
// };

// const createNewDb = (name) => {
//   if (!checkIfDbRootExists()) {
//     createDbRoot();
//   };
//   // open the database connection
//   let db = new sqlite3.Database(path.join(DB_ROOT_PATH, `${name}.db`), (err) => {
//     if (err) {
//       console.error(`Failed to create the new db - ${name}.`, err.message);
//     }
//     console.log(`Created a new database - ${name}`);
//   });

//   // close the database connection
//   db.close((err) => {
//     if (err) {
//       console.error(err.message);
//     }
//     console.log('Close the database connection.');
//   });
// }


// export const dbMsgHandler = (evt, arg) => {
//   console.log('============================================')
//   console.log('DEBUG :: new msg in db msg handler ::');
//   // console.log('evt', evt);
//   console.log('arg', arg);
  
//   switch (arg?.msgType) {
//     case 'fetch-all-dbs': {
//       // todo: This is going to be a async operation
//       // probabaly will have to use async msg-ing 
//       const dbFiles = fetchAllDbs();
//       // now, send this file back to the caller
//       break;
//     }
//     case 'create-new-db': {
//       if (!arg.name) {
//         console.error('Unable to create a new db, name not supplied');
//         return;
//       }
//       createNewDb(arg.name);
//     }
//     default: break;
//   }
// };

// --------------------------------------------------

class InternalDb {
  constructor(path) {
    this.handler = this.handler.bind(this);
    this.fetchSavedInternalDb = this.fetchSavedInternalDb.bind(this);
    this.fetchTable = this.fetchTable.bind(this);
    this.path = path;
  }

  fetchSavedInternalDb = () => {
    if (fs.existsSync(this.path)) {
      // return the file

      // p.s. we should also check if that file containes the tables we are currently querying, otherwise it is not relevant
      // we can use a meta-table to store this info in the db
    } else {
      // create a new file and return that
    }
  }

  fetchTable = () => {
    const db = this.fetchSavedInternalDb();
  };

  handler = (evt, action) => {
    switch (action.type) {
      case 'fetch-table': return this.fetchTable();
    }
  };
}

export default InternalDb;
