import React from 'react';
import {Accordion, Grid, Container, Header, Table} from 'semantic-ui-react';
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
                    {this.state.items.map((item, idx) => ([
                        <Accordion.Title
                            className={idx % 2 !== 0 ? 'stripedRow attached rowBoxed' : 'attached rowBoxed'}
                            key={idx}>
                            <Grid
                                className="attached"
                                celled='internally'
                                columns={this.state.headers.length}>
                                {this.state.headers.map((h, idx) => {
                                    return <Grid.Column
                                        key={idx}>
                                        {formatValue(item[h.key], h.key)}
                                    </Grid.Column>
                                })}
                            </Grid>
                        </Accordion.Title>,
                        <Accordion.Content
                            className="rowBoxed">
                            {item.payments.length > 0 &&
                            <Container text fluid>
                                <Header as='h4'>Payments at this date</Header>
                                <Table celled size='small'>
                                    <Table.Body>
                                        {item.payments.map((p, idx) => (
                                            <Table.Row key={idx}>
                                                <Table.Cell>{p.name}</Table.Cell>
                                                <Table.Cell>{p.cost}</Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table>
                            </Container>
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