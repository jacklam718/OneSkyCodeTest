let phraseRoute = ($stateProvider) => {
  $stateProvider
    .state('phrase', {
      url: '',
      views: {
        '': {
          template: require('./phrase.html'),
          controller: 'PhraseCtrl',
          controllerAs: 'phraseCtrl',
        }
      }
    });
}

phraseRoute.$inject = ['$stateProvider'];
export default phraseRoute;
