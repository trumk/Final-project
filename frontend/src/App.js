import React from 'react';
import './App.css';
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store'; 
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PersistGate } from 'redux-persist/integration/react'; 
import Login from './Components/Login/Login';
import Dashboard from './Pages/admin';
import Homepage from './Pages/Guest';
import ProjectPage from './Pages/admin/Project';

function App() {
  return (
    <Provider store={store}> 
      <PersistGate loading={null} persistor={persistor}> 
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Homepage />} />
            <Route path='/login' element={<Login />} />

            {/* admin */}
            <Route path='/admin' element={<Dashboard />} />
            <Route path='/admin/project' element={<ProjectPage />} />
          </Routes>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;
