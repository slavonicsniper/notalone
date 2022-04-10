import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import {useState, useEffect} from 'react'
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Navigation from './components/Navbar/Navbar';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import Confirmation from './components/Confirmation/Confirmation';
import Dashboard from './components/Dashboard/Dashboard';
import Profile from './components/Profile/Profile';
import Logout from './components/Logout/Logout'
import Activities from './components/Activities/Activities';

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [data, setData] = useState({})

  useEffect(() => {
    setLoggedIn(JSON.parse(window.localStorage.getItem('loggedIn')));
    setData(JSON.parse(window.localStorage.getItem('data')));
  }, []);

  useEffect(() => {
    window.localStorage.setItem('loggedIn', loggedIn);
  }, [loggedIn]);

  const handleLogin = isAuthenticated => setLoggedIn(isAuthenticated)

  useEffect(() => {
    window.localStorage.setItem('data', JSON.stringify(data));
  }, [data]);

  const handleData = data => setData(data)

  return (
    <Router>
      <header>
        <Navigation loggedIn={loggedIn}  userData={data}/>
      </header>
      <Routes>
        <Route exact path="/" element={loggedIn ? <Dashboard/> : <Navigate replace to="/login" />}/>
        <Route path="/login" element={loggedIn ? <Navigate replace to="/" /> : <Login handleLogin={handleLogin} handleData={handleData}/>}/>
        <Route path="/logout" element={<Logout loggedIn={loggedIn} handleLogin={handleLogin}/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/forgotPassword" element={<ForgotPassword/>}/>
        <Route path="/confirm/:confirmationCode" element={<Confirmation/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/activities" element={<Activities/>}/>
      </Routes>
    </Router>  
  );
}

export default App;
