import React from 'react';
import {Button, Form, Segment, Sidebar, Menu} from 'semantic-ui-react';
import update from 'immutability-helper';

class AccountForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedAccount: props.account,
            confirmVisible: false
        };

        this._updateAccount = this._updateAccount.bind(this);
        this._beforeCancel = this._beforeCancel.bind(this);
        this._deleteAccount = this._deleteAccount.bind(this);
    }

    _updateAccount(event) {
        const value = event.target.value;
        const name = event.target.name;
        let newAccount = update(this.state.selectedAccount, {$merge: {[name]: value}});

        this.setState({
            selectedAccount: newAccount
        });
    }

    _beforeCancel() {
        this.setState({
            confirmVisible:true
        })
    }

    _deleteAccount() {
        this.props.deleteAccount(this.state.selectedAccount);
        this.setState({
            confirmVisible: false
        });

    }

    render() {
        return (
            <Sidebar.Pushable as={Segment}>
                <Sidebar as={Menu} animation='overlay' direction='bottom' visible={this.state.confirmVisible} inverted>
                    <Menu.Item name='confirm'>
                        Please confirm
                    </Menu.Item>
                    <Button onClick={this._deleteAccount} compact color="red">Yes</Button>
                    <Button onClick={() => this.setState({confirmVisible: false})} compact color="blue">No</Button>
                </Sidebar>
                <Sidebar.Pusher>
                    <Segment basic>
                        <Form>
                            <Form.Group widths='equal'>
                                <Form.Field>
                                    <label>Name</label>
                                    <input placeholder="account name"
                                           type="text"
                                           name="name"
                                           value={this.state.selectedAccount.name}
                                           onChange={this._updateAccount}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Category</label>
                                    <input placeholder="account category"
                                           type="text"
                                           value={this.state.selectedAccount.type}
                                           name="type"
                                           onChange={this._updateAccount}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Amount</label>
                                    <input placeholder="account balance"
                                           type="text"
                                           value={this.state.selectedAccount.balance}
                                           name="balance"
                                           onChange={this._updateAccount}
                                    />
                                </Form.Field>
                            </Form.Group>
                            <Button onClick={this._beforeCancel}
                                    color="red"
                                    compact
                                    type='button'>Delete</Button>
                            <Button onClick={() => this.props.handleSubmit(this.state.selectedAccount)}
                                    color="green"
                                    compact
                                    type='button'>Save</Button>
                        </Form>
                    </Segment>
                </Sidebar.Pusher>
            </Sidebar.Pushable>
        );
    }
}

export default AccountForm;