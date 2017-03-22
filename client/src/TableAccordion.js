import React from 'react';
import Client from './Client';
import AccountForm from './AccountForm';
import AccountHeader from './AccountHeader';
import {Accordion, Grid, Button, Segment, Container, Label, Message} from 'semantic-ui-react';
import update from 'immutability-helper';
import _ from 'lodash';

class TableAccordion extends React.Component {

    constructor() {
        super();

        this._getAccounts = this._getAccounts.bind(this);
        this._selectAccount = this._selectAccount.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
        this._addAccount = this._addAccount.bind(this);
        this._deleteAccount = this._deleteAccount.bind(this);

        this.state = {
            selectedAccount: {
                name: '',
                type: '',
                balance: 0
            },
            accounts: []
        };
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

    _selectAccount(account) {
        this.setState({selectedAccount: account});
    }

    _handleSubmit(account) {
        if (account.id === -1) {
            Client.addAccount(account, (newAccount) => {
                let accountIdx = _.findIndex(this.state.accounts, (a) => {
                    return a.id === -1;
                });
                const newAccounts = update(this.state.accounts, {[accountIdx]: {$set: newAccount}});
                this.setState({
                    accounts: newAccounts,
                    selectedAccount: {}
                });
            });
        } else {
            Client.editAccount(account, (edited) => {
                let accountIdx = _.findIndex(this.state.accounts, (a) => {
                    return a.id === edited.id
                });
                const newAccounts = update(this.state.accounts, {[accountIdx]: {$set: edited}});
                this.setState({
                    accounts: newAccounts,
                    selectedAccount: {}
                });
            });
        }
    }

    _addAccount() {
        let pendingAccount = {name: 'change me', type: 'change me', balance: 0, id: -1};
        this.setState({
            accounts: update(this.state.accounts, {$push: [pendingAccount]}),
            selectedAccount: pendingAccount
        });
    }

    _deleteAccount(account) {
        let accountIdx = _.findIndex(this.state.accounts, (a) => {
            return a.id === account.id
        });
        Client.deleteAccount(account.id);

        const newAccounts = update(this.state.accounts, {
            $splice: [[accountIdx, 1]]
        });

        this.setState({
            accounts: newAccounts
        });
    }

    render() {
        if (!this.props.visible) {
            return false;
        }

        const header = <Segment
            textAlign="center"
            className="segmentSmall textBold">
            <AccountHeader />
        </Segment>;

        const addAccountButton = <Button onClick={this._addAccount} className="addButton">Add new</Button>;

        if (this.state.accounts.length === 0) {
            return <div>
                {header}
                <Message>No Account set up yet. Created a new one!</Message>
                {addAccountButton}
            </div>
        }

        return (
            <Container >
                {header}
                <Accordion
                    className="segmentSmall"
                    styled
                    fluid>
                    {this.state.accounts.map((account, idx) => ([
                        <Accordion.Title
                            onClick={() => this._selectAccount(account)}
                            key={idx}>
                            {(account.id === -1)
                                ? <Label as='div' color='yellow' ribbon>This account has NOT been saved</Label>
                                : null}
                            <Grid columns={3}
                                  divided='vertically'
                                  textAlign="center">
                                <Grid.Column>
                                    <Segment basic>{account.name}</Segment>
                                </Grid.Column>
                                <Grid.Column>
                                    <Segment basic>{account.type}</Segment>
                                </Grid.Column>
                                <Grid.Column>
                                    <Segment basic>{account.balance}</Segment>
                                </Grid.Column>
                            </Grid>
                        </Accordion.Title>,
                        <Accordion.Content>
                            <AccountForm
                                account={account}
                                handleSubmit={this._handleSubmit}
                                deleteAccount={this._deleteAccount}
                            />
                        </Accordion.Content>
                    ]))}
                </Accordion>
                {addAccountButton}
            </Container>
        )
    }
}

export default TableAccordion;