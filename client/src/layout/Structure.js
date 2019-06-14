import React, { Component } from "react";
import { Layout } from "antd";
import Content from './content.js';
const { Header, Footer,   } = Layout;

export class Structure extends Component {
  render() {
    return (
      <div>
        <Layout>
          <Header>User Management</Header>
          <Content/>
          <Footer>Footer</Footer>
        </Layout>
      </div>
    );
  }
}

export default Structure;
