/**
 * @copyright 2020 All rights reserved.
 * @author Pier Puccini
 */

import angular from 'angular';

import demandOverview from './pages/demandOverview/demandOverview';

// import uberUtilFactory from './services/uberUtil';

import './emsUi.css';

const emsUiModule = angular.module('emsUiModule', ['maUiApp']);

// emsUiModule.factory('UberUtil', uberUtilFactory);

emsUiModule.component('uberdemandOverview', demandOverview);

emsUiModule.config([
    'maUiMenuProvider',
    (maUiMenuProvider) => {
        maUiMenuProvider.registerMenuItems([
            {
                url: '/demand-overview',
                name: 'ui.demandOverview',
                template: '<uber-demand-overview></uber-demand-overview>',
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
