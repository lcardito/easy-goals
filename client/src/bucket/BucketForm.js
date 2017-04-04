import React from "react";
import Client from "../main/Client";
import {Header, Icon} from "semantic-ui-react";
import GenericForm from "../main/GenericForm";

import update from "immutability-helper";
import moment from "moment";

class BucketForm extends React.Component {

    constructor() {
        super();

        this.state = {
            payment: {
                category: '',
                label: '',
                amount: 0,
                type: 'IN'
            }
        };

        this._saveBucket = this._saveBucket.bind(this);
    }

    //noinspection JSUnusedGlobalSymbols
    static contextTypes = {
        router: React.PropTypes.object,
    };

    componentWillMount() {
        if (!isNaN(this.props.params.bucketId)) {
            Client.getBucket(this.props.params.bucketId, (bucket) => {
                this.setState({
                    payment: update(this.state.payment, {
                        $merge: {
                            category: bucket.category
                        }
                    })
                })
            })
        }
    }

    _saveBucket(payment) {
        payment.dueDate = moment().format('YYYY-MM-DD');
        Client.addPayment(payment, () => {
            this.context.router.goBack();
        })
    }

    render() {
        return <div>
            <Header as='h2'>
                <Icon name='add square' />
                <Header.Content>
                    Bucket - {this.state.payment.category}
                    <Header.Subheader>
                        Add some cash to reach your goals quicker!
                    </Header.Subheader>
                </Header.Content>
            </Header>
            <GenericForm
                fields={[
                    {key: 'label', value: 'Label', disabled: false},
                    {key: 'amount', value: 'Extra cash', disabled: false},
                    {key: 'category', value: 'Category', disabled: true}
                ]}
                item={this.state.payment}
                submitCallback={this._saveBucket}
            />
        </div>
    }
}

export default BucketForm;