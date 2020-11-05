/**
 * @copyright 2020 {@link http://infiniteautomation.com|Infinite Automation Systems, Inc.} All rights reserved.
 * @author Pier Puccini
 */

import template from './statisticsWidget.html';
import './statisticsWidget.css';

const PRESET_COLORS = ['#FF6600', '#FCD202', '#B0DE09', '#0D8ECF', '#2A0CD0', '#CD0D74', '#CC0000', '#00CC00', '#0000CC', '#DDDDDD', '#999999', '#333333', '#990000'];

class StatisticsWidgetController {
    static get $$ngIsClass() {
        return true;
    }

    static get $inject() {
        return ['maPoint', 'maDialogHelper', 'maUiDateBar', '$filter'];
    }

    constructor(maPoint, maDialogHelper, maUiDateBar, $filter) {
        this.maPoint = maPoint;
        this.maDialogHelper = maDialogHelper;
        this.dateBar = maUiDateBar;
        this.maFilter = $filter('maFilter');

        // this.to = new Date();

        this.selectedPoints = [];

        this.axisOptions = [
            { name: 'left', translation: 'ui.app.left' },
            { name: 'right', translation: 'ui.app.right' },
            { name: 'left-2', translation: 'ui.app.farLeft' },
            { name: 'right-2', translation: 'ui.app.farRight' }
        ];

        this.graphOptions = [];
        this.chartOptions = { valueAxes: [] };
        this.settings = {};

        this.showSensorXid = false;
    }

    $onChanges(changes) {
        if (changes.defaultPoints && changes.defaultPoints.currentValue && changes.defaultPoints.currentValue.length > 0) {
            this.setDefaultPoints(true);
        }
    }

    $onInit() {
        if (this.defaultPoints) {
            this.setDefaultPoints(true);
        }
    }

    setDefaultPoints(showSensorXid) {
        if (this.defaultPoints.length > 0) {
            const [element] = this.defaultPoints;
            this.element = element;
            this.defaultPoints.shift();
            this.getPoints().then((points) => {
                this.selectedPoints = points.filter((point) => this.defaultPoints.includes(point.name));
                this.buildSettings();
            });
            this.showSensorXid = showSensorXid;
        }
    }

    getPoints(filter) {
        const pointQuery = this.maPoint.buildQuery().eq('enabled', true);

        const [element, id1, id2] = this.element.split('_');

        const elementTag = element.toLowerCase();

        let value = `${id1}`;
        if (id2) {
            value = `${value}_${id2}`;
        }

        pointQuery.eq('tags.element', element);

        if (id1) {
            pointQuery.eq(`tags.${elementTag}`, value);
        }

        return pointQuery
            .query()
            .then((points) => {
                return this.maFilter(points, filter, ['name', 'native', 'common']);
            })
            .catch((err) => {
                this.maDialogHelper.toastOptions({
                    text: `Error getting points - ${err.mangoStatusText}`,
                    hideDelay: 10000,
                    classes: 'md-warn'
                });
            });
    }

    checkSelectedPoints() {
        return this.selectedPoints.length > 0;
    }

    buildSettings() {
        if (this.selectedPoints[this.selectedPoints.length - 1] !== 'clear') {
            this.selectedPoints.forEach((point, index) => {
                let { chartColour, valueAxis } = point;
                chartColour = chartColour === '' ? PRESET_COLORS[index % PRESET_COLORS.length] : chartColour;

                // This is in order to automaticly set 4 initial axises
                if (index < this.axisOptions.length) {
                    valueAxis = valueAxis == null ? this.axisOptions[index % this.axisOptions.length].name : valueAxis;
                }

                this.selectedPoints[index].chartColour = chartColour;
                this.selectedPoints[index].valueAxis = valueAxis;

                this.settings = {
                    ...this.settings,
                    [point.xid]: {
                        graphOptions: { lineColor: chartColour, valueAxis },
                        chartOptions: {}
                    }
                };
            });

            const settingXids = Object.keys(this.settings);
            if (settingXids.length > this.selectedPoints.length) {
                this.removeSettings();
            }
            this.buildOptions();
        } else {
            this.selectedPoints = [];
            this.settings = {};
        }
    }

    editSettings(point) {
        const { plotType, chartColour, valueAxis } = point;

        point.valueAxis = valueAxis;
        point.chartColour = chartColour;

        /* 
        Chart option color params in case ever needed
        axisColor: chartColour,
        color: chartColour 
        */
        this.settings[point.xid] = {
            graphOptions: {
                lineColor: chartColour,
                plotType,
                valueAxis
            },
            chartOptions: {}
        };

        this.buildOptions();
    }

    removeSettings() {
        const settingXids = Object.keys(this.settings);
        const selectedPointsXids = this.selectedPoints.map((point) => point.xid);
        const xidToDelete = settingXids.filter((xid) => !selectedPointsXids.includes(xid));
        delete this.settings[xidToDelete];
    }

    buildOptions() {
        const xids = Object.keys(this.settings);
        this.graphOptions = [];
        this.chartOptions = { valueAxes: [] };
        xids.forEach((xid) => {
            const pointIndex = this.selectedPoints.findIndex((point) => point.xid === xid);
            if (pointIndex >= 0) {
                this.graphOptions[pointIndex] = this.settings[xid].graphOptions;
                this.chartOptions.valueAxes[pointIndex] = this.settings[xid].chartOptions;
            }
        });
    }
}

export default {
    bindings: {
        defaultPoints: '<?',
        column: '<?',
        showSettings: '<?'
    },
    controller: StatisticsWidgetController,
    template
};
