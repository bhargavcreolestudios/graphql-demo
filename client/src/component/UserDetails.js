import React, { Component } from "react";

import * as Yup from "yup";
import { Formik } from "formik";
import moment from "moment";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { Modal, Button, Input, Icon, DatePicker } from "antd";

class UserDetails extends Component {
  state = { visible: true, pollFlag:100 };

  handleCancel = () => {
    this.props.setDetailFlag();
  };
  componentDidMount(){
    this.setState({
      pollFlag:0
    })
  }
  List_UserDetails = gql`
    query user_details($user_id: Int!) {
      user_details(user_id: $user_id) {
        id
        user_id
        gender
        hobby
        phone_no
        user {
          id
          firstName
          lastName
          email
          dateofbirth
        }
        address{
          defaultAddress
          address
        }
      }
    }
  `;

  Refresh_UserDetails = gql`
  query user_details{
    user_details{
      id
      user_id
      gender
      hobby
      phone_no
      user {
        id
        firstName
        lastName
        email
        dateofbirth
      }
      address{
        defaultAddress
        address
      }
    }
  }
`;
  componentDidMount() {
    this.setState({ visible: true });
  }
  render() {
    const { detailId } = this.props;

    return (
      <div>
        <Query query={this.List_UserDetails} variables={{ user_id: detailId }}
        pollInterval={this.state.pollFlag}
        partialRefetch={true}
        >
          {({ loading, error, data }) => {
            if (loading) return null;
            if (error) return `Error! ${error}`;

            return (
              <Modal
                title="Detail User"
                visible={this.props.flag}
                footer={null}
                onCancel={this.handleCancel}
              >
                <h2>User Details</h2>
                <ul>
                  {data.user_details.map((record, index) => (
                    <div key={index}>
                      {record.user.map((info, ind) => (
                        <div key={ind}>
                          <li>{info.firstName}</li>
                          <li>{info.lastName}</li>
                          <li>{info.dateofbirth}</li>
                          <li>{info.email}</li>
                        </div>
                      ))}
                      {record.address.map((info,indez) => {
                        if(info.address !==  ""){
                          return(
                            <li key={indez}>
                            {info.address}
                          </li>
                          )
                        }
                        else{
                          return null;
                        }
                        
                      }
                      )}
                      <li>{record.gender}</li>
                      {JSON.parse(record.hobby).map((hobby,index) => <li key={index}>{hobby}</li>)}
                      <li>{record.phone_no}</li>
                    </div>
                  ))}
                </ul>
              </Modal>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default UserDetails;
