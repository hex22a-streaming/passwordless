import React, { Component } from 'react';
import UserService from '../services/UserService';

interface ISignUpFormState {
  username: string,
}

// eslint-disable-next-line react/prefer-stateless-function
export default class SignUpForm extends Component<{}, ISignUpFormState> {
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

    await UserService.createUser(username);
  }

  render() {
    const { username } = this.state;

    return (
      <>
        Sign Up
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
