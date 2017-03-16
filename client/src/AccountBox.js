import React from 'react';
import Client from './Client';

class AccountBox extends React.Component {
    constructor() {
        super();
        this.state = {
            accounts: []
        }
    }

    componentWillMount(){
        this._getAccounts();
    }

    _getAccounts(){
        Client.getAccounts((accounts) => {
            this.setState({
                accounts: accounts
            })
        })
    }

    render(){
        return (
            <div>
                <table className='ui selectable structured large table'>
                    <thead>
                    <tr>
                        <th className='eight wide'>Name</th>
                        <th>Type</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.accounts.map(function(account, idx) {
                        return (
                            <tr key={idx}>
                                <td>{account.name}</td>
                                <td>{account.type}</td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default AccountBox;