import React from "react";
import {Button, Confirm, Container, Header, Table} from "semantic-ui-react";

class Payments extends React.Component {

    constructor() {
        super();

        this.state = {
            deleting: false,
            toBeDeleted: {}
        };

        this._deletePayment = this._deletePayment.bind(this);
    }

    _deletePayment(p) {
        if (this.state.deleting) {
            //TODO
            // Client.deleteGoal(this.toBeDeleted.id);
            // let idx = _.findIndex(this.state.goals, ['id', this.toBeDeleted.id]);
            // this.setState({
            //     goals: update(this.state.goals, {
            //         $splice: [[idx, 1]]
            //     }),
            //     deleting: false
            // });
        } else {
            this.setState({deleting: true, toBeDeleted: p});
        }
    }

    render() {
        if (this.props.payments.length === 0) {
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
                        {this.props.payments.map((p, idx) => {
                            return <Table.Row
                                key={idx}>
                                <Table.Cell>{p.label}</Table.Cell>
                                <Table.Cell
                                    negative={p.type === 'OUT'}
                                    positive={p.type === 'IN'}>{p.amount}</Table.Cell>
                                {p.type === 'IN' &&
                                <Table.Cell width={1} textAlign="center">
                                    <Button color="red" size="mini" basic compact icon="delete"
                                            onClick={() => this._deletePayment(p)}
                                    />
                                </Table.Cell>
                                }
                            </Table.Row>
                        })}
                    </Table.Body>
                </Table>
                <Confirm
                    open={this.state.deleting}
                    header='This operation can NOT be reverted'
                    content={`Are you sure you want to delete the payment "${this.state.toBeDeleted.label}"?`}
                    onCancel={() => this.setState({deleting: false})}
                    onConfirm={this._deletePayment}
                />
            </div>
        }
    }
}

export default Payments;

Payments.propTypes = {
    payments: React.PropTypes.array
};