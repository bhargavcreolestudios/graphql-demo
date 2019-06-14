import React, { Component } from "react";

import * as Yup from "yup";
import { Formik } from "formik";
import gql from "graphql-tag";
import moment from 'moment'
import { Query, Mutation } from "react-apollo";
import { Table, Button, Modal, Input, Icon, DatePicker } from "antd";

export class ListUser extends Component {
  state = {
    filteredInfo: null,
    sortedInfo: null,
    visible: false,
    record: {}
  };

  showModal = (record) => {
    this.setState({
      visible: true,
      record
    });
  };

  handleChange = (pagination, filters, sorter) => {
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter
    });
  };

  handleCancel = () => {
    this.setState({visible: false, record: {}})
  }
  handleOk = () => {

  }
  clearAll = () => {
    this.setState({
      filteredInfo: null,
      sortedInfo: null
    });
  };
  handleRow (record) {
    this.showModal(record)
    console.log(record)

  }

   List_User = gql`
   query LisitingQuery{
    user{
      id,
      firstName,
      lastName,
      email
      dateofbirth
    }
  }
`;

    update_User = gql`
    mutation updateUser($id: Int!, $firstName: String!) {
        updateUser(id: $id, firstName: $firstName){
          id
        }
      }
    `;
    updateUserSchema = Yup.object().shape({
      firstName: Yup.string()
        .min(2, "Too Short!")
        .max(30, "Too Long!")
        .required("Required"),
      
    });
  render() {
    let { sortedInfo, filteredInfo } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};
    const columns = [
        {
            title: "ID",
            dataIndex: "id",
          },
      {
        title: "FirstName",
        dataIndex: "firstName",
        sorter: (a, b) => a.firstName.length - b.firstName.length,
        sortOrder: sortedInfo.columnKey === "firstName" && sortedInfo.order
      },
      {
        title: "LastName",
        dataIndex: "lastName",
        sorter: (a, b) => a.lastName.length  - b.lastName.length ,
        sortOrder: sortedInfo.columnKey === "lastName" && sortedInfo.order
      },
      {
        title: "Email",
        dataIndex: "email",
      },
    //   {
    //     title: "DOB",
    //     dataIndex: "dateofbirth",
    //     sorter: (a, b) => a.dateofbirth - b.dateofbirth,
    //     sortOrder: sortedInfo.columnKey === "dateofbirth" && sortedInfo.order
    //   }
    ];
    return (
      <div>
        <Query query={this.List_User}>
        {({ loading, error, data }) => {
            if (loading) return <p>Loading</p>;
            if (error) return <p>Error</p>;
            else {
                return (
                    <Table
                    onRow={(record, rowIndex) => {
                        return {
                          onClick: event => {this.handleRow(record)}, // click row
                        };
                      }}
                        columns={columns}
                        dataSource={data.user}
                        onChange={this.handleChange}
                        pagination={false}
                        />
                )}}
        }
        </Query>
        {this.state.visible ? 
        <Mutation mutation={this.update_User}>
        {(updateUser, { data }) => {
          return(  
            <Modal
          title="Update User"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
        >
          <Formik
                initialValues={{
                  firstName: this.state.record.firstName,
                }}
                validationSchema={this.updateUserSchema}
                onSubmit={(values, { setSubmitting }) => {
                  updateUser({
                    variables: {
                      id: this.state.record.id,
                      firstName: values.firstName,
                    }
                  });
                  this.handleCancel()
                }}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  setFieldValue,
                  handleBlur,
                  handleSubmit,
                  isSubmitting
                  /* and other goodies */
                }) => (
                  <form onSubmit={handleSubmit}>
                    <Input
                      placeholder="Enter your Firstname"
                      prefix={
                        <Icon
                          type="user"
                          style={{ color: "rgba(0,0,0,.25)" }}
                        />
                      }
                      type="text"
                      name="firstName"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.firstName}
                    />
                    {errors.firstName && touched.firstName && errors.firstName}
                    
                    <button
                      type="submit"
                      className="ant-btn ant-btn-primary addUser-button"
                    >
                      Submit
                    </button>
                  </form>
                )}
              </Formik>
        </Modal>

        )}}
        </Mutation>    
        :null}
      </div>
    );
  }
}

export default ListUser;

{/* <Table
columns={columns}
dataSource={data}
onChange={this.handleChange}
/>  */}


{/* <table>
                        <thead>
                            <tr>
                                <td>id</td>
                                <td>FirstName</td>
                                <td>LastName</td>
                                <td>FirstName</td>
                                <td>Email</td>
                                <td>DateOfBirth</td>
                            </tr>
                            {
                                data.user.map((user_info,ind) => {
                                    return(
                                        <tr key={ind}>
                                            <td>{user_info.id}</td>
                                            <td>{user_info.firstName}</td>
                                            <td>{user_info.lastName}</td>
                                            <td>{user_info.email}</td>
                                            <td>{moment.unix(user_info.dateofbirth).format("YY-MM-DD")}</td>
                                        </tr>
                                    )
                                })
                            }
                        </thead>
                    </table> */}