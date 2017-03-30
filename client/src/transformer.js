module.exports.mapStateToProps = (state, ownProps) => {
    return {
        isLoggedIn: state.user.username !== '',
        currentURL: ownProps.location.pathname
    };
};