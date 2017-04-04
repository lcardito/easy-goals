import React from 'react';
import {Message} from "semantic-ui-react";

import Client from '../main/Client';
import GoalsLineChart from "./GoalsLineChart";

class DashboardPage extends React.Component {
    constructor() {
        super();

        this.state = {
            graphData: {}
        };

        this._setBuckets = this._setBuckets.bind(this);
    }

    componentWillMount() {
        Client.getBuckets((serverBuckets) => {
            this._setBuckets(serverBuckets);
        })
    }

    _setBuckets(serverBuckets) {
        this.setState({
            buckets: serverBuckets
        })
    }

    render() {
        return (
            <div>
                {this.state.buckets &&
                <GoalsLineChart
                    buckets={this.state.buckets}
                />
                }
            </div>
        )
    }
}

export default DashboardPage;