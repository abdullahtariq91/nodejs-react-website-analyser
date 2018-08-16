import React, { Component } from 'react';
import axios from 'axios';
import Table from './Table';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { value: '', result: [], isLoading: false, isError: false };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleResponse = this.handleResponse.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleResponse(result) {
    if (result.length === 0) {
      this.setState({ result, isLoading: false, isError: true });
    } else {
      this.setState({ result, isLoading: false, isError: false });
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    const { value } = this.state;
    this.setState({
      isLoading: true,
      isError: false
    }, () => {
      axios.post('http://localhost:8080/api/website', { website: value })
        .then((response) => {
          this.handleResponse(response.data);
        });
    });
  }

  render() {
    const { value, result, isLoading, isError } = this.state;
    return (
      <div className="container">
        <form onSubmit={this.handleSubmit}>
          <input type="text" value={value} className="ghost-input" placeholder="Enter Website URL" onChange={this.handleChange} />
          <input type="submit" value="Submit" className="ghost-button" />
        </form>
        {isError && <p>Website not found</p>}
        {isLoading && <p>Loading...</p>}
        {!isLoading && <Table result={result} />}
        {!isLoading && result.length > 0 && <a href="https://www.w3.org/QA/2002/04/valid-dtd-list.html">Check HTML Versions</a>}
      </div>
    );
  }
}
