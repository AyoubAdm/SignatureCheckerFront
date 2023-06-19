import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Acceuil from './components/Login'
import AdminDashboard from './components/AdminDashboard';
import AdminDashboardHome from './components/AdminDashboardHome';
import AdminDashboardSearch from './components/AdminDashboardSearch';
import AbsencePage from './components/AbsencePage';
import Login from './components/Login';
import Settings from './components/Settings';
import MatierePage from './components/MatierePage';
import Analyse from './components/GeneralStatsPage';
import AuthProvider from './components/AuthProvider';
import Profil from './components/Profil';



function App() {
  return (
    <AuthProvider>

    <BrowserRouter>
        <Routes>
          <Route path="" element={<Acceuil/>} />
          <Route path="acceuil" element={<Acceuil/>} />

          <Route path="admindashboard" element={<AdminDashboard/>}>
            <Route path="" element={<AdminDashboardHome/>} />
            <Route path="analyse" element={<Analyse/>} />
            <Route path="search" element={<AdminDashboardSearch/>} />
            <Route path="student/:id" element={<AbsencePage/>} />
            <Route path="matiere/:id" element={<MatierePage/>} />
            <Route path="settings" element = {<Settings />} />
            <Route path="myprofil" element = {<Profil />} />
          </Route>
        
          <Route path="login" element={<Login/>} />

          
          
        </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
