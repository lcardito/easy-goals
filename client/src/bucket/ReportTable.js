import React from 'react';
import {Accordion, Grid, Container, Header, Table} from 'semantic-ui-react';
import {formatValue} from "../utils";
import _ from "lodash";

class ReportTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            headers: props.headers ? props.headers : [],
            items: props.items ? props.items : []
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            headers: nextProps.headers,
            items: nextProps.items
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
                    {this.state.items.map((item, itemIdx) => ([
                        <Accordion.Title
                            className={itemIdx % 2 !== 0 ? 'stripedRow attached rowBoxed' : 'attached rowBoxed'}
                            key={itemIdx}>
                            <Grid
                                className="attached"
                                celled='internally'
                                columns={this.state.headers.length}>
                                {this.state.headers.map((h, idx) => {
                                    let value = item[h.key];
                                    if(h.key === 'paymentsIn') {
                                        let pIn = item.payments.filter((t) => t.type === 'IN');
                                        value = _.sumBy(pIn, 'amount');
                                    }
                                    if(h.key === 'paymentsOut') {
                                        let pOut = item.payments.filter((t) => t.type === 'OUT');
                                        value = _.sumBy(pOut, 'amount');
                                    }
                                    return <Grid.Column
                                        key={idx}>
                                        {formatValue(value, h.key)}
                                    </Grid.Column>
                                })}
                            </Grid>
                        </Accordion.Title>,
                        <Accordion.Content
                            className="rowBoxed">
                            {item.payments.length > 0 &&
                            <Table
                                celled
                                padded
                                striped
                                unstackable
                                style={{width: '50%', margin: '0 auto'}}>
                                <Table.Header fullWidth>
                                    <Table.Row>
                                        <Table.HeaderCell colSpan='2'>Transactions at this date</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {item.payments.map((p, idx) => {
                                        return <Table.Row
                                            key={idx}>
                                            <Table.Cell>{p.label}</Table.Cell>
                                            <Table.Cell
                                                negative={p.type === 'OUT'}
                                                positive={p.type === 'IN'}>{p.amount}</Table.Cell>
                                        </Table.Row>
                                    })}
                                </Table.Body>
                            </Table>
                            }
                            {item.payments.length === 0 &&
                            <Container text fluid>
                                <Header as='h4'>No expected payments</Header>
                            </Container>
                            }
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
    items: React.PropTypes.array
};