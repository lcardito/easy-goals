import React from 'react';
import {Grid, Segment} from 'semantic-ui-react';

class AccountHeader extends React.Component {
    
    render() {
        return (
            <Grid columns={3}>
                <Grid.Column>
                    <Segment basic>Name</Segment>
                </Grid.Column>
                <Grid.Column>
                    <Segment basic>Type</Segment>
                </Grid.Column>
                <Grid.Column>
                    <Segment basic>Balance</Segment>
                </Grid.Column>
            </Grid>
        )
    }
}

export default AccountHeader;