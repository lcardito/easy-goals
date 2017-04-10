import React from 'react';
import {Grid, List, Message} from "semantic-ui-react";
import {formatValue} from "../utils";
import Chart from 'chart.js';

class GoalsLineChart extends React.Component {

    constructor() {
        super();
        this.state = {
            lineGraphData: {}
        };

        this._buildGraphData = this._buildGraphData.bind(this);
    }

    componentWillMount() {
        this._buildGraphData(this.props.buckets);
    }

    componentDidMount() {
        let lineCtx = document.getElementById('lineChart');
        let pieCtx = document.getElementById('pieChart');
        const charOpt = {
            responsive: true,
            maintainAspectRatio: true,
            legend: {
                display: false
            }
        };
        new Chart(lineCtx, {type: 'line', data: this.state.lineGraphData, options: charOpt});
        new Chart(pieCtx, {type: 'pie', data: this.state.pieGraphData, options: charOpt});

    }

    _buildGraphData(buckets) {
        let lineDataSets = [];
        let labels = [];
        let pieDatasets = [{
            data: [],
            backgroundColor: [],
            hoverBackgroundColor: []
        }];
        let pieLabels = [];
        buckets.forEach((bu) => {

            let tmpLabels = [];
            let lineData = [];
            let sum = 0;
            bu.report.forEach((r) => {
                tmpLabels.push(formatValue(r.dueDate, 'date'));
                lineData.push(r.balance);
                sum += r.payIn;
            });

            while (lineData.length < labels.length) {
                lineData.push(0);
            }

            if (tmpLabels.length > labels.length) {
                labels = tmpLabels;
            }

            pieLabels.push(bu.category);
            pieDatasets[0].data.push(sum);
            pieDatasets[0].backgroundColor.push(bu.color);
            pieDatasets[0].hoverBackgroundColor.push(bu.color);

            lineDataSets.push({
                data: lineData,
                label: bu.category,
                fill: false,
                lineTension: 0,
                borderColor: bu.color,
                pointBorderColor: bu.color,
                pointBackgroundColor: bu.color,
            });
        });

        this.setState({
            lineGraphData: {
                labels: labels,
                datasets: lineDataSets
            },
            pieGraphData: {
                labels: pieLabels,
                datasets: pieDatasets
            }
        });
    }

    render() {
        return <Grid stackable={true}>
            <Grid.Row centered={true}>
                <Grid.Column width={4} textAlign="center">
                    <List divided>
                        {this.state.lineGraphData.datasets.map((ds) => {
                            return <List.Item key={ds.label}>
                                <List.Content style={{backgroundColor: ds.borderColor}}>
                                    <List.Header>{ds.label}</List.Header>
                                </List.Content>
                            </List.Item>
                        })}
                    </List>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column width={13}>
                    <canvas id="lineChart"/>
                </Grid.Column>
                <Grid.Column width={3}>
                    <Message
                        info={true}
                        header='Trend'
                        content='Have a look at your trends, month by month'
                    />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column width={4}>
                    <canvas id="pieChart"/>
                </Grid.Column>
                <Grid.Column width={9}>
                    <Message
                        info={true}
                        header='Totals'
                        content='A quick view or your categories totals'/>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    }
}

GoalsLineChart.defaultProps = {
    buckets: []
};

export default GoalsLineChart;