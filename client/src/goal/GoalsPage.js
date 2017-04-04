import React from 'react';
import Client from '../main/Client';
import SortableTable from '../main/SortableTable';
import {Header, Icon, Message, Table} from "semantic-ui-react";
import {formatValue} from "../utils";

class GoalsPage extends React.Component {
    constructor() {
        super();

        this.state = {
            goals: [],
            selectedGoal: {
                label: '',
                amount: 0,
                category: '',
                dueDate: ''
            }
        };

        this._getGoals = this._getGoals.bind(this);
        this._navigateToDetail = this._navigateToDetail.bind(this);
    }

    //noinspection JSUnusedGlobalSymbols
    static contextTypes = {
        router: React.PropTypes.object,
    };

    componentWillMount() {
        Client.getGoals((serverGoals) => {
            this._getGoals(serverGoals);
        })
    }

    _getGoals(serverGoals) {
        this.setState({
            goals: serverGoals
        });
    }

    _navigateToDetail(item) {
        let path = item ? `/goals/${item.id}` : `/${this.state.detailPath}/tmp`;
        this.context.router.push(path);
    }

    render() {
        const itemMapper = (item, h, idx) => {
            return <Table.Cell
                onClick={() => this._navigateToDetail(item)}
                key={idx}>
                {formatValue(item[h.key], h.key)}
            </Table.Cell>
        };
        return (
            <div>
                <Header as='h2'>
                    <Icon name='target'/>
                    <Header.Content>
                        This are your personal goals
                        <Header.Subheader>
                            These are your goals. You are in control of them. Add, edit or delete one of them.
                        </Header.Subheader>
                    </Header.Content>
                </Header>
                <SortableTable
                    headers={[
                        {key: 'label', value: 'Label'},
                        {key: 'category', value: 'Category'},
                        {key: 'amount', value: 'Cost'},
                        {key: 'dueDate', value: 'Due Date'}
                    ]}
                    itemMapper={itemMapper}
                    items={this.state.goals}
                    editable={true}
                />
            </div>
        )
    }
}

export default GoalsPage;