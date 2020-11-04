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
        return ['$scope', '$element', '$compile', '$filter'];
    }

    constructor($scope, $element, $compile, $filter) {
        this.systemSvg = systemSvg;
        this.$scope = $scope;
        this.$element = $element;
        this.$compile = $compile;
        this.maFilter = $filter('maFilter');
    }

    $onInit() {
        this.createTooltip();
    }

    svgColorFill(id) {
        let result = 'svg-color-fill';
        const successClass = 'ems-green';
        const warningClass = 'ems-yellow';
        const dangerClass = 'ems-red';
        if (this.points) {
            if (id.includes('Bus')) {
                const foundPoint = this.points.find((point) => point.deviceName === id && point.name === 'Voltage Magnitude');
                if (foundPoint) {
                    if (foundPoint.value < 0.95 || foundPoint.value > 1.05) {
                        return `${result} bus ${dangerClass}`;
                    }
                    return `${result} bus ${successClass}`;
                }
            }
            if (id.includes('Line')) {
                const pointLoading = this.points.find((point) => point.deviceName === id && point.name === 'Loading');
                const pointMaxLoading = this.points.find((point) => point.deviceName === id && point.name === 'Max Loading');
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
            if (id.includes('Trf')) {
                const pointLoading = this.points.find((point) => point.deviceName === id && point.name === 'Loading');
                const pointMaxLoading = this.points.find((point) => point.deviceName === id && point.name === 'Max Loading');
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
            if (id.includes('Gen')) {
                const foundPoint = this.points.find((point) => point.deviceName === id && point.name === 'Active Power');
                if (foundPoint) {
                    if (foundPoint.value === 0) {
                        return `${result} gen ${dangerClass}`;
                    }
                    return `${result} gen ${successClass}`;
                }
            }
            if (id.includes('Load')) {
                const foundPoint = this.points.find((point) => point.deviceName === id && point.name === 'Nominal Active Power');
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

    selectedElement(value) {
        this.sendElement({ $element: value });
    }

    createTooltip() {
        // this.$compile(tooltipTemplate)(this.$scope.$new(), ($element, $scope) => {
        //     $element.css('visibility', 'hidden');
        //     $element.addClass('ems-tooltip');
        //     this.$element.append($element);
        //     this.tooltipElement = $element;
        //     this.tooltipScope = $scope;
        // });
    }

    showTooltip(event) {
        if (this.points) {
            const element = event.split('_');

            if (element[0] === 'Load') {
                const elementObject = this.points.reduce((filtered, point) => {
                    const shortName = point.name;
                    if (point.tags.load === element[1] && point.tags.element === 'Load' && point.name.indexOf('Active') > -1) {
                        filtered[shortName] = { point: point };
                    }
                    return filtered;
                }, {});
                const result = Object.keys(elementObject).map((element) => elementObject[element]);

                // Object.assign(this.tooltipScope, {
                //     $point: result
                // });

                // const elementRect = this.$element[0].getBoundingClientRect();
                // const targetRect = event.target.getBoundingClientRect();
                // const x = targetRect.x - elementRect.x + targetRect.width + 5;
                // const y = targetRect.y - elementRect.y;

                // this.tooltipElement.css('transform', `translate(${x}px, ${y}px)`);
                // this.tooltipElement.css('visibility', 'visible');
            }
        }
    }

    hideTooltip(event) {
        // this.tooltipElement.css('visibility', 'hidden');
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
