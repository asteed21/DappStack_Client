'use strict';

angular.module('dappstackApp.components.dapps.dappDialog.dappDiscussion.comments.comment')

    .controller('CommentController', ['Dapps', 'Comments', 'DappStackUser', '$rootScope','$stateParams', function(Dapps, Comments, DappStackUser, $rootScope, $stateParams) {

        var vm = this;

        vm.$onInit = function() {

            vm.showEditOrDelete = false;
            vm.username;
            vm.amOwner;
            vm.comments = [];

            function _amOwner() {
                if (vm.comment.dappStackUserId == $rootScope.currentUser.id) {
                    vm.amOwner = true;
                } else {
                    vm.amOwner = false;
                }
            };

            function _getUsername(comment) {
                DappStackUser.findById({id: comment.dappStackUserId})
                .$promise.then(
                    function(response) {
                        vm.username = response.username;
                    },
                    function(response) {
                        console.log("Error " + response + " - COULD NOT GET USERNAME")
                    }
                )
            };

            _amOwner();
            _getUsername(vm.comment);
        }

        vm.commentEdit = function(commentObj) {
            commentObj.interact = commentObj.comment;
            commentObj.editing = true;
            commentObj.replying = false;
        };

        vm.commentReply = function(commentObj) {
            commentObj.interact = '';
            commentObj.replying = true;
            commentObj.editing = false;
        };

        vm.cancelComment = function(commentObj) {
            _commentResetState(commentObj);
        };

        vm.updateComment = function(commentObj) {
            Dapps.comments.updateById({id: commentObj.dappsId, fk: commentObj.id}, {comment: commentObj.interact})
            .$promise.then(
                function(response) {
                    _commentResetState(commentObj);
                },
                function(response) {
                    console.log("ERROR - " + response + " - UNABLE TO UPDATE COMMENT");
                }
            );
        };

        vm.replyComment = function(commentObj) {
            var childComment = {
                comment: commentObj.interact,
                replying: false,
                editing: false,
                interact: '',
                dappsId: $stateParams.dappId,
                dappStackUserId: $rootScope.currentUser.id
            }
            Comments.comments.create({id: commentObj.id}, childComment)
            .$promise.then(
                function(response) {
                    _commentResetState(commentObj);
                },
                function(response) {
                    console.log("Error - " + response + " - COULD NOT CREATE REPLY");
                }
            );
        };

        vm.deleteComment = function(commentObj) {
            Dapps.comments.destroyById({id: commentObj.id})
            .success(function() {
                vm.comments.remove(commentObj);
            });
        };

        vm.score = function(commentObj){
            return parseFloat(commentObj.upVotes - commentObj.downVotes) * -1;
        };

        //HELPER FUNCTION

        function _commentResetState(commentObj) {
            commentObj.replying = false;
            commentObj.editing = false;
        }
    }]);