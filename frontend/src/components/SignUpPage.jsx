import React, { useState } from "react";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useMutation } from "react-query";
import "tailwindcss/tailwind.css";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    avatar: "",
  });

  const backendUrl = import.meta.env.VITE_REACT_BACKEND_URL;

  const createUser = async (formData) => {
    const response = await axios.post(backendUrl + "/api/v1/signUp", formData);
    return response.data;
  };

  const { mutate, isLoading } = useMutation(createUser, {
    onSuccess: (data) => {
      toast.success("SignUp Successfull", { duration: 3000 });
      localStorage.setItem("profile", JSON.stringify(data));
      !!localStorage.getItem("profile") && window.location.reload();
    },
    onError: (error) => {
      if (error.response) {
        toast.error(error.response.data.message);
      }
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        // setImage(reader.result);
        setFormData({
          ...formData,
          [e.target.name]: reader.result,
        });
      };
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.avatar) {
      console.log(formData.avatar);
      mutate(formData);
    } else {
      toast.error("Please choose avatar");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className=" p-8 sm:p-8 sm:bg-gray-800 sm:shadow-lg sm:rounded-lg  w-full sm:max-w-sm">
          <h2 className="text-[26px] text-center tracking-wide text-white font-semibold mb-2">
            Create new account
          </h2>
          <p className="text-sm mb-14 text-gray-400 text-center">
            Please fill in the form to continue
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-md sm:text-md text-white tracking-wide mb-1"
              >
                Username
              </label>
              <input
                type="text"
                name="username"
                className="w-full py-2 px-3 focus:outline-none bg-gray-700 text-white text-md rounded"
                placeholder="Enter your username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [e.target.name]: e.target.value,
                  })
                }
                autoFocus
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-md sm:text-md text-white tracking-wide mb-1"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                className="w-full py-2 px-3 focus:outline-none bg-gray-700 text-white text-md rounded"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [e.target.name]: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-md sm:text-md text-white tracking-wide mb-1"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                className="w-full py-2 px-3 focus:outline-none bg-gray-700 text-white text-md rounded"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [e.target.name]: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="mb-8">
              <label
                htmlFor="password"
                className="block text-md sm:text-md text-white tracking-wide mb-1"
              >
                Profile Pic
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                name="avatar"
                className="w-full rounded bg-gray-700 text-slate-300"
                onChange={handleImageChange}
              />
            </div>

            <Button
              variant="contained"
              type="submit"
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-600 text-md cursor-pointer text-white font-extrabold py-3 px-4 rounded w-full"
            >
              Sign Up
            </Button>
            <p className="text-md text-white tracking-wide text-center mt-4">
              Have an account?{" "}
              <Link to="/Login" className="text-sky-500 underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUpPage;
