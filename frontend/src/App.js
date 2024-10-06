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
import Register from './Components/Login/register';
import ProtectedRoute from './Components/ProtectedRoute';

function App() {
  return (
    <Provider store={store}> 
      <PersistGate loading={null} persistor={persistor}> 
        <BrowserRouter>
          <Routes>
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path='/' element={<Homepage />} />
            <Route path='/projects' element={<Projectpage />} />
            <Route path='/project/:id' element={<DetailPage />} />

            {/* Bảo vệ các route dành cho admin */}
            <Route
              path='/admin'
              element={
                <ProtectedRoute requiredRole="admin">
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path='/admin/project'
              element={
                <ProtectedRoute requiredRole="admin">
                  <ProjectPage />
                </ProtectedRoute>
              }
            />
            <Route
              path='/admin/project/create'
              element={
                <ProtectedRoute requiredRole="admin">
                  <CreateProject />
                </ProtectedRoute>
              }
            />
            <Route
              path='/admin/project/edit/:id'
              element={
                <ProtectedRoute requiredRole="admin">
                  <EditProject />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;
