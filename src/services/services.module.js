import register from 'register';
// my modules
import PhraseService from './phrase/phrase.service';
import PhraseNoteStorageService from './phrase/phrase-note.storage.service';

const MODULE_NAME = 'OneSkyCodeTest.services.module';
angular.module(MODULE_NAME, []);

register(MODULE_NAME)
  .service('PhraseService', PhraseService)
  .service('PhraseNoteStorageService', PhraseNoteStorageService);

export default MODULE_NAME;
