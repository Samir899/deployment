import React, { Component } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Layout from "./Layout";
import MainContent from "./components/Index/MainContent";

export default class Index extends React.Component {
  render() {
    return (
      <React.Fragment>
        <HelmetProvider>
          <Helmet>
            <title>SSO | KuTumba FC</title>
          </Helmet>
          <Layout>
            <MainContent></MainContent>
          </Layout>
        </HelmetProvider>
      </React.Fragment>
    );
  }
}
