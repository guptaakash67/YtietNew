"use client";
import React, { useState, useEffect } from "react";
import { AdminLogIn } from "@/Helper/AdminLogIn";
import { AdminSignUp } from "@/Helper/AdminSignUp";
import ColorRingLoader from "@/components/Common/Others/ColorRingLoader";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";
import axios from "axios";

const SignInForm = () => {
  const { authUser, IsLoading, setAuthUser } = useAuth();
  const [Name, setName] = useState("");
  const [UserName, setUserName] = useState("");
  const [Email, setEmail] = useState("admin@ytiet.com"); // Pre-filled with admin email
  const [Contact, setContact] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [ProfilePicURL, setProfilePicURL] = useState("");
  const [NewUsername, setNewUsername] = useState("");
  const [NewPassword, setNewPassword] = useState("");
  const [FailedAttempts, setFailedAttempts] = useState(0); // Track failed login attempts

  const [ShowMessage, setShowMessage] = useState("");
  const [LogSign, setLogSign] = useState(false); // false for login, true for signup
  const [PassRememberMe, setPassRememberMe] = useState(false);
  const [PassResetLoading, setPassResetLoading] = useState(false);
  const [RingLoad, setRingLoad] = useState(false);
  const [ShowUpdateForm, setShowUpdateForm] = useState(false);

  const nav = useRouter();
  const fetchlink = process.env.NEXT_PUBLIC_SERVERURL;

  const InputFieldClass =
    "bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";

  const SignUpBtnHandel = async () => {
    setRingLoad(true);
    try {
      if (Password !== ConfirmPassword) {
        setShowMessage("Passwords do not match");
        setRingLoad(false);
        return;
      }
      const res = await AdminSignUp(Name, UserName, Email, Contact, Password, ProfilePicURL);
      if (res.success) {
        setShowMessage(res.message || "Signup successful");
        setTimeout(() => {
          setLogSign(false);
          setShowMessage("");
          setName("");
          setUserName("");
          setContact("");
          setPassword("");
          setConfirmPassword("");
          setProfilePicURL("");
        }, 1000);
      } else {
        setShowMessage(res.message || "Signup failed");
      }
    } catch (error) {
      setShowMessage(error?.message || "Error during signup");
    }
    setRingLoad(false);
  };

  const LogInBtnHandel = async () => {
    setRingLoad(true);
    try {
      const res = await AdminLogIn(Email, Password);
      if (res.success) {
        setAuthUser(res.admin);
        setShowMessage(res.message || "Login successful");
        setFailedAttempts(0); // Reset failed attempts on successful login
        setTimeout(() => {
          nav.push("/admin/dashboard");
        }, 1000);
      } else {
        const newFailedAttempts = FailedAttempts + 1;
        setFailedAttempts(newFailedAttempts);
        if (newFailedAttempts >= 3) {
          setShowMessage("Too many failed attempts. Please update your credentials.");
          setShowUpdateForm(true); // Show the update credentials form
          setFailedAttempts(0); // Reset after showing the form
        } else {
          setShowMessage(res.message || "Login failed");
        }
      }
    } catch (error) {
      const newFailedAttempts = FailedAttempts + 1;
      setFailedAttempts(newFailedAttempts);
      if (newFailedAttempts >= 3) {
        setShowMessage("Too many failed attempts. Please update your credentials.");
        setShowUpdateForm(true);
        setFailedAttempts(0);
      } else {
        setShowMessage(error?.message || "Error during login");
      }
    }
    setRingLoad(false);
  };

  const UpdateCredentials = async () => {
    setRingLoad(true);
    try {
      const res = await axios.put(`${fetchlink}/api/v1/admin/update`, {
        email: Email,
        username: NewUsername,
        password: NewPassword,
      });
      if (res.data.success) {
        setShowMessage(res.data.message || "Credentials updated successfully");
        setTimeout(() => {
          setShowUpdateForm(false);
          setShowMessage("");
          setNewUsername("");
          setNewPassword("");
          setPassword(""); // Clear password field after update
        }, 1000);
      } else {
        setShowMessage(res.data.message || "Update failed");
      }
    } catch (error) {
      setShowMessage(error?.response?.data?.message || "Error updating credentials");
    }
    setRingLoad(false);
  };

  const handleCheckboxChange = (event) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("RememberMe", event.target.checked);
    }
    setPassRememberMe(event.target.checked);
  };

  useEffect(() => {
    if (authUser && authUser?.isAdmin) {
      nav.push("/admin/dashboard");
    }
  }, [authUser, IsLoading]);

  return (
    <div className="flex flex-col items-center justify-center mx-auto">
      <div className="w-full m-2 mt-8 shadow dark:border sm:max-w-md dark:bg-gray-800 dark:border-gray-700 rounded-lg backdrop-blur-lg shadow-blue-950 shadow-4xl">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            {LogSign ? "Sign Up (Create Account)" : "Log in to your account"}
          </h1>
          <div className="space-y-3 md:space-y-4">
            {LogSign && (
              <div>
                <label htmlFor="Name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Name
                </label>
                <input
                  type="text"
                  name="Name"
                  id="Name"
                  className={InputFieldClass}
                  placeholder="Enter Your Name"
                  required
                  value={Name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
            {LogSign && (
              <div>
                <label htmlFor="UserName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  UserName
                </label>
                <input
                  type="text"
                  name="UserName"
                  id="UserName"
                  className={InputFieldClass}
                  placeholder="Enter UserName"
                  required
                  value={UserName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
            )}
            <div>
              <label htmlFor="Email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Email
              </label>
              <input
                type="email"
                name="Email"
                id="Email"
                className={InputFieldClass}
                placeholder="Enter Email"
                value={Email}
                readOnly
                required
              />
            </div>
            {LogSign && (
              <div>
                <label htmlFor="Contact" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Contact
                </label>
                <input
                  type="text"
                  name="Contact"
                  id="Contact"
                  className={InputFieldClass}
                  placeholder="Enter Contact"
                  required
                  value={Contact}
                  onChange={(e) => setContact(e.target.value)}
                />
              </div>
            )}
            <div>
              <label htmlFor="Password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Password
              </label>
              <input
                type="password"
                name="Password"
                id="Password"
                placeholder="••••••••"
                className={InputFieldClass}
                required
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {LogSign && (
                <>
                  <label htmlFor="ConfirmPassword" className="block my-2 text-sm font-medium text-gray-900 dark:text-white">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="ConfirmPassword"
                    id="ConfirmPassword"
                    placeholder="••••••••"
                    className={InputFieldClass}
                    required
                    value={ConfirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </>
              )}
            </div>
            <p className="font-bold text-red-600">{ShowMessage}</p>
            {RingLoad ? (
              <ColorRingLoader />
            ) : (
              <>
                {Password && (
                  <>
                    {LogSign ? (
                      <button
                        type="button"
                        className="block w-full rounded-md text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 shadow-lg shadow-purple-500/50 font-medium text-sm px-5 py-2.5 text-center mr-2 mb-2"
                        onClick={SignUpBtnHandel}
                      >
                        Sign Up
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="block w-full rounded-md text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 shadow-lg shadow-purple-500/50 font-medium text-sm px-5 py-2.5 text-center mr-2 mb-2"
                        onClick={LogInBtnHandel}
                      >
                        Log in
                      </button>
                    )}
                  </>
                )}
              </>
            )}
            {ShowUpdateForm && (
              <div className="space-y-3">
                <input
                  type="text"
                  name="NewUsername"
                  id="NewUsername"
                  className={InputFieldClass}
                  placeholder="New Username"
                  value={NewUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                />
                <input
                  type="password"
                  name="NewPassword"
                  id="NewPassword"
                  className={InputFieldClass}
                  placeholder="New Password"
                  value={NewPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="block w-full rounded-md text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 shadow-lg shadow-blue-500/50 font-medium text-sm px-5 py-2.5 text-center mr-2 mb-2"
                  onClick={UpdateCredentials}
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  className="block w-full rounded-md text-white bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 shadow-lg shadow-red-500/50 font-medium text-sm px-5 py-2.5 text-center mr-2 mb-2"
                  onClick={() => setShowUpdateForm(false)}
                >
                  Cancel
                </button>
              </div>
            )}
            <p className="text-sm text-gray-900 dark:text-gray-400">
              {LogSign ? "Already have an account? " : "Don't have an account? "}
              <button
                className="font-bold underline hover:text-green-700 dark:text-purple-500 text-purple-900"
                onClick={() => {
                  setLogSign((prev) => !prev);
                  setShowMessage("");
                  setFailedAttempts(0); // Reset failed attempts when switching forms
                  setName("");
                  setUserName("");
                  setContact("");
                  setPassword("");
                  setConfirmPassword("");
                  setProfilePicURL("");
                }}
              >
                {LogSign ? "Log In" : "Sign Up (create account)"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;