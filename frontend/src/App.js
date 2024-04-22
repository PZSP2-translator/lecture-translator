import './App.css';
import React, { useEffect, useState } from "react";
import DataComponent from './components/Hello';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <DataComponent />
      </header>
    </div>
  );
}

export default App;
