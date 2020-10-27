/**
 * @copyright 2020 All rights reserved.
 * @author Pier Puccini
 */

import angular from 'angular';

import demandOverview from './pages/demandOverview/demandOverview';

import activeAlarms from './components/activeAlarms/activeAlarms';

import statisticsWidget from './components/statisticsWidget/statisticsWidget';

// import uberUtilFactory from './services/uberUtil';

import './emsUi.css';

const emsUiModule = angular.module('emsUiModule', ['maUiApp']);

emsUiModule.component('emsDemandOverview', demandOverview);
emsUiModule.component('emsActiveAlarms', activeAlarms);
emsUiModule.component('emsStatisticsWidget', statisticsWidget);

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
