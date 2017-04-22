import React from 'react'

import {
  Form,
  Input
} from 'formsy-react-components';

import axios from 'axios';

import {
  Redirect,
} from 'react-router-dom';

import auth from '../auth'

import moment from 'moment'

import {
  Alert
} from 'reactstrap';

import Formsy from 'formsy-react';

Formsy.addValidationRule('isLessThan100', (values, value) => {
  return value < 100
})

Formsy.addValidationRule('beforeEndDate', (values, value) => {
  return moment(value).diff(values.end_date, 'days') < 0
})

Formsy.addValidationRule('beforeStartDate', (values, value) => {
  return moment(value).diff(values.start_date, 'days') > 0
})

export default class DepositForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      createdSuccesfully: false,
      errors: null
    }
  }
  submitForm(data) {
    console.log("submitForm")
    console.log(data)

    data.amount = parseInt(data.amount)
    data.interest = parseFloat(data.interest)
    data.taxes = parseFloat(data.taxes)

    data.start_date = this.toTime(data.start_date)
    data.end_date = this.toTime(data.end_date)

    axios({
        method: this.props.method,
        url: this.props.url,
        headers: auth.getAuthHeaders(),
        data: data
      })
      .then(this.onSubmitSuccess.bind(this))
      .catch(this.onSubmitError.bind(this));
  }

  onSubmitSuccess(responce) {
    console.log("onSubmitSuccess")
    this.setState({
      createdSuccesfully: true
    })
  }

  onSubmitError(error) {
    console.log("onSubmitError")
    console.log(error.response)
    console.log(error.response.data.message)

    if (error.response) {
      this.setState({
        errors: error.response.data.message
      })
    }
  }

  toTime(date) {
    return moment(date).format()
  }
  enableSubmit() {
    this.setState({
      canSubmit: true
    })
  }
  disableSubmit() {
    this.setState({
      canSubmit: false
    })
  }

  render() {
    console.log("DepositEditForm render()")

    const toDate = (time) => {
      return moment(time).format('YYYY-MM-DD')
    }

    if (this.state.createdSuccesfully) {
      return <Redirect to={ { pathname: "/deposits" } }/>
    }

    let errors = null;
    if (this.state.errors != null) {
      errors = <Alert color="danger">
                <p>{this.state.errors}</p>
              </Alert>
    }

    return <Form onSubmit={this.submitForm.bind(this)} onValid={this.enableSubmit.bind(this)} onInvalid={this.disableSubmit.bind(this)} >
            { errors }
              <Input
                name="bank_name"
                label="Bank Name"
                value={this.props.data.bank_name}
                required
            />
            <Input
                name="account_number"
                label="Account Number"
                value={this.props.data.account_number}
                required
            />
            <Input
                name="amount"
                label="Amount"
                type="number"
                value={this.props.data.amount}
                addonAfter={"$"}
                validations="isNumeric"
                validationErrors={{
                      beforeEndDate: 'Should be a number'
                  }}
                required
            />
            <Input
                  name="start_date"
                  label="Start Date"
                  type="date"
                  value={toDate(this.props.data.start_date)}
                  placeholder="This is a date input."
                  required
                  validations="beforeEndDate"
                  validationErrors={{
                      beforeEndDate: 'Should be before End Date'
                  }}
              />
              <Input
                  name="end_date"
                  value={toDate(this.props.data.end_date)}
                  label="End Date"
                  type="date"
                  placeholder="This is a date input."
                  validations="beforeStartDate"
                  validationErrors={{
                      beforeStartDate: 'Should be after StartDate'
                  }}
                  required
              />
              <Input
                name="interest"
                value={this.props.data.interest}
                label="Interest"
                type="number"
                addonAfter={"%"}
                required
            />
            <Input
                name="taxes"
                label="Taxes"
                value={this.props.data.taxes}
                type="number"
                addonAfter={"%"}
                validations="isLessThan100"
                validationErrors={{
                    isLessThan100: 'Should be less than 100'
                }}
                required

            />

            <input disabled={!this.state.canSubmit} className="btn btn-primary" type="submit" defaultValue="Submit" />
        </Form>
  }
}