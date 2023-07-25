import React, { useEffect, useState } from "react";
import BottomRightButton from "./BottomRightButton";
import { useQuery } from "react-query";
import axios from "axios";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Logout from "@mui/icons-material/Logout";
import moment from "moment";

import { Link, useNavigate } from "react-router-dom";
import { UserProfileShare } from "../Context/UserContext";
import io from "socket.io-client";
import Loading from "./Loading";
import Error from "./Error";

const backendUrl = import.meta.env.VITE_REACT_BACKEND_URL;

const fetchMyUserData = async ({ token, sender }) => {
  const response = await axios.get(
    backendUrl + `/api/v1/myUsers/${token}/${sender}`
  );

  return response.data;
};

const HomePage = () => {
  const {
    userProfile,
    setUserProfile,
    socket,

    onlineUsers,
    setOnlineUsers,
  } = UserProfileShare();
  const profile = JSON.parse(localStorage.getItem("profile"));
  const token = profile?.token;
  const myId = profile?.id;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    const res = confirm("Are you sure, you want to Logout ?");
    if (res) {
      localStorage.removeItem("profile");
      window.location.reload();
    }
    setAnchorEl(null);
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(
          backendUrl + `/api/v1/myProfile/${token}`
        );
        setUserProfile(response.data);
        setLoading(false);
      } catch (error) {
        console.log("Error --> ", error);
        setError(error);
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  useEffect(() => {
    socket.current = io(import.meta.env.VITE_REACT_BACKEND_URL);
    socket.current.on("onlineUsers", (res) => {
      setOnlineUsers(res);
    });
    socket.current.emit("join", myId);
  }, []);

  const sender = userProfile?.id;
  const {
    data: userData,
    isLoading: userLoading,
    isError: userError,
  } = useQuery("userData", () => fetchMyUserData({ token, sender }), {
    enabled: !!userProfile,
  });

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + " ....";
    }
    return text;
  };

  return (
    <>
      { (loading && userLoading) ? 
        <Loading />
       : (error && userError) ? 
        <Error />
       : (
        <div className="bg-gray-950 min-h-screen text-white">
          {/* Navbar */}

          <nav className=" bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 fixed top-0 left-0 right-0 z-10 ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="text-[26px] font-extrabold">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-700 to-violet-800">
                    Chatty
                  </span>
                </div>
                <div className="flex items-center">
                  <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls={open ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                  >
                    <img
                      className="h-10 w-10 mr-2 rounded-full object-cover cursor-pointer ring-pink-600 ring-2 ring-offset-2 ring-offset-gray-950"
                      src={userProfile?.avatar}
                      alt="Avatar"
                    />
                  </IconButton>
                </div>
              </div>
            </div>
          </nav>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>

          {/* User List */}
          <div className="max-w-7xl mx-auto pt-[56px] sm:px-6 lg:px-8">
            <div className="sm:px-0">
              <ul className="mt-4">
                {userData?.map((user) => (
                  <Link key={user.user._id} to={`/chat/${user.user._id}`}>
                    <li
                      key={user.user._id}
                      className="flex items-center justify-between cursor-pointer hover:bg-gray-900 focus:outline-none p-[14px]"
                    >
                      <div className="flex items-center">
                        <img
                          className="h-12 sm:h-11 sm:w-11 w-12 ml-2 rounded-full object-cover"
                          src={user.user.avatar}
                          alt={user.user.username}
                        />
                        <div className="ml-3 mr-3">
                          <p className="text-[17px] sm:text-lg font-bold tracking-wide">
                            {user.user.username.charAt(0).toUpperCase() +
                              user.user.username.slice(1)}
                          </p>
                          <p className="text-md sm:text-sm tracking-wide text-gray-400">
                            {user.lastMessage?.content ?
                              truncateText(user.lastMessage.content, 22) : "image" }
                          </p>
                        </div>
                      </div>
                      <div className="self-start">
                        <p className="text-[12px] sm:text-sm text-gray-400">
                          {user.lastMessage &&
                            moment(user.lastMessage?.timestamp).format(
                              "HH:mm A"
                            )}
                        </p>
                      </div>
                    </li>
                  </Link>
                ))}
              </ul>
            </div>
          </div>
          <BottomRightButton />
        </div>
      )}
    </>
  );
};

export default HomePage;
