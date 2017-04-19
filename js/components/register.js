import React from 'react'

import {
  Redirect
} from 'react-router-dom';

import {
  Form,
  Input
} from 'formsy-react-components';

import auth from '../auth';

import axios from 'axios'

import {
  Alert
} from 'reactstrap';

export default class Register extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: null,
      redirectToReferrer: false
    }
  }

  onSubmit(data) {
    axios.post("auth/register", data)
      .then(this.onSuccess.bind(this))
      .catch(this.onError.bind(this));
  }

  onSuccess(response) {
    console.log(response)
    console.log("onSuccess")
      // TODO: show message here

    this.setState({
      redirectToReferrer: true
    })
  }

  onError(error) {
    console.log("onError")
    console.log(error)
    console.log(error.response.data)

    this.setState({
      errors: error.response.data.message
    })
  }

  render() {
    console.log('Register');

    if (auth.isAuthenticated()) {
      return <p>You are already logged in.</p>
    }

    if (this.state.redirectToReferrer) {
      return <Redirect to={{ pathname: '/login' }}/>
    }

    let errors = null;

    if (this.state.errors != null) {
      errors = <Alert color="danger">
                <p>{this.state.errors}</p>
              </Alert>
    }

    return <Form onSubmit={this.onSubmit.bind(this)}>
              REGISTER
              { errors }
              <Input
                name="name"
                label="Name"
              />
              <Input
                name="email"
                label="Email"
              />

              <Input
                name="password"
                label="Password"
                type="password"
              />

               <input className="btn btn-primary" formNoValidate={true} type="submit" defaultValue="Submit" />
        </Form>
  }
}