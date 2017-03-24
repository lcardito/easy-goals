import React from 'react';
import Client from '../main/Client';
import SortableTable from '../main/SortableTable';
import GenericForm from '../main/GenericForm';
import update from 'immutability-helper';
import _ from 'lodash';

class AccountsPage extends React.Component {

    constructor() {
        super();

        this.state = {
            accounts: [],
            showForm: false,
            selectedAccount: {
                name: '',
                type: '',
                balance: 0,
                id: -1
            }
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
            accounts: accounts.length ? accounts : this.state.accounts,
            showForm: false,
            selectedAccount: {
                name: '',
                type: '',
                balance: 0,
                id: -1
            }
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

    _deleteAccount() {
        Client.deleteAccount(this.state.selectedAccount.id);
        let accountIdx = _.findIndex(this.state.accounts, (g) => {
            return g.id === this.state.selectedAccount.id
        });
        this.resetState(update(this.state.accounts, {$splice: [[accountIdx, 1]]}));
    }

    render() {
        if (!this.props.visible) {
            return false;
        }

        if (!this.state.showForm) {
            const headers = [
                {key: 'name', value: 'Name'},
                {key: 'type', value: 'Type'},
                {key: 'balance', value: 'Balance'}
            ];
            return (
                <SortableTable
                    editCallback={this._editAccount}
                    addNewCallback={() => this.setState({showForm: true})}
                    headers={headers}
                    items={this.state.accounts}/>
            )
        } else {
            return (
                <GenericForm
                    fields={[
                        {key: 'name', value: 'Name'},
                        {key: 'type', value: 'Type'},
                        {key: 'balance', value: 'Balance'}
                    ]}
                    item={this.state.selectedAccount}
                    submitCallback={this._saveAccount}
                    cancelCallback={() => this.resetState([])}
                    editing={this.state.selectedAccount.id !== -1}
                />
            )
        }
    }
}

export default AccountsPage;