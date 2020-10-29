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

    constructor() {}

    $onChanges(changes) {
        if (changes.element && changes.element.currentValue) {
            this.getPoints();
        }
    }

    getPoints() {
        if (this.points) {
            const filteredPoints = Object.keys(this.points).filter((pointKey) => this.points[pointKey].deviceName === this.element);
            this.selectedPoints = filteredPoints.map((pointKey) => this.points[pointKey]);
        }
    }
}

export default {
    bindings: {
        element: '<',
        points: '<'
    },
    controller: PointDisplayController,
    template: demandTemplate
};
