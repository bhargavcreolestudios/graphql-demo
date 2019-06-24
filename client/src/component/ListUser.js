import React, { Component } from "react";

import * as Yup from "yup";
import { Formik } from "formik";
import gql from "graphql-tag";
import moment from "moment";
import { Query, Mutation, withApollo } from "react-apollo";
import {
  Table,
  Button,
  Modal,
  Input,
  Icon,
  DatePicker,
  Checkbox,
  Radio
} from "antd";
import AddUser from "./AddUser";
import UserDetails from "./UserDetails";
export class ListUser extends Component {
  state = {
    filteredInfo: null,
    sortedInfo: null,
    visible: false,
    record: {},
    deleteModal: false,
    deleteId: null,
    detailId: null,
    DetailsFlag: null
  };

  showModal = record => {
    console.log(record.user_details[0], "recordrecord");
    this.setState({
      visible: true,
      record: record.user_details[0]
    });
  };

  handleChange = (pagination, filters, sorter) => {
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter
    });
  };

  handleCancel = () => {
    this.setState({ visible: false, record: {} });
  };
  handleOk = () => {};
  clearAll = () => {
    this.setState({
      filteredInfo: null,
      sortedInfo: null
    });
  };
  edit = record => {
    /* Using the query as the props without JSX */
    const { client } = this.props;
    let res = client
      .query({
        query: this.List_UserDetails,
        variables: { user_id: record.id }
      })
      .then(res => {
        if (!res.loading) {
          this.showModal(res.data);
        }
      });
  };
  delete = id => {
    this.setState({
      deleteModal: true,
      deleteId: id
    });
  };
  handleDelete = (callback, response) => {
    callback({
      variables: {
        id: this.state.deleteId
      }
    });
    this.setState({
      deleteId: null,
      deleteModal: false
    });
  };
  handleCancelDelete = () => {
    this.setState({
      deleteModal: false,
      deleteId: null
    });
  };
  setDetail = () => {
    this.setState(prevState => {
      return {
        DetailsFlag: !prevState
      };
    });
  };
  Options = ["Playing", "Gaming", "Reading", "Watching TV"];

  changeRecords = response => {};
  List_User = gql`
    query LisitingQuery {
      user {
        id
        firstName
        lastName
        email
        dateofbirth
      }
    }
  `;
  delete_User = gql`
    mutation deleteUser($id: Int!) {
      deleteUser(id: $id) {
        id
        firstName
        lastName
        email
        dateofbirth
      }
    }
  `;
  /* 


      

  */
  update_User = gql`
    mutation updateUser(
      $id: Int!
      $firstName: String!
      $lastName: String!
      $email: String!
      $dateofbirth: String!
      $gender: String!
      $hobby: String!
      $phone_no: String!
      $defaultAddress: Int!
      $address: String!

    ) {
      updateUser(
        id: $id
        firstName: $firstName
        lastName: $lastName
        email: $email
        dateofbirth: $dateofbirth
        gender: $gender
        hobby: $hobby
        phone_no: $phone_no
        defaultAddress: $defaultAddress
        address: $address
      ) {
        id
        firstName
        lastName
        email
        dateofbirth
      }
    }
  `;
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
        address {
          defaultAddress
          address
        }
      }
    }
  `;
  updateUserSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, "Too Short!")
      .max(30, "Too Long!")
      .required("Required"),
    lastName: Yup.string()
      .min(2, "Too Short!")
      .max(30, "Too Long!")
      .required("Required"),
    email: Yup.string()
      .email("Invalid Email")
      .required("Required"),
    dateOfBirth: Yup.date().required(),
    gender: Yup.string().required("Required"),
    hobby: Yup.array().required("Required"),
    phone_no: Yup.string()
      .min(6)
      .required("Required"),
    dAddress: Yup.string() 
  });

  handleUserDetails = record => {
    this.setState({
      detailId: record.id,
      DetailsFlag: true
    });
  };
  render() {
    let { sortedInfo, filteredInfo } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};
    const columns = [
      {
        title: "#",
        dataIndex: "key"
      },
      {
        title: "First Name",
        dataIndex: "firstName",
        sorter: (a, b) => {
          if (a.firstName.toUpperCase() > b.firstName.toUpperCase()) {
            return -1;
          }
          if (a.firstName.toUpperCase() < b.firstName.toUpperCase()) {
            return 1;
          }
          return 0;
        },
        sortOrder: sortedInfo.columnKey === "firstName" && sortedInfo.order
      },
      {
        title: "Last Name",
        dataIndex: "lastName",
        sorter: (a, b) => {
          if (a.lastName.toUpperCase() > b.lastName.toUpperCase()) {
            return -1;
          }
          if (a.lastName.toUpperCase() < b.lastName.toUpperCase()) {
            return 1;
          }
          return 0;
        },
        sortOrder: sortedInfo.columnKey === "lastName" && sortedInfo.order
      },
      {
        title: "Email",
        dataIndex: "email",
        sorter: (a, b) => {
          if (a.email.toUpperCase() > b.email.toUpperCase()) {
            return -1;
          }
          if (a.email.toUpperCase() < b.email.toUpperCase()) {
            return 1;
          }
          return 0;
        },
        sortOrder: sortedInfo.columnKey === "email" && sortedInfo.order
      },
      {
        title: "DOB",
        dataIndex: "dateofbirth",
        sorter: (a, b) => {
          if (a.dateofbirth > b.dateofbirth) {
            return -1;
          }
          if (a.dateofbirth < b.dateofbirth) {
            return 1;
          }
          return 0;
        },
        sortOrder: sortedInfo.columnKey === "dateofbirth" && sortedInfo.order
      },
      {
        title: "Action",
        key: "action",
        render: (text, record) => (
          <span>
            <Icon
              onClick={(records, rowIndex) => {
                this.edit(record);
              }}
              type="edit"
              theme="filled"
              className="edit-icon"
            />
            <Icon
              onClick={(records, rowIndex) => {
                this.delete(record.id);
              }}
              type="delete"
              theme="filled"
              className="delete-icon"
            />
            <Icon
              onClick={(records, rowIndex) => {
                this.handleUserDetails(record);
              }}
              type="read"
              className="read-icon"
              theme="filled"
            />
          </span>
        )
      }
    ];
    return (
      <div>
        <Query query={this.List_User}>
          {({ loading, error, data }) => {
            if (loading) return <p>Loading</p>;
            if (error) return <p>Error</p>;
            else {
              data = data.user.map((record, index) => {
                return {
                  ...record,
                  key: index + 1
                };
              });
              return (
                <Table
                  className="table-content"
                  columns={columns}
                  dataSource={data}
                  onChange={this.handleChange}
                  pagination={{ defaultPageSize: 10, showQuickJumper: true }}
                  ref={refrn => (this.refTable = refrn)}
                />
              );
            }
          }}
        </Query>
        {this.state.visible ? (
          <Mutation
            mutation={this.update_User}
            refetchQueries={() => {
              return [
                {
                  query: this.List_User
                }
              ];
            }}
          >
            {(updateUser, response) => {
              return (
                <Modal
                  title="Update User"
                  visible={this.state.visible}
                  onOk={this.handleOk}
                  onCancel={this.handleCancel}
                  footer={null}
                >
                  <Formik
                    initialValues={{
                      firstName: this.state.record.user[0].firstName,
                      lastName: this.state.record.user[0].lastName,
                      email: this.state.record.user[0].email,
                       dateOfBirth: moment(
                        this.state.record.user[0].dateofbirth
                      ),
                      gender: this.state.record.gender,
                      hobby: JSON.parse(this.state.record.hobby),
                      phone_no: this.state.record.phone_no,
                      dAddress: this.state.record.address[0].address 
                    }}
                    validationSchema={this.updateUserSchema}
                    onSubmit={(values, { setSubmitting }) => {
                       let date = values.dateOfBirth.format(
                        "YYYY-MM-DD hh:mm:ss"
                      );
                      let phone_no = String(values.phone_no);
                      let hobby = JSON.stringify(values.hobby);
                      let defaultAddress = 1;
                      if (!values.dAddress) {
                        defaultAddress = 0;
                      }
                      console.log(values,"valuesvaluesvalues"); 

                      updateUser({
                        variables: {
                          id: this.state.record.user[0].id,
                          firstName: values.firstName,
                          lastName: values.lastName,
                          email: values.email,
                           dateofbirth: date,
                          gender: values.gender,
                          phone_no: phone_no,
                          hobby: hobby,
                          defaultAddress: defaultAddress,
                          address: values.dAddress 
                        }
                      });
                      this.changeRecords(response);
                      this.handleCancel();
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
                      <form className="add-user-form" onSubmit={handleSubmit}>
                        <Input
                          placeholder="Enter your Firstname"
                          type="text"
                          name="firstName"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.firstName}
                          className={
                            errors.firstName &&
                            touched.firstName &&
                            errors.firstName
                              ? "has-error"
                              : null
                          }
                        />
                        <Input
                          placeholder="Enter your Lastname"
                          type="text"
                          name="lastName"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.lastName}
                          className={
                            errors.lastName &&
                            touched.lastName &&
                            errors.lastName
                              ? "has-error"
                              : null
                          }
                        />

                        <Input
                          placeholder="Enter your email"
                          type="text"
                          name="lastName"
                          onChange={handleChange}
                          disabled={true}
                          onBlur={handleBlur}
                          value={values.email}
                        />
                        {errors.email && touched.email && errors.email}

                        <Input
                          placeholder="Enter Default Address"
                          type="text"
                          name="dAddress"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.dAddress}
                          className={
                            errors.dAddress &&
                            touched.dAddress &&
                            errors.dAddress
                              ? "has-error"
                              : null
                          }
                        />
                        <DatePicker
                          allowClear={false}
                          onChange={date => {
                            setFieldValue("dateOfBirth", moment(date));
                          }}
                          value={values.dateOfBirth}
                          name="dateOfBirth"
                          className={
                            errors.dateOfBirth &&
                            touched.dateOfBirth &&
                            errors.dateOfBirth
                              ? "has-error"
                              : null
                          }
                        />
                        <div className="m-2">
                          <span
                            className={
                              errors.gender && touched.gender && errors.gender
                                ? "m-2 has-error-text"
                                : "m-2"
                            }
                          >
                            Gender
                          </span>
                          <Radio.Group
                            disabled={true}
                            onChange={data => {
                              setFieldValue("gender", data.target.value);
                            }}
                            value={values.gender}
                          >
                            <Radio value={"Male"}>Male</Radio>
                            <Radio value={"Female"}>Female</Radio>
                          </Radio.Group>
                        </div>
                        <div>
                          <Input
                            placeholder="Enter your phone number"
                            type="text"
                            name="phone_no"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.phone_no}
                            className={
                              errors.phone_no &&
                              touched.phone_no &&
                              errors.phone_no
                                ? "has-error"
                                : null
                            }
                          />
                        </div>
                        <div className="m-3">
                          <span
                            className={
                              errors.hobby && touched.hobby && errors.hobby
                                ? "p-2 has-error-text"
                                : "p-2"
                            }
                          >
                            Hobby
                          </span>
                          <Checkbox.Group
                            options={this.Options}
                            value={values.hobby}
                            onChange={data => {
                              setFieldValue("hobby", data);
                            }}
                          />
                        </div>
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
              );
            }}
          </Mutation>
        ) : null}

        {this.state.deleteModal ? (
          <Mutation
            mutation={this.delete_User}
            update={(cache, { data }) => {
              cache.writeQuery({
                query: this.List_User,
                data: { user: data.deleteUser }
              });
            }}
          >
            {(deleteUser, response) => {
              this.handleDelete(deleteUser, response);
              return null;
            }}
          </Mutation>
        ) : null}
        {this.state.DetailsFlag && (
          <UserDetails
            flag={this.state.DetailsFlag}
            setDetailFlag={this.setDetail}
            detailId={this.state.detailId}
          />
        )}
      </div>
    );
  }
}

export default withApollo(ListUser);
