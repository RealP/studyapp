var app = angular.module("notes_app", []);

// Main controller for the app
app.controller("myCtrl", function($scope, $http) {
  // Since we will use this values alot lets set them as variable
  var add_note_overlay = document.getElementById('add_note_overlay');
  var user_id = "";
  /**
   * Load a specific users notes
   * @return {None}
   */
  $scope.loadNotes = function () {
    $http.get("http://127.0.0.1:5000/api/v1.0/notes/" + user_id)
    .then(function (response) {
        $scope.notes = response.data;
      }, function errorCallback(response) {
        console.log("Got error")
        console.log(error);
      })
  };
  /**
   * Remove a specific note based on index
   * @param  {int} idx index of note to remove
   * @return {None}
   */
  $scope.removeNote = function (idx) {
      if (! confirm("Are you sure you want to delete that note?")){
        return
      }
      $scope.errortext = "";
      $scope.notes.splice(idx, 1);
      // Make a rest call to delete the note via some id (or lameo title)
      $http.delete("http://127.0.0.1:5000/api/v1.0/notes/" + user_id + "/" + idx)
      .then(function (response) {
          console.log(response);
        }, function errorCallback(error) {
          console.log("Got error")
          console.log(error);
        })
  };
  /**
   * Open the modal which contains the note editor
   * @return {None}
   */
  $scope.openNoteEditor = function () {
    add_note_overlay.style.display = "block";
  };
  /**
   * Close the modal which contains the note editor
   * @return {None}
   */
  $scope.closeCreateNote = function () {
    add_note_overlay.style.display = "none";
  };
  /**
   * Create a new note by sending an HTTP put to the backend
   * @return {None}
   */
  $scope.createNewNote = function () {
    post_data = {
      "title":this.note_title,
      "content":this.note_body_content
    }
    $http.post("http://127.0.0.1:5000/api/v1.0/notes/" + $scope.user_id, post_data)
    .then(function (response) {
        console.log(response);
        $scope.notes = response.data;
        $scope.note_title = "";
        $scope.note_body_content = "";
        add_note_overlay.style.display = "none";
      }, function errorCallback(error) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        console.log("Got error")
        console.log(error);
      })
  };
  /**
   * Set the username so we know which notes to load
   * @return {None}
   */
  $scope.loadUser = function () {
    console.log("Called loadUser");
    user_id = this.user_id;
    $scope.loadNotes();
  };
});