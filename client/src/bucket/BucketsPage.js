import React from "react";
import Client from "../main/Client";
import SortableTable from "../main/SortableTable";
import {Dropdown, Header, Icon, Table} from "semantic-ui-react";
import {formatValue} from "../utils";

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
            selectedBucket: this.defaultBucket
        };

        this._getBuckets = this._getBuckets.bind(this);
        this._navigateToDetail = this._navigateToDetail.bind(this);
        this._openPayment = this._openPayment.bind(this)
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

    _openPayment(item, d) {
        let value = d.value;
        if (value && value !== 'none') {
            let path = '';
            if (value === 'edit') {
                path = item ? `/buckets/${item.id}` : `/${this.state.detailPath}/tmp`;
            } else if (value === 'report') {
                path = item ? `/buckets/${item.id}/report` : `/${this.state.detailPath}/tmp`;
            }
            this.context.router.push(path);
        }
    }

    _navigateToDetail(item) {
        let path = item ? `/buckets/${item.id}/report` : `/${this.state.detailPath}/tmp`;
        this.context.router.push(path);
    }

    render() {

        const actionOptions = [
            {key: 'none', text: '', value: 'none'},
            {key: 'report', icon: 'table', text: 'Monthly Report', value: 'report'},
            {key: 'payIn', icon: 'edit', text: 'Add cash', value: 'edit'},
        ];

        const itemMapper = (item, h, idx) => {
            let actionButton =
                <Dropdown
                    icon="settings"
                    onChange={(e, d) => this._openPayment(item, d)}
                    options={actionOptions}
                    floating
                    inline/>;

            let isAction = h.key === 'action';
            let value = isAction
                ? actionButton
                : formatValue(item[h.key], h.key);

            return <Table.Cell
                textAlign={isAction ? 'center' : 'left'}
                key={idx}>
                {value}
            </Table.Cell>
        };

        return (
            <div>
                <Header as='h2'>
                    <Icon name='archive' />
                    <Header.Content>
                        This are your personal buckets
                        <Header.Subheader>
                            These are your Money Buckets. Click on one of them to view the bucket history and details.
                        </Header.Subheader>
                    </Header.Content>
                </Header>
                <SortableTable
                    headers={[
                        {key: 'category', value: 'Category'},
                        {key: 'balance', value: 'Balance'},
                        {key: 'monthly', value: 'This Month Due'},
                        {key: 'createdDate', value: 'Created'},
                        {key: 'action', value: 'Actions'}
                    ]}
                    itemMapper={itemMapper}
                    items={this.state.buckets}
                    editable={false}
                />
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