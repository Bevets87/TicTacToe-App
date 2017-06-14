(function () {

  'use strict';

  var App = angular.module('ticTacToe',[]);

  App.controller('cntrl', function ($scope, $timeout) {

    $scope.initGame = function () {
      $scope.winner = null;

      $scope.board = [
        null,null,null,
        null,null,null,
        null,null,null
      ];

      $scope.winningCombos = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
      ];
      $scope.user = 'O';

      $scope.userPositions = [];

      $scope.comp = 'O';

      $scope.compPositions = [];

      $scope.turn = $scope.comp;

      $scope.hidePrompt = false;

      $scope.hideBoard = true;
    }

    $scope.setUserChoice = function (selection) {
      $scope.user = selection;
      $scope.comp = ($scope.comp == $scope.user) ? 'X' : 'O';
      $scope.hidePrompt = true;
      $scope.hideBoard = false;
     }

    $scope.setUserPosition = function (position) {
      $scope.board[position] = $scope.user;
      $scope.userPositions.push(position)
        trackWinningCombos($scope.winningCombos,$scope.user,position);
        checkForWinner($scope.winningCombos,$scope.user);
        if ($scope.winner == null) {
          setCompPosition();
        }
      }

    var setCompPosition = function () {
       var compPosition = useAI();
        $scope.board[compPosition] = $scope.comp;
        $scope.compPositions.push(compPosition);
          trackWinningCombos($scope.winningCombos,$scope.comp,compPosition);
          checkForWinner($scope.winningCombos,$scope.comp);
      }

    var useAI = function () {
      var edge = [1,3,5,7]
      var corner = [0,2,6,8]
      var userPosition = $scope.board.lastIndexOf($scope.user)
      var choice;
        if ($scope.userPositions.length == 1) {
          choice = openingDefense(userPosition);
        }
        if ($scope.userPositions.length > 1) {
          choice = checkForWinningCombos($scope.winningCombos,$scope.comp);
        if (choice == undefined) {
          choice = checkForWinningCombos($scope.winningCombos,$scope.user);
        if (choice == undefined) {
         for(var i = 0; i < $scope.board.length; i++) {
           if ($scope.board[i] == null) {
            if (edge.indexOf(userPosition) >= 0 && edge.indexOf(i) >= 0) {
              choice = i;
            } else if (corner.indexOf(userPosition) >= 0 && corner.indexOf(i) >= 0) {
              choice = i;
            } else {
              choice = i;
            }
             }}}}}
             return choice;
      }


      var openingDefense = function (userPosition) {
        switch (userPosition) {
          case 0 :
          case 2 :
          case 6 :
          case 8 :
            return 4
            break;
          case 1 :
          case 3 :
          case 5 :
          case 7 :
            return 4
            break;
          case 4 :
            var corners = [0,2,6,8];
            var index = Math.floor(Math.random() * corners.length);
            return corners[index];
            break;
        }
      }

      var checkForWinningCombos = function (playerWinningCombos, player) {
        var choice;
        playerWinningCombos.forEach(function(combo){
          var count = 0;
          for (var i = 0; i < combo.length; i++) {
            if (combo[i] == player) {
              count++
            }
            if (count == 2) {
              combo.forEach(function(position) {
              if (typeof position == 'number') {
                  choice = position;
                }})
              }
            }
          }
        )
        return choice
      }

      var checkForTie = function () {
        if($scope.board.indexOf(null) < 0 && $scope.winner == null){
          $scope.winner = 'Tie!';
          $timeout(function () {
            $scope.initGame()
          }, 2000);
        }
      }

      var checkForWinner = function (playerWinningCombos,player) {
        playerWinningCombos.forEach(function(combo){
          var count = 0;
          for(var i = 0; i < combo.length; i++){
          if(combo[i] == player){
            count++
            if(count == 3){
              $scope.winner = player + ' Wins!';
              $timeout(function(){$scope.initGame()},2000);
              }
          } else{
            count = 0;
            checkForTie();
          }
        }
      });
    }

    var trackWinningCombos = function (playerWinningCombos,player,position) {
      playerWinningCombos.forEach(function (combo) {
        if(combo.indexOf(position) >= 0){
          combo[combo.indexOf(position)] = player;
        }
      });
    }


    $scope.initGame();

  });

}())
