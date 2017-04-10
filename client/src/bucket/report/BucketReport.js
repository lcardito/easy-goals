import React from "react";
import Client from "../../main/Client";
import * as _ from "lodash";
import {Button, Header, Icon} from "semantic-ui-react";
import ReportTable from "./ReportTable";

class BucketReport extends React.Component {

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
            Client.bucket.all((serverBuckets) => {
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
            <ReportTable
                editable={false}
                headers={[
                    {key: 'dueDate', value: 'Month'},
                    {key: 'payIn', value: 'Calculated deposit'},
                    {key: 'balance', value: 'Bucket balance'},
                    {key: 'paymentsIn', value: 'Money in'},
                    {key: 'paymentsOut', value: 'Money out'}
                ]}
                report={this.state.report}
            />
            <Button className="marginTopButton" type="button" onClick={() => this.context.router.goBack()}>Back</Button>
        </div>
    }
}

export default BucketReport;

BucketReport.defaultProps = {
    params: {
        bucketId: undefined
    }
};