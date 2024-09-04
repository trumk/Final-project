import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './Components/Login/Login';
import Dashboard from './Pages/admin';
import Homepage from './Pages/Guest';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Homepage />} />
          <Route path='/login' element={<Login />} />

          <Route path='/admin' element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
