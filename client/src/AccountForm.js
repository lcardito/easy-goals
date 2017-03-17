import React from 'react';
import Client from './Client';
import {Button, Form} from 'semantic-ui-react';

class AccountForm extends React.Component {

    render() {
        return (
            <Form >
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
                <Button onClick={this._handleSubmit.bind(this)}>Submit</Button>
            </Form>
        );
    }

    _handleSubmit(event) {
        event.preventDefault();

        let account = {
            name: this._name.value,
            type: this._type.value,
            balance: this._balance.value
        };
        Client.addAccount(account);
        if(this.props.onAccountSave) {
            this.props.onAccountSave(account);
        }
    }
}

export default AccountForm;