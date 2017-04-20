import React from 'react'

import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from 'react-router-dom';

import auth from '../auth'

import DepositList from '../components/deposit_list'
import DepositEntryEdit from '../components/deposit_entry_edit'
import DepositEntryNew from '../components/deposit_entry_new'

import UserList from '../components/user_list'
import UserEntryNew from '../components/user_entry_new'
import UserEdit from '../components/user_edit'

import Login from '../components/login'
import Logout from '../components/logout'
import Register from '../components/register'

class PrivateRoute extends Route {
  render() {
    let component = super.render();
    let {
      user,
      path
    } = this.props;
    let match = this.state.match;

    if (match) {
      if (auth.isAuthenticated()) {
        return component;
      } else {
        return <Redirect to = {
          {
            pathname: '/login',
            state: {
              from: path
            }
          }
        }
        />;
      }
    } else {
      return null;
    }
  }
}

export default class Routes extends React.Component {
  render() {
    console.log('Routes');

    return <Router>
    <div>
      <div id="error"/>
        <ul>
          { auth.isAuthenticated() ? (
            <div>
              <li><Link to="/logout">Logout</Link></li>
              <li><Link to="/deposits">Deposits</Link></li>
              <li><Link to="/users">Users</Link></li>
              <li><Link to="/revenue_report">Revenue Report</Link></li>
            </div>
          ) : (
            <div>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </div>
          )}
        </ul>
        <hr/>

        <Route exact path="/login" component={Login}/>
        <Route exact path="/logout" component={Logout}/>
        <Route exact path="/register" component={Register}/>

        <PrivateRoute exact path="/deposits" component={DepositList} />
        <PrivateRoute exact path="/deposits/new" component={DepositEntryNew}/>
        <PrivateRoute exact path="/deposits/:id/edit" component={DepositEntryEdit}/>

        <PrivateRoute exact path="/users" component={UserList} />
        <PrivateRoute exact path="/users/new" component={UserEntryNew} />
        <PrivateRoute exact path="/users/:id/edit" component={UserEdit} />
      </div>
    </Router>
  }
}