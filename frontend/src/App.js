import './App.css';
import { Route, Routes } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import Header from './components/Header';

function App() {
  return (
    <div className='App'>
      <Header/>
      <Routes>
          {AppRoutes.map((route, index) => {
              const { element, ...rest } = route;
              return <Route key={index} {...rest} element={element} />;
          })}
      </Routes>
    </div>
  );
}

export default App;
