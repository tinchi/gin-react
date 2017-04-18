import React from 'react'

import {
  Redirect,
} from 'react-router-dom';

import auth from '../auth';

export default class Logout extends React.Component {
  render() {
    console.log('Logout');

    auth.logout()

    return <Redirect to = {
      {
        pathname: '/'
      }
    }
    />
  }
}