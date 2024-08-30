import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); 

  useEffect(() => {
    const email = localStorage.getItem('email');
    if (email) {
      setIsLoggedIn(true); 
    } else {
      setIsLoggedIn(false); 
    }
  }, []);

  const logout = () => {
    localStorage.clear(); 
    setIsLoggedIn(false); 
    window.location.reload();
  };

  return (
    <div>
      <h1>Welcome</h1>
      {isLoggedIn ? (
        <button onClick={logout}>Logout</button> 
      ) : (
        <button onClick={() => navigate('/login')}>Login</button> 
      )}
    </div>
  );
}

export default Home;
