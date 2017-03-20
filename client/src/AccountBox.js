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
        this._deleteAccount = this._deleteAccount.bind(this);
        this._getTable = this._getTable.bind(this);
        this._handleCancel = this._handleCancel.bind(this);
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
        if (updated) {
            let accountIdx = this.state.accounts.indexOf(this.state.selectedAccount);
            const newAccounts = update(this.state.accounts, {[accountIdx]: {$set: newAccount}});
            this.setState({
                accounts: newAccounts,
                showForm: !this.state.showForm
            });
        } else if (newAccount) {
            this.setState({
                accounts: update(this.state.accounts, {$push: [newAccount]}),
                showForm: !this.state.showForm
            });
        }

        this.setState({
            selectedAccount: {}
        });
    }

    _toggleForm() {
        this.setState({
            showForm: !this.state.showForm
        })
    }

    _handleCancel() {
        this.setState({
            selectedAccount: {}
        }, this._toggleForm);
    }

    _editAccount(account) {
        this.setState({
            selectedAccount: account
        }, this._toggleForm);
    }

    _deleteAccount(account) {
        let accountIdx = this.state.accounts.indexOf(account);
        Client.deleteAccount(accountIdx);

        const newAccounts = update(this.state.accounts, {
            $splice: [[accountIdx, 1]]
        });

        this.setState({
            accounts: newAccounts
        });

    }

    _getTable(){
        if (this.state.accounts.length === 0) {
            return (<Message
                header="No accounts"
                content="You haven't setup an account yet."
                icon="info"
            />)
        } else {
            return (<AccountTable
                accounts={this.state.accounts}
                editCallback={this._editAccount}
                deleteCallback={this._deleteAccount}
            />)
        }
    }

    render() {
        if (!this.props.visible) {
            return false;
        }

        return (
            <div>
                {this._getTable()}
                <div>
                    <Button onClick={this._toggleForm}>Add an account</Button>
                    <Modal open={this.state.showForm}>
                        <Modal.Header>Add an account</Modal.Header>
                        <Modal.Content>
                            <AccountForm
                                submitCallback={this._handleForm}
                                cancelCallback={this._handleCancel}
                                account={this.state.selectedAccount}
                            />
                        </Modal.Content>
                    </Modal>
                </div>
            </div>
        )
    }
}

export default AccountBox;