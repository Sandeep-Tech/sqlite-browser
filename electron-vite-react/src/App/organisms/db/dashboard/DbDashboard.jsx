import React from "react";
import SqlServerInfoForm from "./SqlServerInfoForm";

function DbDashboard({}) {


  const onServerDetailsFormSubmit = async (details) => {
    const res = await window.mainAPI.connectToDb(details);
    console.log('DEBUG :: res in renderer ::', res);
  }


  return (
    <div>
      <p>Database dashboard</p>
      <SqlServerInfoForm onSubmit={onServerDetailsFormSubmit} />
    </div>
  )
}

export default DbDashboard;
