import React from 'react'

import {
  Form,
  Input,
  Select,
} from 'formsy-react-components';

import axios from 'axios';

import {
  Redirect,
} from 'react-router-dom';

import auth from '../auth'

import {
  Alert
} from 'reactstrap';

export default class DepositForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      createdSuccesfully: false,
      errors: null
    }
  }
  submitForm(data) {
    console.log("submitForm")
    console.log(data)

    axios({
        method: this.props.method,
        url: this.props.url,
        headers: auth.getAuthHeaders(),
        data: data
      })
      .then(this.onSubmitSuccess.bind(this))
      .catch(this.onSubmitError.bind(this));
  }

  onSubmitSuccess(responce) {
    console.log("onSubmitSuccess")
    console.log(responce)
    this.setState({
      createdSuccesfully: true
    })
  }

  onSubmitError(error) {
    console.log("onSubmitError")
    console.log(error.response)
    console.log(error.response.data.message)

    if (error.response) {
      this.setState({
        errors: error.response.data.message
      })
    }
  }

  render() {
    console.log("UserForm render()")

    if (this.state.createdSuccesfully) {
      return <Redirect to={ { pathname: "/users" } }/>
    }

    let errors = null;
    if (this.state.errors != null) {
      errors = <Alert color="danger">
                <p>{this.state.errors}</p>
              </Alert>
    }

    const roleOptions = [{
      value: 'user',
      label: 'User'
    }, {
      value: 'manager',
      label: 'Manager'
    }, {
      value: 'admin',
      label: 'Admin'
    }]

    return <Form onSubmit={this.submitForm.bind(this)}>
            { errors }
            <Input
                name="name"
                label="Name"
                required
                value={this.props.data.name}
            />

            <Input
                name="email"
                label="Email"
                required
                value={this.props.data.email}
            />

            <Input
                name="password"
                label="Password"
                type="password"
                required
                value={this.props.data.password}
            />

            <Select
                name="role"
                label="Role"
                value={this.props.data.role}
                options={roleOptions}
                required
            />

            <input className="btn btn-primary" formNoValidate={true} type="submit" defaultValue="Submit" />
        </Form>
  }
}