import nodeLogo from "../assets/node.svg"
import { useState } from 'react'
import './App.scss'
import Db from './db/Db.jsx';

console.log('[App.tsx]', `Hello world from Electron ${process.versions.electron}!`)

function App() {
  return (
    <div className="App">
      <p>sqlite browser demo</p>
      <Db />
    </div>
  )
}

export default App
