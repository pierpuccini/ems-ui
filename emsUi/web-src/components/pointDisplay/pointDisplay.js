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
        return ['maDialogHelper'];
    }

    constructor(maDialogHelper) {
        this.maDialogHelper = maDialogHelper;
    }

    $onChanges(changes) {
        if (changes.points && changes.points.currentValue) {
            this.cost = this.points.find((point) => point.name === 'Cost Ranges');
            this.load = this.points.find((point) => point.name === 'Active Power');
        }
    }

    calculateNewLoad(operation, percent) {
        if (operation === '+') {
            this.newLoad = this.load.value * (1 + percent / 100);
        } else {
            this.newLoad = this.load.value * (1 - percent / 100);
        }
        this.newLoadWithSuffix = this.newLoad.toFixed(2) + this.load.textRenderer.suffix;
    }

    setNewLoad(event) {
        const toMsg = [this.load.renderedValue, this.newLoadWithSuffix].join(' -> ');
        const loadValueCopy = angular.copy(this.load.value);
        this.maDialogHelper.confirm(event, ['ems.demand.confirmChange', toMsg]).then(
            (res) => {
                if (!this.maDialogHelper.isCancelled(res)) {
                    console.log('revert in res');
                    this.load.value = loadValueCopy;
                } else {
                    console.log('set');
                    this.load.setValue(this.newLoad);
                }
            },
            (error) => {
                if (!this.maDialogHelper.isCancelled(error)) {
                    this.load.value = loadValueCopy;
                    console.log('revert');
                }
            }
        );
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
