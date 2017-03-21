import React from 'react';
import Client from './Client';
import {Accordion, Grid, Form, Button, Segment, Container} from 'semantic-ui-react';
import update from 'immutability-helper';
import _ from 'lodash';

class TableAccordion extends React.Component {

    constructor() {
        super();

        this._updateAccount = this._updateAccount.bind(this);
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

    _updateAccount(event) {
        const value = event.target.value;
        const name = event.target.name;
        let newAccount = update(this.state.selectedAccount, {$merge: {[name]: value}});

        this.setState({
            selectedAccount: newAccount
        });
    }

    _selectAccount(account) {
        this.setState({selectedAccount: account});
    }

    _handleSubmit(event) {
        event.preventDefault();

        Client.editAccount(this.state.selectedAccount, (edited) => {
            let accountIdx = _.findIndex(this.state.accounts, (a) => {
                return a.id === edited.id
            });
            const newAccounts = update(this.state.accounts, {[accountIdx]: {$set: edited}});
            this.setState({
                accounts: newAccounts
            });
        });
    }

    _addAccount() {
        Client.addAccount({name: 'changeMe', type: 'changeMe', balance: 0}, (newAccount) => {
            this.setState({
                accounts: update(this.state.accounts, {$push: [newAccount]})
            });
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
        return (
            <Container fluid className="tableAccordion">
                <Segment textAlign="center" clearing className="textBold">
                    <Grid columns={3}>
                        <Grid.Column>
                            <Segment basic>Name</Segment>
                        </Grid.Column>
                        <Grid.Column>
                            <Segment basic>Type</Segment>
                        </Grid.Column>
                        <Grid.Column>
                            <Segment basic>Balance</Segment>
                        </Grid.Column>
                    </Grid>
                </Segment>
                {this.state.accounts.map((account, idx) => (
                    <Accordion
                        styled
                        fluid
                        key={idx}
                        onTitleClick={() => this._selectAccount(account)}>
                        <Accordion.Title
                            key={idx}>
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
                        </Accordion.Title>
                        <Accordion.Content>
                            <Segment>
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
                                    <Button onClick={this._handleSubmit}
                                            color="blue"
                                            compact
                                            type='submit'>Submit</Button>
                                    <Button onClick={this._deleteAccount}
                                            color="red"
                                            compact
                                            type='button'>Delete</Button>
                                </Form>
                            </Segment>
                        </Accordion.Content>
                    </Accordion>
                ))}
                <Button onClick={this._addAccount}
                        className="addButton">Add new</Button>
            </Container>
        )
    }
}

export default TableAccordion;