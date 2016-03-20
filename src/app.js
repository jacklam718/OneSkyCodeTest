import lodash from 'lodash';
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngSanitize from 'angular-sanitize';
import ngStorage from 'ngStorage';
import ngTooltips from 'angular-tooltips';
import angularPagination from 'angularUtils-pagination';

// my modules
import phraseModule from './templates/phrase/phrase.module';
import servicesModule from './services/services.module';

window._ = lodash;

const MODULE_NAME = 'OneSkyCodeTest';
const module = angular.module(MODULE_NAME, [
  uiRouter,
  ngSanitize,
  phraseModule,
  servicesModule,
  ngStorage.name,
  ngTooltips,
  angularPagination,
  'ngDialog'
]);
