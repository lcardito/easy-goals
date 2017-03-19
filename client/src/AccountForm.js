import React from 'react';
import Client from './Client';
import {Button, Form} from 'semantic-ui-react';

class AccountForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedAccount: props.account
        }
    }

    _updateAccount(event) {
        const value = event.target.value;
        const name = event.target.name;
        console.log(name + ":" + value);

        let newAccount = update(this.state.selectedAccount, {
            $merge: {
                [name] : value
            }
        });

        console.log(newAccount);

        this.setState({
            selectedAccount: newAccount
        });
        console.log(this.state.selectedAccount);
    }

    _handleSubmit(event) {
        event.preventDefault();
        console.log(this.state.selectedAccount);

        if(this.state.selectedAccount.id) {
            //TODO update account
        } else {
            Client.addAccount(this.state.selectedAccount, (newAccount) => {
                this.setState({
                    accounts: this.state.accounts.concat(newAccount),
                    showForm: false
                });
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
                <Button onClick={this._clearSelection}
                        type='submit'>Cancel
                </Button>
                <Button onClick={this._handleSubmit}
                        type='submit'>Submit
                </Button>
            </Form>
        );
    }
}

export default AccountForm;