import React, { useEffect, useState } from 'react';
import { auth, provider } from './config';
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

function Login() {
  const [value, setValue] = useState('');
  const navigate = useNavigate(); // Tạo đối tượng navigate

  const handleClick = () => {
    signInWithPopup(auth, provider)
      .then((data) => {
        setValue(data.user.email);
        localStorage.setItem("email", data.user.email);
        navigate('/'); // Chuyển hướng đến trang chính sau khi đăng nhập thành công
      })
      .catch((error) => {
        console.error("Error during sign-in:", error);
      });
  };

  useEffect(() => {
    setValue(localStorage.getItem('email'));
  }, []);

  return (
    <div>
      <button onClick={handleClick}>Signin with google</button>
    </div>
  );
}
export default Login
