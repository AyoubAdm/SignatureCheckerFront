import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);


  const login = async (username, password) => {
    setUser(username)
    try {
      const response = await fetch(`http://localhost:8080/api/utilisateur/check/${username}:${password}`, {
        method: 'GET',
        headers: {
          'Authorization': 'Basic ' + window.btoa('admin:admin'),
          'Accept': 'application/json',
        },
      });

  
      if (response.ok) {
        const result = await response.json()
        if (result){
          setIsAuthenticated(true);

          return 1
        }
        else{
          return 0
        }
      } else {
        console.error('Failed to log in');
        return 0
      }
    } catch (error) {
      console.error('An error occurred during login:', error);
      return -1
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, user, logout  }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
