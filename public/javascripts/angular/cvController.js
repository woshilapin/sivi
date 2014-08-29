var cvApp = angular.module('cvApp', []);

// When you have a callback function, pass it as an argument to this 'callback' function.
// It will check if it's a function before calling it.
var callback = function(next) {
	if(next instanceof Function) {
		next();
	}
}

cvApp.controller('cvController', ['$scope', '$http', '$window', function($scope, $http, $window) {
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
				var getRequest = {
					method: 'GET',
					url: uri
				};
				$http(getRequest).
				success(function(data, status, header, config) {
					if(status === 200) {
						$scope.isCV = true;
						delete data._id;
						delete data._date;
						cv = data;
						// Need to explicitly convert date into Date object in javascript
						cv.birthday = new Date(data.birthday);
					}
					callback(next);
				}).
				error(function(data, status, header, config) {
					console.log('The database does not contain any CV for user \`' + email + "'");
					callback(next);
				});
			}
		};
		$scope.loadCV = function(next) {
			if($scope.isCV) {
				$scope.cv = cv;
				callback(next);
			} else {
				$scope.checkCV(function() {
					$scope.cv = cv;
					callback(next);
				});
			}
		};
		$scope.saveCV = function(next) {
			var uri = 'cv/' + $scope.email;
			$scope.cv.email = $scope.email;
			var postRequest = {
				method: 'POST',
				url: uri,
				data: $scope.cv
			};
			$http(postRequest).
			success(function(data, status, header, config) {
				if(status === 201) {
					console.log('CV saved for ' + $scope.email + "'");
				}
				callback(next);
			}).
			error(function(data, status, header, config) {
				console.log('Error when saving the CV for ' + $scope.email + "'");
				callback(next);
			});
		};
		$scope.generateCV = function(next) {
			$scope.saveCV(function() {
				var uri = 'cv/' + $scope.email + '/pdf';
				$window.open(uri);
			});
		};
		$scope.addDiploma = function(year, name, next) {
			if($scope.cv.diplomas === undefined) {
				$scope.cv.diplomas = [];
			}
			$scope.cv.diplomas.push({
					name: name,
					year: year
			});
			callback(next);
		};
		$scope.removeDiploma = function(index, next) {
			$scope.cv.diplomas.splice(index, 1);
			callback(next);
		};
		$scope.addExperience = function(year, name, next) {
			if($scope.cv.experiences === undefined) {
				$scope.cv.experiences = [];
			}
			$scope.cv.experiences.push({
					name: name,
					year: year
			});
			callback(next);
		};
		$scope.removeExperience = function(index, next) {
			$scope.cv.experiences.splice(index, 1);
			callback(next);
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
