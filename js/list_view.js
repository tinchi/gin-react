import React from 'react'

import axios from 'axios';

import auth from './auth'

export default class ListView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      filterParams: {},
      page: 1
    };

    this.onDeleteSuccess = this.onDeleteSuccess.bind(this);
  }

  componentDidMount() {
    this.pullData();
  }

  pullData() {
    axios.get(this.buildUrl(), {
        "headers": auth.getAuthHeaders()
      })
      .then(this.onSuccess.bind(this), )
      .catch(this.onError.bind(this));
  }

  paramsToQuery(obj) {
    if (Object.keys(obj).length == 0)
      return ""

    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  }

  onFilterChanged(filterParams) {
    this.setState({
      filterParams: filterParams
    }, this.pullData);
  }

  renderFilters() {
    if (this.props.filterClass) {
      let Filter = this.props.filterClass

      return <Filter
                onFilterChanged={this.onFilterChanged.bind(this)}
                url={this.props.url}
              />;
    }
  }

  onSuccess(response) {
    this.setState({
      items: response.data[this.props.collection_name]
    })
  }

  onError(error) {
    console.log("onError", error)
    console.log("onError", error.response)
  }

  buildUrl() {
    return `${this.props.url}?page=${this.state.page}&${this.paramsToQuery(this.state.filterParams)}`
  }

  onNextPage() {
    this.setState({
      page: this.state.page + 1
    }, this.pullData);
  }

  onPrevPage() {
    this.setState({
      page: this.state.page - 1
    }, this.pullData);
  }

  onDeleteItem(id) {
    axios.delete('v1/deposits/' + id, {
        "headers": auth.getAuthHeaders()
      })
      .then(this.onDeleteSuccess.bind(this), )
      .catch(this.onDeleteError.bind(this));
  }

  onDeleteSuccess(id) {
    this.pullData()
  }

  onDeleteError() {
    console.log('TO implement ListView.onDeleteError')
  }

  renderHeader(cols) {
    let heads = cols.map((col) => {
      return <td key={cols.indexOf(col)}>{col}</td>
    })

    return (
      <thead>
        <tr>
          { heads }
        </tr>
      </thead>
    );
  }

  renderPaging() {
    return (
      <tr><td colSpan={this.props.columns.length}>
        {this.state.page > 1 &&
          <button className="btn-go-left btn btn-default" type="button" onClick={this.onPrevPage.bind(this)}>
            Prev Page
          </button>
        }
        {this.state.items.length === 10 &&
          <button className="btn-go-right btn btn-default" type="button" onClick={this.onNextPage.bind(this)}>
            Next Page
          </button>
        }
      </td></tr>
    );
  }

  renderRow(row) {
    console.log("renderRow")

    return React.createElement(this.props.rowClass, {
      key: row.id,
      item: row,
      onDelete: this.onDeleteItem.bind(this)
    });
  }

  render() {
    let rows = this.state.items.map((row) => {
      return this.renderRow(row)
    })

    return (
      <div>
        <h1>{this.props.title}</h1>

        <table className="table time-table">
          { this.renderHeader(this.props.columns) }
          <tbody>
            { rows }
            { this.renderPaging() }
          </tbody>
        </table>
      </div>
    );
  }
}