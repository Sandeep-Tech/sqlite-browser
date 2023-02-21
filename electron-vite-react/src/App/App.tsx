import React, { useState } from 'react'
import './App.scss'
import DbDashboard from 'App/organisms/db/dashboard/DbDashboard';

function App() {
  return (
    <div className="App">
      <DbDashboard />
    </div>
  )
}

export default App;
