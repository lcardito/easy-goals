import React from 'react';
import {Form, Confirm, Message, Header, Icon, Grid} from "semantic-ui-react";
import Client from "../main/Client";
import {mapStateToProps} from "../transformer";
import {connect} from 'react-redux';
import update from 'immutability-helper';
import moment from "moment";
import {colorMap} from "../utils";
import {TwitterPicker} from "react-color";

class BucketForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            bucket: {
                category: '',
                color: '#008080',
                balance: 0,
                createdDate: moment().format('YYYY-MM-DD')
            },
            confirmOpen: false
        };

        this._saveBucket = this._saveBucket.bind(this);
        this._deleteBucket = this._deleteBucket.bind(this);
        this._updateBucket = this._updateBucket.bind(this);
    }

    //noinspection JSUnusedGlobalSymbols
    static contextTypes = {
        router: React.PropTypes.object,
    };

    componentWillMount() {
        if (!isNaN(this.props.params.bucketId)) {
            Client.bucket.one(this.props.params.bucketId, (bucket) => {
                this.setState({
                    bucket: bucket
                });
            });
        }
    }

    _saveBucket(e) {
        e.preventDefault();
        if (this.state.bucket.id) {
            Client.bucket.edit(this.state.bucket, (edited) => {
                this.context.router.goBack();
            });

        } else {
            Client.bucket.save(this.state.bucket, (saved) => {
                this.context.router.goBack();
            });
        }
    }

    _deleteBucket() {
        Client.bucket.remove(this.state.bucket.id, () => {
            this.context.router.goBack();
        })
    }

    _updateBucket(event) {
        this.setState({
            bucket: update(this.state.bucket, {
                $merge: {[event.target.name]: event.target.value}
            })
        });
        if (event.target.name === 'color') {
            this.setState({colorPickerOpen: !this.state.colorPickerOpen});
        }

    }

    render() {
        return <div>
            <Header as='h2'>
                <Icon name='archive'/>
                <Header.Content>
                    Edit this bucket
                    <Header.Subheader>
                        Adding or editing a bucket
                    </Header.Subheader>
                </Header.Content>
            </Header>
            <Form
                error={this.props.error}
                className='segment'
                onSubmit={this._saveBucket}>
                <Message
                    error
                    header='Error'
                    content='Please correct the errors'/>
                <Grid columns={3}>
                    <Grid.Column>
                        <Form.Input label="Bucket Name" name="category" type="text"
                                    value={this.state.bucket.category}
                                    onChange={this._updateBucket}/>
                    </Grid.Column>
                    <Grid.Column>
                        <Form.Input label="Starting balance" name="balance" type="text"
                                    disabled={this.state.bucket.id >= 0}
                                    value={this.state.bucket.balance}
                                    onChange={this._updateBucket}/>
                    </Grid.Column>
                    <Grid.Column>
                        <Form.Input label="Color" name="color" type="text" readOnly={true}
                                    onClick={() => {
                                        this.setState({colorPickerOpen: !this.state.colorPickerOpen})
                                    }}
                                    value={colorMap[this.state.bucket.color]}>
                        </Form.Input>
                        {this.state.colorPickerOpen ? <div className="onTop"><TwitterPicker
                            triangle="top-right"
                            onChange={(color, event) => this._updateBucket({target: {name: 'color', value: color.hex}})}
                            colors={Object.keys(colorMap)}/></div> : null}
                    </Grid.Column>
                </Grid>
                <Form.Group className="marginTopButton">
                    <Form.Button color="green" type="submit">Save</Form.Button>
                    <Form.Button type="button"
                                 onClick={() => this.context.router.goBack()}>Back</Form.Button>
                    {this.state.bucket.id &&
                    <Form.Button
                        type="button"
                        onClick={() => this.setState({confirmOpen: true})}
                        color="red">Delete</Form.Button>
                    }
                </Form.Group>
            </Form>
            <Confirm
                open={this.state.confirmOpen}
                header='This operation can NOT be reverted'
                content={`Are you sure you want to delete ${this.state.bucket.label}?`}
                onCancel={() => this.setState({confirmOpen: false})}
                onConfirm={this._deleteBucket}
            />
        </div>
    }
}

export default connect(mapStateToProps)(BucketForm);

