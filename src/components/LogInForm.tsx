import React, { Component } from 'react';
import UserService from '../services/UserService';

interface ILogInFormState {
  username: string,
}

export default class LogInForm extends Component<{}, ILogInFormState> {
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

  async handleSubmit(event) {
    const { username } = this.state;
    event.preventDefault();

    await UserService.login(username);
  }

  render() {
    const { username } = this.state;

    return (
      <>
        Log in
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="username">
            Username
            <input type="text" value={username} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </>
    );
  }
}
