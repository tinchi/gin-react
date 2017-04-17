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

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: false
    }

  }

  onSubmit(data) {
    const email = data.username
    const password = data.password
    console.log("onSubmit")
    axios.post('/login', data)
      .then(this.onLoginSuccess.bind(this))
      .catch(this.onLoginError.bind(this));

    // auth.login(email, password, (loggedIn) => {
    //   if (!loggedIn)
    //     return this.setState({
    //       error: true
    //     })

    //   const {
    //     location
    //   } = this.props

    //   if (location.state && location.state.nextPathname) {
    //     common.openPath(location.state.nextPathname)
    //   } else {
    //     common.openPath('/')
    //   }
    // })
  }
  onLoginSuccess(responce) {
    console.log("onLoginSuccess")
    console.log(responce.data)
  }
  onLoginError(error) {
    console.log("onLoginError")
    console.log(error.response);
  }

  render() {
    console.log('Login');

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