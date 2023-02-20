import React, { useState } from 'react'
import './App.scss'

function App() {
  return (
    <div className="App">
      {window.mainAPI.hello()}
    </div>
  )
}

export default App;
