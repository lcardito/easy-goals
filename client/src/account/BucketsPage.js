import React from 'react';
import Client from '../main/Client';
import SortableTable from '../main/SortableTable';
import GenericForm from '../main/GenericForm';
import update from 'immutability-helper';
import _ from 'lodash';
import {Message} from 'semantic-ui-react';

class BucketsPage extends React.Component {
    constructor() {
        super();

        this.defaultBucket = {
            name: '',
            category: '',
            balance: 0,
            monthly: 0,
            id: -1
        };

        this.state = {
            buckets: [],
            showForm: false,
            selectedBucket: this.defaultBucket
        };

        this._getBuckets = this._getBuckets.bind(this);
        this._saveBucket = this._saveBucket.bind(this);
        this._updateBucket = this._updateBucket.bind(this);
        this._editBucket = this._editBucket.bind(this);
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
            showForm: false,
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

    _editBucket(bucket) {
        this.setState({
            selectedBucket: bucket,
            showForm: true
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

        if (!this.state.showForm) {
            return (
                <SortableTable
                    editCallback={this._editBucket}
                    addNewCallback={() => this.setState({showForm: true})}
                    headers={[
                        {key: 'name', value: 'Name'},
                        {key: 'category', value: 'Category'},
                        {key: 'balance', value: 'Balance'},
                        {key: 'monthly', value: 'Monthly Due'}
                    ]}
                    items={this.state.buckets}
                    editable={true}
                />
            )
        } else {
            return (
                <div>
                    <Message
                        attached={true}
                        header='Add/Edit an bucket'
                        content='Fill out the form below to add/edit a new bucket'
                    />
                    <GenericForm
                        fields={[
                            {key: 'name', value: 'Name'},
                            {key: 'category', value: 'Category'},
                            {key: 'balance', value: 'Balance'}
                        ]}
                        item={this.state.selectedBucket}
                        submitCallback={this._saveBucket}
                        cancelCallback={() => this.resetState()}
                        deleteCallback={this._deleteBucket}
                        editing={this.state.selectedBucket.id !== -1}
                    />
                </div>
            )
        }
    }
}

export default BucketsPage;