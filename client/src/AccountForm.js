import React from 'react';
import Client from './Client'

class AccountForm extends React.Component {

    render() {
        if(!this.props.visible){
            return false;
        }

        return (
            <form className="ui form" onSubmit={this._handleSubmit.bind(this)}>
                {/*TODO this needs to be header and add padding */}
                <h3 className="ui header">Add an account</h3>
                <div className="equal width fields">
                    <div className="field">
                        <label>Account Name</label>
                        <div className="ui input">
                            <input placeholder="account name" ref={(c) => {this._name = c;}} />
                        </div>
                    </div>
                    <div className="field">
                        <label>Account type</label>
                        <div className="ui input">
                            <input placeholder="account type" ref={c => this._type = c} />
                        </div>
                    </div>
                    <div className="field">
                        <label>Account balance</label>
                        <div className="ui input">
                            <input placeholder="account starting balance" ref={c => this._balance = c} />
                        </div>
                    </div>
                </div>

                <div className="account-form-actions">
                    <button className="button" type="submit">Save account</button>
                </div>
            </form>
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
    }
}

export default AccountForm;