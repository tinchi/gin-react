import React from 'react'

import ListView from '../list_view'

import {
  Link
} from 'react-router-dom'

import {
  Button
} from 'reactstrap';

import moment from 'moment'

class DepositRow extends React.Component {
  delete(event) {
    event.preventDefault();
    this.props.onDelete(this.props.item.id);
  }

  formatTime(time) {
    return moment(time).format('LL')
  }

  render() {
    return <tr key={this.props.item.id} className="list-row">
        <td>
          #{this.props.item.id}
        </td>
        <td>
          {this.props.item.bank_name}
        </td>
        <td>
          {this.props.item.account_number}
        </td>
        <td>
          {this.props.item.ammount}
        </td>
        <td>
          {this.formatTime(this.props.item.start_date)}
        </td>
        <td>
          {this.formatTime(this.props.item.end_date)}
        </td>
        <td>
          {this.props.item.interest}
        </td>
        <td>
          {this.props.item.taxes}
        </td>
        <td>
          <Button color="info" onClick={this.delete.bind(this)}><Link to={'/deposits/' + this.props.item.id + '/edit'}>edit</Link></Button>{' '}
        </td>
        <td>
          <Button color="danger" onClick={this.delete.bind(this)}>remove</Button>{' '}
        </td>
      </tr>
  }
}

export default class DepositList extends React.Component {
  render() {
    console.log('DepositList');

    return <ListView
              title='Deposits'
              url='v1/deposits'
              collection_name='deposits'
              columns={["Id", 'Bank Name', 'Account Number', 'Ammount', 'Start Date', 'End Date', 'Interest', 'Taxes', ""]}
              rowClass={DepositRow}
            />;
  }
}