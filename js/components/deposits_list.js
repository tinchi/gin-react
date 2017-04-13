import React from 'react'

import ListView from '../list_view'

import {
  Link
} from 'react-router-dom'

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
          <a href="" onClick={this.delete.bind(this)}>
          <span
            className="glyphicon glyphicon-remove hover red"
            aria-hidden="true"></span></a>
        </td>
      </tr>
  }
}

export default class DepositsList extends React.Component {
  render() {
    console.log('DepositsList');

    return <ListView
              title='List'
              url='v1/deposits'
              collection_name='deposits'
              columns={['Bank Name', 'Account Number']}
              rowClass={DepositRow}
            />;
  }
}