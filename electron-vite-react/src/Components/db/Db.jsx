import React, { useEffect } from 'react';
import './Db.scss';
import { ipcRenderer } from 'electron';

function ToolBar({ handleClick }) {
  return (
    <div className="toolbar">
      <button
        onClick={() => handleClick('show-all-dbs')}
      >
        Show all DBs
      </button>
      <button
        onClick={() => handleClick('create-new-db')}
      >
        Create new DB
      </button>
    </div>
  );
}




function Db() {
  
  const dbMsghandler = (evt, arg) => {
    console.log
  }

  useEffect(() => {
    ipcRenderer.on('db', dbMsghandler);
    return () => ipcRenderer.removeListener('db', dbMsghandler);
  }, []);


  const handleToolClick = (toolType) => {
    console.log(ipcRenderer)
    switch (toolType) {
      case 'show-all-dbs': {
        ipcRenderer.send('db', { msgType: 'fetch-all-dbs' });
        break;
      }
      case 'create-new-db': {
        break;
      }
      default: break;
    }
  };


  return (
    <div className="db">
      <ToolBar handleClick={handleToolClick}/>
    </div>
  );
}

export default Db;
