/**
 * @copyright 2020 All rights reserved.
 * @author Pier Puccini
 */

electrical.$inject = [];
function electrical() {
    return {
        restrict: 'A',
        require: '^^emsSystemMonitoring',
        link: ($scope, $element, $attrs, systemMonitoringCtrl) => {
            const details = systemMonitoringCtrl.electricalItem($element[0]);

            $scope.$watch(
                () => {
                    return systemMonitoringCtrl.svgColorFill(details);
                },
                (currentClass, previousClass) => {
                    if (previousClass) {
                        $element.removeClass(previousClass);
                    }
                    $element.addClass(currentClass);
                }
            );
        }
    };
}

export default electrical;
