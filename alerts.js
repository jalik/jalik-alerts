import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {_} from 'meteor/underscore';


/**
 * The collection of alerts
 * @type {Mongo.Collection}
 */
const Alerts = new Mongo.Collection(null);

/**
 * The alert helper
 */
class AlertHelper {

    constructor() {
        this.id = Date.now() + Math.random();
    }

    /**
     * Adds an alert
     * @return {*}
     * @param type
     * @param message
     * @param extra
     * @returns {*}
     */
    add(type, message, extra) {
        if (typeof message === 'object' && !message) {
            if (message.reason) {
                message = message.reason;
            }
            else if (message.message) {
                message = message.message;
            }
        }
        return Alerts.insert(_.extend({
            type: type,
            createdAt: new Date(),
            helperId: this.id,
            message: message
        }, extra));
    }

    /**
     * Adds an error
     * @return {*}
     * @param message
     * @param extra
     * @returns {*}
     */
    addError(message, extra) {
        return this.add('error', message, extra);
    }

    /**
     * Adds an info alert
     * @return {*}
     * @param message
     * @param extra
     * @returns {*}
     */
    addInfo(message, extra) {
        return this.add('info', message, extra);
    }

    /**
     * Adds a success alert
     * @return {*}
     * @param message
     * @param extra
     * @returns {*}
     */
    addSuccess(message, extra) {
        return this.add('success', message, extra);
    }

    /**
     * Adds a warning alert
     * @return {*}
     * @param message
     * @param extra
     * @returns {*}
     */
    addWarning(message, extra) {
        return this.add('warning', message, extra);
    }

    /**
     * Removes alerts matching filters
     * @param filters
     */
    clear(filters) {
        return Alerts.remove(_.extend({}, filters, {helperId: this.id}));
    }

    /**
     * Returns alerts matching filters
     * @param filters
     * @param options
     * @return {Mongo.Cursor}
     */
    find(filters, options) {
        filters = _.extend({}, filters, {helperId: this.id});
        options = _.extend({sort: {createdAt: -1}}, options);
        return Alerts.find(filters, options);
    }
}

export {
    AlertHelper,
    Alerts
};
