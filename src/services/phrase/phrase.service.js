let phrasesSeedData = require('./phrases.json');

// fade service, simulate API calls and responses
class PhraseService {
  constructor ($q) {
    this.$q = $q;
  }

  _countPhrases () {
    let visible = _.countBy(phrasesSeedData, {status: 'visible'})['true'] || 0;
    let hidden   = _.countBy(phrasesSeedData, {status: 'hidden'})['true']  || 0;
    let total    = (visible + hidden);
    return {visible: visible, hidden: hidden, total: total};
  }

  getAll () {
    let deferred     = this.$q.defer();
    let phrasesCount = this._countPhrases();
    deferred.resolve({phrases: phrasesSeedData, phrasesCount: phrasesCount});
    return deferred.promise;
  }

  search (keyword) {
    let deferred = this.$q.defer();
    if (!['string', 'number'].includes(typeof keyword)) {
      deferred.reject('keyword value invalid');
    } else {
      let phrasesCount   = this._countPhrases();
      let results        = {};
      let searchByFields = ['id', 'context', 'value', 'notes'];
      for (let k in phrasesSeedData) {
        for (let i = 0; i < searchByFields.length; i++) {
          let searchByField = searchByFields[i];
          if (_.toString(phrasesSeedData[k][searchByField]).includes(_.toString(keyword))) {
            results[k] = phrasesSeedData[k];
          }
        }
      }
      deferred.resolve({phrases: results, phrasesCount: phrasesCount});
    }
    return deferred.promise;
  }

  getByStatus (status) {
    let deferred = this.$q.defer();
    if (!typeof status === 'string') {
      deferred.reject('status value invalid');
    } else {
      let phrasesCount    = this._countPhrases();
      let filteredPhrases = [];
      for (let k in phrasesSeedData) {
        if (phrasesSeedData[k]['status'] === status) {
          filteredPhrases.push(phrasesSeedData[k]);
        }
      }
      deferred.resolve({phrases: filteredPhrases, phrasesCount: phrasesCount});
    }
    return deferred.promise;
  }

  updatePhrasesStatus (phrases) {
    _.forEach(phrases, phrase => {
      phrasesSeedData[phrase.id]['status'] = phrase.status;
    });
    let deferred     = this.$q.defer();
    let phrasesCount = this._countPhrases();
    deferred.resolve({phrases: phrasesSeedData, phrasesCount: phrasesCount});
    return deferred.promise;
  }
}

PhraseService.$inject = ['$q'];
export default PhraseService;
