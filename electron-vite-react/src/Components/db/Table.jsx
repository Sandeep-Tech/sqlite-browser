import React from 'react';
import { ipcRenderer } from 'electron';

function Table() {
  console.log(ipcRenderer);
  return (
    <div>
      Table
    </div>
  )
}

export default Table;