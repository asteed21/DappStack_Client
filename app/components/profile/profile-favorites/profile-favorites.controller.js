'use strict';

angular.module('dappstackApp.components.profile.profileFavorites')

    .controller('ProfileFavoritesController', ['DappStackUser', 'Favorites', 'dapps', '$rootScope','$state', function(DappStackUser, Favorites, dapps, $rootScope, $state) {
        
        var vm = this;

        DappStackUser.favorites({id:$rootScope.currentUser.id, "filter":{"include":["dapps"]}})
        .$promise.then(
            function (response) {
                vm.favorites = response;
            },
            function (response) {
                console.log("Error: " + response.status + " " + response.statusText);
            }
        );

        vm.toggleDelete = function () {
            vm.showDelete = !vm.showDelete;
        };

        vm.deleteFavorite = function(favoriteid) {
            Favorites.deleteById({id: favoriteid}).$promise.then(
                function() {
                    vm.showDelete = !vm.showDelete;
                    $state.go($state.current, {}, {reload: true});
                },
                function(response) {
                    console.log("Error: " + response + " - COULD NOT DELETE");
                }
            )
        };
    }]);