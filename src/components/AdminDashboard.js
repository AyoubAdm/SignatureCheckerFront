import React from 'react'
import SideBar from './SideBar'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
import { useContext } from 'react';


export default function AdminDashboard() {
  const isAuthenticated = useContext(AuthContext);
  const navigate = useNavigate();

  React.useEffect(() => {
  if(!isAuthenticated.isAuthenticated){
    navigate('/login');
  }
}, []);

  return (

    
    <div>
        <SideBar/>        
    </div>
  )
}
