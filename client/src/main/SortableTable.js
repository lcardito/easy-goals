import React from "react";
import {Button, Icon, Table} from "semantic-ui-react";
import _ from "lodash";

class SortableTable extends React.Component {

    //noinspection JSUnusedGlobalSymbols
    static contextTypes = {
        router: React.PropTypes.object,
    };

    constructor(props) {
        super(props);
        this.state = {
            headers: props.headers ? props.headers : [],
            items: props.items ? props.items : [],
            detailPath: props.detailPath ? props.detailPath : '',
            editable: props.editable ? props.editable : false,
            sortingBy: ''
        };

        this._sortBy = this._sortBy.bind(this);
        this._navigateToDetail = this._navigateToDetail.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            headers: nextProps.headers,
            items: nextProps.items,
            editable: nextProps.editable,
            detailPath: nextProps.detailPath ? nextProps.detailPath : '',
            sortingBy: ''
        })
    }

    _sortBy(prop) {
        this.sortingOrder = (this.sortingOrder === 'asc') ? 'desc' : 'asc';
        this.setState({
            items: _.orderBy(this.state.items, [prop], [this.sortingOrder]),
            sortingBy: prop
        })
    }

    _navigateToDetail(item) {
        let path = item ? `/${this.state.detailPath}/${item.id}` : `/${this.state.detailPath}/tmp`;
        this.context.router.push(path);
    }

    render() {
        return (
            <Table celled
                   padded
                   sortable
                   striped
                   unstackable
                   selectable={this.state.editable}>
                <Table.Header>
                    <Table.Row>
                        {this.state.headers.map((h, idx) => {
                            let iconName = 'sort';
                            if (this.state.sortingBy === h.key) {
                                iconName = this.sortingOrder === 'asc' ? 'sort ascending' : 'sort descending'
                            }

                            return <Table.HeaderCell key={idx} onClick={() => this._sortBy(h.key)}>
                                <Icon name={iconName}/> {h.value}
                            </Table.HeaderCell>
                        })}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {this.state.items.map((item, itemIdx) => (
                        <Table.Row
                            key={itemIdx}>
                            {this.state.headers.map((h, idx) => {
                                return this.props.itemMapper(item, h, idx);
                            })}
                        </Table.Row>
                    ))}
                </Table.Body>
                {this.state.editable &&
                <Table.Footer fullWidth>
                    <Table.Row>
                        <Table.HeaderCell colSpan={this.props.headers.length}>
                            <Button
                                onClick={() => this._navigateToDetail()}
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

SortableTable.defaultProps = {
    itemMapper: () => {}
};

export default SortableTable;