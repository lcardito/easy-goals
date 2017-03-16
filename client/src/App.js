import React from 'react';
import AccountBox from './AccountBox';
import AccountForm from './AccountForm';

class App extends React.Component {

    render() {
        return (
            <div className='App'>
                <div className='ui text container'>
                    <AccountBox />
                    <AccountForm />
                </div>
            </div>
        );
    }
}

export default App;
