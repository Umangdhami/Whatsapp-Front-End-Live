import './App.css'
import Register from './Container/Register'
import Profile from './Container/Profile'
import { Route, Routes } from "react-router";
import Login from './Container/Login'
import Home from './Container/Home'
import SecureRoutes from './SecureRoutes/SecureRoutes'
import Loader from './Component/Loader/Loader';
import ShowSuccessMessage from './common/Toasts/ShowSuccessMessage';
import ShowAlertMessage from './common/Toasts/ShowAlertMessage';

function App() {
  return (
    <>
    <ShowSuccessMessage message="Registration successful!" />
    <ShowAlertMessage message="Registration successful!" />
      <Routes>
        <Route path='/loader' element={<Loader />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/profile' element={<Profile />} />

        <Route path='/' element={<SecureRoutes />} >
          <Route path='/' element={<Home />} />
          {/* <Route path='/logout' element={logout()} /> */}
          {/* <Route path='/chat' element={<Home />} /> */}
        </Route>

      </Routes>
    </>
  )
}

export default App
