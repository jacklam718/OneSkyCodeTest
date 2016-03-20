class PhraseDialogProvider {
  constructor () {
    this.$get.$inject = ['ngDialog'];
  }

  openDialog (phraseId) {
    this.ngDialog.open({
      template: './build/templates/phrase/phrase.dialog/phrase.dialog.html',
      className: 'ngdialog-theme-default phrase-dialog',
      showClose: false,
      controller: function ($scope, ngDialog, PhraseNoteStorageService) {
        let phraseNoteStorage = PhraseNoteStorageService;

        // load note from localStorage
        $scope.phraseNote = phraseNoteStorage.getNoteByPhraseId(phraseId);

        $scope.onCloseDialog = () => {
          ngDialog.close();
        };

        $scope.onSaveNote = () => {
          phraseNoteStorage.saveNoteWithPhraseId(phraseId, $scope.phraseNote);
        };
      }
    });
  }

  $get (ngDialog) {
    this.ngDialog = ngDialog;
    return this;
  }
}

export default PhraseDialogProvider;
