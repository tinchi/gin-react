import React from 'react'

import {
  Link
} from 'react-router'

import {
  Alert,
  Button
} from 'reactstrap';

import {
  Form,
  Input
} from 'formsy-react-components';

export default class DepositFilter extends React.Component {
  filter(data) {
    if (data.from == undefined) {
      delete data.from
    }

    if (data.to == undefined) {
      delete data.to
    }

    this.props.onFilterChanged(data);
  }

  clear() {
    this.refs.from.value = this.refs.to.value = "";
    this.filter()
  }

  render() {
    return <Form className="form-inline" onSubmit={this.filter.bind(this)}>
        <Input name="from" label="From" type="date"/>
        <Input name="to" label="To" type="date"/>

        <Input name="amount_from" label="Amount" value="0" />
        <Input name="amount_to" label="To" value="1000" />

        <input className="btn btn-primary" formNoValidate={true} type="submit" defaultValue="Search" />

        {/*<Button color="info" onClick={this.filter.bind(this)}>Search</Button>{' '}*/}
        {/*<Button color="info" onClick={this.clear.bind(this)}>Clear</Button>{' '}*/}
      </Form>
  }
}