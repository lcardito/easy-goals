import moment from "moment";

module.exports.formatValue = (value, key) => {
    if (key.toLowerCase().indexOf('date') !== -1) {
        return moment(value).format('MMMM YYYY');
    }
    return value;
};