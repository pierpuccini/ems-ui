/**
 * @copyright 2020 All rights reserved.
 * @author Pier Puccini
 */

import demandTemplate from './demandOverview.html';
import './demandOverview.css';

class DemandOverviewController {
    static get $$ngIsClass() {
        return true;
    }

    static get $inject() {
        return ['maPoint'];
    }

    constructor(maPoint) {
        this.elementType = 'Bus';
        this.maPoint = maPoint;
    }

    $onInit() {
        this.getPoints();
    }

    getPoints() {
        this.maPoint
            .buildQuery()
            .eq('enabled', true)
            .query()
            .then((points) => {
                this.points = points;
            });
    }

    setElement(el) {
        this.element = el;
        const filteredPoints = this.points.filter((point) => point.deviceName === el);
        const defaultPoints = filteredPoints.map((point) => point.name);
        this.defaultPoints = [el, ...defaultPoints];
    }
}

export default {
    bindings: {},
    controller: DemandOverviewController,
    template: demandTemplate
};
