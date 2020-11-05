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
        this.element = 'System';
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
                this.setFirstElem();
            });
    }

    setElement(el) {
        const [element, id1, id2] = el.split('_');
        this.element = el.replace('_', ' ');
        const filteredPoints = this.points.filter((point) => {
            if (element === 'Load' && point.name === 'Cost') {
                return true;
            }
            const elementTag = element.toLowerCase();
            let value = `${id1}`;
            if (id2) {
                value = `${value}_${id2}`;
            }
            const matchesElId = point.tags[elementTag] === value;
            const matchesElement = point.tags.element === element;
            return matchesElement && matchesElId;
        });
        this.filteredPoints = filteredPoints;
        const defaultPoints = filteredPoints.map((point) => point.name);
        this.defaultPoints = [el, ...defaultPoints];
    }

    setFirstElem() {
        const filteredPoints = this.points.filter((point) => point.tags.element === this.element);
        this.filteredPoints = filteredPoints;
        const defaultPoints = filteredPoints.map((point) => point.name);
        this.defaultPoints = [this.element, ...defaultPoints];
    }
}

export default {
    bindings: {},
    controller: DemandOverviewController,
    template: demandTemplate
};
