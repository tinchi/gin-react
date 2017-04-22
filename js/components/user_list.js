import React from 'react'

import ListView from '../list_view'

import {
  Link
} from 'react-router-dom'

import {
  Button
} from 'reactstrap';

class UserRow extends React.Component {
  delete(event) {
    event.preventDefault();
    this.props.onDelete(this.props.item.id);
  }

  render() {
    return <tr key={this.props.item.id} className="list-row">
        <td>
          #{this.props.item.id}
        </td>
        <td>
          {this.props.item.name}
        </td>
        <td>
          {this.props.item.email}
        </td>
        <td>
          {this.props.item.role}
        </td>
        <td>
          <Button color="info"><Link to={'/users/' + this.props.item.id + '/edit'}>edit</Link></Button>{' '}
        </td>
        <td>
          <Button color="danger" onClick={this.delete.bind(this)}>remove</Button>{' '}
        </td>
      </tr>
  }
}

export default class UserList extends React.Component {
  render() {
    console.log('UserList');

    return <ListView
              title='Users'
              url='v1/users'
              collection_name='users'
              columns={["Id", 'Name', 'Email', 'Role', ""]}
              rowClass={UserRow}
            />;
  }
}