import React from 'react'
import {Table, Button, Icon} from 'semantic-ui-react';
import _ from 'lodash';

class SortableTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            headers: props.headers ? props.headers : [],
            items: props.items ? props.items : [],
            editable: props.editable ? props.editable : false
        };

        this._sortBy = this._sortBy.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            headers: nextProps.headers,
            items: nextProps.items,
            editable: nextProps.editable
        })
    }

    _sortBy(prop) {
        this.sortingOrder = (this.sortingOrder === 'asc') ? 'desc' : 'asc';
        this.setState({
            items: _.orderBy(this.state.items, [prop], [this.sortingOrder])
        })
    }

    render() {
        return (
            <Table celled
                   padded
                   sortable
                   selectable={this.state.editable}>
                <Table.Header>
                    <Table.Row>
                        {this.state.headers.map((h, idx) => (
                            <Table.HeaderCell
                                key={idx}
                                onClick={() => this._sortBy(h.key)}>{h.value}</Table.HeaderCell>
                        ))}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {this.state.items.map((item, itemIdx) => (
                        <Table.Row key={itemIdx} onClick={() => this.props.editCallback(item)}>
                            {this.state.headers.map((h, idx) => (
                                <Table.Cell key={idx}>
                                    {item[h.key]}
                                </Table.Cell>
                            ))}
                        </Table.Row>
                    ))}
                </Table.Body>
                {this.state.editable &&
                <Table.Footer fullWidth>
                    <Table.Row>
                        <Table.HeaderCell colSpan={this.props.headers.length}>
                            <Button
                                onClick={() => this.props.addNewCallback()}
                                floated='left' icon size='tiny' labelPosition='left' primary>
                                <Icon name="add circle"/>Add New
                            </Button>
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Footer>
                }
            </Table>
        )
    }
}

export default SortableTable;