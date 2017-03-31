module.exports.mapStateToProps = (state, ownProps) => {
    return {
        isLoggedIn: state.user.username !== '',
        user: state.user,
        currentURL: ownProps.location.pathname
    };
};