import React from 'react'

import ListView from '../list_view'

import {
  Link
} from 'react-router-dom'

import {
  Form,
  Input
} from 'formsy-react-components';

import axios from 'axios';

import auth from '../auth';

import moment from 'moment'

import {
  Alert
} from 'reactstrap';

class RevenueRow extends React.Component {
  revenueValue(val) {
    let textColor = "text-primary"

    if (val < 0) {
      textColor = "text-danger"
    } else {
      textColor = "text-success"
    }

    return <div className={textColor}>{val}</div>
  }

  render() {
    return <tr key={this.props.item.id} className="list-row">
        <td>
          {this.props.item.bank_name}
        </td>
        <td>
          {this.props.item.account_number}
        </td>
        <td>
          {this.props.item.amount}
        </td>
        <td>
          {this.revenueValue(this.props.item.revenue_amount)}
        </td>
      </tr>
  }
}

// * User can generate a revenue report for a given period, showing the gains and losses from interest and taxes for each deposit. 
// The amount should be green or red if respectively it represents a gain or loss.
//  The report should show the sum of profits and losses at the bottom for that period.

export default class RevenueReport extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      errors: null
    }
  }
  onSubmit(data) {
    console.log("onSubmit")

    axios({
        method: "post",
        url: "/v1/revenue/report",
        headers: auth.getAuthHeaders(),
        data: {
          from_date: moment(data.from).format(),
          to_date: moment(data.to).format()
        }
      })
      .then(this.onSubmitSuccess.bind(this))
      .catch(this.onSubmitError.bind(this));
  }

  onSubmitSuccess(responce) {
    console.log("onSubmitSuccess")
    console.log(responce)
    console.log(responce.data.revenues)

    this.setState({
      items: responce.data.revenues,
      errors: null
    })
  }

  onSubmitError(error) {
    console.log("onSubmitError")
    console.log(error.response)
    console.log(error.response.data)

    if (error.response) {
      this.setState({
        errors: error.response.data.message
      })
    }
  }

  renderHeader(cols) {
    let heads = cols.map((col) => {
      return <td key={cols.indexOf(col)}>{col}</td>
    })

    return (
      <thead>
        <tr>
          { heads }
        </tr>
      </thead>
    );
  }

  render() {
    console.log('RevenueReport');

    let results = null

    if (this.state.items.length > 0) {

      const sumItem = {
        bank_name: "Total Sum",
        revenue_amount: this.state.items.reduce((acc, val) => {
          return acc + val.revenue_amount;
        }, 0)
      }

      let rows = this.state.items.map((row) => {
        return <RevenueRow key={row.id} item={row}/>
      })

      results = <table className="table time-table">
          { this.renderHeader(['Bank Name', 'Account Number', 'Total Amount', 'Revenue']) }
          <tbody>
            { rows }
            <RevenueRow key={"-"} item={sumItem}/>
          </tbody>
        </table>
    }

    const timeNow = moment()

    const form = <Form onSubmit={this.onSubmit.bind(this)}>
        <Input name="from" label="From" type="date" value={timeNow.format('YYYY-MM-DD')}/>
        <Input name="to" label="To" type="date" value={timeNow.add(1, 'months').format('YYYY-MM-DD')}/>

        <input className="btn btn-primary" formNoValidate={true} type="submit" defaultValue="Search" />
      </Form>

    let errors = null;
    if (this.state.errors != null) {
      errors = <Alert color="danger">
                <p>{this.state.errors}</p>
              </Alert>
    }

    return <div>
          { errors }
          { form }
          { results }
          </div>

  }
}