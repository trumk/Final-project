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
import CreateProject from './Pages/admin/Project/Create';
import EditProject from './Pages/admin/Project/[id]/Edit';
import Projectpage from './Pages/Guest/projectPage';
import DetailPage from './Pages/Guest/[id]/detail';
import Login2 from './Components/Login/Login2';


function App() {
  return (
    <Provider store={store}> 
      <PersistGate loading={null} persistor={persistor}> 
        <BrowserRouter>
          <Routes>
            <Route path='/loginAdmin' element={<Login />} />
            <Route path='/login' element={<Login2 />} />
            <Route path='/' element={<Homepage />} />
            <Route path='/projects' element={<Projectpage />} />
            <Route path='/project/:id' element={<DetailPage />} />
            
            {/* admin */}
            <Route path='/admin' element={<Dashboard />} />
            <Route path='/admin/project' element={<ProjectPage />} />
            <Route path='/admin/project/create' element={<CreateProject/>} />
            <Route path='/admin/project/edit/:id' element={<EditProject/>} />
          </Routes>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;
