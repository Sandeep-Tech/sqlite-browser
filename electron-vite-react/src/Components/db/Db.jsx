import React, { useState, useEffect } from 'react';
import './Db.scss';
import { ipcRenderer } from 'electron';

function ToolBar({ handleClick }) {
  const [newDbName, setNewDbName] = useState('');

  const handleCreateNewDb = () => {
    if (newDbName === '') {
      alert('new db name cannot be blank');
      return;
    }

    handleClick({
      type: 'create-new-db',
      newDbName,
    })
  };

  const onNewDbNameChange = (evt) => {
    console.log(evt.target.value)
    setNewDbName(evt.target.value);
  }

  return (
    <div className="toolbar">
      <button
        onClick={() => handleClick({ type: 'show-all-dbs' })}
      >
        Show all DBs
      </button>
      <div className="toolbar__new-db-creator">
        <input value={newDbName} onChange={(evt) => { onNewDbNameChange(evt) }}/>
        <button onClick={handleCreateNewDb}>
          Create new DB
        </button>
      </div>
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


  const handleToolClick = (tool) => {
    // console.log(ipcRenderer)
    switch (tool?.type) {
      case 'show-all-dbs': {
        ipcRenderer.send('db', { msgType: 'fetch-all-dbs' });
        break;
      }
      case 'create-new-db': {
        ipcRenderer.send('db', { msgType: 'create-new-db', name: tool.newDbName });
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
