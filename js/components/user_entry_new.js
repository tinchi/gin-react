import React from 'react'

import UserForm from './user_form'

export default class UserEntryNew extends React.Component {
  render() {
    console.log('UserEntryNew');

    return <UserForm
            url={ "/v1/users" }
            method={"post"}
            data={{role: "user"}}/>
  }
}