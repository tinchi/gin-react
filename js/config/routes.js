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

import RevenueReport from '../components/revenue_report'

import {
  NavLink,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem
} from 'reactstrap';

class PrivateRoute extends Route {
  canAccess() {
    if (!auth.isAuthenticated()) {
      return false
    }

    if (this.props.only == undefined) {
      return true
    }

    return this.props.only.includes(auth.getRole())
  }

  render() {
    let component = super.render();
    let match = this.state.match;

    if (match) {
      if (this.canAccess()) {

        return component;
      } else {

        if (auth.isAuthenticated()) {
          console.log("Redirect to Home")

          return <Redirect to={ { pathname: '/' } } />
        } else {
          console.log("Redirect to Login")

          return <Redirect to = {
            {
              pathname: '/login',
              state: {
                from: this.props.path
              }
            }
          }
          />
        }
      }

    } else {
      return null;
    }
  }
}

class NavBar extends React.Component {
  render() {
    let links = []

    switch (auth.getRole()) {
      case 'user':
        console.log('user')
        links = [<NavItem><Link className="nav-link" to="/deposits">Deposits</Link></NavItem>, <NavItem><Link className="nav-link"  to="/revenue_report">Revenue Report</Link></NavItem>]
        break;
      case 'manager':
        links = [<NavItem><Link className="nav-link" to="/users">Users</Link></NavItem>]
        break;
      case 'admin':
        links = [<NavItem><Link className="nav-link" to="/deposits">Deposits</Link></NavItem>, <NavItem><Link className="nav-link"  to="/users">Users</Link></NavItem>]
        break;
    }

    return <Navbar color="faded" light toggleable>
          <NavbarBrand href="/">Deposit Manager</NavbarBrand>

          <Nav className="ml-auto" navbar>
            { links }
          </Nav>

          {
            auth.isAuthenticated() ? (
          <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink href="#">{ auth.getEmail() }[{ auth.getRole()}]</NavLink>
              </NavItem>

              <NavItem>
                <Link className="nav-link" to="/logout">Logout</Link>
              </NavItem>
            </Nav>
      ) : (
        <Nav className="ml-auto" navbar>
            <NavItem>
              <Link className="nav-link" to="/login">Login</Link>
            </NavItem>
            <NavItem>
              <Link className="nav-link" to="/register">Register</Link>
            </NavItem>
            </Nav>
      )
    }
        </Navbar>
  }
}

export default class Routes extends React.Component {
  render() {
    console.log('Routes');

    return <Router>
    <div>
        <div id="error"/>
        <Route path="/" component={NavBar}/>

        <hr/>

        <Route exact path="/login" component={Login}/>
        <Route exact path="/logout" component={Logout}/>
        <Route exact path="/register" component={Register}/>

        <PrivateRoute exact path="/deposits" component={DepositList} only={ ["user", "admin"] } />
        <PrivateRoute exact path="/deposits/new" component={DepositEntryNew} only={ ["user", "admin"] } />
        <PrivateRoute exact path="/deposits/:id/edit" component={DepositEntryEdit} only={ ["user", "admin"] }/>

        <PrivateRoute exact path="/users" component={UserList} only={ ["manager", "admin"] } />
        <PrivateRoute exact path="/users/new" component={UserEntryNew} only={ ["manager", "admin"] } />
        <PrivateRoute exact path="/users/:id/edit" component={UserEdit} only={ ["manager", "admin"] } />

        <PrivateRoute exact path="/revenue_report" component={RevenueReport} only={ ["user"] } />
      </div>
    </Router>
  }
}