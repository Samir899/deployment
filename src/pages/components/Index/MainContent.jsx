import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { BrowserRouter as Router, Link, withRouter } from "react-router-dom";
import { useCookies } from "react-cookie";

import CountryCodes from "../CountryCodes/MainContent";

function MainContent(props) {
  const [state, setState] = useState({
    countryCode: 91,
    phone: "",
    password: "",
    successMessage: null,
    errorMessage: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();
    document
      .getElementById("sign-in-button")
      .setAttribute("disabled", "disabled");
    document.getElementById("sign-in-button-text").classList.add("d-none");
    document.getElementById("sign-in-button-loader").classList.remove("d-none");
    if (state.phone === "" && state.password !== "") {
      setState((prevState) => ({
        ...prevState,
        errorMessage: "Please enter a phone number.",
      }));
      document.getElementById("phone").classList.remove("red-outline");
      document
        .getElementById("sign-in-button")
        .removeAttribute("disabled", "disabled");
      document.getElementById("sign-in-button-text").classList.remove("d-none");
      document.getElementById("sign-in-button-loader").classList.add("d-none");
    } else if (state.phone !== "" && state.password === "") {
      setState((prevState) => ({
        ...prevState,
        errorMessage: "Please enter a password.",
      }));
      document.getElementById("password").classList.add("red-outline");
      document
        .getElementById("sign-in-button")
        .removeAttribute("disabled", "disabled");
      document.getElementById("sign-in-button-text").classList.remove("d-none");
      document.getElementById("sign-in-button-loader").classList.add("d-none");
    } else if (state.phone === "" && state.password === "") {
      setState((prevState) => ({
        ...prevState,
        errorMessage: "Enter phone and password.",
      }));
      document.getElementById("phone").classList.add("red-outline");
      document.getElementById("password").classList.add("red-outline");
      document
        .getElementById("sign-in-button")
        .removeAttribute("disabled", "disabled");
      document.getElementById("sign-in-button-text").classList.remove("d-none");
      document.getElementById("sign-in-button-loader").classList.add("d-none");
    } else {
      document.getElementById("countryCode").classList.remove("red-outline");
      document.getElementById("phone").classList.remove("red-outline");
      document.getElementById("password").classList.remove("red-outline");
      console.log(
        localStorage.APIRoute +
          "login.php?phone=" +
          state.countryCode +
          state.phone +
          "&password=" +
          state.password
      );
      axios
        .post(
          localStorage.APIRoute +
            "login.php?phone=" +
            state.countryCode +
            state.phone +
            "&password=" +
            state.password
        )
        .then(function (response) {
          console.log(response);
          if (response.data === "db-error") {
            setState((prevState) => ({
              ...prevState,
              errorMessage: "An unknown error occurred. Code - 1001.",
            }));
            document
              .getElementById("sign-in-button")
              .removeAttribute("disabled", "disabled");
            document
              .getElementById("sign-in-button-text")
              .classList.remove("d-none");
            document
              .getElementById("sign-in-button-loader")
              .classList.add("d-none");
          } else if (response.data === "invalid-password") {
            setState((prevState) => ({
              ...prevState,
              errorMessage: "Phone and password do not match.",
            }));
            document
              .getElementById("sign-in-button")
              .removeAttribute("disabled", "disabled");
            document
              .getElementById("sign-in-button-text")
              .classList.remove("d-none");
            document
              .getElementById("sign-in-button-loader")
              .classList.add("d-none");
          } else if (response.data === "user-doesnt-exist") {
            setState((prevState) => ({
              ...prevState,
              errorMessage: "Account does not exist.",
            }));
            document
              .getElementById("sign-in-button")
              .removeAttribute("disabled", "disabled");
            document
              .getElementById("sign-in-button-text")
              .classList.remove("d-none");
            document
              .getElementById("sign-in-button-loader")
              .classList.add("d-none");
          } else {
            // Remove old cookies
            removeCookie("phone");
            removeCookie("email");
            removeCookie("auth_token");

            // Write response to cookie for web
            setCookie("phone", response.data.phone, {
              domain: ".kutumbafc.com",
              maxAge: "2147483647",
            });
            setCookie("email", response.data.email, {
              domain: ".kutumbafc.com",
              maxAge: "2147483647",
            });
            setCookie("auth_token", response.data.auth_token, {
              domain: ".kutumbafc.com",
              maxAge: "2147483647",
            });

            // Write phone number to localStorage
            localStorage.phone = response.data.phone;

            // Write auth status to localStorage
            localStorage.isLoggedIn = true;

            if (response.data.phone_confirmed === 0) {
              console.log("redirecting to verify phone");
              redirectToVerifyPhone();
            } else {
              redirectToHome();
            }
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const redirectToHome = () => {
    window.location.replace(localStorage.myaccount);
  };

  const redirectToVerifyPhone = () => {
    props.history.push("/verify-phone");
  };

  const easing = [0.6, -0.05, 0.01, 0.99];
  const fade1 = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
      transition: {
        duration: 1,
        ease: easing,
      },
    },
  };

  const [cookies, setCookie, removeCookie] = useCookies([
    "phone",
    "auth_token",
  ]);

  return (
    <motion.div exit={{ opacity: 0 }} initial="initial" animate="animate">
      <motion.div variants={fade1}>
        <div className="site-content">
          <div className="container">
            <div className="row d-flex justify-content-center">
              <div className="col-lg-6">
                {/* Login */}
                <div className="card">
                  <div className="card__header">
                    <h4>Login to your Account</h4>
                  </div>
                  <div className="card__content">
                    {/* Login Form */}
                    <form action="#">
                      <div className="form-group">
                        <label htmlFor="login-name">Your Country Code</label>
                        <select
                          className="form-control"
                          id="countryCode"
                          value={state.code}
                          onChange={handleChange}
                        >
                          <CountryCodes></CountryCodes>
                        </select>
                      </div>

                      <div className="form-group">
                        <label htmlFor="login-name">Your phone number</label>
                        <input
                          type="tel"
                          name="login-name"
                          id="phone"
                          className="form-control"
                          placeholder="Phone number"
                          value={state.phone}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="login-password">Your Password</label>
                        <input
                          type="password"
                          name="login-password"
                          id="password"
                          className="form-control"
                          placeholder="Enter your password"
                          value={state.password}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group form-group--password-forgot d-flex my-0">
                        <Link to={"/recover-account"} className="ml-auto">
                          <span className="password-reminder">
                            Forgot your password?
                          </span>
                        </Link>
                      </div>
                      <div className="text-danger font-weight-bold text-small mb-3">
                        {state.errorMessage}
                      </div>
                      <div className="form-group form-group--sm">
                        <button
                          className="btn btn-primary-inverse btn-lg btn-block mb-4"
                          onClick={handleSubmitClick}
                          id="sign-in-button"
                        >
                          <span id="sign-in-button-text">SIGN IN</span>
                          <span
                            id="sign-in-button-loader"
                            className="spinner-border spinner-border-sm d-none"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        </button>

                        <hr className="bg-secondary" />

                        <div className="form-group form-group--password-forgot mt-4 mb-2">
                          <span className="password-reminder">
                            Don't have an account?
                          </span>
                        </div>

                        <Link
                          to={"/register"}
                          className="btn btn-primary btn-lg btn-block"
                        >
                          Sign Up For Free
                        </Link>
                      </div>
                    </form>
                    {/* Login Form / End */}
                  </div>
                </div>
                {/* Login / End */}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default withRouter(MainContent);
