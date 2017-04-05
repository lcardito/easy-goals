import React from "react";
import {Button, Container, Header, Table} from "semantic-ui-react";

class Payments extends React.Component {

    constructor(props) {
        super();

        this.state = {
            payments: props.payments
        };
    }

    componentWillReceiveProps(nextProps){
        this.state = {
            payments: nextProps.payments
        };
    }

    render() {
        if (this.state.payments.length === 0) {
            return <Container text fluid>
                <Header as='h4'>No expected payments</Header>
            </Container>;
        } else {
            return <div>
                <Table
                    celled
                    padded
                    striped
                    unstackable
                    style={{width: '50%', margin: '0 auto'}}>
                    <Table.Header fullWidth>
                        <Table.Row>
                            <Table.HeaderCell colSpan='3'>Transactions at this date</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {this.state.payments.map((p, idx) => {
                            return <Table.Row
                                key={idx}>
                                <Table.Cell>{p.label}</Table.Cell>
                                <Table.Cell
                                    negative={p.type === 'OUT'}
                                    positive={p.type === 'IN'}>{p.amount}</Table.Cell>
                                {p.type === 'IN' &&
                                <Table.Cell width={1} textAlign="center">
                                    <Button color="red" size="mini" basic compact icon="delete"
                                            onClick={() => this.props.deleteCallback(p)}
                                    />
                                </Table.Cell>
                                }
                            </Table.Row>
                        })}
                    </Table.Body>
                </Table>
            </div>
        }
    }
}

export default Payments;

Payments.propTypes = {
    payments: React.PropTypes.array,
    deleteCallback: React.PropTypes.func
};