import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Link, withRouter } from "react-router-dom";
import { useCookies } from "react-cookie";

import CountryCodes from "../CountryCodes/MainContent";

function MainContent(props) {
  const [state, setState] = useState({
    first_name: "",
    last_name: "",
    countryCode: 91,
    phone: "",
    password: "",
    confirm_password: "",
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

  const resetForm = (e) => {
    document
      .getElementById("sign-up-button")
      .removeAttribute("disabled", "disabled");
    document.getElementById("sign-up-button-text").classList.remove("d-none");
    document.getElementById("sign-up-button-loader").classList.add("d-none");
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();
    document
      .getElementById("sign-up-button")
      .setAttribute("disabled", "disabled");
    document.getElementById("sign-up-button-text").classList.add("d-none");
    document.getElementById("sign-up-button-loader").classList.remove("d-none");
    document.getElementById("first_name").classList.remove("red-outline");
    document.getElementById("last_name").classList.remove("red-outline");
    document.getElementById("phone").classList.remove("red-outline");
    document.getElementById("password").classList.remove("red-outline");
    document.getElementById("confirm_password").classList.remove("red-outline");
    if (
      state.first_name === "" ||
      state.last_name === "" ||
      state.phone === "" ||
      state.password === "" ||
      state.confirm_password === ""
    ) {
      setState((prevState) => ({
        ...prevState,
        errorMessage: "Please fill all the fields.",
      }));

      if (state.first_name === "") {
        document.getElementById("first_name").classList.add("red-outline");
      }
      if (state.last_name === "") {
        document.getElementById("last_name").classList.add("red-outline");
      }
      if (state.phone === "") {
        document.getElementById("phone").classList.add("red-outline");
      }
      if (state.password === "") {
        document.getElementById("password").classList.add("red-outline");
      }
      if (state.confirm_password === "") {
        document
          .getElementById("confirm_password")
          .classList.add("red-outline");
      }

      document
        .getElementById("sign-up-button")
        .removeAttribute("disabled", "disabled");
      document.getElementById("sign-up-button-text").classList.remove("d-none");
      document.getElementById("sign-up-button-loader").classList.add("d-none");
    } else {
      if (state.password !== "" && state.confirm_password !== "") {
        if (state.password !== state.confirm_password) {
          document.getElementById("password").classList.add("red-outline");
          document
            .getElementById("confirm_password")
            .classList.add("red-outline");
          setState((prevState) => ({
            ...prevState,
            errorMessage: "Passwords don't match.",
          }));
          resetForm();
        } else {
          document.getElementById("first_name").classList.remove("red-outline");
          document.getElementById("last_name").classList.remove("red-outline");
          document.getElementById("phone").classList.remove("red-outline");
          document.getElementById("password").classList.remove("red-outline");
          document
            .getElementById("confirm_password")
            .classList.remove("red-outline");
          setState((prevState) => ({
            ...prevState,
            errorMessage: "",
          }));

          var email = state.countryCode + state.phone;

          // Get referral code if exists
          var url = window.location.href;
          if (url.indexOf("?") > -1) {
            console.log("Url has params");
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const referral_code = urlParams.get("referral");
            var subscribe = urlParams.get("subscribe");
            var months = urlParams.get("months");
            localStorage.referral_code = referral_code;

            var api =
              localStorage.APIRoute +
              "register.php?first_name=" +
              state.first_name +
              "&last_name=" +
              state.last_name +
              "&phone=+" +
              state.countryCode +
              state.phone +
              "&email=" +
              email +
              "&password=" +
              state.password +
              "&referral_code=" +
              referral_code;
          } else if (localStorage.referral_code !== null) {
            var api =
              localStorage.APIRoute +
              "register.php?first_name=" +
              state.first_name +
              "&last_name=" +
              state.last_name +
              "&phone=+" +
              state.countryCode +
              state.phone +
              "&email=" +
              email +
              "&password=" +
              state.password +
              "&referral_code=" +
              localStorage.referral_code;
          } else {
            var api =
              localStorage.APIRoute +
              "register.php?first_name=" +
              state.first_name +
              "&last_name=" +
              state.last_name +
              "&phone=+" +
              state.countryCode +
              state.phone +
              "&email=" +
              email +
              "&password=" +
              state.password;
          }

          axios
            .post(api)
            .then(function (response) {
              console.log(response);
              if (response.data === "db-error") {
                setState((prevState) => ({
                  ...prevState,
                  errorMessage:
                    "An error occurred. Please try again or report this error to us. Code - 1000.",
                }));
                resetForm();
              } else if (response.data === "invalid-phone") {
                setState((prevState) => ({
                  ...prevState,
                  errorMessage: "The phone number you entered is invalid.",
                }));
                resetForm();
              } else if (response.data === "user-exists") {
                setState((prevState) => ({
                  ...prevState,
                  errorMessage:
                    "An account with those credentials already exists.",
                }));
                resetForm();
              } else if (response.data) {
                // Remove old cookies
                removeCookie("phone");
                removeCookie("email");
                removeCookie("auth_token");

                // Write response to cookie
                setCookie("phone", response.data.phone, {
                  domain: ".kutumbafc.com",
                  maxAge: "2147483647",
                  sameSite: "lax",
                });
                setCookie("email", response.data.email, {
                  domain: ".kutumbafc.com",
                  maxAge: "2147483647",
                  sameSite: "lax",
                });
                setCookie("auth_token", response.data.auth_token, {
                  domain: ".kutumbafc.com",
                  maxAge: "2147483647",
                  sameSite: "lax",
                });

                // Write phone number to localStorage
                localStorage.phone = response.data.phone;

                redirectToVerify(subscribe, months);

                props.showError(null);
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        }
      }
    }
  };

  function redirectToVerify(subscribe, months) {
    props.history.push(
      "/verify-phone?subscribe=" + subscribe + "&months=" + months
    );
  }

  const [cookies, setCookie, removeCookie] = useCookies([
    "phone",
    "email",
    "auth_token",
  ]);

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

  return (
    <motion.div exit={{ opacity: 0 }} initial="initial" animate="animate">
      <motion.div variants={fade1}>
        <div className="site-content">
          <div className="container">
            {/* Register */}
            <div className="card">
              <div className="card__header">
                <h4>Sign Up For Free</h4>
              </div>
              <div className="card__content">
                {/* Register Form */}
                <form>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label htmlFor="login-name">First name</label>
                        <input
                          type="tel"
                          name="login-first-name"
                          id="first_name"
                          className="form-control"
                          placeholder="Enter your first name"
                          value={state.first_name}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label htmlFor="login-name">Last name</label>
                        <input
                          type="tel"
                          name="login-last-name"
                          id="last_name"
                          className="form-control"
                          placeholder="Enter your last name"
                          value={state.last_name}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label htmlFor="login-name">Your country code</label>
                        <select
                          className="form-control"
                          id="countryCode"
                          value={state.code}
                          onChange={handleChange}
                          defaultValue={91}
                        >
                          <CountryCodes></CountryCodes>
                        </select>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label htmlFor="login-name">Your phone number</label>
                        <input
                          type="tel"
                          name="login-name"
                          id="phone"
                          className="form-control"
                          placeholder="Enter your phone number"
                          value={state.phone}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label htmlFor="register-password">Your Password</label>
                        <input
                          type="password"
                          name="register-password"
                          id="password"
                          className="form-control"
                          placeholder="Enter your password"
                          value={state.password}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label htmlFor="repeat-password">Repeat Password</label>
                        <input
                          type="password"
                          name="repeat-password"
                          id="confirm_password"
                          className="form-control"
                          placeholder="Repeat your password"
                          value={state.confirm_password}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="text-danger font-weight-bold text-small">
                    {state.errorMessage}
                  </div>

                  <div className="my-2">
                    <span className="text-muted">
                      By signing up, you agree to our{" "}
                      <a
                        href="https://kutumbafc.com/terms-of-service"
                        className="text-white"
                      >
                        terms of service
                      </a>{" "}
                      and acknowledge that you've read our{" "}
                      <a
                        href="https://kutumbafc.com/privacy-policy"
                        className="text-white"
                      >
                        privacy policy.
                      </a>
                    </span>
                  </div>
                  <div className="d-flex mt-4 justify-content-between justify-content-lg-start">
                    <div className="form-group">
                      <button
                        id="sign-up-button"
                        className="btn btn-primary-inverse"
                        onClick={handleSubmitClick}
                      >
                        <span id="sign-up-button-text">
                          Create Your Account
                        </span>
                        <span
                          id="sign-up-button-loader"
                          className="spinner-border spinner-border-sm d-none"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      </button>
                    </div>

                    <div className="form-group ml-lg-3">
                      <Link to={"/"}>
                        <button className="btn btn-primary font-weight-medium auth-form-btn">
                          Sign In Instead
                        </button>
                      </Link>
                    </div>
                  </div>
                </form>
                {/* Register Form / End */}
              </div>
            </div>
            {/* Register / End */}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default withRouter(MainContent);
