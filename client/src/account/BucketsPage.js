import React from 'react';
import Client from '../main/Client';
import SortableTable from '../main/SortableTable';
import GenericForm from '../main/GenericForm';
import update from 'immutability-helper';
import _ from 'lodash';
import {Message} from 'semantic-ui-react';
import moment from 'moment';

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
            tracks: [],
            showBucket: false,
            selectedBucket: this.defaultBucket
        };

        this._getBuckets = this._getBuckets.bind(this);
        this._saveBucket = this._saveBucket.bind(this);
        this._updateBucket = this._updateBucket.bind(this);
        this._showBucket = this._showBucket.bind(this);
        this._deleteBucket = this._deleteBucket.bind(this);
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

    resetState(buckets) {
        this.setState({
            buckets: buckets ? buckets : this.state.buckets,
            showBucket: false,
            selectedBucket: this.defaultBucket
        });
    }

    _saveBucket(bucket) {
        if (bucket.id === -1) {
            Client.addBucket(bucket, (savedBucket) => {
                this.resetState(update(this.state.buckets, {$push: [savedBucket]}));
            });
        } else {
            Client.editBucket(bucket, (savedBucket) => {
                let bucketIdx = _.findIndex(this.state.buckets, (a) => {
                    return a.id === savedBucket.id
                });
                this.resetState(update(this.state.buckets, {[bucketIdx]: {$set: savedBucket}}));
            });
        }
    }

    _updateBucket(event) {
        this.setState({
            selectedBucket: update(this.state.selectedBucket, {
                $merge: {[event.target.name]: event.target.value}
            })
        });
    }

    _showBucket(bucket) {
        this.setState({
            selectedBucket: bucket,
            showBucket: true
        });
    };

    _deleteBucket(bucket) {
        Client.deleteBucket(bucket.id);
        let bucketIdx = _.findIndex(this.state.buckets, (g) => {
            return g.id === bucket.id
        });
        this.resetState(update(this.state.buckets, {$splice: [[bucketIdx, 1]]}));
    }

    render() {
        if (!this.props.visible) {
            return false;
        }

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
                    editable={true}
                />
            )
        } else {
            return (
                <SortableTable
                    editable={false}
                    headers={[
                        {key: 'date', value: 'Date'},
                        {key: 'payIn', value: 'Payment In'},
                        {key: 'payOut', value: 'Goal Cost'},
                        {key: 'balance', value: 'Bucket Balance'},
                    ]}
                    items={this.state.selectedBucket.report}
                />
            )
        }
    }
}

export default BucketsPage;