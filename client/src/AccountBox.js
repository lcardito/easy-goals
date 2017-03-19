import React from 'react';
import Client from './Client';
import {Button, Message, Modal, Form, Table} from 'semantic-ui-react';
import update from 'immutability-helper';

class AccountBox extends React.Component {

    constructor() {
        super();
        this.state = {
            accounts: [],
            showForm: false,
            selectedAccount: {
                name: '',
                type: '',
                balance: 0
            }
        };

        //TODO: bind all the function in here
        this._toggleForm = this._toggleForm.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
        this._updateAccount = this._updateAccount.bind(this);
        this._editAccount = this._editAccount.bind(this);
        this._getAccounts = this._getAccounts.bind(this);
        this._clearSelection = this._clearSelection.bind(this);
    }

    componentWillMount() {
        this._getAccounts();
    }

    _getAccounts() {
        Client.getAccounts((accounts) => {
            this.setState({
                accounts: accounts
            });

        });
    }

    _toggleForm() {
        this.setState({showForm: !this.state.showForm})
    }

    _handleSubmit(event) {
        event.preventDefault();

        Client.addAccount(this.state.selectedAccount, (newAccount) => {
            this.setState({
                accounts: this.state.accounts.concat(newAccount),
                showForm: false
            });
        });
    }

    _editAccount(account) {
        this.setState({
            selectedAccount: account
        });
        this._toggleForm();
    }

    _updateAccount(event) {
        const value = event.target.value;
        const name = event.target.name;
        let newAccount = update(this.state.selectedAccount, {
            $merge: {
                [name] : value
            }
        });

        this.setState({
            selectedAccount: newAccount
        });
    }

    _clearSelection(e){
        e.preventDefault();
        this.setState({
            selectedAccount: {
                name: '',
                type: '',
                balance: 0
            }
        });
        this._toggleForm();
    }

    render() {
        if (!this.props.visible) {
            return false;
        }

        let accountForm =
            <div>
                <Button onClick={this._toggleForm}>Add an account</Button>
                <Modal open={this.state.showForm}>
                    <Modal.Header>Add an account</Modal.Header>
                    <Modal.Content>
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
                            <Button onClick={this._clearSelection}>Cancel</Button>
                            <Button onClick={this._handleSubmit}
                                    type='submit'>Submit
                            </Button>
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
                <Table celled selectable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>Type</Table.HeaderCell>
                            <Table.HeaderCell>Balance</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {this.state.accounts.map((account, idx) => (
                            <Table.Row
                                onClick={() => this._editAccount(account)}
                                key={idx}>
                                <Table.Cell>{account.name}</Table.Cell>
                                <Table.Cell>{account.type}</Table.Cell>
                                <Table.Cell>{account.balance}</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
                {accountForm}
            </div>
        )
    }
}

export default AccountBox;