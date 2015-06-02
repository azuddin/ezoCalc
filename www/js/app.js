// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('calculatorApp', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

calculatorApp.factory("$calculatorFactory", function() {
 
    return {
 
        infixToPostfix: function(infix) {
            var outputQueue = "";
            var operatorStack = [];
            var operators = {
                "^": {
                    precedence: 4,
                    associativity: "Right"
                },
                "/": {
                    precedence: 3,
                    associativity: "Left"
                },
                "*": {
                    precedence: 3,
                    associativity: "Left"
                },
                "+": {
                    precedence: 2,
                    associativity: "Left"
                },
                "-": {
                    precedence: 2,
                    associativity: "Left"
                }
            }
            infix = infix.replace(/\s+/g, "");
            infix = infix.split(/([\+\-\*\/\^\(\)])/).clean();
            for(var i = 0; i < infix.length; i++) {
                var token = infix[i];
                if(token.isNumeric()) {
                    outputQueue += token + " ";
                } else if("^*/+-".indexOf(token) !== -1) {
                    var o1 = token;
                    var o2 = operatorStack[operatorStack.length - 1];
                    while("^*/+-".indexOf(o2) !== -1 && ((operators[o1].associativity === "Left" && operators[o1].precedence <= operators[o2].precedence) || (operators[o1].associativity === "Right" && operators[o1].precedence < operators[o2].precedence))) {
                        outputQueue += operatorStack.pop() + " ";
                        o2 = operatorStack[operatorStack.length - 1];
                    }
                    operatorStack.push(o1);
                } else if(token === "(") {
                    operatorStack.push(token);
                } else if(token === ")") {
                    while(operatorStack[operatorStack.length - 1] !== "(") {
                        outputQueue += operatorStack.pop() + " ";
                    }
                    operatorStack.pop();
                }
            }
            while(operatorStack.length > 0) {
                outputQueue += operatorStack.pop() + " ";
            }
            return outputQueue;
        },
        
        solvePostfix: function(postfix) {
            var resultStack = [];
            postfix = postfix.split(" ");
            for(var i = 0; i < postfix.length; i++) {
                if(postfix[i].isNumeric()) {
                    resultStack.push(postfix[i]);
                } else {
                    var a = resultStack.pop();
                    var b = resultStack.pop();
                    if(postfix[i] === "+") {
                        resultStack.push(parseInt(a) + parseInt(b));
                    } else if(postfix[i] === "-") {
                        resultStack.push(parseInt(b) - parseInt(a));
                    } else if(postfix[i] === "*") {
                        resultStack.push(parseInt(a) * parseInt(b));
                    } else if(postfix[i] === "/") {
                        resultStack.push(parseInt(b) / parseInt(a));
                    } else if(postfix[i] === "^") {
                        resultStack.push(Math.pow(parseInt(b), parseInt(a)));
                    }
                }
            }
            if(resultStack.length > 1) {
                return "error";
            } else {
                return resultStack.pop();
            }
        }
    
    }
 
});

String.prototype.isNumeric = function() {
    return !isNaN(parseFloat(this)) && isFinite(this);
}

Array.prototype.clean = function() {
    for(var i = 0; i < this.length; i++) {
        if(this[i] === "") {
            this.splice(i, 1);
        }
    }
    return this;
}

calculatorApp.controller("CalculatorController", function($scope, $calculatorFactory) {
 
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