import React from 'react'

import {
  Redirect,
  Link
} from 'react-router-dom';

import {
  Form,
  Input
} from 'formsy-react-components';

import auth from '../auth';

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
    })
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

    if (this.state.redirectToReferrer) {
      return (
        <Redirect to={from}/>
      )
    }

    if (auth.isAuthenticated()) {
      return <p>You are already logged in.</p>
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