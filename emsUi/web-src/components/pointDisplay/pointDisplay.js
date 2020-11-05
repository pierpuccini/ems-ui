/**
 * @copyright 2020 All rights reserved.
 * @author Pier Puccini
 */

import demandTemplate from './pointDisplay.html';
import './pointDisplay.css';

class PointDisplayController {
    static get $$ngIsClass() {
        return true;
    }

    static get $inject() {
        return [];
    }

    $onChanges(changes) {
        if (changes.points && changes.points.currentValue) {
            this.cost = this.points.find((point) => point.name === 'Cost Ranges');
            this.load = this.points.find((point) => point.name === 'Nominal Active Power');
        }
    }
}

export default {
    bindings: {
        points: '<',
        element: '@'
    },
    controller: PointDisplayController,
    template: demandTemplate
};
