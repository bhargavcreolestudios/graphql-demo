import React, { Component } from "react";
import { Layout } from "antd";
import Content from './content.js';
const { Header, Footer,   } = Layout;

export class Structure extends Component {
  render() {
    return (
        <Layout>
          <Header>User Management</Header>
          <Content/>
        </Layout>
    );
  }
}

export default Structure;