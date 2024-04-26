import './App.css';
import React, { useEffect, useState } from "react";
import DataComponent from './components/Hello';
import Header from './components/Header';

function App() {
  return (
    <div className="App">
      <Header />
      <header className="App-header">
        <DataComponent />
      </header>
    </div>
  );
}

export default App;
