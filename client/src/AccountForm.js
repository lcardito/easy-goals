import React from 'react';

class AccountForm extends React.Component {

    render() {
        return (
            <form className="comment-form" onSubmit={this._handleSubmit.bind(this)}>
                <label>New account</label>
                <div className="comment-form-fields">
                    <input placeholder="Name:" ref={c => this._name = c} />
                    <input placeholder="Type:" ref={c => this._type = c} />
                </div>
                <div className="comment-form-actions">
                    <button type="submit">Save account</button>
                </div>
            </form>
        );
    }

    _handleSubmit(event) {
        event.preventDefault();

        let name = this._name;
        let type = this._type;

        this._addAccount(name.value, type.value)
    }

    _addAccount(name, type) {
        fetch('api/account/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                type: type
            })
        });

    }
}

export default AccountForm;