/**
 * @copyright 2020 {@link http://Radixiot.com|Radix IOT,LLC.} All rights reserved.
 * @author Jose Puccini
 */

import template from './activeAlarms.html';
import './activeAlarms.css';

class ActiveAlarmsController {
    static get $$ngIsClass() {
        return true;
    }

    static get $inject() {
        return ['$state', 'maEvents'];
    }

    constructor($state, maEvents) {
        this.$state = $state;
        this.maEvents = maEvents;

        this.query = {
            page: 1,
            limit: 5
        };
    }

    $onChanges(changes) {
        if (changes.element && changes.element.currentValue) {
            if (this.activeEvents) {
                this.activeEvents.deregister();
            }
            this.getAlarmCount();
        }
    }

    $onDestroy() {
        if (this.activeEvents) {
            this.activeEvents.deregister();
        }
    }

    getAlarmCount() {
        const activeEventsQuery = this.maEvents.notificationManager.buildActiveQuery().eq('eventType.eventType', 'DATA_POINT');

        if (this.element) {
            activeEventsQuery.eq('eventType.reference1.deviceName', this.element);
        }

        this.activeEvents = activeEventsQuery.activeEvents();
    }
}

export default {
    bindings: {
        element: '<?'
    },
    controller: ActiveAlarmsController,
    template
};
