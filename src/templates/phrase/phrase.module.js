import register from 'register';
import phraseRoute from './phrase.route';
import PhraseCtrl from './phrase.ctrl';
import PhraseDialogProvider from './phrase.dialog/phrase.dialog';

const MODULE_NAME = 'OneSkyCodeTest.phrase';

// create module
angular.module(MODULE_NAME, [])
  .config(phraseRoute)
  .name;

// register component, controller, services to module
register(MODULE_NAME)
  .provider('PhraseDialogProvider', PhraseDialogProvider)
  .controller('PhraseCtrl', PhraseCtrl);

export default MODULE_NAME;
