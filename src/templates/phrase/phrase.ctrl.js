class PhraseCtrl {
  constructor (PhraseService, PhraseDialogProvider) {
    this.phraseService        = PhraseService;
    this.phraseDialogProvider = PhraseDialogProvider;

    this._fetchPhrases();

    this.filterOptionsForSelect = [
      {
        text: 'All phrases',
        value: undefined,
        icon: 'icon-align-left'
      },
      {
        text: 'visible phrases',
        value: 'visible',
        icon: 'icon-eye-open'
      },
      {
        text: 'Hidden phrases',
        value: 'hidden',
        icon: 'icon-eye-close'
      }
    ];
  }

  _fetchPhrases (status) {
    if (_.isUndefined(status) || _.isEmpty(status)) {
      this.phraseService.getAll()
        .then(this._setPhrases.bind(this));
    } else {
      this.phraseService.getByStatus(status)
        .then(this._setPhrases.bind(this));
    }
  }

  _setPhrases (result) {
    this.phrases          = result.phrases;
    this.numberOfVisible  = result.phrasesCount.visible;
    this.numberOfHidden   = result.phrasesCount.hidden;
    this.totalOfPhrases   = result.phrasesCount.total;
  }

  areAnyPhrasesSelected () {
    return !!_.find(this.phrases, {selected: true});
  }

  onToggleAllPhrases () {
    this.toggledAllPhrases = !this.toggledAllPhrases;
    _.forEach(this.phrases, phrase => {
      phrase.selected = this.toggledAllPhrases;
    });
  }

  onSearch (keyword) {
    if (_.isEmpty(keyword)) {
      this._fetchPhrases(this.selectedFilter);
    } else {
      this.phraseService.search(keyword)
        .then(this._setPhrases.bind(this));
    }
  }

  onStatusFilter (status) {
    this.selectedFilter = status;
    this._fetchPhrases(status);
  }

  onAddPhrasesHidden () {
    _.forEach(this.phrases, phrase => {
      if (phrase.selected) phrase.status = 'hidden';
    });
    this.phraseService
      .updatePhrasesStatus(this.phrases)
      .then(this._setPhrases.bind(this));
  }

  onAddPhrasesVisible () {
    _.forEach(this.phrases, phrase => {
      if (phrase.selected) phrase.status = 'visible';
    });
    this.phraseService
      .updatePhrasesStatus(this.phrases)
      .then(this._setPhrases.bind(this));
  }

  onAddNote (phraseId) {
    this.phraseDialogProvider.openDialog(phraseId);
  }
}

PhraseCtrl.$inject = ['PhraseService', 'PhraseDialogProvider'];
export default PhraseCtrl;
