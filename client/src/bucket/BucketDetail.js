import React from "react";
import Client from "../main/Client";
import TableAccordion from "./TableAccordion";
import * as _ from "lodash";
import {Button, Header, Icon} from "semantic-ui-react";

class BucketDetail extends React.Component {

    constructor() {
        super();
        this.state = {
            report: [],
            category: ''
        };
    }

    //noinspection JSUnusedGlobalSymbols
    static contextTypes = {
        router: React.PropTypes.object,
    };

    componentWillMount() {
        if (!isNaN(this.props.params.bucketId)) {
            Client.getBuckets((serverBuckets) => {
                let bucket = _.find(serverBuckets, _.matchesProperty('id', parseInt(this.props.params.bucketId, 10)));
                this.setState({
                    report: bucket.report,
                    category: bucket.category
                })
            })
        }
    }

    render() {
        return <div>
            <Header as='h2'>
                <Icon name='table' />
                <Header.Content>
                    {this.state.category}
                    <Header.Subheader>
                        Here you can see the trend for this bucket
                    </Header.Subheader>
                </Header.Content>
            </Header>
            <TableAccordion
                editable={false}
                headers={[
                    {key: 'dueDate', value: 'Month'},
                    {key: 'payIn', value: 'Fixed monthly deposit'},
                    {key: 'balance', value: 'Bucket Balance'},
                ]}
                items={this.state.report}
            />
            <Button className="marginTopButton" type="button" onClick={() => this.context.router.goBack()}>Back</Button>
        </div>
    }
}

export default BucketDetail;

BucketDetail.defaultProps = {
    params: {
        bucketId: undefined
    }
};