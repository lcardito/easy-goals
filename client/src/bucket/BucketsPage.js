import React from "react";
import Client from "../main/Client";
import {Button, Card, Header, Icon, Grid, Input, Form} from "semantic-ui-react";
import {colorMap, formatValue} from "../utils";
import _ from "lodash";
import {TwitterPicker} from "react-color";
import update from "immutability-helper";
import moment from "moment";

class BucketsPage extends React.Component {
    constructor() {
        super();

        this.state = {
            buckets: [],
            showBucket: false,
            category: '',
            balance: 0,
            sortingBy: '',
            colorPickerOpen: ''
        };

        this._getBuckets = this._getBuckets.bind(this);
        this._openReport = this._openReport.bind(this);
        this._openPayment = this._openPayment.bind(this);
        this._openColorPicker = this._openColorPicker.bind(this);
        this._updateColor = this._updateColor.bind(this);
        this._addNewBucket = this._addNewBucket.bind(this);
    }

    //noinspection JSUnusedGlobalSymbols
    static contextTypes = {
        router: React.PropTypes.object,
    };

    componentWillMount() {
        Client.bucket.all((serverBuckets) => {
            this._getBuckets(serverBuckets);
        })
    }

    _getBuckets(serverBuckets) {
        this.setState({
            buckets: serverBuckets
        });
    }

    _openPayment(item) {
        let path = `/buckets/${item.id}`;
        this.context.router.push(path);
    }

    _openReport(item) {
        let path = `/buckets/${item.id}/report`;
        this.context.router.push(path);
    }

    _openColorPicker(item) {
        this.setState({
            colorPickerOpen: this.state.colorPickerOpen === item.id ? '' : item.id
        });
    }

    _updateColor(item, hex) {
        let idx = _.findIndex(this.state.buckets, item);
        let newBucket = item;
        newBucket.color = hex;
        let buckets = this.state.buckets;

        Client.bucket.edit(newBucket, (updatedBuckets) => {
            this.setState({
                buckets: update(buckets, {
                    $splice: [[idx, 1, updatedBuckets[0]]]
                }),
                colorPickerOpen: ''
            });
        });
    }

    _addNewBucket() {
        Client.bucket.save({
            category: this.state.category,
            balance: this.state.balance,
            createdDate: moment().format('YYYY-MM-DD')
        }, (saved) => {
            let buckets = this.state.buckets;
            buckets.push(saved);

            this.setState({
                buckets: buckets
            });
        });
    }

    render() {
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
                <Grid columns={3} style={{width: '80%', height: '30%', margin: '1em auto'}}>
                    {this.state.buckets.map((bucket, bucketIdx) => (
                        <Grid.Column key={bucketIdx}>
                            <Card color={colorMap[bucket.color]} fluid>
                                <Card.Content>
                                    <Card.Header>
                                        {bucket.category}
                                    </Card.Header>
                                    <Card.Meta>
                                        Current balance: {bucket.balance}
                                    </Card.Meta>
                                    <Card.Description>
                                        Created in: <strong>{formatValue(bucket.createdDate, 'date')}</strong>
                                    </Card.Description>
                                </Card.Content>
                                <Card.Content extra>
                                    <Button.Group className="three" basic compact>
                                        <Button color="blue" icon="payment" onClick={() => this._openPayment(bucket)}/>
                                        <Button negative icon="table" onClick={() => this._openReport(bucket)}/>
                                        <Button negative icon="edit" onClick={() => this._openColorPicker(bucket)}/>
                                    </Button.Group>
                                </Card.Content>
                            </Card>
                            {this.state.colorPickerOpen === bucket.id ? <div className="onTop"><TwitterPicker
                                triangle="top-right"
                                onChange={(color, event) => this._updateColor(bucket, color.hex)}
                                colors={Object.keys(colorMap)}/></div> : null}
                        </Grid.Column>
                    ))}
                    <Grid.Column>
                        <Card fluid>
                            <Card.Content>
                                <Form.Group widths='equal'>
                                    <Input
                                        fluid
                                        label="Category"
                                        size="medium"
                                        onChange={(e) => this.setState({
                                            category: e.target.value
                                        })}
                                        type="text"/>
                                    <Input
                                        fluid
                                        className="marginTopButton"
                                        label="Initial balance"
                                        size="small"
                                        onChange={(e) => this.setState({
                                            balance: e.target.value
                                        })}
                                        type="text"/>
                                </Form.Group>
                            </Card.Content>

                            <Button basic compact icon="add circle" onClick={this._addNewBucket}/>

                        </Card>
                    </Grid.Column>
                </Grid>
            </div>
        );
    }
}

export default BucketsPage;

BucketsPage.propTypes = {
    visible: React.PropTypes.bool
};

BucketsPage.defaultProps = {
    visible: false
};