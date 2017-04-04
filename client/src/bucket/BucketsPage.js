import React from "react";
import Client from "../main/Client";
import {Button, Header, Icon, Table} from "semantic-ui-react";
import {formatValue} from "../utils";
import _ from "lodash";

class BucketsPage extends React.Component {
    constructor() {
        super();

        this.defaultBucket = {
            category: '',
            balance: 0,
            monthly: 0,
            report: []
        };

        this.state = {
            buckets: [],
            showBucket: false,
            selectedBucket: this.defaultBucket,
            sortingBy: ''
        };

        this._getBuckets = this._getBuckets.bind(this);
        this._openReport = this._openReport.bind(this);
        this._openPayment = this._openPayment.bind(this);
        this._sortBy = this._sortBy.bind(this);
    }

    //noinspection JSUnusedGlobalSymbols
    static contextTypes = {
        router: React.PropTypes.object,
    };

    componentWillMount() {
        Client.getBuckets((serverBuckets) => {
            this._getBuckets(serverBuckets);
        })
    }

    _getBuckets(serverBuckets) {
        this.setState({
            buckets: serverBuckets
        });
    }

    _openPayment(item) {
        let path = item ? `/buckets/${item.id}` : `/${this.state.detailPath}/tmp`;
        this.context.router.push(path);
    }

    _openReport(item) {
        let path = item ? `/buckets/${item.id}/report` : `/${this.state.detailPath}/tmp`;
        this.context.router.push(path);
    }

    _sortBy(prop) {
        this.sortingOrder = (this.sortingOrder === 'asc') ? 'desc' : 'asc';
        this.setState({
            items: _.orderBy(this.state.items, [prop], [this.sortingOrder]),
            sortingBy: prop
        })
    }

    render() {
        const itemMapper = (item, h, idx) => {
            return <Table.Cell
                key={idx}>
                {formatValue(item[h.key], h.key)}
            </Table.Cell>
        };

        const headers = [
            {key: 'category', value: 'Category'},
            {key: 'balance', value: 'Balance'},
            {key: 'monthly', value: 'This Month Due'},
            {key: 'createdDate', value: 'Created'}
        ];

        return (
            <div>
                <Header as='h2'>
                    <Icon name='archive'/>
                    <Header.Content>
                        This are your personal buckets
                        <Header.Subheader>
                            These are your Money Buckets. Click on one of them to view the bucket history and details.
                        </Header.Subheader>
                    </Header.Content>
                </Header>
                <Table celled
                       padded
                       sortable
                       striped
                       unstackable
                       selectable>
                    <Table.Header>
                        <Table.Row>
                            {headers.map((h, idx) => {
                                let iconName = 'sort';
                                if (this.state.sortingBy === h.key) {
                                    iconName = this.sortingOrder === 'asc' ? 'sort ascending' : 'sort descending'
                                }

                                return <Table.HeaderCell key={idx} onClick={() => this._sortBy(h.key)}>
                                    <Icon name={iconName}/> {h.value}
                                </Table.HeaderCell>
                            })}
                            <Table.HeaderCell />
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {this.state.buckets.map((item, itemIdx) => (
                            <Table.Row
                                key={itemIdx}>
                                {headers.map((h, idx) => {
                                    return itemMapper(item, h, idx);
                                })}
                                <Table.Cell collapsing textAlign="center">
                                    <Button.Group size="mini" basic compact>
                                        <Button color="blue" icon="edit" onClick={() => this._openPayment(item)}/>
                                        <Button negative icon="table" onClick={() => this._openReport(item)}/>
                                    </Button.Group>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>
        )
    }
}

export default BucketsPage;

BucketsPage.propTypes = {
    visible: React.PropTypes.bool
};

BucketsPage.defaultProps = {
    visible: false
};