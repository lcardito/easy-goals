import React from 'react';
import Client from './Client';
import AccountForm from './AccountForm';
import AccountTable from './AccountTable';
import {Button, Message, Modal} from 'semantic-ui-react';
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

        this._toggleForm = this._toggleForm.bind(this);
        this._editAccount = this._editAccount.bind(this);
        this._getAccounts = this._getAccounts.bind(this);
        this._handleForm = this._handleForm.bind(this);
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

    _handleForm(newAccount, updated) {
        if (updated && newAccount.id) {
            let accountIdx = this.state.accounts.indexOf(this.state.selectedAccount);
            const newAccounts = update(this.state.accounts, {
                [accountIdx]: {$set: newAccount}
            });
            this.setState({
                accounts: newAccounts
            });
        } else if(newAccount.id) {
            this.setState({
                accounts: update(this.state.accounts, {$push: [newAccount]})
            })
        }

        this.setState({
            selectedAccount: {},
            showForm: !this.state.showForm
        })
    }

    _toggleForm() {
        this.setState({
            showForm: !this.state.showForm
        })
    }

    _editAccount(account) {
        this.setState({
            selectedAccount: account
        });
        this._toggleForm();
    }

    render() {
        if (!this.props.visible) {
            return false;
        }

        if (this.state.accounts.length === 0) {
            return (
                <div>
                    <Message
                        header="No accounts"
                        content="You haven't setup an account yet."
                        icon="info"
                    />
                    <div>
                        <Button onClick={this._toggleForm}>Add an account</Button>
                        <Modal open={this.state.showForm}>
                            <Modal.Header>Add an account</Modal.Header>
                            <Modal.Content>
                                <AccountForm
                                    callback={this._handleForm}
                                />
                            </Modal.Content>
                        </Modal>
                    </div>
                </div>
            )
        }
        return (
            <div>
                <AccountTable
                    accounts={this.state.accounts}
                    callback={this._editAccount}
                />
                <div>
                    <Button onClick={this._toggleForm}>Add an account</Button>
                    <Modal open={this.state.showForm}>
                        <Modal.Header>Add an account</Modal.Header>
                        <Modal.Content>
                            <AccountForm
                                account={this.state.selectedAccount}
                                callback={this._handleForm}
                            />
                        </Modal.Content>
                    </Modal>
                </div>
            </div>
        )
    }
}

export default AccountBox;