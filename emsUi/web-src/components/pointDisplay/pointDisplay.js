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

    priceCalculator(values) {
        if (this.load.value) {
            const [past, now] = values;
            const loadInKw = this.load.value * 1000000;
            const previousPay = (loadInKw * past.value) / 1000000;
            const nowPay = (loadInKw * now.value) / 1000000;
            const percent = Math.abs(past - now) / 100;

            return [`${percent} %`, 'test'];
        }
        return ['N/A'];
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
