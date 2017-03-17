import React from 'react';
import Client from './Client';
import {Button, Message, Modal, Form} from 'semantic-ui-react';

class AccountBox extends React.Component {

    constructor() {
        super();
        this.state = {
            accounts: [],
            showForm: false
        }
    }

    componentWillMount() {
        this._getAccounts();
    }

    _getAccounts() {
        Client.getAccounts((accounts) => {
            this.setState({
                accounts: accounts
            });

        })
    }

    _showAccountForm() {
        this.setState({showForm: true})
    }

    _handleSubmit(event) {
        event.preventDefault();

        let account = {
            name: this._name.value,
            type: this._type.value,
            balance: this._balance.value
        };
        Client.addAccount(account);
        this.setState({
            accounts: this.state.accounts.concat(account),
            showForm: false
        });
    }

    render() {
        if (!this.props.visible) {
            return false;
        }

        let accountForm =
            <div>
                <Button onClick={this._showAccountForm.bind(this)}>Add an account</Button>
                <Modal open={this.state.showForm}>
                    <Modal.Header>Add an account</Modal.Header>
                    <Modal.Content>
                        <Form>
                            <Form.Group widths='equal'>
                                <Form.Field>
                                    <label>Account name</label>
                                    <input placeholder="account name" ref={(c) => {
                                        this._name = c;
                                    }}/>
                                </Form.Field>
                                <Form.Field>
                                    <label>Account category</label>
                                    <input placeholder="account category" ref={(c) => {
                                        this._type = c;
                                    }}/>
                                </Form.Field>
                                <Form.Field>
                                    <label>Initial amount</label>
                                    <input placeholder="account balance" ref={(c) => {
                                        this._balance = c;
                                    }}/>
                                </Form.Field>
                            </Form.Group>
                            <Button
                                onClick={this._handleSubmit.bind(this)}
                                type='submit'>Submit</Button>
                        </Form>
                    </Modal.Content>
                </Modal>
            </div>;

        if (this.state.accounts.length === 0) {
            return (
                <div>
                    <Message
                        header="No accounts"
                        content="You haven't setup an account yet."
                        icon="info"
                    />
                    {accountForm}
                </div>

            )
        }
        return (
            <div>
                <table className='ui selectable structured large table'>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Balance</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.accounts.map(function (account, idx) {
                        return (
                            <tr key={idx}>
                                <td>{account.name}</td>
                                <td>{account.type}</td>
                                <td>{account.balance}</td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
                {/* TODO: align left? */}
                {accountForm}
            </div>
        )
    }
}

export default AccountBox;