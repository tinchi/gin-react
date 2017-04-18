import React from 'react'
import ReactDOM from 'react-dom'

import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from 'react-router-dom';

import auth from './auth'

import DepositsList from './components/deposits_list'
import DepositEntryEdit from './components/deposit_entry_edit'
import DepositEntryNew from './components/deposit_entry_new'
import Login from './components/login'

class App extends React.Component {
  render() {
    console.log("App render()")

    return <div>
        <div className="container">
        </div>
      </div>
  }
}

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

class Routes extends React.Component {
  render() {
    console.log('Routes');

    return <Router>
    <div>
        <ul>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/logout">Logout</Link></li>

          {/*<li><Link to="/">Home</Link></li>*/}
          <li><Link to="/deposits">Deposits</Link></li>
          <li><Link to="/deposits/new">New Deposit</Link></li>

          <li><Link to="/">Revenue Report</Link></li>
        </ul>
        <hr/>

        <Route exact path="/login" component={Login}/>

        <PrivateRoute exact path="/deposits" component={DepositsList} />
        <PrivateRoute exact path="/deposits/new" component={DepositEntryNew}/>
        <PrivateRoute exact path="/deposits/:id/edit" component={DepositEntryEdit}/>
      </div>
    </Router>
  }
}

ReactDOM.render(<Routes/>, document.getElementById('app'));