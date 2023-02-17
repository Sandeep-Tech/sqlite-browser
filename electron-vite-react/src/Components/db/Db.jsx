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
  
  useEffect(() => {
  }, []);


  const handleToolClick = (toolType) => {
    switch (toolType) {
      case 'show-all-db': {
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
