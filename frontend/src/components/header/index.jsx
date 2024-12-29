import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../slice/authSlice";
import { useNavigate } from "react-router-dom";
import "./header.scss";

function Header() {
  const [showDropdown, setShowDropdown] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      dispatch(logout());
      window.location.reload();
      navigate("/login");
    } catch (err) {
      console.error("Failed to logout:", err);
    }
  };

  return (
    <div className="header-container">
      <div className="avatar" onClick={() => setShowDropdown(!showDropdown)}>
        {user?.username?.[0].toUpperCase()}
      </div>
      {showDropdown && (
        <div className="dropdown">
          <div className="dropdown-item username">{user?.username}</div>
          <div className="separator"></div>
          <div className="dropdown-item logout" onClick={handleLogout}>
            Logout
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
