import React from 'react';
import {Container, Header, Table} from "semantic-ui-react";

class Payments extends React.Component {

    render() {
        if (this.props.payments.length === 0) {
            return <Container text fluid>
                <Header as='h4'>No expected payments</Header>
            </Container>;
        } else {
            return <Table
                celled
                padded
                striped
                unstackable
                style={{width: '50%', margin: '0 auto'}}>
                <Table.Header fullWidth>
                    <Table.Row>
                        <Table.HeaderCell colSpan='2'>Transactions at this date</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {this.props.payments.map((p, idx) => {
                        return <Table.Row
                            key={idx}>
                            <Table.Cell>{p.label}</Table.Cell>
                            <Table.Cell
                                negative={p.type === 'OUT'}
                                positive={p.type === 'IN'}>{p.amount}</Table.Cell>
                        </Table.Row>
                    })}
                </Table.Body>
            </Table>
        }
    }
}

export default Payments;

Payments.propTypes = {
    payments: React.PropTypes.array
};