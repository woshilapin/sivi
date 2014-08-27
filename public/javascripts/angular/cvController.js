var cvApp = angular.module('cvApp', []);

cvApp.controller('cvController', ['$scope', '$http', function($scope, $http) {
		var cv = undefined;
		$scope.check = {
			"address": {
				"postal": /^[0-9A-Z -]+$/
			}
		};
		$scope.isCV = false;
		$scope.checkCV = function(next) {
			var email = $scope.email;
			$scope.isCV = false;
			if(email !== "") {
				var uri = 'cv/' + email + '/last';
				$http.get(uri).
				success(function(data, status, header, config) {
					if(status === 200) {
						$scope.isCV = true;
						cv = data;
						// Need to explicitly convert date into Date object in javascript
						cv.birthday = new Date(data.birthday);
					}
					next();
				}).
				error(function(data, status, header, config) {
					console.log('The database does not contain any CV for user \`' + email + "'");
					next();
				});
			}
		};
		$scope.loadCV = function(next) {
			if($scope.isCV) {
				$scope.cv = cv;
				next();
			} else {
				$scope.checkCV(function() {
					$scope.cv = cv;
					next();
				});
			}
		};
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
