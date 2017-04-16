import React from 'react'

import DepositForm from './deposit_form'

export default class DepositEntryNew extends React.Component {
  render() {
    console.log('DepositEntryNew');

    return <DepositForm
            url={ "/v1/deposits" }
            method={"post"}
            data={ [] }/>
  }
}