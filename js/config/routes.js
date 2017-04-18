import React from 'react'

import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from 'react-router-dom';

import auth from '../auth'

import DepositsList from '../components/deposits_list'
import DepositEntryEdit from '../components/deposit_entry_edit'
import DepositEntryNew from '../components/deposit_entry_new'

import Login from '../components/login'
import Logout from '../components/logout'

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
        <ul>
          { auth.isAuthenticated ? (
            <div>
              <li><Link to="/logout">Logout</Link></li>
              <li><Link to="/deposits">Deposits</Link></li>
              <li><Link to="/deposits/new">New Deposit</Link></li>
            <li><Link to="/">Revenue Report</Link></li>
            </div>
          ) : (
            <li><Link to="/login">Login</Link></li>
          )}
        </ul>
        <hr/>

        <Route exact path="/login" component={Login}/>
        <Route exact path="/logout" component={Logout}/>

        <PrivateRoute exact path="/deposits" component={DepositsList} />
        <PrivateRoute exact path="/deposits/new" component={DepositEntryNew}/>
        <PrivateRoute exact path="/deposits/:id/edit" component={DepositEntryEdit}/>
      </div>
    </Router>
  }
}