import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import AppRouter from './AppRouter';
import { UserProvider } from './context/UserProvider';

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="App">
          <AppRouter />
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
