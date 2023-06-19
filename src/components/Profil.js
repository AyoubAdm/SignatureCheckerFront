import React from 'react'
import { Typography } from '@mui/material'
import { useContext } from 'react';
import { AuthContext } from './AuthProvider';
import Button from '@mui/material/Button';

export default function Profil() {
    const {user, logout} = useContext(AuthContext);
    const Logout = () => {
        console.log("logout");
        logout();
        window.location.reload(false);
    }
  return (
    <div style={{display : "flex", justifyContent : "center", alignItems :"center", flexDirection : "column"}}>
        <Typography variant="h1"  sx={{ p : 2}}>
            Profil
        </Typography>
        <Typography variant="body1" sx={{ p : 2}}>
            Vous etes connecté en tant que : {user}
        </Typography>
        <Button variant="contained" color ="error" onClick={Logout} >Se deconnecter</Button>
    </div>
  )
}
