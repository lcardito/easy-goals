import React from "react";
import {Button, Container, Header, List} from "semantic-ui-react";

class Payments extends React.Component {

    constructor(props) {
        super();

        this.state = {
            payments: props.payments
        };
    }

    componentWillReceiveProps(nextProps) {
        this.state = {
            payments: nextProps.payments
        };
    }

    render() {
        if (this.state.payments.length === 0) {
            return <Container text fluid>
                <Header as='h4'>No expected payments</Header>
            </Container>;
        } else {
            return <div style={{width: '80%', height: '20%', margin: '1em auto'}}>
                <Header as='h4'>Transactions at this date</Header>
                <List divided size="large">
                    {this.state.payments.map((p, idx) => {
                        return <List.Item
                            key={idx}>
                            {p.type === 'IN' &&
                            <List.Content floated='right'>
                                <Button size="mini" basic compact color="red">delete</Button>
                            </List.Content>
                            }
                            {p.type === 'IN' &&
                            <List.Icon name='plus' color="green" size='small' verticalAlign='middle'/>
                            }
                            {p.type === 'OUT' &&
                            <List.Icon color="red" name='minus' size='small' verticalAlign='middle'/>
                            }
                            <List.Content>
                                <List.Header as='a'>{p.label}</List.Header>
                                <List.Description as='a'>£ {p.amount}</List.Description>
                            </List.Content>
                        </List.Item>
                    })}
                </List>
            </div>
        }
    }
}

export default Payments;

Payments.propTypes = {
    payments: React.PropTypes.array,
    deleteCallback: React.PropTypes.func
};