/**
 * @copyright 2020 All rights reserved.
 * @author Pier Puccini
 */

import demandTemplate from './demandOverview.html';
import systemSvg from '../../static/pf.svg';
import './demandOverview.css';

class DemandOverviewController {
    static get $$ngIsClass() {
        return true;
    }

    static get $inject() {
        return [];
    }

    constructor() {
        this.systemSvg = systemSvg;
        this.elementType = 'Bus';
    }
}

export default {
    bindings: {},
    controller: DemandOverviewController,
    template: demandTemplate
};
