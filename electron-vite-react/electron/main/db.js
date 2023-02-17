import sqlite3 from 'sqlite3';
import path from 'path';

// const dbPath = path.join(__dirname, '../mydatabase.sqlite');
// const db = new sqlite3.Database(dbPath);
// console.log('DEBUG db :: ', dbPath);

export const dbMsgHandler = (evt, args) => {
  console.log('============================================')
  console.log('DEBUG :: new msg in db msg handler ::');
  // console.log('evt', evt);
  console.log('args', args);
};