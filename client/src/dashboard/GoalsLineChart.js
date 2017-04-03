import React from 'react';
import {Grid, List} from "semantic-ui-react";
import {formatValue} from "../utils";
import Chart from 'chart.js';

class GoalsLineChart extends React.Component {

    constructor() {
        super();
        this.state = {
            graphData: {}
        };

        this._buildGraphData = this._buildGraphData.bind(this);
    }

    componentWillMount() {
        this._buildGraphData(this.props.buckets);
    }

    componentDidMount(){
        let lineCtx = document.getElementById('lineChart');
        const charOpt = {
            responsive: true, maintainAspectRatio: true,
            legend: {
                display: false
            }
        };
        new Chart(lineCtx, {type: 'line', data: this.state.graphData, options: charOpt});
    }

    _buildGraphData(buckets) {
        let dataSets = [];
        let labels = [];
        buckets.forEach((bu) => {

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
                data: data,
                label: bu.category,
                fill: false,
                lineTension: 0,
                borderColor: `rgba(${r}, ${g}, ${b}, 0.1)`,
                pointBorderColor: `rgba(${r}, ${g}, ${b}, 1)`,
                pointBackgroundColor: `rgba(${r}, ${g}, ${b}, 1)`,
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
        return <Grid textAlign="center" stackable={true}>
            <Grid.Row>
                <Grid.Column width={14}>
                    <canvas id="lineChart" />
                </Grid.Column>
                <Grid.Column width={2}>
                    <List divided>
                        {this.state.graphData.datasets.map((ds) => {
                            return <List.Item key={ds.label}>
                                <List.Content style={{backgroundColor: ds.borderColor}}>
                                    <List.Header>{ds.label}</List.Header>
                                </List.Content>
                            </List.Item>
                        })}
                    </List>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    }
}

GoalsLineChart.defaultProps = {
    buckets: []
};

export default GoalsLineChart;