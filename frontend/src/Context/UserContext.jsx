import React, { createContext, useContext, useRef, useState } from "react";

const UserProfile = createContext();

const UserContext = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const socket = useRef(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  return (
    <UserProfile.Provider
      value={{
        userProfile,
        setUserProfile,
        socket,
        onlineUsers,
        setOnlineUsers,
      }}
    >
      {children}
    </UserProfile.Provider>
  );
};

export default UserContext;

export const UserProfileShare = () => useContext(UserProfile);
