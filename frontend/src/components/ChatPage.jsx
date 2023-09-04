import React, { useEffect, useRef, useState } from "react";
import "tailwindcss/tailwind.css";
import { BiArrowBack } from "react-icons/bi";
import { FaImage, FaRegImage } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import { toast } from "react-hot-toast";
import { useQuery } from "react-query";
import axios from "axios";
import { UserProfileShare } from "../Context/UserContext";

const ChatPage = () => {
  const { userProfile, socket, onlineUsers } = UserProfileShare();
  const { userId } = useParams();
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [receiveMessage, setReceiveMessage] = useState(null);
  const navigate = useNavigate();
  const scrollRef = useRef();
  const profile = JSON.parse(localStorage.getItem("profile"));
  const token = profile?.token;
  const sender = profile?.id;
  const recepient = userId;
  const backendUrl = import.meta.env.VITE_REACT_BACKEND_URL;
  let data = "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          backendUrl + `/api/v1/message/${token}/${sender}/${recepient}`
        );
        setMessages(response.data);
      } catch (error) {
        console.log("Error --> ", error);
      }
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    const sendImage = async () => {
      try {
        const inputData = {
          sender: sender,
          recepient: recepient,
          image: image,
        };
        const response = await axios.post(
          backendUrl + `/api/v1/message/${token}`,
          inputData
        );
        setMessages([...messages, response.data]);
        data = response.data;
        socket.current.emit("sendMessage", { data, recepient });
      } catch (error) {
        toast.error(error.response.data.message);
      }
      setImage(null);
    };
    image && sendImage();
  }, [image]);

  const fetchUserData = async ({ userId, token }) => {
    const response = await axios.get(
      backendUrl + `/api/v1/user/${token}/${userId}`
    );

    return response.data;
  };

  const {
    data: recepientData,
    isLoading: recepientLoading,
    isError: recepientError,
  } = useQuery("userDetail", () => fetchUserData({ userId, token }), {
    enabled: !!userId && !!token,
  });

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleInput();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImage(reader.result);
      };
    }
  };

  const handleInput = async () => {
    if (content) {
      try {
        const inputData = {
          sender: sender,
          recepient: recepient,
          content: content,
        };
        const response = await axios.post(
          backendUrl + `/api/v1/message/${token}`,
          inputData
        );
        setMessages([...messages, response.data]);
        data = response.data;
        socket.current.emit("sendMessage", { data, recepient });
      } catch (error) {
        console.log("Error --> ", error);
      }
      setContent("");
    }
    data = "";
  };

  // useEffect(() => {
  //   socket.current?.on("receiveMessage", (data) => {
  //     // if (data.recepient === userId || data.sender === sender) {
  //     data && setReceiveMessage(data);
  //     // setMessages([...messages, data]);
  //     // }
  //   });
  // }, []);

  useEffect(() => {
    socket.current?.on("receiveMessage", (data) => {
      data && setReceiveMessage(data);
    });
  }, []);

  useEffect(() => {
    if (receiveMessage) {
      setMessages([...messages, receiveMessage]);
    }
  }, [receiveMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView();
  }, [messages]);

  return (
    <>
      <div className="lg:bg-slate-800">
        <div className="lg:container lg:mx-auto lg:px-52">
          <div className="flex flex-col h-screen bg-[url('https://th.bing.com/th/id/OIP.kvq2cAPCMr8rX-Av81em_gAAAA?pid=ImgDet&rs=1')] bg-center">
            {/* Top Navbar */}
            {recepientData && (
              <div
                className={`flex items-center ${
                  window.innerWidth < 1024
                    ? "fixed top-0 left-0 w-full z-50 "
                    : "static"
                } justify-between h-16 px-3 py-2 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-950 `}
              >
                <div className={`flex items-center `}>
                  <BiArrowBack
                    onClick={() => navigate(-1)}
                    className="text-2xl font-medium text-white mr-[6px] cursor-pointer"
                  />
                  <img
                    className="w-11 h-11 rounded-full object-cover"
                    src={recepientData?.avatar}
                    alt="Avatar"
                  />
                  <div className="ml-2">
                    <p className="text-[16px] sm:text-lg tracking-wide font-bold text-white">
                      {recepientData?.username.charAt(0).toUpperCase() +
                        recepientData?.username.slice(1)}
                    </p>
                    <p className="text-[13px] tracking-wider sm:text-sm text-gray-400">
                      {onlineUsers.find(
                        (user) => user.userId === recepientData?.id
                      )
                        ? "Online"
                        : "Offline"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Chat messages */}
            <div
              className={`flex-grow bg-slate-800 px-1 py-3 overflow-y-scroll ${
                window.innerWidth < 1024 ? "mt-[64px] " : ""
              } `}
            >
              {messages?.map((message) => (
                <div ref={scrollRef} key={message._id}>
                  {/* image */}
                  {message.image && (
                    <div
                      className={` chat ${
                        message.sender === sender ? "chat-end" : "chat-start"
                      }   chat-start `}
                    >
                      <div
                        className={`chat-bubble max-w-[250px]  min-w-[56px] bg-slate-900`}
                      >
                        <div>
                          <img
                            className="w-50 h-80 rounded-lg object-cover"
                            src={message.image}
                            alt="Avatar"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* text  */}
                  {message.content && (
                    <div
                      className={` chat ${
                        message.sender === sender ? "chat-end" : "chat-start"
                      }  mb-1 `}
                    >
                      <div
                        className={`chat-bubble tracking-wide text-md max-w-[250px] ${
                          message.sender !== sender
                            ? "bg-gray-800 text-gray-300"
                            : "bg-teal-500 text-black"
                        } min-w-[56px]`}
                      >
                        {message.content}
                      </div>
                      <div className="chat-footer">
                        <time className="text-[12px]  text-white">
                          {moment(message.timestamp).format("HH:mm")}
                        </time>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Input and Button */}
            <div className="flex items-center px-1 py-[6px] -pt-2 bg-slate-950">
              <div className="flex items-center px-4 py-[8px] bg-gray-900 flex-grow rounded-full mx-1 mr-2 ">
                <input
                  className="flex-grow mr-5 bg-gray-900 text-md focus:outline-none text-white text-[16px]"
                  type="text"
                  placeholder="Type a message..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <label htmlFor="image-upload">
                  <FaRegImage className="text-2xl text-slate-500 curser cursor-pointer" />
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }} // Hide the input field
                />
              </div>
              <FiSend
                disabled={content ? false : true}
                className="text-xl text-teal-500 cursor-pointer mr-3 focus:outline-none"
                onClick={handleInput}
              />
              {/* input without image select  */}
              {/* <input
                className="flex-grow px-4 py-[8px] text-md bg-gray-900 rounded-full focus:outline-none text-white text-[16px]"
                type="text"
                placeholder="Type a message..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
              />
              <label htmlFor="image-upload">
                 <FaImage size={20} /> 
                <FaRegImage className="text-2xl text-slate-500" />
              </label>
              <FiSend
                disabled={content ? false : true}
                className="text-xl text-teal-500 cursor-pointer mr-3 focus:outline-none"
                onClick={handleInput}
              /> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatPage;
