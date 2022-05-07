import React, { Component } from 'react';
import UserService from './services/UserService';

interface IAppState {
  username: string,
}

// eslint-disable-next-line react/prefer-stateless-function
export default class App extends Component<{}, IAppState> {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ username: event.target.value });
  }

  handleSubmit(event) {
    const { username } = this.state;

    UserService.crateUser(username);

    event.preventDefault();
  }

  render() {
    const { username } = this.state;

    return (
      <form onSubmit={this.handleSubmit}>
        <label htmlFor="username">
          Username
          <input type="text" value={username} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
