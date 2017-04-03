import React from 'react';
import {Accordion, Grid, Container, Header, Table, Icon} from 'semantic-ui-react';
import {formatValue} from "../utils";

class TableAccordion extends React.Component {

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
                                    return <Grid.Column
                                        key={idx}>
                                        {formatValue(item[h.key], h.key)}
                                        {idx === this.state.headers.length - 1 &&
                                        item.payments.length > 0 &&
                                        <Icon className="floatRight" name="money"/>
                                        }
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
                                stackable
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

export default TableAccordion;

TableAccordion.propTypes = {
    headers: React.PropTypes.array,
    items: React.PropTypes.array
};