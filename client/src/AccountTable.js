import React from 'react';
import {Table} from 'semantic-ui-react';

class AccountTable extends React.Component {

    render(){
        return (
            <Table celled selectable>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Type</Table.HeaderCell>
                        <Table.HeaderCell>Balance</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {this.props.accounts.map((account, idx) => (
                        <Table.Row
                            onClick={() => this.props.callback(account)}
                            key={idx}>
                            <Table.Cell>{account.name}</Table.Cell>
                            <Table.Cell>{account.type}</Table.Cell>
                            <Table.Cell>{account.balance}</Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        )
    }

}

export default AccountTable;