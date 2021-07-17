import React, { Component } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Layout from "./Layout";

import MainContent from "./components/VerifyEmail/MainContent";
export default class VerifyEmail extends Component {
  render() {
    return (
      <HelmetProvider>
        <Layout>
          <Helmet>
            <title>Verify Email | KuTumba FC</title>
          </Helmet>
          <MainContent></MainContent>
        </Layout>
      </HelmetProvider>
    );
  }
}
