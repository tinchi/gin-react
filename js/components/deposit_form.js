import React from 'react'

import {
  Form,
  Input
} from 'formsy-react-components';

import axios from 'axios';
import qs from 'qs';

import {
  Redirect,
} from 'react-router-dom';

import auth from '../auth'

import moment from 'moment'

import {
  Alert
} from 'reactstrap';

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

    data.ammount = parseInt(data.ammount)
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

    return <Form onSubmit={this.submitForm.bind(this)}>
            { errors }
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
                  value={toDate(this.props.data.start_date)}
                  placeholder="This is a date input."
                  required
              />
              <Input
                  name="end_date"
                  value={toDate(this.props.data.end_date)}
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