import React, { useEffect, useState } from "react";
import './DbDashboard.scss';

import Button from '../../../atoms/button/Button';
import SqlServerInfoForm from "./SqlServerInfoForm";
import {
  Form,
  FormInput,
  FormLabel,
  FormError,
  FormReset,
  FormSubmit,
  useFormState,
} from '../../../atoms/form/Form';

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
  const [externalDbConfig, setExternalDbConfig] = useState(null);
  const [error, setError] = useState(null);
  const [notif, setNotif] = useState(null);

  const form = useFormState({ 
    defaultValues: {
      tablename: "",
      queryrate: 5,
    }
  });
  form.useSubmit(() => {
    alert(JSON.stringify(form.values));
  });

  const callbackWithTimedCleanup = (callback, cleanup, timeout = 1500) => {
    callback();
    setTimeout(() => { cleanup(); }, timeout);
  };

  const fetchvaluesFromStore = async () => {
    const dbConfig = await window.mainAPI.getDbConfig();
     if (dbConfig) setExternalDbConfig(dbConfig);
  };
  useEffect(() => {
    fetchvaluesFromStore();
  }, []);

  const testConnection = async () => {
    const isAbleToConnect = await window.mainAPI.testConnection();
    if (isAbleToConnect) {
      callbackWithTimedCleanup(
        () => setNotif({ msg: 'Connection established successfully...' }),
        () => setNotif(null),
      );
    } else {
      callbackWithTimedCleanup(
        () => setError({ msg: 'Failed to connect to the external DB, maybe the credentials are incorrect' }),
        () => setError(null),
        3000,
      );
    }
  };

  return (
    <div className="monitor">
      {error && <p className="error-msg">{error.msg}</p>}
      {notif && <p className="notif-msg">{notif.msg}</p>}
      {externalDbConfig ? (
        <div className="test-connection">
          <span className="test-connection__prompt">Click the button to test the connection to external db</span>
          <Button onClick={testConnection} style={{ display: 'inline-block' }}>Test</Button>
        </div>
      ) : null}
      <div className="monitor-screen">
        <Form
          state={form}
          aria-labelledby="table-name-and-query-rate-form"
          className="form"
        >
          <div className="form__field">
            <FormLabel name={form.names.tablename}>Table name</FormLabel>
            <FormInput name={form.names.tablename} required />
            <FormError name={form.names.tablename} />
          </div>
          <div className="form__field">
            <FormLabel name={form.names.queryrate}>Query rate (in seconds)</FormLabel>
            <FormInput name={form.names.queryrate} required />
            <FormError name={form.names.queryrate} />
          </div>
          <div className="form__buttons">
            <FormReset>Reset</FormReset>
            <FormSubmit>Submit</FormSubmit>
          </div>
        </Form>
      </div>
    </div>
  );
}

function DbDashboard({}) {
  const [content, setContent] = useState(<div />);

  const onServerDetailsFormSubmit = async (details) => {
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
