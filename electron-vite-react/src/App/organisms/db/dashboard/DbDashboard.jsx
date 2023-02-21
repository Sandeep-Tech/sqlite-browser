import React, { useEffect, useState } from "react";
import './DbDashboard.scss';

import Button from '../../../atoms/button/Button';
import SqlServerInfoForm from "./SqlServerInfoForm";

const sidebarItems = [{
  text: 'Sql Server Settings',
  type: 'sql-server-settings',
}, {
  text: 'Monitor',
  type: 'monitor',
}];

function Sidebar({ onSelect }) {
  return (
    <div className="sidebar">
      {sidebarItems.map((item) => (
        <Button
          onClick={() => onSelect(item)}
          key={item.type}
        >
          {item.text}
        </Button>
      ))}
    </div>
  );
}

function Monitor() {
  return (
    <div>
      monitor
    </div>
  );
}

function DbDashboard({}) {
  const [content, setContent] = useState(<div />);

  const onServerDetailsFormSubmit = async (details) => {
    await window.mainAPI.setupDbConfig(details);
    await window.mainAPI.saveDbConfig(details);
  };

  const onSidebarSelect = (sidebarItem) => {
    switch (sidebarItem.type) {
      case 'sql-server-settings': {
        setContent(<SqlServerInfoForm onSubmit={onServerDetailsFormSubmit} />);
        break;
      }
      case 'monitor': {
        setContent(<Monitor />);
        break;
      }
      default: setContent(<div />);
    }
  }

  useEffect(() => {
    onSidebarSelect(sidebarItems.find((item) => item.type === 'sql-server-settings'));
  }, []);

  return (
    <div className="dashboard">
      <h1 className="dashboard__title">Database Dashboard</h1>
      <div className='dashboard__content'>
        <Sidebar onSelect={onSidebarSelect} />
        <div className="sidebar-content">
          {content}
        </div>
      </div>
    </div>
  )
}

export default DbDashboard;
