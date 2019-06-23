import React, { Component } from "react";
import { Radio, Checkbox } from "antd";
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
    this.refForm.state.values = {
      // firstName: "",
      // lastName: "",
      // email: "",
      // gender: "",
      // hobby: [],
      // phone_no: "",
      // dateOfBirth: null
    };
    this.refForm.state.errors = {};
    this.setState({
      visible: false
    });
  };

  Add_User = gql`
    mutation addUser(
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
      addUser(
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
    dateOfBirth: Yup.date().required(),
    gender: Yup.string().required("Required"),
    hobby: Yup.array().required("Required"),
    phone_no: Yup.number()
      .min(6)
      .required("Required"),
    dAddress: Yup.string()
  });

  Options = ["Playing", "Gaming", "Reading", "Watching TV"];
  render() {
    return (
      <Mutation
        mutation={this.Add_User}
        refetchQueries={() => {
          return [
            {
              query: this.List_User
            }
          ];
        }}
      >
        {(addUser, { data }) => (
          <div className="add-user">
            <Button onClick={this.showModal}>ADD USER</Button>
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
                  gender: "",
                  hobby: [],
                  phone_no: "",
                  dateOfBirth: null,
                  dAddress:""
                }}
                validationSchema={this.newUserSchema}
                onSubmit={(values, { setSubmitting }) => {
                  let date = values.dateOfBirth.format("YYYY-MM-DD hh:mm:ss");
                  let phone_no = String(values.phone_no);
                  let hobby = JSON.stringify(values.hobby);

                  addUser({
                    variables: {
                      firstName: values.firstName,
                      lastName: values.lastName,
                      email: values.email,
                      dateofbirth: date,
                      gender: values.gender,
                      phone_no: phone_no,
                      hobby: hobby,
                      defaultAddress:0,
                      address: values.dAddress
                    }
                  });
                  this.handleCancel();
                }}
                ref={refr => (this.refForm = refr)}
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
                        errors.lastName && touched.lastName && errors.lastName
                          ? "has-error"
                          : null
                      }
                    />
                    <Input
                      placeholder="Enter your Email"
                      type="email"
                      name="email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                      className={
                        errors.email && touched.email && errors.email
                          ? "has-error"
                          : null
                      }
                    />
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
                        type="number"
                        name="phone_no"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.phone_no}
                        className={
                          errors.phone_no && touched.phone_no && errors.phone_no
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
                        defaultValue={["Apple"]}
                        onChange={data => {
                          console.log(data);
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
          </div>
        )}
      </Mutation>
    );
  }
}

export default AddUser;
