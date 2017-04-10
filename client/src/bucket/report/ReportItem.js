import React from 'react';
import {formatValue} from "../../utils";
import {Grid} from "semantic-ui-react";
import _ from "lodash";

class ReportItem extends React.Component {

    render() {
        return <Grid
            className="attached"
            celled='internally'
            columns={this.props.itemKeys.length}>
            {this.props.itemKeys.map((h, idx) => {
                let value = this.props.item[h.key];
                if (h.key === 'paymentsIn') {
                    let pIn = this.props.item.payments.filter((t) => t.type === 'IN');
                    value = _.sumBy(pIn, 'amount');
                }
                if (h.key === 'paymentsOut') {
                    let pOut = this.props.item.payments.filter((t) => t.type === 'OUT');
                    value = _.sumBy(pOut, 'amount');
                }
                return <Grid.Column
                    key={idx}>
                    {formatValue(value, h.key)}
                </Grid.Column>
            })}
        </Grid>;
    }
}

ReportItem.propTypes = {
    item: React.PropTypes.object,
    itemKeys: React.PropTypes.array
};

ReportItem.defaultProps = {
    item: {
        payments: []
    },
    itemKeys: []
};

export default ReportItem;