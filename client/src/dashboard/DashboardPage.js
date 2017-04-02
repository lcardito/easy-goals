import React from 'react';
import {Grid, List, Message} from "semantic-ui-react";

import Client from '../main/Client';
import {formatValue} from "../utils";

const LineChart = require("react-chartjs").Line;

class DashboardPage extends React.Component {
    constructor() {
        super();

        this.state = {
            graphData: {},
            graphLegend: ''
        };

        this._buildGraphData = this._buildGraphData.bind(this);
    }

    componentWillMount() {
        Client.getBuckets((serverBuckets) => {
            this._buildGraphData(serverBuckets);
        })
    }

    _buildGraphData(serverBuckets) {
        let dataSets = [];
        let labels = [];
        serverBuckets.forEach((bu) => {

            let tmpLabels = [];
            let data = [];
            bu.report.forEach((r) => {
                tmpLabels.push(formatValue(r.dueDate, 'date'));
                data.push(r.balance);
            });

            while (data.length < labels.length) {
                data.push(0);
            }

            if (tmpLabels.length > labels.length) {
                labels = tmpLabels;
            }

            let r = (Math.floor(Math.random() * 256));
            let g = (Math.floor(Math.random() * 256));
            let b = (Math.floor(Math.random() * 256));

            dataSets.push({
                label: bu.category,
                data: data,
                fill: false,
                fillColor: `rgba(${r}, ${g}, ${b}, 0.2)`,
                strokeColor: `rgba(${r}, ${g}, ${b}, 0.1)`,
                pointColor: `rgba(${r}, ${g}, ${b}, 1)`,
                pointHighlightStroke: `rgba(${r}, ${g}, ${b}, 1)`,
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff"
            });
        });

        this.setState({
            graphData: {
                labels: labels,
                datasets: dataSets
            }
        });
    }

    render() {
        const charOpt = {
            responsive: true, maintainAspectRatio: true, bezierCurve: false
        };

        return (
            <div>
                <Message
                    header='Dashboard'
                    content='Your dashboard for a quick view'
                />
                {this.state.graphData.datasets &&
                <Grid textAlign="center">
                    <Grid.Row>
                        <Grid.Column width={14}>
                            <LineChart data={this.state.graphData} options={charOpt}/>
                        </Grid.Column>
                        <Grid.Column width={2}>
                            <List divided>
                                {this.state.graphData.datasets.map((ds) => {
                                    return <List.Item key={ds.label}>
                                        <List.Content style={{backgroundColor: ds.strokeColor}}>
                                            <List.Header>{ds.label}</List.Header>
                                        </List.Content>
                                    </List.Item>
                                })}
                            </List>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                }
            </div>
        )
    }
}

export default DashboardPage;