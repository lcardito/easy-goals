import React from 'react';
import {Message} from "semantic-ui-react";
import {Line} from "react-chartjs";

import Client from '../main/Client';
import {formatValue} from "../utils";

class DashboardPage extends React.Component {
    constructor() {
        super();

        this.state = {
            buckets: [],
        };

        this._getBuckets = this._getBuckets.bind(this);

    }

    componentWillMount() {
        Client.getBuckets((serverBuckets) => {
            console.log(serverBuckets);
            this._getBuckets(serverBuckets);
        })
    }

    _getBuckets(serverBuckets) {
        this.setState({
            buckets: serverBuckets
        });
    }

    render() {
        function rand(min, max, num) {
            let rtn = [];
            while (rtn.length < num) {
                rtn.push((Math.random() * (max - min)) + min);
            }
            return rtn;
        }

        let data = {
            labels: this.state.buckets.length > 0 ? this.state.buckets[0].report.map((r) => formatValue(r.dueDate, 'date')) : [],
            datasets: [
                {
                    label: "Bucket data",
                    fill: false,
                    fillColor: "rgba(220,220,220,0.2)",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(220,220,220,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: this.state.buckets.length > 0 ? this.state.buckets[0].report.map((r) => r.balance) : []
                }
            ]
        };

        return (
            <div>
                <Message
                    header='Dashboard'
                    content='Your dashboard for a quick view'
                />
                <Line data={data} options={{ responsive: true, maintainAspectRatio: true}} />
            </div>
        )
    }
}

export default DashboardPage;