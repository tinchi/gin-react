import {
  Link
} from 'react-router'

import React from 'react'

import {
  Form,
  Input
} from 'formsy-react-components';

import axios from 'axios';
import qs from 'qs';
import auth from '../auth';

import {
  Redirect
} from 'react-router-dom';

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: false,
      redirectToReferrer: false
    }
  }

  onSubmit(data) {
    const email = data.username
    const password = data.password
    console.log("onSubmit")

    auth.login(email, password, (loggedIn) => {
      console.log('Login callback')

      return this.setState({
        redirectToReferrer: true
      })
      const {
        location
      } = this.props

    });
  }

  render() {
    console.log('Login');

    const {
      from
    } = this.props.location.state || {
      from: {
        pathname: '/'
      }
    }
    const {
      redirectToReferrer
    } = this.state

    console.log(from)

    if (redirectToReferrer) {
      return (
        <Redirect to={from}/>
      )
    }

    return <Form onSubmit={this.onSubmit.bind(this)}>
              <Input
                name="username"
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