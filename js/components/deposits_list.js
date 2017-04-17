import React from 'react'

import ListView from '../list_view'

import {
  Link
} from 'react-router-dom'

import {
  Button
} from 'reactstrap';

class DepositRow extends React.Component {
  delete(event) {
    event.preventDefault();
    this.props.onDelete(this.props.item.id);
  }

  render() {
    return <tr key={this.props.item.id} className="list-row">
        <td>
          {this.props.item.bank_name}
        </td>
        <td>
          <Link to={'/deposits/' + this.props.item.id + '/edit'}>{this.props.item.account_number}</Link>
        </td>
        <td>
          {this.props.item.ammount}
        </td>
        <td>
          {this.props.item.start_date}
        </td>
        <td>
          {this.props.item.end_date}
        </td>
        <td>
          {this.props.item.interest}
        </td>
        <td>
          {this.props.item.taxes}
        </td>
        <td>
          <Button color="danger" onClick={this.delete.bind(this)}>remove</Button>{' '}
        </td>
      </tr>
  }
}

export default class DepositsList extends React.Component {
  render() {
    console.log('DepositsList');

    return <ListView
              title='Deposit List'
              url='v1/deposits'
              collection_name='deposits'
              columns={['Bank Name', 'Account Number', 'Ammount', 'Start Date', 'End Date', 'Interest', 'Taxes', ""]}
              rowClass={DepositRow}
            />;
  }
}