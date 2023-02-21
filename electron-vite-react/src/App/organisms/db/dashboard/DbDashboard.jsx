import React from "react";
import SqlServerInfoForm from "./SqlServerInfoForm";

function DbDashboard({}) {


  const onServerDetailsFormSubmit = (details) => {
    console.log(details);
  }


  return (
    <div>
      <p>Database dashboard</p>
      <SqlServerInfoForm onSubmit={onServerDetailsFormSubmit} />
    </div>
  )
}

export default DbDashboard;
