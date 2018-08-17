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
        <h1 className="cool-input">Website Analyser</h1>
        <form onSubmit={this.handleSubmit}>
          <input type="text" value={value} className="cool-input" placeholder="Enter Website URL" onChange={this.handleChange} />
          <input type="submit" value="Submit" className="cool-button" />
        </form>
        {isError && <p>Website not found.</p>}
        {isError && <p><small>Make sure it's a valid URL with 'http://' or 'https://'.</small></p>}
        {isLoading && <p>Loading...</p>}
        {!isLoading && result.length > 0 && <Table result={result} />}
        {!isLoading && result.length > 0 && <a className="table-font" rel="noopener noreferrer" target="_blank" href="https://www.w3.org/QA/2002/04/valid-dtd-list.html">Check HTML Versions</a>}
      </div>
    );
  }
}
