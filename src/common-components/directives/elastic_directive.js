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

                    // var parentHeight = element[0].scrollHeight + 18;
                    // element.parent().parent().parent()[0].style.height = "" + parentHeight + "px";
                };
                // element.on("blur keyup change", resize);
                $timeout(resize, 700);
                $(element).change(resize);
                $(element).keyup(resize);
                $(element).blur(resize);
                // var scope = $scope.$parent;
                // scope.$watch('poem.title', function(newValue, oldValue) {
                //     if(newValue) {
                //         resize();
                //     }
                // });
            }
        };
    }
]);