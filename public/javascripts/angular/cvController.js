var cvApp = angular.module('cvApp', []);

cvApp.controller('cvController', ['$scope', '$http', function($scope, $http) {
	$scope.email= "simard.jean@gmail.com";
	$scope.check = {
		"email": /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
		// "birthday": /^(\d{4})(?:-?W(\d+)(?:-?(\d+)D?)?|(?:-(\d+))?-(\d+))(?:[T ](\d+):(\d+)(?::(\d+)(?:\.(\d+))?)?)?(?:Z(-?\d*))?$/,
		"birthday": /^\d{4}-\d{2}-\d{2}$/,
		"address": {
			"postal": /^[0-9A-Z -]+$/
		}
	};
	$scope.trigger = function() {
		var email = $scope.email;
		if(email !== "") {
			var uri = 'cv/' + email + '/last';
			$http.get(uri).
			success(function(data, status, header, config) {
				if(status === 200) {
					$scope.cv = data;
					// Need to explicitly convert date into Date object in javascript
					$scope.cv.birthday = new Date(data.birthday);
				}
			}).
			error(function(data, status, header, config) {
				console.log('The database does not contain any CV for user \`' + email + "'");
			});
		}
	};
	$scope.trigger();
}]);
cvApp.directive('myDate', ['dateFilter', function(dateFilter) {
	return {
		"require": "ngModel",
		"restrict": "A",
		"link": function(scope, element, attr, controller) {
			controller.$formatters.push(function (modelValue) {
				return dateFilter(modelValue, 'yyyy-MM-dd');
			});
		}
	};
}]);
