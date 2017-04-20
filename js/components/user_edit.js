import React from 'react'

import UserForm from './user_form'

import axios from 'axios';
import auth from '../auth';

export default class UserEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {}
    };
  }

  componentDidMount() {
    axios.get(this.userUrl(), {
        "headers": auth.getAuthHeaders()
      })
      .then(this.onGetSuccess.bind(this))
      .catch(this.onGetError.bind(this));
  }

  onGetSuccess(responce) {
    this.setState({
      data: responce.data.user
    });
  }

  onGetError() {
    console.log("TODO: implement onGetError()")
  }

  userUrl() {
    return `/v1/users/${this.props.match.params.id}`
  }

  render() {
    console.log('UserEdit');

    return <UserForm
            url={ this.userUrl() }
            method={"put"}
            data={this.state.data}/>
  }
}