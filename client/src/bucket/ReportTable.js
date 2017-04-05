import React from "react";
import {Accordion, Grid} from "semantic-ui-react";
import Payments from "./Payments";
import ReportItem from "./ReportItem";

class ReportTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            headers: props.headers,
            report: props.report
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            headers: nextProps.headers,
            report: nextProps.report
        })
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
                                item={reportItem} />
                        </Accordion.Title>,
                        <Accordion.Content
                            className="rowBoxed">
                            <Payments payments={reportItem.payments} />
                        </Accordion.Content>
                    ]))}
                </Accordion>
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