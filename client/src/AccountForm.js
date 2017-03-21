import React from 'react';
import {Button, Form} from 'semantic-ui-react';
import update from 'immutability-helper';

class AccountForm extends React.Component {

    constructor(props) {
        super(props);
        let current = props.account.id >= 0 ? props.account : {name: '', type: '', balance: 0};
        this.state = {
            selectedAccount: current
        };

        this._updateAccount = this._updateAccount.bind(this);
    }

    _updateAccount(event) {
        const value = event.target.value;
        const name = event.target.name;
        let newAccount = update(this.state.selectedAccount, {$merge: {[name]: value}});

        this.setState({
            selectedAccount: newAccount
        });
    }

    render() {
        return (
            <Form>
                <Form.Group widths='equal'>
                    <Form.Field>
                        <label>Account name</label>
                        <input placeholder="account name"
                               type="text"
                               name="name"
                               value={this.state.selectedAccount.name}
                               onChange={this._updateAccount}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Account category</label>
                        <input placeholder="account category"
                               type="text"
                               value={this.state.selectedAccount.type}
                               name="type"
                               onChange={this._updateAccount}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Initial amount</label>
                        <input placeholder="account balance"
                               type="text"
                               value={this.state.selectedAccount.balance}
                               name="balance"
                               onChange={this._updateAccount}
                        />
                    </Form.Field>
                </Form.Group>
                <Button onClick={() => this.props.handleSubmit(this.state.selectedAccount)}
                        color="blue"
                        compact
                        type='button'>Submit</Button>
                <Button onClick={() => this.props.deleteAccount(this.state.selectedAccount)}
                        color="red"
                        compact
                        type='button'>Delete</Button>

            </Form>
        );
    }
}

export default AccountForm;