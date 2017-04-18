import React from 'react'

import DepositForm from './deposit_form'

import axios from 'axios';
import auth from '../auth';

export default class DepositEntryEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {}
    };
  }

  componentDidMount() {
    axios.get(this.depositUrl(), {
        "headers": auth.getAuthHeaders()
      })
      .then(this.onGetSuccess.bind(this))
      .catch(this.onGetError.bind(this));
  }

  onGetSuccess(responce) {
    this.setState({
      data: responce.data.deposit
    });
  }

  onGetError() {
    console.log("TODO: implement onGetError()")
  }

  depositUrl() {
    return `/v1/deposits/${this.props.match.params.id}`
  }

  render() {
    console.log('DepositEntryEdit');

    return <DepositForm
            url={ this.depositUrl() }
            method={"put"}
            data={this.state.data}/>
  }
}