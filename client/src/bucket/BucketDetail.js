import React from "react";
import Client from "../main/Client";
import TableAccordion from "./TableAccordion";
import * as _ from "lodash";
import {Message} from "semantic-ui-react";

class BucketDetail extends React.Component {

    constructor() {
        super();
        this.state = {
            report: []

        };
    }

    componentWillMount() {
        if (!isNaN(this.props.params.bucketId)) {
            Client.getBuckets((serverBuckets) => {
                this.setState({
                    report: _.find(serverBuckets, _.matchesProperty('id', parseInt(this.props.params.bucketId, 10))).report
                })
            })
        }
    }

    render() {
        return <div>
            <Message
                header='Bucket detail'
                content='These is the report for your Buckets. Click on one of them to view the payments you might have to make.'
            />
            <TableAccordion
                editable={false}
                headers={[
                    {key: 'dueDate', value: 'Date'},
                    {key: 'payIn', value: 'Payment In'},
                    {key: 'balance', value: 'Bucket Balance'},
                ]}
                items={this.state.report}
            />
        </div>
    }
}

export default BucketDetail;

BucketDetail.defaultProps = {
    params: {
        bucketId: undefined
    }
};