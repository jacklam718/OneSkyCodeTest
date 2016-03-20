class PhraseNoteStorageService {
  PHRASE_NOTE_STORE_KEY = 'phrase_note';

  constructor ($localStorage) {
    this.$localStorage = $localStorage;

    if (!$localStorage[this.PHRASE_NOTE_STORE_KEY]) {
      $localStorage[this.PHRASE_NOTE_STORE_KEY] = {};
    }
  }

  getNoteByPhraseId (phraseId) {
    return this.$localStorage[this.PHRASE_NOTE_STORE_KEY][phraseId];
  }

  saveNoteWithPhraseId (phraseId, phraseNote) {
    return this.$localStorage[this.PHRASE_NOTE_STORE_KEY][phraseId] = phraseNote;
  }
}

PhraseNoteStorageService.$inject = ['$localStorage'];
export default PhraseNoteStorageService;
