import React, { Component } from "react";

import * as Yup from "yup";
import { Formik } from "formik";
import moment from "moment";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { Modal, Button, Input, Icon, DatePicker } from "antd";
export class AddUser extends Component {
  state = { visible: false };

  showModal = () => {
    this.setState({
      visible: true
    });
  };


  handleCancel = e => {
    this.Formik = {
      firstName: "",
      lastName: "",
      email: "",
      dateOfBirth: moment()
    }
    this.setState({
      visible: false
    });
  };
  handleDate(e) {
    console.log(e.target.value);
  }
  newUserSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, "Too Short!")
      .max(30, "Too Long!")
      .required("Required"),
    lastName: Yup.string()
      .min(2, "Too Short!")
      .max(30, "Too Long!")
      .required("Required"),
    email: Yup.string()
      .email("Invalid email")
      .required("Required"),
    dateOfBirth: Yup.date().required()
  });
  Add_User = gql`
  mutation addUser($firstName: String!, $lastName: String!, $email: String!, $dateofbirth: String!) {
    addUser(firstName: $firstName,lastName: $lastName,email: $email ,dateofbirth: $dateofbirth){
      id
    }
  }
  `;

  render() {
    return (
      <Mutation mutation={this.Add_User}>
        {(addUser, { data }) => (
          <div>
            <Button onClick={this.showModal}>
              Add User
            </Button>
            <Modal
              title="Add User"
              visible={this.state.visible}
              footer={null}
              onCancel={this.handleCancel}
            >
              <Formik
                initialValues={{
                  firstName: "",
                  lastName: "",
                  email: "",
                  dateOfBirth: moment()
                }}
                validationSchema={this.newUserSchema}
                onSubmit={(values, { setSubmitting }) => {
                  let date = values.dateOfBirth.format("YYYY-MM-DD hh:mm:ss");
                  addUser({
                    variables: {
                      firstName: values.firstName,
                      lastName: values.lastName,
                      email: values.email,
                      dateofbirth: date
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
                    <Input
                      placeholder="Enter your Lastname"
                      prefix={
                        <Icon
                          type="user"
                          style={{ color: "rgba(0,0,0,.25)" }}
                        />
                      }
                      type="text"
                      name="lastName"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.lastName}
                    />
                    {errors.lastName && touched.lastName && errors.lastName}
                    <Input
                      placeholder="Enter your Email"
                      type="email"
                      name="email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                    />
                    {errors.email && touched.email && errors.email}
                    <DatePicker
                    allowClear={false}
                      onChange={date => {
                        console.log(date);
                        setFieldValue("dateOfBirth", moment(date));
                      }}
                      value={values.dateOfBirth}
                      name="dateOfBirth"
                    />

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
          </div>
        )}
      </Mutation>
    );
  }
}

export default AddUser;
