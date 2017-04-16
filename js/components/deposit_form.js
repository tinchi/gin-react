import React from 'react'

import Formsy from 'formsy-react';
import {
  Form,
  Input
} from 'formsy-react-components';

import axios from 'axios';
import qs from 'qs';

import {
  browserHistory
} from 'react-router'

export default class DepositForm extends React.Component {
  submitForm(data) {
    console.log("submitForm")

    axios({
        method: this.props.method,
        url: this.props.url,
        data: qs.stringify({
          deposit: data
        })
      })
      .then(this.onSubmitSuccess.bind(this))
      // .catch(this.onSubmitError.bind(this));
  }

  onSubmitSuccess(responce) {
    console.log("onSubmitSuccess")

    window.location = "/deposits"
  }

  onSubmitError() {
    console.log("TODO: implement onSubmitError()")
  }

  render() {
    console.log("DepositEditForm render()")

    return <Form onSubmit={this.submitForm.bind(this)}>
              <Input
                name="bank_name"
                label="Bank Name"
                value={this.props.data.bank_name}
            />
            <Input
                name="account_number"
                label="Account Number"
                value={this.props.data.account_number}
            />
            <Input
                name="ammount"
                label="Ammount"
                type="number"
                value={this.props.data.ammount}
                addonAfter={"$"}
            />
            <Input
                  name="start_date"
                  label="Start Date"
                  type="date"
                  value={this.props.data.start_date}
                  placeholder="This is a date input."
                  required
              />
              <Input
                  name="end_date"
                  value={this.props.data.end_date}
                  label="End Date"
                  type="date"
                  placeholder="This is a date input."
                  required
              />
              <Input
                name="interest"
                value={this.props.data.interest}
                label="Interest"
                type="number"
                addonAfter={"%"}
            />
            <Input
                name="taxes"
                label="Taxes"
                value={this.props.data.taxes}
                type="number"
                addonAfter={"%"}
            />

            <input className="btn btn-primary" formNoValidate={true} type="submit" defaultValue="Submit" />
        </Form>
  }
}