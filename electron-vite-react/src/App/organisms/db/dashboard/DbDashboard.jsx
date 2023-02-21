import React from "react";
import SqlServerInfoForm from "./SqlServerInfoForm";

function DbDashboard({}) {


  const onServerDetailsFormSubmit = (details) => {
    let { servername, username, password, dbname, port } = details;

    // forward them to the server
    // get a response and display the results in the dashbaord
  }


  return (
    <div>
      <p>Database dashboard</p>
      <SqlServerInfoForm onSubmit={onServerDetailsFormSubmit} />
    </div>
  )
}

export default DbDashboard;
