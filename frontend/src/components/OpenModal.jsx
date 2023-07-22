import React, { useEffect, useState } from "react";
import "tailwindcss/tailwind.css";
import { Drawer, Button } from "@mui/material";
import BottomCenterButton from "./BottomCenterButton";
import { HiPlus } from "react-icons/hi";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
// import { BsNodeMinusFill, BsNutFill } from "react-icons/bs";

const OpenModal = ({ open, setOpen }) => {
  const profile = JSON.parse(localStorage.getItem("profile"));
  const [person, setPerson] = useState("");
  const token = profile?.token;
  const sender = profile?.id;
  const queryClient = useQueryClient();
  const backendUrl = import.meta.env.VITE_REACT_BACKEND_URL;

  const fetchUsers = async ({ sender, token }) => {
    const response = await axios.get(
      backendUrl + `/api/v1/users/${token}/${sender}`
    );

    return response.data;
  };

  const searchUsers = async ({ token, person, sender }) => {
    const response = await axios.get(
      backendUrl + `/api/v1/users/search/${token}/${person}/${sender}`
    );

    return response.data;
  };

  const createChat = async ({ createChats, token }) => {
    const response = await axios.post(
      backendUrl + `/api/v1/chats/${token}`,
      createChats
    );
    return response.data;
  };

  const {
    data: userListData,
    isLoading: userListLoading,
    isError: userListError,
  } = useQuery("userList", () => fetchUsers({ sender, token }), {
    enabled: !!sender && !!token,
  });

  const {
    data: searchListData,
    isLoading: searchListLoading,
    isError: searchListError,
    refetch,
  } = useQuery("searchList", () => searchUsers({ token, person, sender }), {
    enabled: !!person && !!token && !!sender,
  });

  const { mutate, data, error, isLoading } = useMutation(createChat, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("userData");
    },
  });

  const handleToggleDrawer = (recepient) => {
    const createChats = { sender: sender, recepient: recepient };
    mutate({ createChats, token });
    queryClient.invalidateQueries("userList");
    setOpen(!open);
  };

  useEffect(() => {
    if (person) {
      refetch();
    }
  }, [person]);

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={handleToggleDrawer}
        PaperProps={{
          className:
            "w-full sm:w-[425px] transition-transform duration-800 transform",
        }}
        BackdropProps={{
          className: "bg-black opacity-50",
        }}
      >
        <div className="min-h-screen overflow-y-auto bg-gray-950">
          <nav className="w-full sm:w-[425px] bg-gradient-to-r from-slate-950 via-gray-800 to-slate-950 fixed top-0 z-10 py-2 px-4">
            <input
              type="text"
              value={person}
              onChange={(e) => setPerson(e.target.value)}
              placeholder="Search friend's"
              className="bg-gray-950 border-gray-600 border text-[16px] rounded-full py-3 px-4 w-full text-white focus:outline-none"
            />
          </nav>

          {!!person ? (
            <section className=" pt-[54px] sm:w-[425px] text-white">
              <ul className="mt-3 mb-6">
                {searchListData?.map((user) => (
                  <li
                    key={user._id}
                    className="flex items-center justify-between sm:focus:bg-gray-800 focus:outline-none p-3 pl-4"
                  >
                    <div className="flex items-center">
                      <img
                        className={`h-12 sm:h-10 ${
                          user._id === sender ? "hidden" : null
                        } w-12 sm:w-10 rounded-full object-cover`}
                        src={user.avatar}
                        alt={user.username}
                      />
                      <p
                        className={`ml-3 text-lg sm:text-lg ${
                          user._id === sender ? "hidden" : null
                        } font-bold tracking-wider`}
                      >
                        {user.username.charAt(0).toUpperCase() +
                          user.username.slice(1)}
                      </p>
                    </div>
                    <div className="">
                      <HiPlus
                        onClick={() => handleToggleDrawer(user._id)}
                        className=" text-pink-500 mr-6 cursor-pointer  rounded-full w-5 sm:w-6 sm:h-6 h-5"
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ) : (
            !person && (
              <section className=" pt-[54px] sm:w-[425px] text-white">
                <ul className="mt-3 mb-6">
                  {userListData?.map((user) => (
                    <li
                      key={user._id}
                      className="flex items-center justify-between sm:focus:bg-gray-800 focus:outline-none p-3 pl-4"
                    >
                      <div className="flex items-center">
                        <img
                          className={`h-12 sm:h-10 ${
                            user._id === sender ? "hidden" : null
                          } w-12 sm:w-10 rounded-full object-cover`}
                          src={user.avatar}
                          alt={user.username}
                        />
                        <p
                          className={`ml-3 text-lg sm:text-lg ${
                            user._id === sender ? "hidden" : null
                          } font-bold tracking-wide`}
                        >
                          {user.username.charAt(0).toUpperCase() +
                            user.username.slice(1)}
                        </p>
                      </div>
                      <div className="">
                        <HiPlus
                          onClick={() => handleToggleDrawer(user._id)}
                          className={`text-pink-500 mr-6 cursor-pointer ${
                            user._id === sender ? "hidden" : null
                          } rounded-full w-5 sm:w-6 sm:h-6 h-5`}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )
          )}

          <BottomCenterButton open={open} setOpen={setOpen} />
        </div>
      </Drawer>
    </>
  );
};

export default OpenModal;
