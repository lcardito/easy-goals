import React from 'react';
import Client from '../main/Client';
import SortableTable from '../main/SortableTable';
import GenericForm from '../main/GenericForm';
import update from 'immutability-helper';
import _ from 'lodash';
import {Message} from 'semantic-ui-react';

class AccountsPage extends React.Component {
    constructor() {
        super();

        this.defaultAccount = {
            name: '',
            category: '',
            balance: 0,
            monthly: 0,
            id: -1
        };

        this.state = {
            accounts: [],
            showForm: false,
            selectedAccount: this.defaultAccount
        };

        this._getAccounts = this._getAccounts.bind(this);
        this._saveAccount = this._saveAccount.bind(this);
        this._updateAccount = this._updateAccount.bind(this);
        this._editAccount = this._editAccount.bind(this);
        this._deleteAccount = this._deleteAccount.bind(this);
    }

    componentWillMount() {
        Client.getAccounts((serverAccounts) => {
            this._getAccounts(serverAccounts);
        })
    }

    _getAccounts(serverAccounts) {
        this.setState({
            accounts: serverAccounts
        });
    }

    resetState(accounts) {
        this.setState({
            accounts: accounts ? accounts : this.state.accounts,
            showForm: false,
            selectedAccount: this.defaultAccount
        });
    }

    _saveAccount(account) {
        if (account.id === -1) {
            Client.addAccount(account, (savedAccount) => {
                this.resetState(update(this.state.accounts, {$push: [savedAccount]}));
            });
        } else {
            Client.editAccount(account, (savedAccount) => {
                let accountIdx = _.findIndex(this.state.accounts, (a) => {
                    return a.id === savedAccount.id
                });
                this.resetState(update(this.state.accounts, {[accountIdx]: {$set: savedAccount}}));
            });
        }
    }

    _updateAccount(event) {
        this.setState({
            selectedAccount: update(this.state.selectedAccount, {
                $merge: {[event.target.name]: event.target.value}
            })
        });
    }

    _editAccount(account) {
        this.setState({
            selectedAccount: account,
            showForm: true
        });
    };

    _deleteAccount(account) {
        Client.deleteAccount(account.id);
        let accountIdx = _.findIndex(this.state.accounts, (g) => {
            return g.id === account.id
        });
        this.resetState(update(this.state.accounts, {$splice: [[accountIdx, 1]]}));
    }

    render() {
        if (!this.props.visible) {
            return false;
        }

        if (!this.state.showForm) {
            return (
                <SortableTable
                    editCallback={this._editAccount}
                    addNewCallback={() => this.setState({showForm: true})}
                    headers={[
                        {key: 'name', value: 'Name'},
                        {key: 'category', value: 'Category'},
                        {key: 'balance', value: 'Balance'},
                        {key: 'monthly', value: 'Monthly Due'}
                    ]}
                    items={this.state.accounts}
                    editable={true}
                />
            )
        } else {
            return (
                <div>
                    <Message
                        attached={true}
                        header='Add/Edit an account'
                        content='Fill out the form below to add/edit a new account'
                    />
                    <GenericForm
                        fields={[
                            {key: 'name', value: 'Name'},
                            {key: 'category', value: 'Category'},
                            {key: 'balance', value: 'Balance'}
                        ]}
                        item={this.state.selectedAccount}
                        submitCallback={this._saveAccount}
                        cancelCallback={() => this.resetState()}
                        deleteCallback={this._deleteAccount}
                        editing={this.state.selectedAccount.id !== -1}
                    />
                </div>
            )
        }
    }
}

export default AccountsPage;