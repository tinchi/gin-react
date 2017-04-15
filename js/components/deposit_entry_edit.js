import React from 'react'
import Formsy from 'formsy-react';
import {
  Form,
  Input
} from 'formsy-react-components';

import axios from 'axios';

class DepositEditForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {}
    };
  }

  componentDidMount() {
    axios.get(this.props.url)
      .then(this.onGetSuccess.bind(this), )
      .catch(this.onGetError.bind(this));
  }

  onGetSuccess(responce) {
    this.setState({
      data: responce.data.deposit
    });
  }

  onGetError() {
    console.log("TODO: implement onGetError()")
  }

  submitForm(data) {
    console.log("submitForm")
    console.log(data)

    console.log("TODO: implement submitForm()")
  }

  render() {
    console.log("DepositEditForm#props render", this.state.data)

    return <Form onSubmit={this.submitForm}>
              <Input
                name="bank_name"
                label="Bank Name"
                value={this.state.data.bank_name}
            />
            <Input
                name="account_number"
                label="Account Number"
                value={this.state.data.account_number}
            />
            <Input
                name="ammount"
                label="Ammount"
                value={this.state.data.ammount}
                addonAfter={"$"}
            />
            <Input
                  name="start_date"
                  value=""
                  label="Date"
                  type="date"
                  value={this.state.data.start_date}
                  placeholder="This is a date input."
                  required
              />
              <Input
                  name="end_date"
                  value={this.state.data.end_date}
                  value=""
                  label="Date"
                  type="date"
                  placeholder="This is a date input."
                  required
              />
              <Input
                name="interest"
                value={this.state.data.interest}
                label="Interest"
                addonAfter={"%"}
            />
            <Input
                name="taxes"
                label="Taxes"
                value={this.state.data.taxes}
                addonAfter={"%"}
            />

            <input className="btn btn-primary" formNoValidate={true} type="submit" defaultValue="Submit" />
        </Form>
  }
}

export default class DepositEntryEdit extends React.Component {
  render() {
    console.log('DepositEntryEdit', this.props.match.params);

    return <DepositEditForm url={`/v1/deposits/${this.props.match.params.id}`}/>
  }
}