import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Acceuil from './components/Home'
import AdminDashboard from './components/AdminDashboard';
import AdminDashboardHome from './components/AdminDashboardHome';
import AdminDashboardSearch from './components/AdminDashboardSearch';
import AbsencePage from './components/AbsencePage';
import Login from './components/Login';
import Settings from './components/Settings';
import MatierePage from './components/MatierePage';


function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="" element={<Acceuil/>} />
          <Route path="acceuil" element={<Acceuil/>} />

          <Route path="admindashboard" element={<AdminDashboard/>}>
            <Route path="" element={<AdminDashboardHome/>} />
            <Route path="search" element={<AdminDashboardSearch/>} />
            <Route path="search/:id" element={<AbsencePage/>} />
            <Route path="matiere/:id" element={<MatierePage/>} />
            <Route path="settings" element = {<Settings />} />
          </Route>
        
          <Route path="login" element={<Login/>} />

          
          
        </Routes>
    </BrowserRouter>
  );
}

export default App;
