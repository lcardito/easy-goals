import React from 'react';
import Client from '../main/Client';
import SortableTable from '../main/SortableTable';
import {Message} from "semantic-ui-react";

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
            <div>
                <Message
                    header='Your personal buckets'
                    content='These are your Money Buckets. Click on one of them to view the bucket history and details.'
                />
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