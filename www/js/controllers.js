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
    if($scope.postData && $scope.postData.content && $scope.postData.content !== "") {
        if($rootScope.hasOwnProperty("postlists") !== true) {
            $rootScope.postlists = [];
        }
        // switch post to put, the latter we need to create _id
        // if (!$scope.postData._id) {
        //   $scope.postData._id = new Date().getTime() + '';
        // }
        localDB.post($scope.postData, function (err, response) {
          if (err) console.log(err);
          $scope.postData.content = "";
          console.log("New Post Published!")
        });
    } else {
        console.log("Action not completed");
    }
    $scope.closePost();
  };
})

.controller('PostlistsCtrl', function($scope, $rootScope, PouchDBListener, $timeout) {

  $scope.$on('add', function(event, post) {
    $rootScope.postlists.unshift(post);
  });

  $scope.$on('delete', function(event, id) {
    for(var i = 0; i < $rootScope.postlists.length; i++) {
      if($rootScope.postlists[i]._id === id) {
        $rootScope.postlists.splice(i, 1);
      }
    }
  });

  $scope.$on('scroll.refreshComplete', function(event) {
    retryFetchReplication();
  })

  function retryFetchReplication() {
      var timeout = 5000;
      var backoff = 2;
      // sync local database with remote one on server
      localDB.replicate.from(remoteDB, {live: true})
      .on('change', function (info) {
        // something changed, handle change
        timeout = 5000;  // reset timer
        console.log("PouchDB SYNC changed");
      }).on('complete', function (info) {
        // handle complete
        console.log("PouchDB SYNC completed");
      }).on('uptodate', function (info) {
        // handle up-to-date
        console.log("PouchDB SYNC up-to-dated from Fetching.");
      }).on('error', function (err) {
        // handle error
        console.log("PouchDB SYNC error!");
        console.log(err);
        setTimeout(function() {
          timeout *= backoff;
          retryFetchReplication();
        }, timeout);
      });
    }

  $scope.refreshTasks = function() {
    console.log('Refreshing');

    $timeout(function() {
      $scope.$broadcast('scroll.refreshComplete');
    }, 1250);
  };
})

.controller('PostlistCtrl', function($scope, $stateParams) {
});
