//http://stackoverflow.com/questions/17772260/textarea-auto-height
var elastic = angular.module('elastic', []);

elastic.directive('elastic', [
    '$timeout',
    function($timeout) {
        return {
            restrict: 'A',
            link: function($scope, element) {
                $scope.initialHeight = $scope.initialHeight || element[0].style.height;
                console.log(element[0].scrollHeight);
                var resize = function() {
                    element[0].style.height = $scope.initialHeight;
                    element[0].style.height = "" + element[0].scrollHeight + "px";
                };
                element.on("input blur keyup change propertychange", resize);
                $timeout(resize, 500);
            }
        };
    }
]);