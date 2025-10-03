import './App.css'
import {Route,Routes} from 'react-router-dom';
import { ToastProvider, useToast } from './context/ToastContext';
import { AuthContext } from './context/AuthContext';
import { useContext, useEffect } from 'react';
import { alertService } from './services/alertService';
import Navbar from './components/Navbar/Navbar'
import Dashboard from './pages/Dashboard/Dashboard'
import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'
import Portfolio from './pages/Portfolio/Portfolio';
import Alerts from './components/Alerts/Alerts';
import Insghts from './components/Insights/Insghts';
import Profile from './pages/Profile/Profile';
import Query from './components/Query/Query';
import AuthCallback from './components/AuthCallback/AuthCallback';

function AppContent() {
  const { loading, user, isAuthenticated } = useContext(AuthContext);
  const { showToast } = useToast();

  // Set up alert checking when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      alertService.setToastCallback(showToast);
      alertService.startAlertChecking(user.id);

      return () => {
        alertService.stopAlertChecking();
      };
    }
  }, [isAuthenticated, user, showToast]);

  if (loading) {
    return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>Loading...</div>;
  }

  return (
    <div className="app">
     <Navbar/>
     <Query/>
      <Routes>
        <Route path='/' element={<Dashboard/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/portfolio' element={<Portfolio/>}/>
        <Route path='/alerts' element={<Alerts/>}/>
        <Route path='/markets' element={<Insghts/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/auth/callback' element={<AuthCallback/>}/>
      </Routes>
    </div>
  )
}

function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  )
}

export default App
