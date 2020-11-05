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
        return [];
    }
}

export default {
    bindings: {
        points: '<'
    },
    controller: PointDisplayController,
    template: demandTemplate
};
