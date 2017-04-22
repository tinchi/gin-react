import React from 'react'

import {
  Link
} from 'react-router'

import {
  Alert,
  Button,
  Col
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

  render() {
    return <Form onSubmit={this.filter.bind(this)}>
        <Input name="bank_name" label="Bank Name" value=""/>

        <Input name="from" label="Starts From" type="date"/>
        <Input name="to" label="To" type="date"/>

        <Input name="amount_from" label="Min. amount" value="" />
        <Input name="amount_to" label="Max. amount" value="" />

        <Col sm={10}>
            <input className="btn btn-primary" formNoValidate={true} type="submit" defaultValue="Search" />
        </Col>
      </Form>
  }
}