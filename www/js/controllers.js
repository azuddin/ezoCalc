angular.module('starter.controllers', [])

.controller("CalculatorController", function($scope, $calculatorFactory) {
 	
 	$scope.calculate = function(expression) {
        var postfix = $calculatorFactory.infixToPostfix(expression);
        $scope.expression = $calculatorFactory.solvePostfix(postfix.trim());
    }
 
    $scope.add = function(value) {
        if($scope.expression === "" || $scope.expression === undefined) {
            $scope.expression = value;
        } else {
            $scope.expression = $scope.expression + " " + value;
        }
    }
 
});