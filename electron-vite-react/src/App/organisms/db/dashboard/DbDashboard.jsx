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
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

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


function Table({ data, columns }) {
  const table = useReactTable({
    data: data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <table className="monitor__content__table">
      <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map(row => (
          <tr key={row.id}>
            {row.getVisibleCells().map(cell => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const monitoringToolbarButtons = [{
  text: 'Table',
  type: 'table',
}, {
  text: 'Criteria',
  type: 'criteria',
}]
function MonitorContent({ monitoringCriteria }) {
  const [selectedButton, setSelectedButton] = useState(monitoringToolbarButtons.find((b) => b.type === 'table'));
  const form = useFormState({ 
    defaultValues: {
      tablename: "",
      queryrate: 5,
    }
  });
  form.useSubmit(async () => {
    await window.mainAPI.saveMonitoringCriteria(form.values);
  });
  const [tableData, setTableData] = useState(null);

  const columnHelper = createColumnHelper();

  const prepTableData = (data) => {
    if (data.length > 0) {
      const preparedColumns = [];
      
      const refRow = data[0];

      Object.keys(refRow).forEach(
        (colName) => {
          preparedColumns.push(
            columnHelper.accessor(colName, {
              cell: props => props.getValue()
            })
          )
        }
      );

      setTableData({
        columns: preparedColumns,
        data,
      });
    };
  }

  useEffect(() => {
    const tableUpdateHandler = (_event, update) => {
      update.data && prepTableData(update.data);
    };
    window.mainAPI.onTableUpdate(tableUpdateHandler);
    return () => window.mainAPI.offTableUpdate(tableUpdateHandler);
  }, []);


  useEffect(() => {
    if (!monitoringCriteria) return;
    form.setValues(monitoringCriteria);
  }, [monitoringCriteria]);

  const renderMonitoringCriteriaForm = () => (
    <>
      <p>Monitoring Criteria</p>
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
          <FormInput name={form.names.queryrate} required type="number" min={1} />
          <FormError name={form.names.queryrate} />
        </div>
        <div className="form__buttons">
          <FormReset>Reset</FormReset>
          <FormSubmit>Submit</FormSubmit>
        </div>
      </Form>
    </>
  );

  const renderContent = () => {
    switch (selectedButton.type) {
      case 'table' : {
        return (tableData ? <Table data={tableData.data} columns={tableData.columns} /> : <div />);
      }
      case 'criteria': {
        return renderMonitoringCriteriaForm();
      }
      default: return <div />;
    }
  }

  return (
    <div className="monitor__content">
      <div className="monitor__content__toolbar">
        {monitoringToolbarButtons.map(
          (button) => (
            <Button
              onClick={() => {
                setSelectedButton(button);
              }}
              key={button.text}
            >
              {button.text}
            </Button>
          ),
        )}
      </div>
      <div className="monitor-screen">
        {renderContent()}
      </div>
    </div>
  );
}

function Monitor() {
  const [externalDbConfig, setExternalDbConfig] = useState(null);
  const [monitoringCriteria, setMonitoringCriteria] = useState(null);
  const [error, setError] = useState(null);
  const [notif, setNotif] = useState(null);

  const callbackWithTimedCleanup = (callback, cleanup, timeout = 1500) => {
    callback();
    setTimeout(() => { cleanup(); }, timeout);
  };

  const init = async () => {
    // fetch values from store and setup states
    const savedDbConfig = await window.mainAPI.getDbConfig();
    const savedMonitoringCriteria = await window.mainAPI.getMonitoringCriteria();

     if (savedDbConfig) setExternalDbConfig(savedDbConfig);
    
     if (savedMonitoringCriteria) {
      setMonitoringCriteria(savedMonitoringCriteria);
    };
  };
  useEffect(() => {
    init();
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

  const renderConnectionTester = () => (
    <div className="test-connection">
      <span className="test-connection__prompt">
        Click the button to test the connection to external db
      </span>
      <Button onClick={testConnection} style={{ display: 'inline-block' }}>Test</Button>
    </div>
  );

  // const renderMonitorContent = () => (
  //   <div className="monitor__content">
  //     <div className="monitor__content__toolbar">
  //       <Button
  //         onClick={() => {
  //           setContent(renderMonitoredTable())
  //         }}
  //       >
  //         Table
  //       </Button>
  //       <Button
  //         onClick={() => {
  //           setContent(renderMonitoringCriteriaForm());
  //         }}
  //       >
  //         Criteria
  //       </Button>
  //     </div>
  //     {content}
  //   </div>
  // );

  return (
    <div className="monitor">
      {error && <p className="error-msg">{error.msg}</p>}
      {notif && <p className="notif-msg">{notif.msg}</p>}
      {
        (!monitoringCriteria)
        ? renderConnectionTester() 
        : <MonitorContent monitoringCriteria={monitoringCriteria}/>
      }
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

