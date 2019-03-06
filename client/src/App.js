import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import axios from 'axios';
import UserList from './components/UserList';
import User from './components/User';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };
  }
  componentDidMount() {
    axios
      .get('http://localhost:5000/users')
      .then(res => this.setState({ users: res.data.users }))
      .catch(err => console.log(err));
  }
  render() {
    return (
      <>
        <header className="top-bar" />
        <Route
          exact
          path="/"
          render={props => <UserList {...props} users={this.state.users} />}
        />
        <Route path="/user/:id" component={User} />
      </>
    );
  }
}

export default App;
