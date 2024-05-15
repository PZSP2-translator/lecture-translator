import React, { useState } from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import Header from './components/Header';
import { UserProvider } from './components/UserContext';

function App() {
  const [notes, setNotes] = useState("");

  return (
    <UserProvider>
    <div className='App'>
      <Header setNotes={setNotes} />  {}
      <Routes>
        {AppRoutes.map((route, index) => {
          const { element, ...rest } = route;
          if (element.type.name === "LectureView") {
            return <Route key={index} {...rest} element={React.cloneElement(element, { notes, setNotes })} />;
          }
          return <Route key={index} {...rest} element={element} />;
        })}
      </Routes>
    </div>
    </UserProvider>
  );
}

export default App;
