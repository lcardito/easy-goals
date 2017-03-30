import React from 'react';
import Client from '../main/Client';
import SortableTable from '../main/SortableTable';
import {Button} from "semantic-ui-react";
import TableAccordion from "../TableAccordion";

class BucketsPage extends React.Component {
    constructor() {
        super();

        this.defaultBucket = {
            category: '',
            balance: 0,
            monthly: 0,
            report: [],
            id: -1
        };

        this.state = {
            buckets: [],
            showBucket: false,
            selectedBucket: this.defaultBucket
        };

        this._getBuckets = this._getBuckets.bind(this);
        this._showBucket = this._showBucket.bind(this);
    }

    componentWillMount() {
        Client.getBuckets((serverBuckets) => {
            this._getBuckets(serverBuckets);
        })
    }

    componentWillReceiveProps(nextProps) {
        Client.getBuckets((serverBuckets) => {
            this._getBuckets(serverBuckets);
        })
    }

    _getBuckets(serverBuckets) {
        this.setState({
            buckets: serverBuckets
        });
    }

    _showBucket(bucket) {
        this.setState({
            selectedBucket: bucket,
            showBucket: true
        });
    };

    render() {
        if (!this.state.showBucket) {
            return (
                <SortableTable
                    editCallback={this._showBucket}
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
        } else {
            return (
                <div>
                    <TableAccordion
                        editable={false}
                        headers={[
                            {key: 'dueDate', value: 'Date'},
                            {key: 'payIn', value: 'Payment In'},
                            {key: 'balance', value: 'Bucket Balance'},
                        ]}
                        items={this.state.selectedBucket.report}
                    />
                    <Button className="marginTopButton"
                            type="button"
                            onClick={() => this.setState({showBucket: false})}>Back</Button>
                </div>
            )
        }
    }
}

export default BucketsPage;

BucketsPage.propTypes = {
    visible: React.PropTypes.bool
};

BucketsPage.defaultProps = {
    visible: false
};