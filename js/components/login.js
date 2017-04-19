import React from 'react'
import ReactDOM from 'react-dom'

import {
  Redirect,
  Link
} from 'react-router-dom';

import {
  Form,
  Input
} from 'formsy-react-components';

import auth from '../auth';

import {
  Alert
} from 'reactstrap';

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: null,
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
    }, (error) => {
      console.log(error)
      console.log(error.response.data.message)

      return this.setState({
        errors: error.response.data.message
      })

    })
  }

  render() {
    console.log('Login');

    const {
      from
    } = this.props.location.state || {
      from: {
        pathname: '/deposits'
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

    let errors = null;
    if (this.state.errors != null) {
      errors = <Alert color="danger">
                <p>{this.state.errors}</p>
              </Alert>
    }

    return <Form onSubmit={this.onSubmit.bind(this)}>
              { errors }
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