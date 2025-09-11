import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { Home } from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import AuthWrapper from './AuthWrapper'

function AppRoutes() {
  return (
    <BrowserRouter>
        <Routes>
            <Route 
              path='/' 
              element={
                <AuthWrapper>
                  <Home />
                </AuthWrapper>
              } 
            />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
        </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes