import React from "react";
import {
  Redirect,
} from "react-router-dom";
import { motion } from "framer-motion";

class CheckIfLoggedIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
    };
  }

  componentDidMount() {
    console.log("Called CheckIfLoggedIn");
    function getCookieValue(cookieName) {
      var b = document.cookie.match(
        "(^|;)\\s*" + cookieName + "\\s*=\\s*([^;]+)"
      );
      return b ? b.pop() : "";
    }

    var phone = getCookieValue("phone");
    var auth_token = getCookieValue("auth_token");

    fetch(
      localStorage.APIRoute +
      "auth-status.php?phone=" +
      phone +
      "&auth_token=" +
      auth_token
    )
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(result);
          this.setState({
            isLoaded: true,
            data: result,
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
  }

  render() {
    const { error, isLoaded, data } = this.state;

    const easing = [0.6, -0.05, 0.01, 0.99];
    const fade1 = {
      initial: {
        opacity: 0,
      },
      animate: {
        opacity: 1,
        transition: {
          duration: 3,
          ease: easing,
        },
      },
    };

    const fade2 = {
      initial: {
        opacity: 0,
      },
      animate: {
        opacity: 1,
        transition: {
          duration: 4,
          ease: easing,
        },
      },
    };

    const fade3 = {
      initial: {
        opacity: 0,
      },
      animate: {
        opacity: 1,
        transition: {
          duration: 5,
          ease: easing,
        },
      },
    };

    const fade4 = {
      initial: {
        opacity: 0,
      },
      animate: {
        opacity: 1,
        transition: {
          duration: 6,
          ease: easing,
        },
      },
    };

    if (error) {
      return (
        <div className="site-content">
          <div className="container">
            {/* Error 404 */}
            <div className="error-404">
              <div className="row">
                <div className="col-md-8 offset-md-2">
                  <motion.div
                    exit={{ opacity: 0 }}
                    initial="initial"
                    animate="animate"
                  >
                    <motion.div variants={fade1}>
                      <figure className="error-404__figure">
                        <img src="soccer-dark/assets/images/icon-ghost.svg" />
                      </figure>
                    </motion.div>
                  </motion.div>
                  <motion.div
                    exit={{ opacity: 0 }}
                    initial="initial"
                    animate="animate"
                  >
                    <motion.div variants={fade2}>
                      <header className="error__header">
                        <h2 className="error__title">ERROR 503</h2>
                        <h3 className="error__subtitle">
                          Service Temporarily Unavailable
                      </h3>
                      </header>
                    </motion.div>
                  </motion.div>
                  <motion.div
                    exit={{ opacity: 0 }}
                    initial="initial"
                    animate="animate"
                  >
                    <motion.div variants={fade3}>
                      <div className="error__description">
                        Our servers are currently down. We should be back online shortly. If this issue persists, please inform us by sending an email to{" "}
                        <a href="mailto:support@kutumbafc.com">support@kutumbafc.com</a>
                      </div>
                    </motion.div>
                  </motion.div>
                  <motion.div
                    exit={{ opacity: 0 }}
                    initial="initial"
                    animate="animate"
                  >
                    <motion.div variants={fade4}>
                      <footer className="error__cta">
                        <a
                          href={localStorage.myaccount}
                          className="btn btn-primary"
                        >
                          Go To Account
                      </a>{" "}
                        <a href={localStorage.home} className="btn btn-primary-inverse">
                          Take Me Home
                      </a>
                      </footer>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </div>
            {/* Error 404 / End */}
          </div>
        </div>
      );
    } else if (!isLoaded) {
      return (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "100vh", width: "100vw" }}
        >
          <div className="spinner-border text-light" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      );
    } else {
      const Component = this.props.component;

      // Check for subscription parameters
      var url = window.location.href;
      var myaccount;
      if (url.indexOf("?") > -1) {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        var subscribe = urlParams.get("subscribe");
        var months = urlParams.get("months");
        if (subscribe != undefined || subscribe != null) {
          myaccount = "https://myaccount.kutumbafc.com/subscribe?subscribe=" + subscribe + "&months=" + months;
        }
        else {
          myaccount = "https://myaccount.kutumbafc.com/";
        }
      }

      if (data.is_authenticated === true) {
        if (data.phone_confirmed === true) {
          return (
            window.location.replace(myaccount)
          );
        } else {
          return <Redirect to={{ pathname: "/verify-phone" }} />;
        }
      } else {
        return <Component />;
      }
    }
  }
}

export default CheckIfLoggedIn;