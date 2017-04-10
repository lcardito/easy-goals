import React from "react";
import {Accordion, Confirm, Grid} from "semantic-ui-react";
import Payments from "./ReportPayments";
import ReportItem from "./ReportItem";
import Client from "../../main/Client";
import _ from "lodash";
import update from "immutability-helper";

class ReportTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            headers: props.headers,
            report: props.report,
            deleting: false,
            toBeDeleted: {}
        };

        this._deletePayment = this._deletePayment.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            headers: nextProps.headers,
            report: nextProps.report
        })
    }

    _deletePayment(p) {
        if (this.state.deleting) {
            Client.payment.remove(this.state.toBeDeleted.id);
            let reportItem = _.find(this.state.report, (ri) => {
                return ri.payments.indexOf(this.state.toBeDeleted) !== -1;
            });
            let riIdx = _.findIndex(this.state.report, reportItem);
            let paymentIdx = _.findIndex(reportItem.payments, ['id', this.state.toBeDeleted.id]);

            this.setState({
                deleting: false,
                report: update(this.state.report, {[riIdx]: { payments: {$splice: [[paymentIdx, 1]]} }}),
            });
        } else {
            this.setState({deleting: true, toBeDeleted: p});
        }
    }

    render() {
        return (
            <div>
                <Grid
                    className="textBold noMargin"
                    celled={true}
                    columns={this.props.headers.length}>
                    {this.state.headers.map((h, idx) => (
                        <Grid.Column
                            key={idx}>
                            {h.value}
                        </Grid.Column>
                    ))}
                </Grid>
                <Accordion
                    className="boxed"
                    exclusive={true}
                    fluid>
                    {this.state.report.map((reportItem, itemIdx) => ([
                        <Accordion.Title
                            className={itemIdx % 2 !== 0 ? 'stripedRow attached rowBoxed' : 'attached rowBoxed'}
                            key={itemIdx}>
                            <ReportItem
                                itemKeys={this.state.headers}
                                item={reportItem}/>
                        </Accordion.Title>,
                        <Accordion.Content
                            className="rowBoxed">
                            <Payments
                                payments={reportItem.payments}
                                deleteCallback={this._deletePayment}
                            />
                        </Accordion.Content>
                    ]))}
                </Accordion>
                <Confirm
                    open={this.state.deleting}
                    header='This operation can NOT be reverted'
                    content={`Are you sure you want to delete the payment "${this.state.toBeDeleted.label}"?`}
                    onCancel={() => this.setState({deleting: false})}
                    onConfirm={this._deletePayment}
                />
            </div>
        )
    }
}

export default ReportTable;

ReportTable.propTypes = {
    headers: React.PropTypes.array,
    report: React.PropTypes.array
};

ReportTable.defaultProps = {
    headers: [],
    report: []
};