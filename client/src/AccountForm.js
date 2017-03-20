import React from 'react';
import Client from './Client';
import {Button, Form} from 'semantic-ui-react';
import update from 'immutability-helper';

class AccountForm extends React.Component {

    constructor(props) {
        super(props);
        let current = props.account ? props.account : {name: '', type: '', balance: 0};
        this.state = {
            selectedAccount: current
        };

        this._updateAccount = this._updateAccount.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
    }

    _updateAccount(event) {
        const value = event.target.value;
        const name = event.target.name;
        let newAccount = update(this.state.selectedAccount, {
            $merge: {
                [name]: value
            }
        });

        this.setState({
            selectedAccount: newAccount
        });
    }

    _handleSubmit(event) {
        event.preventDefault();

        if(this.state.selectedAccount.id){
            Client.editAccount(this.state.selectedAccount, (edited) => {
                this.props.callback(edited, true);
            });
        } else {
            Client.addAccount(this.state.selectedAccount, (newAccount) => {
                this.props.callback(newAccount, false);
            });
        }
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
                <Button onClick={this.props.callback} type="button">Cancel</Button>
                <Button onClick={this._handleSubmit} type='submit'>Submit</Button>
            </Form>
        );
    }
}

export default AccountForm;