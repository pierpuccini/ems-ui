/**
 * @copyright 2020 All rights reserved.
 * @author Pier Puccini
 */

import angular from 'angular';

import demandOverview from './pages/demandOverview/demandOverview';

import activeAlarms from './components/activeAlarms/activeAlarms';

import statisticsWidget from './components/statisticsWidget/statisticsWidget';

import systemMonitoring from './components/systemMonitoring/systemMonitoring';

import pointDisplay from './components/pointDisplay/pointDisplay';

import electrical from './components/systemMonitoring/electrical';

// import uberUtilFactory from './services/uberUtil';

import './emsUi.css';

const emsUiModule = angular.module('emsUiModule', ['maUiApp']);

emsUiModule
    .component('emsDemandOverview', demandOverview)
    .component('emsActiveAlarms', activeAlarms)
    .component('emsStatisticsWidget', statisticsWidget)
    .component('emsSystemMonitoring', systemMonitoring)
    .component('emsPointDisplay', pointDisplay)
    .directive('emsElectrical', electrical);

// emsUiModule.factory('UberUtil', uberUtilFactory);
emsUiModule.config([
    'maUiMenuProvider',
    (maUiMenuProvider) => {
        maUiMenuProvider.registerMenuItems([
            {
                url: '/demand-overview',
                name: 'ui.demandOverview',
                template: '<ems-demand-overview></ems-demand-overview>',
                menuHidden: false,
                menuTr: 'ems.menu.overview',
                menuIcon: 'bar_chart',
                params: {
                    noPadding: true,
                    hideFooter: true,
                    dateBar: {
                        rollupControls: true
                    }
                },
                permission: ['anonymous'],
                weight: 1
            }
        ]);
    }
]);

export default emsUiModule;
