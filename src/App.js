import React, { Component } from 'react';
import axios from 'axios';
import Table from './Table';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { value: '', result: [], isLoading: false };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleResponse = this.handleResponse.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleResponse(result) {
    this.setState({ result, isLoading: false });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { value } = this.state;
    this.setState({
      isLoading: true,
    }, () => {
      axios.post('http://localhost:8080/api/website', { website: value })
        .then((response) => {
          console.log(response.data);
          this.handleResponse(response.data);
        });
    });
  }

  render() {
    const { value, result, isLoading } = this.state;
    return (
      <div className="container">
        <form onSubmit={this.handleSubmit}>
          <input type="text" value={value} className="ghost-input" placeholder="Enter Website URL" onChange={this.handleChange} />
          <input type="submit" value="Submit" className="ghost-button" />
        </form>
        {isLoading && <p>Loading...</p>}
        {!isLoading && <Table result={result} />}
      </div>
    );
  }
}
