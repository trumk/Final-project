import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); // Tạo đối tượng navigate

  useEffect(() => {
    const email = localStorage.getItem('email');
    if (email) {
      setIsLoggedIn(true); // Người dùng đã đăng nhập
    } else {
      setIsLoggedIn(false); // Người dùng chưa đăng nhập
    }
  }, []);

  const logout = () => {
    localStorage.clear(); // Xóa thông tin đăng nhập khỏi localStorage
    setIsLoggedIn(false); // Cập nhật trạng thái đăng nhập
    window.location.reload(); // Reload lại trang
  };

  return (
    <div>
      <h1>Welcome</h1>
      {isLoggedIn ? (
        <button onClick={logout}>Logout</button> // Hiển thị nút Logout nếu đã đăng nhập
      ) : (
        <button onClick={() => navigate('/login')}>Login</button> // Hiển thị nút Login nếu chưa đăng nhập
      )}
    </div>
  );
}

export default Home;
