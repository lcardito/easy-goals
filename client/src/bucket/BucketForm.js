import React from "react";
import Client from "../main/Client";
import {Header, Icon, Table, Button, Confirm} from "semantic-ui-react";

import update from "immutability-helper";
import moment from "moment";
import _ from "lodash";
import EditablePaymentRow from "./EditablePaymentRow";

class BucketForm extends React.Component {

    constructor() {
        super();

        this.state = {
            payments: [],
            sortingBy: '',
            deleting: false
        };

        this.headers = [
            {key: 'label', value: 'Label'},
            {key: 'amount', value: 'Amount'},
            {key: 'type', value: 'Type'},
            {key: 'dueDate', value: 'Date'}
        ];

        this._addPayment = this._addPayment.bind(this);
        this._addNewPayment = this._addNewPayment.bind(this);
        this._exitEditItem = this._exitEditItem.bind(this);
        this._deletePayment = this._deletePayment.bind(this);
    }

    //noinspection JSUnusedGlobalSymbols
    static contextTypes = {
        router: React.PropTypes.object,
    };

    componentWillMount() {
        if (!isNaN(this.props.params.bucketId)) {
            Client.bucket.one(this.props.params.bucketId, (bucket) => {
                Client.payment.all(bucket.category, (payments) => {
                    this.setState({
                        payments: payments
                    });
                });
            })
        }
    }

    _addPayment(payment) {
        let idx = _.findIndex(this.state.payments, ['id', payment.id]);
        if (!payment.id) {
            Client.payment.save(payment, (newPayment) => {
                let payments = this.state.payments;
                this.setState({
                    payments: update(payments, {
                        $splice: [[idx, 1, newPayment[0]]]
                    })
                })
            });
        } else {
            Client.payment.edit(payment, (updatedPayments) => {
                let payments = this.state.payments;
                this.setState({
                    payments: update(payments, {
                        $splice: [[idx, 1, updatedPayments[0]]]
                    })
                });
            });
        }
    }

    _exitEditItem(item) {
        if (!item.id) {
            this.setState({
                payments: update(this.state.payments, {
                    $splice: [[this.state.payments.length - 1, 1]]
                })
            });
        }
    }

    _deletePayment(payment) {
        if (this.state.deleting) {
            Client.payment.remove(this.toBeDeleted.id);
            let idx = _.findIndex(this.state.payments, ['id', this.toBeDeleted.id]);
            this.setState({
                payments: update(this.state.payments, {
                    $splice: [[idx, 1]]
                }),
                deleting: false
            });
        } else {
            this.toBeDeleted = payment;
            this.setState({deleting: true});
        }
    }

    _sortBy(prop) {
        this.sortingOrder = (this.sortingOrder === 'asc') ? 'desc' : 'asc';
        this.setState({
            payments: _.orderBy(this.state.payments, [prop], [this.sortingOrder]),
            sortingBy: prop
        })
    }

    _addNewPayment() {
        if (this.state.payments.length === 0 || _.last(this.state.payments).id) {
            let payments = this.state.payments;
            this.setState({
                payments: update(payments, {
                    $push: [{
                        label: '',
                        amount: 0,
                        category: this.state.payments[0].category,
                        dueDate: moment().format('YYYY-MM-DD')
                    }]
                })
            });
        }
    }


    _headerMapper = (h, idx) => {
        let iconName = 'sort';
        if (this.state.sortingBy === h.key) {
            iconName = this.sortingOrder === 'asc' ? 'sort ascending' : 'sort descending'
        }

        return (
            <Table.HeaderCell key={idx} onClick={() => this._sortBy(h.key)}>
                <Icon name={iconName}/> {h.value}
            </Table.HeaderCell>
        )
    };

    render() {
        return <div>
            <Header as='h2'>
                <Icon name='target'/>
                <Header.Content>
                    Bucket SOME payments
                    <Header.Subheader>
                        There are the current payments in the bucket
                    </Header.Subheader>
                </Header.Content>
            </Header>
            <Table celled padded sortable striped selectable>
                <Table.Header>
                    <Table.Row>
                        {this.headers.map((h, idx) => {
                            return this._headerMapper(h, idx);
                        })}
                        <Table.HeaderCell />
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {this.state.payments.map((payment, itemIdx) => (
                        <EditablePaymentRow
                            key={itemIdx}
                            editing={!payment.id}
                            payment={payment}
                            paymentKeys={this.headers}
                            saveCallback={this._addPayment}
                            deleteCallback={this._deletePayment}
                            undoCallback={this._exitEditItem}
                        />
                    ))}
                </Table.Body>
                <Table.Footer fullWidth>
                    <Table.Row>
                        <Table.HeaderCell colSpan={this.headers.length + 1}>
                            <Button
                                floated='left'
                                icon
                                size='tiny'
                                labelPosition='left'
                                onClick={this._addNewPayment}
                                primary>
                                <Icon name="add circle"/>Add New
                            </Button>
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Footer>
            </Table>
            <Confirm
                open={this.state.deleting}
                header='This operation can NOT be reverted'
                content='Are you sure you want to delete this?'
                onCancel={() => this.setState({deleting: false})}
                onConfirm={() => this._deletePayment()}
            />
        </div>
    }
}

export default BucketForm;