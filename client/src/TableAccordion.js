import React from 'react';
import {Accordion, Grid} from 'semantic-ui-react';
import {Message} from "semantic-ui-react";

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
                            className={idx % 2 !== 0 ? 'stripedRow attached rowBoxed' : 'attached rowBoxed'}
                            key={idx}>
                            <Grid
                                className="attached"
                                celled='internally'
                                columns={this.state.headers.length}>
                                {this.state.headers.map((h, idx) => (
                                    <Grid.Column
                                        key={idx}>
                                        {item[h.key]}
                                    </Grid.Column>
                                ))}
                            </Grid>
                        </Accordion.Title>,
                        <Accordion.Content
                            className="rowBoxed">
                            {item.payments.length > 0 &&
                            <div>
                                <Message size='small' floating>Payments at this date:</Message>
                                <Grid
                                    columns={3}
                                    className='attached' celled>
                                    {item.payments.map((p, idx) => (
                                        <Grid.Row key={idx}>
                                            <Grid.Column textAlign="center">{p.name}</Grid.Column>
                                            <Grid.Column textAlign="center">{p.cost}</Grid.Column>
                                        </Grid.Row>
                                    ))}
                                </Grid>
                            </div>
                            }
                            {item.payments.length === 0 &&
                            <Message size='small' floating>No expected payments</Message>
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