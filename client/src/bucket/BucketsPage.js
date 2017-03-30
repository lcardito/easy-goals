import React from 'react';
import Client from '../main/Client';
import SortableTable from '../main/SortableTable';

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
    }

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

    render() {
        return (
            <SortableTable
                headers={[
                    {key: 'category', value: 'Category'},
                    {key: 'balance', value: 'Balance'},
                    {key: 'monthly', value: 'This Month Due'},
                    {key: 'createdDate', value: 'Created'}
                ]}
                items={this.state.buckets}
                editable={false}
                detailPath="buckets"
            />
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