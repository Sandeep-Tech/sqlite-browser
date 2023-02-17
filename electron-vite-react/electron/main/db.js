import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

// const dbPath = path.join(__dirname, '../mydatabase.sqlite');

const DB_ROOT_PATH = path.join(__dirname, '../db-root');

const checkIfDbRootExists = () => {
  try {
    if (fs.existsSync(DB_ROOT_PATH)) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error('Error: failed to check weather the DB root folder exists');
    console.error(err);
    return null;
  }
}

const createDbRoot = () => {
  fs.mkdir(DB_ROOT_PATH, (err) => {
    if (err) {
      console.error('Error: failed to create the db root folder', err);
      return false;
    } else {
      console.log('db root folder created');
      return true;
    }
  });
}

const fetchAllDbs = () => {
  if (!checkIfDbRootExists()) {
    createDbRoot();
    return null;
  };

  fs.readdir(DB_ROOT_PATH, (err, files) => {
    if (err) {
      console.error('Failed to read directory:', Object.entries(err));
      return;
    }  
    console.log(files);
    // const sqliteFiles = files.filter(file => file.endsWith('.sqlite'));
    // console.log('SQLite database files:', sqliteFiles);
  });
};




export const dbMsgHandler = (evt, arg) => {
  console.log('============================================')
  console.log('DEBUG :: new msg in db msg handler ::');
  // console.log('evt', evt);
  console.log('arg', arg);
  
  switch (arg?.msgType) {
    case 'fetch-all-dbs': {
      fetchAllDbs();
      break;
    }
    default: break;
  }
};