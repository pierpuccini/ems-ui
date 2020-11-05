/**
 * @copyright 2020 All rights reserved.
 * @author Pier Puccini
 */

import systemMonitoringTemplate from './systemMonitoring.html';
import tooltipTemplate from './tooltip.html';
import systemSvg from '../../static/pf.svg';

import './systemMonitoring.css';

class SystemMonitoringController {
    static get $$ngIsClass() {
        return true;
    }

    static get $inject() {
        return ['$scope', '$element', '$compile'];
    }

    constructor($scope, $element, $compile) {
        this.$scope = $scope;
        this.$element = $element;
        this.$compile = $compile;

        this.systemSvg = systemSvg;
    }

    $onInit() {
        this.createTooltip();
    }

    svgColorFill(details) {
        const { electrical } = details;

        const result = 'svg-color-fill';
        const successClass = 'ems-green';
        const warningClass = 'ems-yellow';
        const dangerClass = 'ems-red';
        if (this.points) {
            if (electrical === 'Bus') {
                const foundPoint = this.points.find((point) => point.tags.element === electrical && point.name === 'Voltage Magnitude');
                if (foundPoint) {
                    if (foundPoint.value < 0.95 || foundPoint.value > 1.05) {
                        return `${result} bus ${dangerClass}`;
                    }
                    return `${result} bus ${successClass}`;
                }
            }
            if (electrical === 'Line') {
                const pointLoading = this.points.find((point) => point.tags.element === electrical && point.name === 'Loading');
                const pointMaxLoading = this.points.find((point) => point.tags.element === electrical && point.name === 'Max Loading');
                if (pointLoading && pointMaxLoading) {
                    if (pointLoading.value > pointMaxLoading.value) {
                        return `${result} line ${dangerClass}`;
                    }
                    if (pointLoading.value < pointMaxLoading.value && pointLoading.value > pointMaxLoading.value - pointMaxLoading.value * 0.2) {
                        return `${result} line ${warningClass}`;
                    }
                    return `${result} line ${successClass}`;
                }
            }
            if (electrical === 'Trf') {
                const pointLoading = this.points.find((point) => point.tags.element === electrical && point.name === 'Loading');
                const pointMaxLoading = this.points.find((point) => point.tags.element === electrical && point.name === 'Max Loading');
                if (pointLoading && pointMaxLoading) {
                    if (pointLoading.value > pointMaxLoading.value) {
                        return `${result} trf ${dangerClass}`;
                    }
                    if (pointLoading.value < pointMaxLoading.value && pointLoading.value > pointMaxLoading.value - pointMaxLoading.value * 0.2) {
                        return `${result} trf ${warningClass}`;
                    }
                    return `${result} trf ${successClass}`;
                }
            }
            if (electrical === 'Gen') {
                const foundPoint = this.points.find((point) => point.tags.element === electrical && point.name === 'Active Power');
                if (foundPoint) {
                    if (foundPoint.value === 0) {
                        return `${result} gen ${dangerClass}`;
                    }
                    return `${result} gen ${successClass}`;
                }
            }
            if (electrical === 'Load') {
                const foundPoint = this.points.find((point) => point.tags.element === electrical && point.name === 'Nominal Active Power');
                if (foundPoint) {
                    if (foundPoint.value === 0) {
                        return `${result} load ${dangerClass}`;
                    }
                    return `${result} load ${successClass}`;
                }
            }
        }
        return null;
    }

    selectedElement(event) {
        const { electrical, idOne, idTwo } = this.electricalItem(event.target);
        let value = `${electrical}_${idOne}`;
        if (idTwo) {
            value = `${value}_${idTwo}`;
        }
        this.sendElement({ $element: value });
    }

    electricalItem(item) {
        let { id } = item;
        let items = id.split('_');
        if (items[0].includes('path') || items[0].includes('ellipse')) {
            id = item.parentNode.id;
            items = id.split('_');
        }
        if (items.length <= 2) {
            const [electrical, idOne] = items;
            return {
                electrical,
                idOne
            };
        }
        const [electrical, idOne, idTwo] = items;
        return { electrical, idOne, idTwo };
    }

    createTooltip() {
        this.$compile(tooltipTemplate)(this.$scope.$new(), ($element, $scope) => {
            $element.css('visibility', 'hidden');
            $element.addClass('ems-tooltip');
            this.$element.append($element);
            this.tooltipElement = $element;
            this.tooltipScope = $scope;
        });
    }

    showTooltip(event) {
        const { electrical } = this.electricalItem(event.target);

        let pointNames = [];
        if (this.points) {
            if (electrical === 'Load') {
                pointNames = ['Nominal Active Power', 'Load Price'];
            }
            if (electrical === 'Bus') {
                pointNames = ['Active Flow', 'Active Gen', 'Active Out'];
            }
            if (electrical === 'Gen') {
                pointNames = ['Active Power'];
            }
            if (electrical === 'Line' || electrical === 'Trf') {
                pointNames = ['Loading'];
            }
            const elementObj = this.points.reduce((result, point) => {
                const shortName = point.name;
                if (point.tags.element === electrical && pointNames.includes(point.name)) {
                    result[shortName] = point;
                }
                return result;
            }, {});

            Object.assign(this.tooltipScope, {
                $points: elementObj
            });

            const { clientX, clientY } = event;
            const x = clientX + 15;
            const y = clientY - 110;

            this.tooltipElement.css('transform', `translate(${x}px, ${y}px)`);
            this.tooltipElement.css('visibility', 'visible');
        }

        this.selectedElement(event);
    }

    hideTooltip(event) {
        this.tooltipElement.css('visibility', 'hidden');
    }
}

export default {
    bindings: {
        points: '<?',
        sendElement: '&'
    },
    controller: SystemMonitoringController,
    template: systemMonitoringTemplate
};
