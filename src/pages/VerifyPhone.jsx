import React, { Component } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Layout from "./Layout";
import MainContent from "./components/VerifyPhone/MainContent";

export default class VerifyPhone extends Component {
  render() {
    return (
      <React.Fragment>
        <HelmetProvider>
          <Helmet>
            <title>Verify Phone | KuTumba FC</title>
          </Helmet>
          <Layout>
            <MainContent></MainContent>
          </Layout>
        </HelmetProvider>
      </React.Fragment>
    );
  }
}
