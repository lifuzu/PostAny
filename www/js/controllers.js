angular.module('starter.controllers', ['starter.factory'])

.controller('AppCtrl', function($scope, $rootScope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

  // Add a new post
  $scope.postData = {};
  $rootScope.postlists = [];

  // Create the post modal that we will use later
  $ionicModal.fromTemplateUrl('templates/post.html', {
    scope: $scope
  }).then(function(post) {
    $scope.post = post;
  });

  // Triggered in the post modal to close it
  $scope.closePost = function() {
    $scope.post.hide();
  };

  // Open the post modal
  $scope.doPost = function() {
    $scope.post.show();
  };

  // Perform the post action when the user submits the login form
  $scope.newPost = function() {
    console.log('Doing post', $scope.postData);
    if($scope.postData && $scope.postData.content !== "") {
        if($rootScope.hasOwnProperty("postlists") !== true) {
            $rootScope.postlists = [];
        }
        // switch post to put, the latter we need to create _id
        if (!$scope.postData._id) {
          $scope.postData._id = new Date().getTime() + '';
        }
        localDB.put($scope.postData, function (err, response) {
          if (err) console.log(err); return;
          $scope.postData.content = "";
        });
    } else {
        console.log("Action not completed");
    }
    $scope.closePost();
  };
})

.controller('PostlistsCtrl', function($scope, $rootScope, PouchDBListener) {

  $scope.$on('add', function(event, post) {
    $rootScope.postlists.push(post);
  });

  $scope.$on('delete', function(event, id) {
    for(var i = 0; i < $rootScope.postlists.length; i++) {
      if($rootScope.postlists[i]._id === id) {
        $rootScope.postlists.splice(i, 1);
      }
    }
  });
})

.controller('PostlistCtrl', function($scope, $stateParams) {
});
