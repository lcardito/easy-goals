import React from 'react';
import {Table, Dropdown} from 'semantic-ui-react';

class AccountTable extends React.Component {

    render() {
        return (
            <Table celled selectable>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell
                            textAlign='center'>Id</Table.HeaderCell>
                        <Table.HeaderCell
                            textAlign='center'>Name</Table.HeaderCell>
                        <Table.HeaderCell
                            textAlign='center'>Type</Table.HeaderCell>
                        <Table.HeaderCell
                            textAlign='center'>Balance</Table.HeaderCell>
                        <Table.HeaderCell
                            textAlign='center'>Actions</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {this.props.accounts.map((account, idx) => (
                        <Table.Row
                            key={idx}>
                            <Table.Cell>{account.id}</Table.Cell>
                            <Table.Cell>{account.name}</Table.Cell>
                            <Table.Cell>{account.type}</Table.Cell>
                            <Table.Cell>{account.balance}</Table.Cell>
                            <Table.Cell textAlign='center'>
                                <Dropdown icon='settings' button className='icon'>
                                    <Dropdown.Menu>
                                        <Dropdown.Item
                                            icon='edit'
                                            text='Edit'
                                            onClick={() => this.props.editCallback(account)}
                                        />
                                        <Dropdown.Item
                                            icon='delete'
                                            text='Delete'
                                            onClick={() => this.props.deleteCallback(account)}
                                        />
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        )
    }

}

export default AccountTable;