import React from 'react';
import {Accordion, Grid, List} from 'semantic-ui-react';

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
                    celled
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
                            className="attached rowBoxed"
                            key={idx}>
                            <Grid
                                className="attached"
                                columns={this.state.headers.length}>
                                {this.state.headers.map((h, idx) => (
                                    <Grid.Column
                                        className="cellBoxed"
                                        key={idx}>
                                        {item[h.key]}
                                    </Grid.Column>
                                ))}
                            </Grid>
                        </Accordion.Title>,
                        <Accordion.Content
                            className="rowBoxed">

                            {item.payments.length > 0 &&
                            <List as='ul'>
                                {item.payments.map((p) => ([
                                    <List.Item as="li">{p.name} - {p.cost}</List.Item>
                                ]))}
                            </List>
                            }
                            {item.payments.length === 0 &&
                            <div>No Payment found in this period</div>
                            }
                        </Accordion.Content>
                    ]))}
                </Accordion>
            </div>
        )
    }
}

export default TableAccordion;