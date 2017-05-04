/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(1);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(2);
	
	__webpack_require__(3);
	
	__webpack_require__(4);
	
	__webpack_require__(5);
	
	__webpack_require__(6);
	
	__webpack_require__(7);
	
	__webpack_require__(8);
	
	var _leaflet = __webpack_require__(9);
	
	var _leaflet2 = _interopRequireDefault(_leaflet);
	
	__webpack_require__(10);
	
	__webpack_require__(11);
	
	__webpack_require__(12);
	
	__webpack_require__(13);
	
	__webpack_require__(14);
	
	__webpack_require__(15);
	
	__webpack_require__(16);
	
	__webpack_require__(17);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// Tracker core
	_leaflet2.default.Icon.Default.imagePath = '../dhis-web-commons/leaflet/images';
	
	angular.module('eventCapture').value('DHIS2URL', '../api/26').value('DHIS2COORDINATESIZE', 6).config(["$routeProvider", "$translateProvider", "$logProvider", function ($routeProvider, $translateProvider, $logProvider) {
	
	    $routeProvider.when('/', {
	        templateUrl: 'views/home.html',
	        controller: 'MainController',
	        reloadOnSearch: false
	    }).otherwise({
	        redirectTo: '/'
	    });
	
	    $translateProvider.preferredLanguage('en');
	    $translateProvider.useSanitizeValueStrategy('escaped');
	    $translateProvider.useLoader('i18nLoader');
	
	    $logProvider.debugEnabled(false);
	}]);

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = angular.module('eventCapture', ['ui.bootstrap', 'ngRoute', 'ngCookies', 'ngMessages', 'ngSanitize', 'eventCaptureDirectives', 'eventCaptureServices', 'eventCaptureFilters', 'd2Filters', 'd2Directives', 'd2Services', 'd2Controllers', 'd2Templates', 'ui.select', 'angularLocalStorage', 'pascalprecht.translate', 'leaflet-directive', 'ngCsv']);

/***/ },
/* 3 */
/***/ function(module, exports) {

	/* Pagination service */
	/* global angular, dhis2, moment */
	
	var d2Services = angular.module('d2Services', ['ngResource'])
	
	/* Factory for loading translation strings */
	.factory('i18nLoader', function ($q, $http, SessionStorageService, DHIS2URL) {
	
	    var getTranslationStrings = function (locale) {
	        var defaultUrl = 'i18n/i18n_app.properties';
	        var url = '';
	        if (locale === 'en' || !locale) {
	            url = defaultUrl;
	        }
	        else {
	            url = 'i18n/i18n_app_' + locale + '.properties';
	        }
	
	        var tx = {locale: locale};
	
	        var promise = $http.get(url).then(function (response) {
	            tx = {locale: locale, keys: dhis2.util.parseJavaProperties(response.data)};
	            return tx;
	        }, function () {
	
	            var p = $http.get(defaultUrl).then(function (response) {
	                tx = {locale: locale, keys: dhis2.util.parseJavaProperties(response.data)};
	                return tx;
	            });
	            return p;
	        });
	        return promise;
	    };
	
	    var getProfile = function () {
	        var locale = 'en';
	
	        var promise = $http.get( DHIS2URL + '/me.json?fields=id,displayName,userCredentials[username,userRoles[id,programs,authorities]],organisationUnits[id,displayName,level,path,children[id,displayName,level,children[id]]],dataViewOrganisationUnits[id,displayName,level,path,children[id,displayName,level,children[id]]],teiSearchOrganisationUnits[id,displayName,level,path,children[id,displayName,level,children[id]]]').then(function (response) {
	            SessionStorageService.set('USER_PROFILE', response.data);
	            if (response.data && response.data.settings && response.data.settings.keyUiLocale) {
	                locale = response.data.settings.keyUiLocale;
	            }
	            return locale;
	        }, function () {
	            return locale;
	        });
	
	        return promise;
	    };
	    return function () {
	        var deferred = $q.defer(), translations;
	        var userProfile = SessionStorageService.get('USER_PROFILE');
	        if (userProfile && userProfile.settings && userProfile.settings.keyUiLocale) {
	            getTranslationStrings(userProfile.settings.keyUiLocale).then(function (response) {
	                translations = response.keys;
	                deferred.resolve(translations);
	            });
	            return deferred.promise;
	        }
	        else {
	            getProfile().then(function (locale) {
	                getTranslationStrings(locale).then(function (response) {
	                    translations = response.keys;
	                    deferred.resolve(translations);
	                });
	            });
	            return deferred.promise;
	        }
	    };
	})
	
	.service('AuthorityService', function () {
	    var getAuthorities = function (roles) {
	        var authority = {};
	        if (roles && roles.userCredentials && roles.userCredentials.userRoles) {
	            angular.forEach(roles.userCredentials.userRoles, function (role) {
	                angular.forEach(role.authorities, function (auth) {
	                    authority[auth] = true;
	                });
	            });
	        }
	        return authority;
	    };
	
	    return {
	        getUserAuthorities: function (roles) {
	            var auth = getAuthorities(roles);
	            var authority = {};
	            authority.canDeleteEvent = auth['F_TRACKED_ENTITY_DATAVALUE_DELETE'] || auth['ALL'] ? true : false;
	            authority.canAddOrUpdateEvent = auth['F_TRACKED_ENTITY_DATAVALUE_ADD'] || auth['ALL'] ? true : false;
	            authority.canSearchTei = auth['F_TRACKED_ENTITY_INSTANCE_SEARCH'] || auth['ALL'] ? true : false;
	            authority.canDeleteTei = auth['F_TRACKED_ENTITY_INSTANCE_DELETE'] || auth['ALL'] ? true : false;
	            authority.canRegisterTei = auth['F_TRACKED_ENTITY_INSTANCE_ADD'] || auth['ALL'] ? true : false;
	            authority.canEnrollTei = auth['F_PROGRAM_ENROLLMENT'] || auth['ALL'] ? true : false;
	            authority.canUnEnrollTei = auth['F_PROGRAM_UNENROLLMENT'] || auth['ALL'] ? true : false;
	            authority.canAdministerDashboard = auth['F_PROGRAM_DASHBOARD_CONFIG_ADMIN'] || auth['ALL'] ? true : false;
	            return authority;
	        }
	    };
	})
	
	/* Factory for loading external data */
	.factory('ExternalDataFactory', function ($http) {
	
	    return {
	        get: function (fileName) {
	            var promise = $http.get(fileName).then(function (response) {
	                return response.data;
	            });
	            return promise;
	        }
	    };
	})
	
	/* service for wrapping sessionStorage '*/
	.service('SessionStorageService', function ($window) {
	    return {
	        get: function (key) {
	            return JSON.parse($window.sessionStorage.getItem(key));
	        },
	        set: function (key, obj) {
	            $window.sessionStorage.setItem(key, JSON.stringify(obj));
	        },
	        clearAll: function () {
	            for (var key in $window.sessionStorage) {
	                $window.sessionStorage.removeItem(key);
	            }
	        }
	    };
	})
	
	/* service for getting calendar setting */
	.service('CalendarService', function (storage, $rootScope) {
	
	    return {
	        getSetting: function () {
	
	            var dhis2CalendarFormat = {keyDateFormat: 'yyyy-MM-dd', keyCalendar: 'gregorian', momentFormat: 'YYYY-MM-DD'};
	            var storedFormat = storage.get('SYSTEM_SETTING');
	            
	            if (angular.isObject(storedFormat) && storedFormat.keyDateFormat && storedFormat.keyCalendar) {
	                if (storedFormat.keyCalendar === 'iso8601') {
	                    storedFormat.keyCalendar = 'gregorian';
	                }
	
	                if (storedFormat.keyDateFormat === 'dd-MM-yyyy') {
	                    dhis2CalendarFormat.momentFormat = 'DD-MM-YYYY';
	                }
	
	                dhis2CalendarFormat.keyCalendar = storedFormat.keyCalendar;
	                dhis2CalendarFormat.keyDateFormat = storedFormat.keyDateFormat;
	            }
	            $rootScope.dhis2CalendarFormat = dhis2CalendarFormat;
	            return dhis2CalendarFormat;
	        }
	    };
	})
	
	/* service for dealing with dates */
	.service('DateUtils', function ($filter, CalendarService, NotificationService, $translate) {
	
	    return {        
	        getDate: function (dateValue) {
	            if (!dateValue) {
	                return;
	            }
	            var calendarSetting = CalendarService.getSetting();
	            dateValue = moment(dateValue, calendarSetting.momentFormat)._d;
	            return Date.parse(dateValue);
	        },
	        format: function (dateValue) {
	            if (!dateValue) {
	                return;
	            }
	
	            var calendarSetting = CalendarService.getSetting();
	            dateValue = moment(dateValue, calendarSetting.momentFormat)._d;
	            dateValue = $filter('date')(dateValue, calendarSetting.keyDateFormat);
	            return dateValue;
	        },
	        formatToHrsMins: function (dateValue) {
	            var calendarSetting = CalendarService.getSetting();
	            var dateFormat = 'YYYY-MM-DD @ hh:mm A';
	            if (calendarSetting.keyDateFormat === 'dd-MM-yyyy') {
	                dateFormat = 'DD-MM-YYYY @ hh:mm A';
	            }
	            return moment(dateValue).format(dateFormat);
	        },
	        formatToHrsMinsSecs: function (dateValue) {
	            var calendarSetting = CalendarService.getSetting();
	            var dateFormat = 'YYYY-MM-DD @ hh:mm:ss A';
	            if (calendarSetting.keyDateFormat === 'dd-MM-yyyy') {
	                dateFormat = 'DD-MM-YYYY @ hh:mm:ss A';
	            }
	            return moment(dateValue).format(dateFormat);
	        },
	        getToday: function () {
	            var calendarSetting = CalendarService.getSetting();
	            var tdy = $.calendars.instance(calendarSetting.keyCalendar).newDate();
	            var today = moment(tdy._year + '-' + tdy._month + '-' + tdy._day, 'YYYY-MM-DD')._d;
	            today = Date.parse(today);
	            today = $filter('date')(today, calendarSetting.keyDateFormat);
	            return today;
	        },
	        isValid: function( dateValue ){
	            if( !dateValue ){
	                return false;
	            }
	            var convertedDate = this.format(angular.copy(dateValue));
	            return dateValue === convertedDate;
	        },
	        isBeforeToday: function (dateValue) {
	            if (!dateValue) {
	                return;
	            }
	            dateValue = moment(dateValue, "YYYY-MM-DD");
	            if (dateValue.isBefore(moment())) {
	                return true;
	            }
	            return false;
	        },
	        isAfterToday: function (dateValue) {
	            if (!dateValue) {
	                return;
	            }
	            dateValue = moment(dateValue, "YYYY-MM-DD");
	            if (dateValue.isAfter(moment())) {
	                return true;
	            }
	            return false;
	        },
	        formatFromUserToApi: function (dateValue) {
	            if (!dateValue) {
	                return;
	            }
	            var calendarSetting = CalendarService.getSetting();
	            dateValue = moment(dateValue, calendarSetting.momentFormat)._d;
	            dateValue = Date.parse(dateValue);
	            dateValue = $filter('date')(dateValue, 'yyyy-MM-dd');
	            return dateValue;
	        },
	        formatFromApiToUser: function (dateValue) {
	            if (!dateValue) {
	                return;
	            }
	            var calendarSetting = CalendarService.getSetting();
	            if (moment(dateValue, calendarSetting.momentFormat).format(calendarSetting.momentFormat) === dateValue) {
	                return dateValue;
	            }
	            dateValue = moment(dateValue, 'YYYY-MM-DD')._d;
	            return $filter('date')(dateValue, calendarSetting.keyDateFormat);
	        },
	        getDateAfterOffsetDays: function (offSetDays) {
	            var date = new Date();
	            date.setDate(date.getDate()+offSetDays);
	            var calendarSetting = CalendarService.getSetting();
	            var tdy = $.calendars.instance(calendarSetting.keyCalendar).fromJSDate(date);
	            var dateAfterOffset = moment(tdy._year + '-' + tdy._month + '-' + tdy._day, 'YYYY-MM-DD')._d;
	            dateAfterOffset = Date.parse(dateAfterOffset);
	            dateAfterOffset = $filter('date')(dateAfterOffset, calendarSetting.keyDateFormat);
	            return dateAfterOffset;
	        },
	        verifyExpiryDate: function(date, expiryPeriodType, expiryDays){
	            var eventPeriodEndDate, eventDate, eventPeriod;
	            var isValid = true;
	            var calendarSetting, dateFormat, generator, today;
	            if(!date || !expiryPeriodType || !expiryDays) {
	                return isValid;
	            }
	            calendarSetting = CalendarService.getSetting();
	            dateFormat = calendarSetting.momentFormat;
	            generator = new dhis2.period.PeriodGenerator($.calendars.instance(calendarSetting.keyCalendar), dateFormat);
	            today = moment(this.getToday(), dateFormat);
	            eventDate = moment(date, dateFormat);
	            eventPeriod = generator.getPeriodForTheDate(eventDate.format("YYYY-MM-DD"), expiryPeriodType, true);
	            if (eventPeriod && eventPeriod.endDate) {
	                eventPeriodEndDate = moment(eventPeriod.endDate, "YYYY-MM-DD").add(expiryDays, "day");
	                if (today.isAfter(eventPeriodEndDate)) {
	                    NotificationService.showNotifcationDialog($translate.instant("error"), $translate.instant("event_date_out_of_range"));
	                    isValid = false;
	                }
	            }
	            return isValid;
	        },
	        verifyOrgUnitPeriodDate: function(date, periodStartDate, periodEndDate) {
	            var isValid = true;
	            var dateFormat, startDate, endDate, eventDate, calendarSetting;
	            if(!date) {
	                hideHeaderMessage();
	                return isValid;
	            }
	            if (!periodStartDate && !periodEndDate) {
	                hideHeaderMessage();
	                return isValid;
	            } else {
	                calendarSetting = CalendarService.getSetting();
	                dateFormat = calendarSetting.momentFormat;
	                eventDate = moment(date, dateFormat);
	                if (!periodStartDate) {
	                    endDate = moment(periodEndDate, "YYYY-MM-DD");
	                    if (eventDate.isAfter(endDate)) {
	                        isValid = false;
	                    }
	                } else if (!periodEndDate) {
	                    startDate = moment(periodStartDate, "YYYY-MM-DD");
	                    if (eventDate.isBefore(startDate)) {
	                        isValid = false;
	                    }
	                } else {
	                    startDate = moment(periodStartDate, "YYYY-MM-DD");
	                    endDate = moment(periodEndDate, "YYYY-MM-DD");
	                    if (eventDate.isBefore(startDate) || eventDate.isAfter(endDate)) {
	                        isValid = false;
	                    }
	                }
	            }
	            if(!isValid) {
	                setHeaderDelayMessage($translate.instant("date_out_of_ou_period"));
	            } else {
	                hideHeaderMessage();
	            }
	            return isValid;
	        },
	        getAge: function( _dob ){
	            var calendarSetting = CalendarService.getSetting();
	            var now = moment();
	            var dob = moment( _dob, calendarSetting.momentFormat);
	            var age = {};
	
	            age.years = now.diff(dob, 'years');
	            dob.add(age.years, 'years');
	
	            age.months = now.diff(dob, 'months');
	            dob.add(age.months, 'months');
	
	            age.days = now.diff(dob, 'days');
	            
	            return age;
	        },
	        getDateFromUTCString: function(utcDateTimeString) {
	            var calendarSetting = CalendarService.getSetting();
	            return moment(utcDateTimeString).format(calendarSetting.momentFormat);
	        }
	    };
	})
	
	/* Service for option name<->code conversion */
	.factory('OptionSetService', function() {
	    return {
	        getCode: function(options, key){
	            if(options){
	                for(var i=0; i<options.length; i++){
	                    if( key === options[i].displayName){
	                        return options[i].code;
	                    }
	                }
	            }
	            return key;
	        },
	        getName: function(options, key){
	            if(options){
	                for(var i=0; i<options.length; i++){
	                    if( key === options[i].code){
	                        return options[i].displayName;
	                    }
	                }
	            }
	            return key;
	        }
	    };
	})
	
	/* service for common utils */
	.service('CommonUtils', function($translate, DateUtils, OptionSetService, CurrentSelection, FileService, OrgUnitFactory, NotificationService, SessionStorageService, storage){
	    
	    var setFileName = function(event, valueId, dataElementId){
	        var fileNames = CurrentSelection.getFileNames() || {};
	        FileService.get(valueId).then(function(response){
	            if(response && response.displayName){
	                if(!fileNames[event.event]){
	                    fileNames[event.event] = {};
	                }
	                fileNames[event.event][dataElementId] = response.displayName;
	                CurrentSelection.setFileNames( fileNames );
	            }
	        });
	    };
	    
	    var setOrgUnitName = function( id ){
	        var orgUnitNames = CurrentSelection.getOrgUnitNames() || {};
	        if( !orgUnitNames[id] ){                
	            OrgUnitFactory.getFromStoreOrServer( id ).then(function (response) {
	                if(response && response.displayName) {                                                        
	                    orgUnitNames[id] = response.displayName;
	                    CurrentSelection.setOrgUnitNames( orgUnitNames );
	                }
	            });
	        }
	    };
	    
	    return {
	        formatDataValue: function(event, val, obj, optionSets, destination){
	            if(val &&
	                obj.valueType === 'NUMBER' ||
	                obj.valueType === 'PERCENTAGE' ||
	                obj.valueType === 'INTEGER' ||
	                obj.valueType === 'INTEGER_POSITIVE' ||
	                obj.valueType === 'INTEGER_NEGATIVE' ||
	                obj.valueType === 'INTEGER_ZERO_OR_POSITIVE'){
	                if( dhis2.validation.isNumber(val)){
	                    if(obj.valueType === 'NUMBER'){
	                        val = parseFloat(val);
	                    }else{
	                        val = parseInt(val);
	                    }
	                }
	            }
	            if(val && obj.optionSetValue && obj.optionSet && obj.optionSet.id && optionSets[obj.optionSet.id] && optionSets[obj.optionSet.id].options  ){
	                if(destination === 'USER'){
	                    val = OptionSetService.getName(optionSets[obj.optionSet.id].options, String(val));
	                }
	                else{
	                    val = OptionSetService.getCode(optionSets[obj.optionSet.id].options, val);
	                }
	
	            }
	            if(val && obj.valueType === 'DATE'){
	                if(destination === 'USER'){
	                    val = DateUtils.formatFromApiToUser(val);
	                }
	                else{
	                    val = DateUtils.formatFromUserToApi(val);
	                }
	            }
	            if(obj.valueType === 'TRUE_ONLY'){
	                if(destination === 'USER'){
	                    val = val === 'true' ? true : '';
	                }
	                else{
	                    val = val === true ? 'true' : '';
	                }
	            }
	            if( val && obj.valueType === 'ORGANISATION_UNIT' ){
	                if( destination === 'USER' ){                    
	                    setOrgUnitName( val );
	                }
	            }
	            if(event && val && destination === 'USER' && obj.valueType === 'FILE_RESOURCE'){                
	                setFileName(event, val, obj.id);
	            }
	            return val;
	        },
	        displayBooleanAsYesNo: function(value, dataElement){
	            if(angular.isUndefined(dataElement) || dataElement.valueType === "BOOLEAN"){
	                if(value === "true" || value === true){
	                    return "Yes";
	                }
	                else if(value === "false" || value === false){
	                    return "No";
	                }
	            }
	            return value;
	        },
	        userHasValidRole: function(obj, prop, userRoles){
	        	if( !obj || !prop || !userRoles){
	                return false;
	        	}
	        	for(var i=0; i < userRoles.length; i++){            
	                if( userRoles[i].authorities && userRoles[i].authorities.indexOf('ALL') !== -1 ){
	                    return true;
	                }
	                if( userRoles[i][prop] && userRoles[i][prop].length > 0 ){
	                    for( var j=0; j< userRoles[i][prop].length; j++){
	                        if( obj.id === userRoles[i][prop][j].id ){
	                            return true;
	                        }
	                    }
	                }
	            }
	            return false;            	
	        },        
	        checkAndSetOrgUnitName: function( id ){
	            setOrgUnitName( id );
	        },
	        checkAndSetFileName: function(event, valueId, dataElementId ){
	            setFileName(event, valueId, dataElementId);
	        },
	        getUsername: function(){            
	            var userProfile = SessionStorageService.get('USER_PROFILE');
	            var username = userProfile && userProfile.userCredentials && userProfile.userCredentials.username ? userProfile.userCredentials.username : '';
	            return username;
	        },
	        getSystemSetting: function(){
	            var settings = storage.get('SYSTEM_SETTING');            
	            return settings;
	        }
	    };
	})
	
	/* service for dealing with custom form */
	.service('CustomFormService', function ($translate, NotificationService) {
	
	    return {
	        getForProgramStage: function (programStage, programStageDataElements) {
	
	            var htmlCode = programStage.dataEntryForm ? programStage.dataEntryForm.htmlCode : null;
	
	            if (htmlCode) {
	                var inputRegex = /<input.*?\/>/g,
	                    match,
	                    inputFields = [],
	                    hasEventDate = false;
	
	                while (match = inputRegex.exec(htmlCode)) {
	                    inputFields.push(match[0]);
	                }
	
	                for (var i = 0; i < inputFields.length; i++) {
	                    var inputField = inputFields[i];
	                    
	                    var inputElement = $.parseHTML(inputField);
	                    var attributes = {};
	
	                    $(inputElement[0].attributes).each(function () {
	                        attributes[this.nodeName] = this.value;
	                    });
	
	                    var fieldId = '', newInputField;
	                    if (attributes.hasOwnProperty('id')) {
	
	                        if (attributes['id'] === 'executionDate') {
	                            fieldId = 'eventDate';
	                            hasEventDate = true;
	
	                            //name needs to be unique so that it can be used for validation in angularjs
	                            if (attributes.hasOwnProperty('name')) {
	                                attributes['name'] = fieldId;
	                            }
	
	                            newInputField = '<span class="hideInPrint"><input type="text" ' +
	                                this.getAttributesAsString(attributes) +
	                                ' ng-model="currentEvent.' + fieldId + '"' +
	                                ' ng-disabled="model.editingDisabled"' +
	                                ' input-field-id="' + fieldId + '"' +
	                                ' d2-date ' +
	                                ' d2-date-validator ' +
	                                ' max-date="' + 0 + '"' +
	                                ' placeholder="{{dhis2CalendarFormat.keyDateFormat}}" ' +
	                                ' ng-change="verifyExpiryDate()"'+
	                                ' ng-class="getInputNotifcationClass(prStDes.' + fieldId + '.dataElement.id,true)"' +
	                                ' blur-or-change="saveDatavalue(prStDes.' + fieldId + ')"' +
	                                ' ng-required="{{true}}"></span><span class="not-for-screen"><input type="text" value={{currentEvent.' + fieldId + '}}></span>';
	                        }
	                        else {
	                            fieldId = attributes['id'].substring(4, attributes['id'].length - 1).split("-")[1];
	
	                            //name needs to be unique so that it can be used for validation in angularjs
	                            if (attributes.hasOwnProperty('name')) {
	                                attributes['name'] = fieldId;
	                            }
	
	                            var prStDe = programStageDataElements[fieldId];
	
	                            if (prStDe && prStDe.dataElement && prStDe.dataElement.valueType) {
	
	                                var commonInputFieldProperty = this.getAttributesAsString(attributes) +
	                                    ' ng-model="currentEvent.' + fieldId + '" ' +
	                                    ' input-field-id="' + fieldId + '"' +
	                                    ' ng-disabled="model.editingDisabled || isHidden(prStDes.' + fieldId + '.dataElement.id) || selectedEnrollment.status===\'CANCELLED\' || selectedEnrollment.status===\'COMPLETED\' || currentEvent[uid]==\'uid\' || currentEvent.editingNotAllowed "'+
	                                    ' ng-required="{{prStDes.' + fieldId + '.compulsory}}" ';
	
	                                
	                                //check if dataelement has optionset
	                                if (prStDe.dataElement.optionSetValue) {
	                                    var optionSetId = prStDe.dataElement.optionSet.id;
	                                    newInputField = '<span class="hideInPrint"><ui-select theme="select2" ' + commonInputFieldProperty + ' ng-disabled="model.editingDisabled" on-select="saveDatavalue(prStDes.' + fieldId + ', outerForm.' + fieldId + ')" >' +
	                                        '<ui-select-match ng-class="getInputNotifcationClass(prStDes.' + fieldId + '.dataElement.id, true)" allow-clear="true" placeholder="' + $translate.instant('select_or_search') + '">{{$select.selected.displayName || $select.selected}}</ui-select-match>' +
	                                        '<ui-select-choices ' +
	                                        ' repeat="option.displayName as option in optionSets.' + optionSetId + '.options | filter: $select.search | limitTo:maxOptionSize">' +
	                                        '<span ng-bind-html="option.displayName | highlight: $select.search">' +
	                                        '</span>' +
	                                        '</ui-select-choices>' +
	                                        '</ui-select></span><span class="not-for-screen"><input type="text" value={{currentEvent.' + fieldId + '}}></span>';
	                                }
	                                else {
	                                    //check data element type and generate corresponding angular input field
	                                    if (prStDe.dataElement.valueType === "NUMBER" ||
	                                        prStDe.dataElement.valueType === "PERCENTAGE" ||
	                                        prStDe.dataElement.valueType === "INTEGER" ||
	                                        prStDe.dataElement.valueType === "INTEGER_POSITIVE" ||
	                                        prStDe.dataElement.valueType === "INTEGER_NEGATIVE" ||
	                                        prStDe.dataElement.valueType === "INTEGER_ZERO_OR_POSITIVE") {
	                                        newInputField = '<span class="hideInPrint"><input type="number" ' +
	                                            ' d2-number-validator ' +
	                                            ' ng-class="{{getInputNotifcationClass(prStDes.' + fieldId + '.dataElement.id, true)}}" ' +
	                                            ' number-type="' + prStDe.dataElement.valueType + '" ' +
	                                            ' ng-blur="saveDatavalue(prStDes.' + fieldId + ', outerForm.' + fieldId + ')"' +
	                                            commonInputFieldProperty + 'ng-disabled="model.editingDisabled"></span><span class="not-for-screen"><input type="text" value={{currentEvent.' + fieldId + '}}></span>';
	                                    }
	                                    else if (prStDe.dataElement.valueType === "BOOLEAN") {
	                                    	newInputField = '<span class="hideInPrint"><d2-radio-button ' +
	                                                                    ' dh-required="prStDes.' + fieldId + '.compulsory" ' +
	                                                                    ' dh-disabled="model.editingDisabled || isHidden(prStDes.' + fieldId + '.dataElement.id) || selectedEnrollment.status===\'CANCELLED\' || selectedEnrollment.status===\'COMPLETED\' || currentEvent[uid]==\'uid\' || currentEvent.editingNotAllowed" ' +
	                                                                    ' dh-value="currentEvent.' + fieldId + '" ' +
	                                                                    ' dh-name="foo" ' +
	                                                                    ' dh-current-element="currentElement" ' +
	                                                                    ' dh-event="currentEvent.event" ' +
	                                                                    ' dh-id="prStDes.' + fieldId + '.dataElement.id" ' +
	                                                                    ' dh-click="saveDatavalue(prStDes.' + fieldId + ', currentEvent, value )">' +
	                                                            ' </d2-radio-button></span> ' +
	                                                            '<span class="not-for-screen">' +
	                                                            	'<label class="radio-inline"><input type="radio" value="true" ng-model="currentEvent.' + fieldId +'">{{\'yes\' | translate}}</label>' +
	                                                            	'<label class="radio-inline"><input type="radio" value="false" ng-model="currentEvent.' + fieldId + '">{{\'no\' | translate}}</label>' +
	                                                            '</span>';
	                                    }
	                                    else if (prStDe.dataElement.valueType === "DATE") {
	                                        var maxDate = prStDe.allowFutureDate ? '' : 0;
	                                        newInputField = '<span class="hideInPrint"><input type="text" ' +
	                                            ' placeholder="{{dhis2CalendarFormat.keyDateFormat}}" ' +
	                                            ' ng-class="{{getInputNotifcationClass(prStDes.' + fieldId + '.dataElement.id, true)}}" ' +
	                                            ' ng-disabled="model.editingDisabled"'+
	                                            ' d2-date ' +
	                                            ' d2-date-validator ' +
	                                            ' max-date="' + maxDate + '"' +
	                                            ' ng-change="verifyExpiryDate()"'+
	                                            ' blur-or-change="saveDatavalue(prStDes.' + fieldId + ', outerForm.' + fieldId + ')"' +
	                                            commonInputFieldProperty + ' ></span><span class="not-for-screen"><input type="text" value={{currentEvent.' + fieldId + '}}></span>';
	                                    }
	                                    else if (prStDe.dataElement.valueType === "TRUE_ONLY") {
	                                        newInputField = '<span class="hideInPrint"><input type="checkbox" ng-disabled="model.editingDisabled"' +
	                                            ' ng-class="{{getInputNotifcationClass(prStDes.' + fieldId + '.dataElement.id, true)}}" ' +
	                                            ' ng-change="saveDatavalue(prStDes.' + fieldId + ', outerForm.' + fieldId + ')"' +
	                                            commonInputFieldProperty + ' ></span><span class="not-for-screen"><input type="checkbox" ng-checked={{currentEvent.' + fieldId + '}}></span>';
	                                    }
	                                    else if (prStDe.dataElement.valueType === "LONG_TEXT") {
	                                        newInputField = '<span class="hideInPrint"><textarea ng-disabled="model.editingDisabled" row="3" ' +
	                                            ' ng-class="{{getInputNotifcationClass(prStDes.' + fieldId + '.dataElement.id, true)}}" ' +
	                                            ' ng-blur="saveDatavalue(prStDes.' + fieldId + ', outerForm.' + fieldId + ')"' +
	                                            commonInputFieldProperty + '></textarea></span><span class="not-for-screen"><textarea row="3" value={{currentEvent.' + fieldId + '}}></textarea></span>';
	                                    }
	                                    else if (prStDe.dataElement.valueType === "FILE_RESOURCE") {
	                                        newInputField = '<span ng-disabled="model.editingDisabled" class="input-group hideInPrint">\n\
	                                                        <span ng-if="currentEvent.' + fieldId + '">\n\
	                                                            <a href ng-click="downloadFile(null, \'' + fieldId + '\', null)" title="fileNames[currentEvent.event][' + fieldId + ']" >{{fileNames[currentEvent.event][' + fieldId + '].length > 20 ? fileNames[currentEvent.event][' + fieldId + '].substring(0,20).concat(\'...\') : fileNames[currentEvent.event][' + fieldId + ']}}</a>\n\
	                                                        </span>\n\
	                                                        <span class="input-group-btn">\n\
	                                                            <span class="btn btn-grp btn-file">\n\
	                                                                <span ng-if="currentEvent.' + fieldId + '" title="{{\'delete\' | translate}}" d2-file-input-name="fileNames[currentEvent.event][' + fieldId + ']" d2-file-input-delete="currentEvent.' + fieldId + '">\n\
	                                                                    <a href ng-click="deleteFile(\'' + fieldId + '\')"><i class="fa fa-trash alert-danger"></i></a>\n\
	                                                                </span>\n\
	                                                                <span ng-if="!currentEvent.' + fieldId + '" title="{{\'upload\' | translate}}" >\n\
	                                                                    <i class="fa fa-upload"></i>\n\
	                                                                    <input  type="file" \n\
	                                                                            ' + this.getAttributesAsString(attributes) + '\n\
	                                                                            input-field-id="' + fieldId + '"\n\
	                                                                            d2-file-input-ps="currentStage"\n\
	                                                                            d2-file-input="currentEvent"\n\
	                                                                            d2-file-input-current-name="currentFileNames"\n\
	                                                                            d2-file-input-name="fileNames">\n\
	                                                                </span>\n\
	                                                            </span>\n\
	                                                        </span>\n\
	                                                    </span>' 
	                                                    '<span class="not-for-screen">' +
	                                                    	'<input type="text" value={{currentEvent.' + fieldId + '}}' +
	                                                    '</span>';
	                                    }
	                                    else if (prStDe.dataElement.valueType === "AGE") {
	                                    	newInputField = '<span class="hideInPrint"><d2-age ' +
	                                    							' id=" ' + fieldId + '" ' +
							                                        ' d2-object="currentEvent" ' + 
							                                        ' d2-disabled="model.editingDisabled || isHidden(prStDes.' + fieldId + '.dataElement.id) || selectedEnrollment.status===\'CANCELLED\' || selectedEnrollment.status===\'COMPLETED\' || currentEvent[uid]==\'uid\' || currentEvent.editingNotAllowed" ' +
	                                                                                        ' d2-required="prStDes.' + fieldId + '.compulsory" ' +
							                                        ' d2-function="saveDatavalue(arg1)" ' +						                                        
							                                        ' d2-function-param-text="prStDes.' + fieldId + '" >' +
							                                '</d2-age></span>' +
	                                                        '<span class="not-for-screen">' +
	                                                    		'<input type="text" value={{currentEvent.' + fieldId + '}}' +
	                                                    	'</span>';
	                                    }
	                                    else if (prStDe.dataElement.valueType === "COORDINATE") {
	                                    	newInputField = '<span class="hideInPrint"><d2-map ' +
	                                    							' id=" ' + fieldId + '" ' +
							                                        ' d2-object="currentEvent" ' + 
							                                        ' d2-coordinate-format="\'TEXT\'" ' + 
							                                        ' d2-disabled="model.editingDisabled || isHidden(prStDes.' + fieldId + '.dataElement.id) || selectedEnrollment.status===\'CANCELLED\' || selectedEnrollment.status===\'COMPLETED\' || currentEvent[uid]==\'uid\' || currentEvent.editingNotAllowed" ' +
	                                                                                        ' d2-required="prStDes.' + fieldId + '.compulsory" ' +
							                                        ' d2-function="saveDatavalue(arg1)" ' +						                                        
							                                        ' d2-function-param-text="prStDes.' + fieldId + '" ' +
							                                        ' d2-function-param-coordinate="\'LATLNG\'" > ' +
							                                '</d2-map></span>' +
							                                '<span class="not-for-screen">' +
	                                                    		'<input type="text" value={{currentEvent.' + fieldId + '}}' +
	                                                    	'</span>';
	                                    }
	                                    else if (prStDe.dataElement.valueType === "ORGANISATION_UNIT") {
	                                    	newInputField = '<span class="hideInPrint"><d2-org-unit-tree ' +
						                                            ' selected-org-unit-id="{{selectedOrgUnit.id}}" ' +
						                                            ' id="{{prStDes.' + fieldId + '.dataElement.id}}" ' +
						                                            ' d2-object="currentEvent" ' +
						                                            ' d2-value="currentEvent.' + fieldId + '" ' +
						                                            ' d2-disabled="model.editingDisabled || isHidden(prStDes.' + fieldId + '.dataElement.id) || selectedEnrollment.status===\'CANCELLED\' || selectedEnrollment.status===\'COMPLETED\' || currentEvent[uid]==\'uid\' || currentEvent.editingNotAllowed" ' +
						                                            ' d2-required="prStDes.' + fieldId + '.compulsory" ' +
	                                                                                    ' d2-orgunit-names="orgUnitNames" ' +
						                                            ' d2-function="saveDatavalue(prStDes.' + fieldId + ', currentEvent, value )" >' +
						                                    ' </d2-org-unit-tree></span>' +
						                                    '<span class="not-for-screen">' +
	                                                    		'<input type="text" value={{currentEvent.' + fieldId + '}}' +
	                                                    	'</span>';
	                                    }
	                                    else if (prStDe.dataElement.valueType === "PHONE_NUMBER") {
	                                        newInputField = '<span class="hideInPrint"><input ng-disabled="model.editingDisabled" type="text" ' +
	                                            ' ng-class="{{getInputNotifcationClass(prStDes.' + fieldId + '.dataElement.id, true)}}" ' +
	                                            ' ng-blur="saveDatavalue(prStDes.' + fieldId + ', outerForm.' + fieldId + ')"' +
	                                            commonInputFieldProperty + '></span><span class="not-for-screen"><input type="text" value={{currentEvent.' + fieldId + '}}></span>';
	                                    }
	                                    else if (prStDe.dataElement.valueType === "EMAIL") {
	                                        newInputField = '<span class="hideInPrint"><input style="width:100%;" type="email" ng-disabled="model.editingDisabled"' +
	                                            ' ng-blur="saveDatavalue(prStDes.' + fieldId + ', outerForm.' + fieldId + ')" ' +
	                                            commonInputFieldProperty +
	                                            ' ng-model="currentEvent.' + fieldId + '">' +
	                                            '<span class="not-for-screen"><input type="email" value={{currentEvent.' + fieldId + '}}></span>';
	                                    }
	                                    else if (prStDe.dataElement.valueType === "TEXT") {
	                                        newInputField = '<span class="hideInPrint"><input ng-disabled="model.editingDisabled" type="text" ' +
	                                            ' ng-class="{{getInputNotifcationClass(prStDes.' + fieldId + '.dataElement.id, true)}}" ' +
	                                            ' ng-blur="saveDatavalue(prStDes.' + fieldId + ', outerForm.' + fieldId + ')"' +
	                                            commonInputFieldProperty + '></span><span class="not-for-screen"><input type="text" value={{currentEvent.' + fieldId + '}}></span>';
	                                    }
	                                    else{
	                                    	newInputField = ' {{"unsupported_value_type" | translate }}: ' + prStDe.dataElement.valueType;
	                                    }
	                                }
	                            }
	                            else{
	                                NotificationService.showNotifcationDialog($translate.instant("error"),
	                                    $translate.instant("custom_form_has_invalid_dataelement"));
	
	                                return;
	                            }
	                            
	                            
	                        }
	                        newInputField = newInputField + ' <span ng-messages="outerForm.' + fieldId + '.$error" class="required" ng-if="interacted(outerForm.' + fieldId + ')" ng-messages-include="./templates/error-messages.html"></span>';
	
	                        htmlCode = htmlCode.replace(inputField, newInputField);
	
	                    }
	                }
	                htmlCode = addPopOver(htmlCode, programStageDataElements);
	                return {htmlCode: htmlCode, hasEventDate: hasEventDate};
	            }
	            return null;
	        },
	        getForTrackedEntity: function (trackedEntityForm, target) {
	            if (!trackedEntityForm) {
	                return null;
	            }
	
	            var htmlCode = trackedEntityForm.htmlCode ? trackedEntityForm.htmlCode : null;
	            if (htmlCode) {
	
	                var trackedEntityFormAttributes = [];
	                angular.forEach(trackedEntityForm.attributes, function (att) {
	                    trackedEntityFormAttributes[att.id] = att;
	                });
	
	
	                var inputRegex = /<input.*?\/>/g, match, inputFields = [];
	                var hasProgramDate = false;
	                while (match = inputRegex.exec(htmlCode)) {
	                    inputFields.push(match[0]);
	                }
	
	                for (var i = 0; i < inputFields.length; i++) {
	                    var inputField = inputFields[i];
	                    var inputElement = $.parseHTML(inputField);
	                    var attributes = {};
	
	                    $(inputElement[0].attributes).each(function () {
	                        attributes[this.nodeName] = this.value;
	                    });
	
	                    var attId = '', fieldName = '', newInputField, programId;
	                    if (attributes.hasOwnProperty('attributeid')) {
	                        attId = attributes['attributeid'];
	                        fieldName = attId;
	                        var att = trackedEntityFormAttributes[attId];
	
	                        if (att) {
	                            var attMaxDate = att.allowFutureDate ? '' : 0;
	                            var isTrackerAssociate = att.valueType === 'TRACKER_ASSOCIATE';
	                            var commonInputFieldProperty = ' name="' + fieldName + '"' +
	                                ' element-id="' + i + '"' +
	                                this.getAttributesAsString(attributes) +
	                                ' d2-focus-next-on-enter' +
	                                ' ng-model="selectedTei.' + attId + '" ' +
	                                ' attribute-data="attributesById.' + attId + '" ' +
	                                ' selected-program-id="selectedProgram.id" ' +
	                                ' selected-tei-id="selectedTei.trackedEntityInstance" ' +
	                                ' ng-disabled="selectedOrgUnit.closedStatus || editingDisabled || isHidden(attributesById.' + attId + '.id) || ' + isTrackerAssociate+ '|| attributesById.' + attId + '.generated"' +
	                                ' d2-attribute-validator ' +
	                                ' ng-required=" ' + att.mandatory + '" ';
	
	                            //check if attribute has optionset
	                            if (att.optionSetValue) {
	                                var optionSetId = att.optionSet.id;
	                                newInputField = '<span class="hideInPrint"><ui-select style="width:100%;" ng-disabled="selectedOrgUnit.closedStatus" theme="select2" ' + commonInputFieldProperty + '  on-select="teiValueUpdated(selectedTei,\'' + attId + '\')" >' +
	                                    '<ui-select-match allow-clear="true" placeholder="' + $translate.instant('select_or_search') + '">{{$select.selected.displayName || $select.selected}}</ui-select-match>' +
	                                    '<ui-select-choices ' +
	                                    'repeat="option.displayName as option in optionSets.' + optionSetId + '.options | filter: $select.search | limitTo:maxOptionSize">' +
	                                    '<span ng-bind-html="option.displayName | highlight: $select.search"></span>' +
	                                    '</ui-select-choices>' +
	                                    '</ui-select></span><span class="not-for-screen"><input type="text" value={{selectedTei.' + attId + '}}></span>';
	                            }
	                            else {
	                                //check attribute type and generate corresponding angular input field
	                                if (att.valueType === "NUMBER" ||
	                                    att.valueType === "PERCENTAGE" ||
	                                    att.valueType === "INTEGER" ||
	                                		att.valueType === "INTEGER_POSITIVE" ||
	                                		att.valueType === "INTEGER_NEGATIVE" ||
	                                		att.valueType === "INTEGER_ZERO_OR_POSITIVE" ) {
	                                    newInputField = '<span class="hideInPrint"><input style="width:100%;" ng-disabled="selectedOrgUnit.closedStatus"  type="number"' +
	                                        ' d2-number-validator ' +
	                                        ' number-type="' + att.valueType + '" ' +
	                                        ' ng-blur="teiValueUpdated(selectedTei,\'' + attId + '\')" ' +
	                                        commonInputFieldProperty + ' ></span><span class="not-for-screen"><input type="text" value={{selectedTei.' + attId + '}}></span>';
	                                }
	                                else if (att.valueType === "BOOLEAN") {
	                                	newInputField = '<span class="hideInPrint"><d2-radio-button ' +
	                                                            ' dh-required=" ' + (att.mandatory || att.unique) + '" ' +
	                                                            ' dh-disabled="selectedOrgUnit.closedStatus || editingDisabled || isHidden(attributesById.' + attId + '.id) || ' + isTrackerAssociate + '"' +
	                                                            ' dh-value="selectedTei.' + attId + '" ' +
	                                                            ' dh-name="foo" ' +
	                                                            ' dh-current-element="currentElement" ' +
	                                                            ' dh-event="currentEvent.event" ' +
	                                                            ' dh-id="' + attId + '" >' +
	                                                    ' </d2-radio-button></span>' +
	                                                    '<span class="not-for-screen">' +
	                                                        '<label class="radio-inline"><input type="radio" value="true" ng-model="selectedTei.' + attId + '">{{\'yes\' | translate}}</label>' +
	                                                        '<label class="radio-inline"><input type="radio" value="false" ng-model="selectedTei.' + attId + '">{{\'no\' | translate}}</label>' +
	                                                    '</span>';
	                                }
	                                else if (att.valueType === "DATE") {
	                                    newInputField = '<span class="hideInPrint"><input  style="width:100%;" type="text"' +
	                                        ' ng-disabled="selectedOrgUnit.closedStatus"'+
	                                        ' placeholder="{{dhis2CalendarFormat.keyDateFormat}}" ' +
	                                        ' max-date=" ' + attMaxDate + ' " ' +
	                                        ' d2-date' +
	                                        ' ng-change="verifyExpiryDate(\'selectedTei.'+attId+'\')"'+
	                                        ' blur-or-change="teiValueUpdated(selectedTei,\'' + attId + '\')" ' +
	                                        commonInputFieldProperty + ' ></span>' +
	                                        '<span class="not-for-screen"><input type="text" value={{selectedTei.' + attId + '}}></span>';
	                                }
	                                else if (att.valueType === "TRUE_ONLY") {
	                                    newInputField = '<span class="hideInPrint"><input style="width:100%;" ng-disabled="selectedOrgUnit.closedStatus" type="checkbox" ' +
	                                        ' ng-change="teiValueUpdated(selectedTei,\'' + attId + '\')" ' +
	                                        commonInputFieldProperty + ' ></span>' +
	                                        '<span class="not-for-screen"><input type="checkbox" ng-checked={{selectedTei.' + attId + '}}></span>';
	                                }
	                                else if (att.valueType === "EMAIL") {
	                                    newInputField = '<span class="hideInPrint"><input style="width:100%;" type="email" ng-disabled="selectedOrgUnit.closedStatus"' +
	                                        ' ng-blur="teiValueUpdated(selectedTei,\'' + attId + '\')" ' +
	                                        commonInputFieldProperty + ' >' +
	                                        '<span class="not-for-screen"><input type="text" value={{selectedTei.' + attId + '}}></span>';
	                                }
	                                else if (att.valueType === "TRACKER_ASSOCIATE") {
	                                	newInputField = '<span class="input-group hideInPrint"> ' +
	                                                                        ' <input type="text" style="width:100%;"' +
	                                                                        ' ng-blur="teiValueUpdated(selectedTei,\'' + attId + '\')" ' +
	                                                                        commonInputFieldProperty + ' >' +
	                                                                        '<span class="input-group-btn input-group-btn-no-width"> ' +
	                                                            '<button class="btn btn-grp default-btn-height" type="button" ' + 
	                                                                ' title="{{\'add\' | translate}} {{attributesById.' + attId + '.displayName}}" ' +
	                                                                ' ng-if="!selectedTei.' + attId + '" ' +
	                                                                ' ng-disabled="selectedOrgUnit.closedStatus"'+
	                                                                ' ng-class="{true: \'disable-clicks\'} [editingDisabled]" ' +
	                                                                ' ng-click="getTrackerAssociate(attributesById.' + attId + ', selectedTei.' + attId + ')" >' +
	                                                                '<i class="fa fa-external-link"></i> ' +
	                                                            '</button> ' + 
	                                                            '<button class="btn btn-grp default-btn-height" type="button" ' + 
	                                                                ' title="{{\'remove\' | translate}} {{attributesById.' + attId + '.displayName}}" ' +
	                                                                ' ng-if="selectedTei.' + attId + '" ' +
	                                                                ' ng-disabled="selectedOrgUnit.closedStatus"'+
	                                                                ' ng-class="{true: \'disable-clicks\'} [editingDisabled]" ' +
	                                                                ' ng-click="selectedTei.' + attId + ' = null" >' +
	                                                                '<i class="fa fa-trash-o"></i> ' +
	                                                            '</button> ' + 
	                                                        '</span>'+
	                                                    '</span>'+
	                                                    '<span class="not-for-screen"><input type="text" value={{selectedTei.' + attId + '}}></span>';
	                                }
	                                else if (att.valueType === "AGE") {
	                                	newInputField = '<span class="hideInPrint"><d2-age ' +
	                                                                                    ' id=" ' + attId + '" ' +
							                                    ' d2-object="selectedTei" ' +  						                                    
							                                    ' d2-required=" ' + (att.mandatory || att.unique) + '" ' +
	                                                                                    ' d2-disabled="selectedOrgUnit.closedStatus || editingDisabled || isHidden(attributesById.' + attId + '.id) || ' + isTrackerAssociate+ ' || attributesById.' + attId + '.generated" >' +
							                            '</d2-age></span>'+
	                                                                            '<span class="not-for-screen"><input type="text" value={{selectedTei.' + attId + '}}></span>';
	                                }
	                                else if (att.valueType === "COORDINATE") {
	                                	newInputField = '<span class="hideInPrint"><d2-map ' +
	                                                                                    ' id=" ' + attId + '" ' +
							                                    ' d2-object="selectedTei" ' +  
							                                    ' d2-value="selectedTei.' + attId + '" ' +
							                                    ' d2-required=" ' + (att.mandatory || att.unique) + '" ' +
						                                        ' d2-disabled="selectedOrgUnit.closedStatus || editingDisabled || isHidden(attributesById.' + attId + '.id) || ' + isTrackerAssociate+ ' || attributesById.' + attId + '.generated"' +
							                                    ' d2-coordinate-format="\'TEXT\'" > ' +
							                            '</d2-map></span>'+
	                                                                            '<span class="not-for-screen"><input type="text" value={{selectedTei.' + attId + '}}></span>';
	                                }
	                                else if (att.valueType === "ORGANISATION_UNIT") {
	                                	newInputField = '<span class="hideInPrint"><d2-org-unit-tree ' +
					                                            ' selected-org-unit-id="{{selectedOrgUnit.id}}" ' +
					                                            ' id=" ' + attId + '" ' +
					                                            ' d2-object="selectedTei" ' +  
							                                    ' d2-value="selectedTei.' + attId + '" ' +
							                                    ' d2-required=" ' + (att.mandatory || att.unique) + '" ' +
						                                        ' d2-disabled="selectedOrgUnit.closedStatus || editingDisabled || isHidden(attributesById.' + attId + '.id) || ' + isTrackerAssociate+ ' || attributesById.' + attId + '.generated"' +
	                                                                                ' d2-orgunit-names="orgUnitNames" ' +
						                                        ' d2-function="teiValueUpdated()" >' +
					                                    ' </d2-org-unit-tree></span>'+
	                                                                    '<span class="not-for-screen"><input type="text" value={{selectedTei.' + attId + '}}></span>';
	                                }
	                                else if (att.valueType === "LONG_TEXT") {
	                                    newInputField = '<span><textarea style="width:100%;" ng-disabled="selectedOrgUnit.closedStatus" row ="3" ' +
	                                        ' ng-blur="teiValueUpdated(selectedTei,\'' + attId + '\')" ' +
	                                        commonInputFieldProperty + ' ></textarea></span>';
	                                }
	                                else if (att.valueType === "TEXT") {
	                                    newInputField = '<input type="text" style="width:100%;" ng-disabled="selectedOrgUnit.closedStatus"' +
	                                        ' ng-blur="teiValueUpdated(selectedTei,\'' + attId + '\')" ' +
	                                        commonInputFieldProperty + '>';
	                                }
	                                else if (att.valueType === "PHONE_NUMBER") {
	                                    newInputField = '<input type="text" style="width:100%;" ng-disabled="selectedOrgUnit.closedStatus"' +
	                                        ' ng-blur="teiValueUpdated(selectedTei,\'' + attId + '\')" ' +
	                                        commonInputFieldProperty + '>';
	                                }
	                                else {                                	
	                                    newInputField = ' {{"unsupported_value_type" | translate }} ' + att.valueType;
	                                }                                
	                            }
	                        }
	                        else{
	                            NotificationService.showNotifcationDialog($translate.instant("error"),
	                                $translate.instant("custom_form_has_invalid_attribute"));
	                            return;
	                        }
	                    }
	
	                    if (attributes.hasOwnProperty('programid')) {
	                        hasProgramDate = true;
	                        programId = attributes['programid'];
	                        if (programId === 'enrollmentDate') {
	                            fieldName = 'dateOfEnrollment';
	                            var enMaxDate = trackedEntityForm.selectEnrollmentDatesInFuture ? '' : 0;
	                            newInputField = '<input type="text" style="width:100%;"' +
	                                ' name="' + fieldName + '"' +
	                                ' element-id="' + i + '"' +
	                                this.getAttributesAsString(attributes) +
	                                ' d2-focus-next-on-enter' +
	                                ' placeholder="{{dhis2CalendarFormat.keyDateFormat}}" ' +
	                                ' ng-model="selectedEnrollment.dateOfEnrollment" ' +
	                                ' ng-change="verifyExpiryDate(\'selectedEnrollment.dateOfEnrollment\')"'+
	                                ' ng-disabled="\'' + target + '\' === \'PROFILE\' || selectedOrgUnit.closedStatus"' +
	                                ' d2-date' +
	                                ' max-date="' + enMaxDate + '"' +
	                                ' ng-required="true">';
	                        }
	                        if (programId === 'dateOfIncident' && trackedEntityForm.displayIncidentDate) {
	                            fieldName = 'dateOfIncident';
	                            var inMaxDate = trackedEntityForm.selectIncidentDatesInFuture ? '' : 0;
	                            newInputField = '<input type="text" style="width:100%;"' +
	                                ' name="' + fieldName + '"' +
	                                ' element-id="' + i + '"' +
	                                this.getAttributesAsString(attributes) +
	                                ' d2-focus-next-on-enter' +
	                                ' placeholder="{{dhis2CalendarFormat.keyDateFormat}}" ' +
	                                ' ng-model="selectedEnrollment.dateOfIncident" ' +
	                                ' ng-change="verifyExpiryDate(\'selectedEnrollment.dateOfIncident\')"'+
	                                ' ng-disabled="\'' + target + '\' === \'PROFILE\' || selectedOrgUnit.closedStatus"' +
	                                ' d2-date ' +
	                                ' max-date="' + inMaxDate + '">';
	                        }
	                    }
	
	                    newInputField = newInputField + ' <span ng-messages="outerForm.' + fieldName + '.$error" class="required" ng-if="interacted(outerForm.' + fieldName + ')" ng-messages-include="./templates/error-messages.html"></span>';
	
	                    htmlCode = htmlCode.replace(inputField, newInputField);
	                }
	                htmlCode = addPopOver(htmlCode, trackedEntityFormAttributes);
	                return {htmlCode: htmlCode, hasProgramDate: hasProgramDate};
	            }
	            return null;
	        },
	        getAttributesAsString: function (attributes) {
	            if (attributes) {
	                var attributesAsString = '';
	                for (var prop in attributes) {
	                    if (prop !== 'value') {
	                        attributesAsString += prop + '="' + attributes[prop] + '" ';
	                    }
	                }
	                return attributesAsString;
	            }
	            return null;
	        }
	    };
	    /* This function inserts the d2-pop-over attributes into the tags containing d2-input-label attribute to
	     * add description and url popover to those tags */
	    function addPopOver(htmlCodeToInsertPopOver, popOverContent) {
	
	        var inputRegex = /<span.*?\/span>/g;
	        var match, tagToInsertPopOver, tagWithPopOver;
	        var htmlCode = htmlCodeToInsertPopOver;
	        while (match = inputRegex.exec(htmlCodeToInsertPopOver)) {
	            if (match[0].indexOf("d2-input-label") > -1) {
	                tagToInsertPopOver = match[0];
	                tagWithPopOver = insertPopOverSpanToTag(tagToInsertPopOver, popOverContent);
	                htmlCode = htmlCode.replace(tagToInsertPopOver,tagWithPopOver);
	            }
	        }
	        return htmlCode;
	
	    }
	
	    function insertPopOverSpanToTag(tagToInsertPopOverSpan, popOverContent)  {
	
	        var attribute, attributes, fieldId, description, url, element, attValue;
	        var popOverSpanElement, tagWithPopOverSpan;
	
	        element = $(tagToInsertPopOverSpan);
	        attributes = element[0].attributes;
	
	        for (var index = 0; index < attributes.length; index++) {
	            if (attributes[index].name === "d2-input-label") {
	                attValue = attributes[index].value;
	                break;
	            }
	        }
	        if (attValue) {
	            popOverSpanElement = $('<span></span>');
	            popOverSpanElement.attr("d2-pop-over","");
	            popOverSpanElement.attr("details","{{'details'| translate}}");
	            popOverSpanElement.attr("trigger","click");
	            popOverSpanElement.attr("placement","right");
	            popOverSpanElement.attr("class","popover-label");
	
	            if (attValue.indexOf("attributeId.") > -1) {
	                fieldId = attValue.split(".")[1];
	                description = popOverContent[fieldId].description ? "'" + popOverContent[fieldId].description + "'" :
	                    "undefined";
	                popOverSpanElement.attr("content","{description: " + description + "}");
	                popOverSpanElement.attr("template","attribute-details.html");
	
	            } else {
	                fieldId = attValue.split("-")[1];
	                description = popOverContent[fieldId].dataElement.description ? "'" +
	                popOverContent[fieldId].dataElement.description + "'" : "undefined";
	                url = popOverContent[fieldId].dataElement.url ? "'" +
	                popOverContent[fieldId].dataElement.url + "'" : "undefined";
	                popOverSpanElement.attr("content","{description: " + description + ", url:" + url + "}");
	                popOverSpanElement.attr("template","dataelement-details.html");
	            }
	            popOverSpanElement.html("<a href title=\"{{'details'| translate}}\" class=\"wrap-text\" tabindex=\"-1\">" +element.html() + "</a>");
	            element.html(popOverSpanElement[0].outerHTML.replace('d2-pop-over=""','d2-pop-over'));
	            tagWithPopOverSpan = element[0].outerHTML;
	        }
	        return tagWithPopOverSpan;
	    }
	})
	
	/* Context menu for grid*/
	.service('ContextMenuSelectedItem', function () {
	    this.selectedItem = '';
	
	    this.setSelectedItem = function (selectedItem) {
	        this.selectedItem = selectedItem;
	    };
	
	    this.getSelectedItem = function () {
	        return this.selectedItem;
	    };
	})
	
	/* Modal service for user interaction */
	.service('ModalService', ['$modal', function ($modal) {
	
	    var modalDefaults = {
	        backdrop: true,
	        keyboard: true,
	        modalFade: true,
	        templateUrl: 'views/modal.html'
	    };
	
	    var modalOptions = {
	        closeButtonText: 'Close',
	        actionButtonText: 'OK',
	        headerText: 'Proceed?',
	        bodyText: 'Perform this action?'
	    };
	
	    this.showModal = function (customModalDefaults, customModalOptions) {
	        if (!customModalDefaults)
	            customModalDefaults = {};
	        customModalDefaults.backdrop = 'static';
	        return this.show(customModalDefaults, customModalOptions);
	    };
	
	    this.show = function (customModalDefaults, customModalOptions) {
	        //Create temp objects to work with since we're in a singleton service
	        var tempModalDefaults = {};
	        var tempModalOptions = {};
	
	        //Map angular-ui modal custom defaults to modal defaults defined in service
	        angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);
	
	        //Map modal.html $scope custom properties to defaults defined in service
	        angular.extend(tempModalOptions, modalOptions, customModalOptions);
	
	        if (!tempModalDefaults.controller) {
	            tempModalDefaults.controller = ['$scope','$modalInstance', function ($scope, $modalInstance) {
	                $scope.modalOptions = tempModalOptions;
	                $scope.modalOptions.ok = function (result) {
	                    $modalInstance.close(result);
	                };
	                $scope.modalOptions.close = function (result) {
	                    $modalInstance.dismiss('cancel');
	                };
	            }];
	        }
	
	        return $modal.open(tempModalDefaults).result;
	    };
	
	}])
	
	/* Dialog service for user interaction */
	.service('DialogService', ['$modal', function ($modal) {
	
	    var dialogDefaults = {
	        backdrop: true,
	        keyboard: true,
	        backdropClick: true,
	        modalFade: true,
	        templateUrl: 'views/dialog.html'
	    };
	
	    var dialogOptions = {
	        closeButtonText: 'close',
	        actionButtonText: 'ok',
	        headerText: 'dhis2_tracker',
	        bodyText: 'Perform this action?'
	    };
	
	    this.showDialog = function (customDialogDefaults, customDialogOptions, summaries) {
	        if (!customDialogDefaults)
	            customDialogDefaults = {};
	        customDialogDefaults.backdropClick = false;
	        return this.show(customDialogDefaults, customDialogOptions, summaries);
	    };
	
	    this.show = function (customDialogDefaults, customDialogOptions, summaries) {
	        //Create temp objects to work with since we're in a singleton service
	        var tempDialogDefaults = {};
	        var tempDialogOptions = {};
	
	        //Map angular-ui modal custom defaults to modal defaults defined in service
	        angular.extend(tempDialogDefaults, dialogDefaults, customDialogDefaults);
	
	        //Map modal.html $scope custom properties to defaults defined in service
	        angular.extend(tempDialogOptions, dialogOptions, customDialogOptions);
	
	        if (!tempDialogDefaults.controller) {
	            tempDialogDefaults.controller = ['$scope','$modalInstance', function ($scope, $modalInstance) {
	                $scope.dialogOptions = tempDialogOptions;
	                $scope.dialogOptions.ok = function (result) {
	                    $modalInstance.close(result);
	                };
	                if(summaries) {
	                    $scope.summaries = summaries;
	                }
	            }];
	            
	        }
	
	        return $modal.open(tempDialogDefaults).result;
	    };
	
	}])
	.service('NotificationService', function (DialogService, $timeout) {
	    this.showNotifcationDialog = function(errorMsgheader, errorMsgBody, errorResponse){
	        var dialogOptions = {
	            headerText: errorMsgheader,
	            bodyText: errorMsgBody
	        };
	        var summaries = null;
	        if (errorResponse && errorResponse.data) {
	            if(errorResponse.data.message && (errorResponse.data.status === 'ERROR' || errorResponse.data.status === 'WARNING')) {
	                dialogOptions.bodyText += "<br/>"+errorResponse.data.message+"<br/>";
	            }
	            if( errorResponse.data.response && errorResponse.data.response.importSummaries && errorResponse.data.response.importSummaries.length > 0 ){
	                summaries = JSON.stringify(errorResponse.data.response.importSummaries);
	            }
	        }
	        DialogService.showDialog({}, dialogOptions, summaries);
	    };
	
	    this.showNotifcationWithOptions = function(dialogDefaults, dialogOptions){
	        DialogService.showDialog(dialogDefaults, dialogOptions);
	    };
	    
	    this.displayDelayedHeaderMessage = function( message ){
	        setHeaderDelayMessage( message );
	    };
	    
	    this.displayHeaderMessage = function( message ){
	        $timeout(function(){
	            setHeaderMessage( message );
	        }, 1000);
	    };
	    
	    this.removeHeaderMessage = function(){
	        hideHeaderMessage();
	    };
	})
	.service('Paginator', function () {
	    this.page = 1;
	    this.pageSize = 50;
	    this.itemCount = 0;
	    this.pageCount = 0;
	    this.toolBarDisplay = 5;
	
	    this.setPage = function (page) {
	        if (page > this.getPageCount()) {
	            return;
	        }
	
	        this.page = page;
	    };
	
	    this.getPage = function () {
	        return this.page;
	    };
	
	    this.setPageSize = function (pageSize) {
	        this.pageSize = pageSize;
	    };
	
	    this.getPageSize = function () {
	        return this.pageSize;
	    };
	
	    this.setItemCount = function (itemCount) {
	        this.itemCount = itemCount;
	    };
	
	    this.getItemCount = function () {
	        return this.itemCount;
	    };
	
	    this.setPageCount = function (pageCount) {
	        this.pageCount = pageCount;
	    };
	
	    this.getPageCount = function () {
	        return this.pageCount;
	    };
	
	    this.setToolBarDisplay = function (toolBarDisplay) {
	        this.toolBarDisplay = toolBarDisplay;
	    };
	
	    this.getToolBarDisplay = function () {
	        return this.toolBarDisplay;
	    };
	
	    this.lowerLimit = function () {
	        var pageCountLimitPerPageDiff = this.getPageCount() - this.getToolBarDisplay();
	
	        if (pageCountLimitPerPageDiff < 0) {
	            return 0;
	        }
	
	        if (this.getPage() > pageCountLimitPerPageDiff + 1) {
	            return pageCountLimitPerPageDiff;
	        }
	
	        var low = this.getPage() - (Math.ceil(this.getToolBarDisplay() / 2) - 1);
	
	        return Math.max(low, 0);
	    };
	})
	
	.service('GridColumnService', function ($http, $q, DHIS2URL, $translate, SessionStorageService, NotificationService) {
	    var GRIDCOLUMNS_URL = DHIS2URL+'/userDataStore/gridColumns/';
	    return {
	        columnExists: function (cols, id) {
	            var colExists = false;
	            if (!angular.isObject(cols) || !id || angular.isObject(cols) && !cols.length) {
	                return colExists;
	            }
	
	            for (var i = 0; i < cols.length && !colExists; i++) {
	                if (cols[i].id === id) {
	                    colExists = true;
	                }
	            }
	            return colExists;
	        },
	        set: function (gridColumns, name) {
	            var deferred = $q.defer();
	            var httpMessage = {
	                method: "put",
	                url: GRIDCOLUMNS_URL + name,
	                data: {"gridColumns": gridColumns},
	                headers: {'Content-Type': 'application/json;charset=UTF-8'}
	            };
	
	            $http(httpMessage).then(function (response) {
	                deferred.resolve(response.data);
	            },function (error) {
	                httpMessage.method = "post";
	                $http(httpMessage).then(function (response) {
	                    deferred.resolve(response.data);
	                }, function (error) {
	                    if (error && error.data) {
	                        deferred.resolve(error.data);
	                    } else {
	                        deferred.resolve(null);
	                    }
	                });
	            });
	            return deferred.promise;
	        },
	        get: function (name) {
	            var promise = $http.get(GRIDCOLUMNS_URL+name).then(function (response) {
	                if (response && response.data && response.data.gridColumns) {
	                    SessionStorageService.set(name, {id:name, columns:response.data.gridColumns});
	                    return response.data.gridColumns;
	                } else {
	                    NotificationService.showNotifcationDialog($translate.instant("error"), $translate.instant("gridColumns_invalid"));
	                    return null;
	                }
	            }, function (error) {
	                var gridColumnsFromSessionStore = SessionStorageService.get(name);
	                if (gridColumnsFromSessionStore && gridColumnsFromSessionStore.columns) {
	                    return gridColumnsFromSessionStore.columns;
	                }
	                return null;
	            });
	            return promise;
	        }
	    };
	})
	
	/* Service for uploading/downloading file */
	.service('FileService', function ($http, DHIS2URL) {
	
	    return {
	        get: function (uid) {
	            var promise = $http.get(DHIS2URL + '/fileResources/' + uid).then(function (response) {
	                return response.data;
	            } ,function(error) {
	                return null;
	            });
	            return promise;
	        },
	        download: function (fileName) {
	            var promise = $http.get(fileName).then(function (response) {
	                return response.data;
	            }, function(error) {
	                return null;
	            });
	            return promise;
	        },
	        upload: function(file){
	            var formData = new FormData();
	            formData.append('file', file);
	            var headers = {transformRequest: angular.identity, headers: {'Content-Type': undefined}};
	            var promise = $http.post(DHIS2URL + '/fileResources', formData, headers).then(function(response){
	                return response.data;
	            },function(error) {
	               return null;
	            });
	            return promise;
	        }
	    };
	})
	/* Returns a function for getting rules for a specific program */
	.factory('RulesFactory', function($q,MetaDataFactory,$filter){
	    var staticReplacements = 
	                        [{regExp:new RegExp("([^\w\d])(and)([^\w\d])","gi"), replacement:"$1&&$3"},
	                        {regExp:new RegExp("([^\w\d])(or)([^\w\d])","gi"), replacement:"$1||$3"},
	                        {regExp:new RegExp("V{execution_date}","g"), replacement:"V{event_date}"}];
	
	    var performStaticReplacements = function(expression) {
	        angular.forEach(staticReplacements, function(staticReplacement) {
	            expression = expression.replace(staticReplacement.regExp, staticReplacement.replacement);
	        });
	
	        return expression;
	    };
	
	    return{        
	        loadRules : function(programUid){            
	            var def = $q.defer();            
	            MetaDataFactory.getAll('constants').then(function(constants) {
	                MetaDataFactory.getByProgram('programIndicators',programUid).then(function(pis){                    
	                    var variables = [];
	                    var programRules = [];
	                    angular.forEach(pis, function(pi){
	                        if(pi.displayInForm){
	                            var newAction = {
	                                    id:pi.id,
	                                    content:pi.displayDescription ? pi.displayDescription : pi.displayName,
	                                    data:pi.expression,
	                                    programRuleActionType:'DISPLAYKEYVALUEPAIR',
	                                    location:'indicators'
	                                };
	                            var newRule = {
	                                    displayName:pi.displayName,
	                                    id: pi.id,
	                                    shortname:pi.shortname,
	                                    code:pi.code,
	                                    program:pi.program,
	                                    description:pi.description,
	                                    condition:pi.filter ? pi.filter : 'true',
	                                    programRuleActions: [newAction]
	                                };
	
	                            programRules.push(newRule);
	
	                            var variablesInCondition = newRule.condition.match(/[A#]{\w+.?\w*}/g);
	                            var variablesInData = newAction.data.match(/[A#]{\w+.?\w*}/g);
	                            var valueCountPresent = newRule.condition.indexOf("V{value_count}") >= 0 
	                                                            || newAction.data.indexOf("V{value_count}") >= 0;
	                            var positiveValueCountPresent = newRule.condition.indexOf("V{zero_pos_value_count}") >= 0
	                                                            || newAction.data.indexOf("V{zero_pos_value_count}") >= 0;
	                            var variableObjectsCurrentExpression = [];
	
	                            var pushDirectAddressedVariable = function(variableWithCurls) {
	                                var variableName = $filter('trimvariablequalifiers')(variableWithCurls);
	                                var variableNameParts = variableName.split('.');
	
	                                var newVariableObject;
	
	                                if(variableNameParts.length === 2) {
	                                    //this is a programstage and dataelement specification. translate to program variable:
	                                    newVariableObject = {
	                                        displayName:variableName,
	                                        programRuleVariableSourceType:'DATAELEMENT_CURRENT_EVENT',
	                                        dataElement:variableNameParts[1],
	                                        program:programUid,
	                                        useCodeForOptionSet:true
	                                    };
	                                }
	                                else if(variableNameParts.length === 1)
	                                {
	                                    //This is an attribute - let us translate to program variable:
	                                    newVariableObject = {
	                                        displayName:variableName,
	                                        programRuleVariableSourceType:'TEI_ATTRIBUTE',
	                                        trackedEntityAttribute:variableNameParts[0],
	                                        program:programUid,
	                                        useCodeForOptionSet:true
	                                    };
	                                }
	                                
	                                variables.push(newVariableObject);
	
	                                return newVariableObject;
	
	                            };
	
	                            angular.forEach(variablesInCondition, function(variableInCondition) {
	                                var pushed = pushDirectAddressedVariable(variableInCondition);
	                            });
	
	                            angular.forEach(variablesInData, function(variableInData) {
	                                var pushed = pushDirectAddressedVariable(variableInData);
	
	                                //We only count the number of values in the data part of the rule
	                                //(Called expression in program indicators)
	                                variableObjectsCurrentExpression.push(pushed);
	                            });
	
	                            //Change expression or data part of the rule to match the program rules execution model
	                            if(valueCountPresent) {
	                                var valueCountText;
	                                angular.forEach(variableObjectsCurrentExpression, function(variableCurrentRule) {
	                                   if(valueCountText) {
	                                       //This is not the first value in the value count part of the expression. 
	                                       valueCountText +=  ' + d2:count(\'' + variableCurrentRule.displayName + '\')';
	                                   }
	                                   else
	                                   {
	                                       //This is the first part value in the value count expression:
	                                       valueCountText = '(d2:count(\'' + variableCurrentRule.displayName + '\')';
	                                   }
	                                });
	                                //To finish the value count expression we need to close the paranthesis:
	                                valueCountText += ')';
	
	                                //Replace all occurrences of value counts in both the data and expression:
	                                newRule.condition = newRule.condition.replace(new RegExp("V{value_count}", 'g'),valueCountText);
	                                newAction.data = newAction.data.replace(new RegExp("V{value_count}", 'g'),valueCountText);
	                            }
	                            if(positiveValueCountPresent) {
	                                var zeroPosValueCountText;
	                                angular.forEach(variableObjectsCurrentExpression, function(variableCurrentRule) {
	                                   if(zeroPosValueCountText) {
	                                       //This is not the first value in the value count part of the expression. 
	                                       zeroPosValueCountText +=  '+ d2:countifzeropos(\'' + variableCurrentRule.displayName + '\')';
	                                   }
	                                   else
	                                   {
	                                       //This is the first part value in the value count expression:
	                                       zeroPosValueCountText = '(d2:countifzeropos(\'' + variableCurrentRule.displayName + '\')';
	                                   }
	                                });
	                                //To finish the value count expression we need to close the paranthesis:
	                                zeroPosValueCountText += ')';
	
	                                //Replace all occurrences of value counts in both the data and expression:
	                                newRule.condition = newRule.condition.replace(new RegExp("V{zero_pos_value_count}", 'g'),zeroPosValueCountText);
	                                newAction.data = newAction.data.replace(new RegExp("V{zero_pos_value_count}", 'g'),zeroPosValueCountText);
	                            }
	
	                            newAction.data = performStaticReplacements(newAction.data);
	                            newRule.condition = performStaticReplacements(newRule.condition);
	                        }
	                    });
	
	                    var programIndicators = {rules:programRules, variables:variables};
	
	                    MetaDataFactory.getByProgram('programValidations',programUid).then(function(programValidations){                    
	                        MetaDataFactory.getByProgram('programRuleVariables',programUid).then(function(programVariables){                    
	                            MetaDataFactory.getByProgram('programRules',programUid).then(function(prs){
	                                var programRules = [];
	                                angular.forEach(prs, function(rule){
	                                    rule.actions = [];
	                                    rule.programStageId = rule.programStage && rule.programStage.id ? rule.programStage.id : null;
	                                    programRules.push(rule);
	                                });                                
	                                def.resolve({constants: constants, programIndicators: programIndicators, programValidations: programValidations, programVariables: programVariables, programRules: programRules});
	                            });
	                        });
	                    });
	                }); 
	            });                        
	            return def.promise;
	        }
	    };  
	})
	/* service for building variables based on the data in users fields */
	.service('VariableService', function(DateUtils,OptionSetService,$filter,$log){
	    var processSingleValue = function(processedValue,valueType){
	        //First clean away single or double quotation marks at the start and end of the variable name.
	        processedValue = $filter('trimquotes')(processedValue);
	
	        if(processedValue === "Yes") {
	            processedValue = true;
	        }
	        if(processedValue === "No") {
	            processedValue = false;
	        }
	
	        //Append single quotation marks in case the variable is of text or date type:
	        if(valueType === 'LONG_TEXT' || valueType === 'TEXT' || valueType === 'DATE' || valueType === 'OPTION_SET') {
	            if(processedValue) {
	                processedValue = "'" + processedValue + "'";
	            } else {
	                processedValue = "''";
	            }
	        }
	        else if(valueType === 'BOOLEAN' || valueType === 'TRUE_ONLY') {
	            if(processedValue && eval(processedValue)) {
	                processedValue = true;
	            }
	            else {
	                processedValue = false;
	            }
	        }
	        else if( valueType === "INTEGER" || valueType === "NUMBER" || valueType === "INTEGER_POSITIVE"
	             ||  valueType === "INTEGER_NEGATIVE" || valueType === "INTEGER_ZERO_OR_POSITIVE" ||
	                 valueType === "PERCENTAGE") {
	            if(processedValue) {
	                processedValue = Number(processedValue);
	            } else {
	                processedValue = 0;
	            }
	        }
	        else{
	            $log.warn("unknown datatype:" + valueType);
	        }
	
	        return processedValue;
	    };
	
	    var pushVariable = function(variables, variablename, varValue, allValues, varType, variablefound, variablePrefix, variableEventDate, useCodeForOptionSet) {
	
	        var processedValues = [];
	
	        angular.forEach(allValues, function(alternateValue) {
	            processedValues.push(processSingleValue(alternateValue,varType));
	        });
	
	        variables[variablename] = {
	            variableValue:processSingleValue(varValue, varType),
	            useCodeForOptionSet:useCodeForOptionSet,
	            variableType:varType,
	            hasValue:variablefound,
	            variableEventDate:variableEventDate,
	            variablePrefix:variablePrefix,
	            allValues:processedValues
	        };
	        return variables;
	    };
	    
	    var getDataElementValueOrCodeForValueInternal = function(useCodeForOptionSet, value, dataElementId, allDes, optionSets) {
	        return useCodeForOptionSet && allDes && allDes[dataElementId].dataElement.optionSet ? 
	                                            OptionSetService.getCode(optionSets[allDes[dataElementId].dataElement.optionSet.id].options, value)
	                                            : value;
	    };
	
	    return {
	        processValue: function(value, type) {
	            return processSingleValue(value,type);
	        },
	        getDataElementValueOrCode: function(useCodeForOptionSet, event, dataElementId, allDes, optionSets) {
	            return getDataElementValueOrCodeForValueInternal(useCodeForOptionSet, event[dataElementId], dataElementId, allDes, optionSets);
	        },
	        getDataElementValueOrCodeForValue: function(useCodeForOptionSet, value, dataElementId, allDes, optionSets) {
	            return getDataElementValueOrCodeForValueInternal(useCodeForOptionSet, value, dataElementId, allDes, optionSets);
	        },
	        getVariables: function(allProgramRules, executingEvent, evs, allDes, selectedEntity, selectedEnrollment, optionSets) {
	
	            var variables = {};
	
	            var programVariables = allProgramRules.programVariables;
	
	            programVariables = programVariables.concat(allProgramRules.programIndicators.variables);
	
	            angular.forEach(programVariables, function(programVariable) {
	                var dataElementId = programVariable.dataElement;
	                if(programVariable.dataElement && programVariable.dataElement.id) {
	                    dataElementId = programVariable.dataElement.id;
	                }
	
	                var trackedEntityAttributeId = programVariable.trackedEntityAttribute;
	                if(programVariable.trackedEntityAttribute && programVariable.trackedEntityAttribute.id) {
	                    trackedEntityAttributeId = programVariable.trackedEntityAttribute.id;
	                }
	
	                var programStageId = programVariable.programStage;
	                if(programVariable.programStage && programVariable.programStage.id) {
	                    programStageId = programVariable.programStage.id;
	                }
	
	                var valueFound = false;
	                //If variable evs is not defined, it means the rules is run before any events is registered, skip the types that require an event
	                if(programVariable.programRuleVariableSourceType === "DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE" && evs && evs.byStage){
	                    if(programStageId) {
	                        var allValues = [];
	                        angular.forEach(evs.byStage[programStageId], function(event) {
	                            if(event[dataElementId] !== null) {
	                                if(angular.isDefined(event[dataElementId])
	                                        && event[dataElementId] !== ""){
	                                    var value = getDataElementValueOrCodeForValueInternal(programVariable.useCodeForOptionSet, event[dataElementId], dataElementId, allDes, optionSets);
	                                            
	                                    allValues.push(value);
	                                    valueFound = true;
	                                    variables = pushVariable(variables, programVariable.displayName, value, allValues, allDes[dataElementId].dataElement.valueType, valueFound, '#', event.eventDate, programVariable.useCodeForOptionSet);
	                                }
	                            }
	                        });
	                    } else {
	                        $log.warn("Variable id:'" + programVariable.id + "' name:'" + programVariable.displayName
	                            + "' does not have a programstage defined,"
	                            + " despite that the variable has sourcetype DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE" );
	                    }
	                }
	                else if(programVariable.programRuleVariableSourceType === "DATAELEMENT_NEWEST_EVENT_PROGRAM" && evs){
	                    var allValues = [];
	                    angular.forEach(evs.all, function(event) {
	                        if(angular.isDefined(event[dataElementId])
	                            && event[dataElementId] !== null 
	                            && event[dataElementId] !== ""){
	                            var value = getDataElementValueOrCodeForValueInternal(programVariable.useCodeForOptionSet, event[dataElementId], dataElementId, allDes, optionSets);
	                                    
	                            allValues.push(value);
	                            valueFound = true;
	                            variables = pushVariable(variables, programVariable.displayName, value, allValues, allDes[dataElementId].dataElement.valueType, valueFound, '#', event.eventDate, programVariable.useCodeForOptionSet);
	                        }
	                    });
	                }
	                else if(programVariable.programRuleVariableSourceType === "DATAELEMENT_CURRENT_EVENT" && evs){
	                    if(angular.isDefined(executingEvent[dataElementId])
	                        && executingEvent[dataElementId] !== null 
	                        && executingEvent[dataElementId] !== ""){
	                        var value = getDataElementValueOrCodeForValueInternal(programVariable.useCodeForOptionSet, executingEvent[dataElementId], dataElementId, allDes, optionSets);
	                            
	                        valueFound = true;
	                        variables = pushVariable(variables, programVariable.displayName, value, null, allDes[dataElementId].dataElement.valueType, valueFound, '#', executingEvent.eventDate, programVariable.useCodeForOptionSet );
	                    }
	                }
	                else if(programVariable.programRuleVariableSourceType === "DATAELEMENT_PREVIOUS_EVENT" && evs){
	                    //Only continue checking for a value if there is more than one event.
	                    if(evs.all && evs.all.length > 1) {
	                        var allValues = [];
	                        var previousvalue = null;
	                        var previousEventDate = null;
	                        var currentEventPassed = false;
	                        for(var i = 0; i < evs.all.length; i++) {
	                            //Store the values as we iterate through the stages
	                            //If the event[i] is not the current event, it is older(previous). Store the previous value if it exists
	                            if(!currentEventPassed && evs.all[i] !== executingEvent &&
	                                angular.isDefined(evs.all[i][dataElementId])
	                                && evs.all[i][dataElementId] !== "") {
	                                previousvalue = getDataElementValueOrCodeForValueInternal(programVariable.useCodeForOptionSet, evs.all[i][dataElementId], dataElementId, allDes, optionSets);
	                                previousEventDate = evs.all[i].eventDate;
	                                allValues.push(value);
	                                valueFound = true;
	                            }
	                            else if(evs.all[i] === executingEvent) {
	                                //We have iterated to the newest event - store the last collected variable value - if any is found:
	                                if(valueFound) {
	                                    variables = pushVariable(variables, programVariable.displayName, previousvalue, allValues, allDes[dataElementId].dataElement.valueType, valueFound, '#', previousEventDate, programVariable.useCodeForOptionSet);
	                                }
	                                //Set currentEventPassed, ending the iteration:
	                                currentEventPassed = true;
	                            }
	                        }
	                    }
	                }
	                else if(programVariable.programRuleVariableSourceType === "TEI_ATTRIBUTE"){
	                    angular.forEach(selectedEntity.attributes , function(attribute) {
	                        if(!valueFound) {
	                            if(attribute.attribute === trackedEntityAttributeId
	                                    && angular.isDefined(attribute.value)
	                                    && attribute.value !== null
	                                    && attribute.value !== "") {
	                                valueFound = true;
	                                //In registration, the attribute type is found in .type, while in data entry the same data is found in .valueType.
	                                //Handling here, but planning refactor in registration so it will always be .valueType
	                                variables = pushVariable(variables, 
	                                    programVariable.displayName, 
	                                    programVariable.useCodeForOptionSet ? (angular.isDefined(attribute.optionSetCode) ? attribute.optionSetCode : attribute.value) : attribute.value,
	                                    null, 
	                                    attribute.type ? attribute.type : attribute.valueType, valueFound, 
	                                    'A', 
	                                    '',
	                                    programVariable.useCodeForOptionSet);
	                            }
	                        }
	                    });
	                }
	                else if(programVariable.programRuleVariableSourceType === "CALCULATED_VALUE"){
	                    //We won't assign the calculated variables at this step. The rules execution will calculate and assign the variable.
	                }
	                else {
	                    //If the rules was executed without events, we ended up in this else clause as expected, as most of the variables require an event to be mapped
	                    if(evs)
	                    {
	                        //If the rules was executed and events was supplied, we should have found an if clause for the the source type, and not ended up in this dead end else.
	                        $log.warn("Unknown programRuleVariableSourceType:" + programVariable.programRuleVariableSourceType);
	                    }
	                }
	
	
	                if(!valueFound){
	                    //If there is still no value found, assign default value:
	                    if(dataElementId && allDes) {
	                        var dataElement = allDes[dataElementId];
	                        if( dataElement ) {
	                            variables = pushVariable(variables, programVariable.displayName, "", null, dataElement.dataElement.valueType, false, '#', '', programVariable.useCodeForOptionSet );
	                        }
	                        else {
	                            $log.warn("Variable #{" + programVariable.displayName + "} is linked to a dataelement that is not part of the program");
	                            variables = pushVariable(variables, programVariable.displayName, "", null, "TEXT",false, '#', '', programVariable.useCodeForOptionSet );
	                        }
	                    }
	                    else if (programVariable.trackedEntityAttribute) {
	                        //The variable is an attribute, set correct prefix and a blank value
	                        variables = pushVariable(variables, programVariable.displayName, "", null, "TEXT",false, 'A', '', programVariable.useCodeForOptionSet );
	                    }
	                    else {
	                        //Fallback for calculated(assigned) values:
	                        variables = pushVariable(variables, programVariable.displayName, "", null, "TEXT",false, '#', '', programVariable.useCodeForOptionSet );
	                    }
	                }
	            });
	
	            //add context variables:
	            //last parameter "valuefound" is always true for event date
	            variables = pushVariable(variables, 'current_date', DateUtils.getToday(), null, 'DATE', true, 'V', '', false );
	
	            variables = pushVariable(variables, 'event_date', executingEvent.eventDate, null, 'DATE', true, 'V', '', false );
	            variables = pushVariable(variables, 'due_date', executingEvent.dueDate, null, 'DATE', true, 'V', '' );
	            variables = pushVariable(variables, 'event_count', evs ? evs.all.length : 0, null, 'INTEGER', true, 'V', '', false );
	
	            variables = pushVariable(variables, 'enrollment_date', selectedEnrollment ? selectedEnrollment.enrollmentDate : '', null, 'DATE', selectedEnrollment ? true : false, 'V', '', false );
	            variables = pushVariable(variables, 'enrollment_id', selectedEnrollment ? selectedEnrollment.enrollment : '', null, 'TEXT',  selectedEnrollment ? true : false, 'V', '', false );
	            variables = pushVariable(variables, 'event_id', executingEvent ? executingEvent.event : '', null, 'TEXT',  executingEvent ? true : false, 'V', executingEvent ? executingEvent.eventDate : false, false);
	
	            variables = pushVariable(variables, 'incident_date', selectedEnrollment ? selectedEnrollment.incidentDate : '', null, 'DATE',  selectedEnrollment ? true : false, 'V', '', false);
	            variables = pushVariable(variables, 'enrollment_count', selectedEnrollment ? 1 : 0, null, 'INTEGER', true, 'V', '', false);
	            variables = pushVariable(variables, 'tei_count', selectedEnrollment ? 1 : 0, null, 'INTEGER', true, 'V', '', false);
	
	            //Push all constant values:
	            angular.forEach(allProgramRules.constants, function(constant){
	                variables = pushVariable(variables, constant.id, constant.value, null, 'INTEGER', true, 'C', '', false);
	            });
	
	            return variables;
	        }
	    };
	})
	
	/* service for executing tracker rules and broadcasting results */
	.service('TrackerRulesExecutionService', function($translate, VariableService, DateUtils, NotificationService, DHIS2EventFactory, RulesFactory, CalendarService, OptionSetService, $rootScope, $q, $log, $filter, orderByFilter){
	    var NUMBER_OF_EVENTS_IN_SCOPE = 10;
	
	    //Variables for storing scope and rules in memory from rules execution to rules execution:
	    var allProgramRules = false; 
	    var crossEventRulesExist = false;
	    var lastEventId = null;
	    var lastEventDate = null;
	    var lastProgramId = null;
	    var eventScopeExceptCurrent = false;
	
	    var replaceVariables = function(expression, variablesHash){
	        //replaces the variables in an expression with actual variable values.
	
	        //Check if the expression contains program rule variables at all(any curly braces):
	        if(expression.indexOf('{') !== -1) {
	            //Find every variable name in the expression;
	            var variablespresent = expression.match(/[A#CV]{\w+.?\w*}/g);
	            //Replace each matched variable:
	            angular.forEach(variablespresent, function(variablepresent) {
	                //First strip away any prefix and postfix signs from the variable name:
	                variablepresent = variablepresent.replace("#{","").replace("A{","").replace("C{","").replace("V{","").replace("}","");
	
	                if(angular.isDefined(variablesHash[variablepresent])) {
	                    //Replace all occurrences of the variable name(hence using regex replacement):
	                    expression = expression.replace(new RegExp( variablesHash[variablepresent].variablePrefix + "{" + variablepresent + "}", 'g'),
	                        variablesHash[variablepresent].variableValue);
	                }
	                else {
	                    $log.warn("Expression " + expression + " conains variable " + variablepresent
	                        + " - but this variable is not defined." );
	                }
	            });
	        }
	
	        //Check if the expression contains environment  variables
	        if(expression.indexOf('V{') !== -1) {
	            //Find every variable name in the expression;
	            var variablespresent = expression.match(/V{\w+.?\w*}/g);
	            //Replace each matched variable:
	            angular.forEach(variablespresent, function(variablepresent) {
	                //First strip away any prefix and postfix signs from the variable name:
	                variablepresent = variablepresent.replace("V{","").replace("}","");
	
	                if(angular.isDefined(variablesHash[variablepresent]) &&
	                    variablesHash[variablepresent].variablePrefix === 'V') {
	                    //Replace all occurrences of the variable name(hence using regex replacement):
	                    expression = expression.replace(new RegExp("V{" + variablepresent + "}", 'g'),
	                        variablesHash[variablepresent].variableValue);
	                }
	                else {
	                    $log.warn("Expression " + expression + " conains context variable " + variablepresent
	                        + " - but this variable is not defined." );
	                }
	            });
	        }
	
	        //Check if the expression contains attribute variables:
	        if(expression.indexOf('A{') !== -1) {
	            //Find every attribute in the expression;
	            var variablespresent = expression.match(/A{\w+.?\w*}/g);
	            //Replace each matched variable:
	            angular.forEach(variablespresent, function(variablepresent) {
	                //First strip away any prefix and postfix signs from the variable name:
	                variablepresent = variablepresent.replace("A{","").replace("}","");
	
	                if(angular.isDefined(variablesHash[variablepresent]) &&
	                    variablesHash[variablepresent].variablePrefix === 'A') {
	                    //Replace all occurrences of the variable name(hence using regex replacement):
	                    expression = expression.replace(new RegExp("A{" + variablepresent + "}", 'g'),
	                        variablesHash[variablepresent].variableValue);
	                }
	                else {
	                    $log.warn("Expression " + expression + " conains attribute " + variablepresent
	                        + " - but this attribute is not defined." );
	                }
	            });
	        }
	
	        //Check if the expression contains constants
	        if(expression.indexOf('C{') !== -1) {
	            //Find every constant in the expression;
	            var variablespresent = expression.match(/C{\w+.?\w*}/g);
	            //Replace each matched variable:
	            angular.forEach(variablespresent, function(variablepresent) {
	                //First strip away any prefix and postfix signs from the variable name:
	                variablepresent = variablepresent.replace("C{","").replace("}","");
	
	                if(angular.isDefined(variablesHash[variablepresent]) &&
	                    variablesHash[variablepresent].variablePrefix === 'C') {
	                    //Replace all occurrences of the variable name(hence using regex replacement):
	                    expression = expression.replace(new RegExp("C{" + variablepresent + "}", 'g'),
	                        variablesHash[variablepresent].variableValue);
	                }
	                else {
	                    $log.warn("Expression " + expression + " conains constant " + variablepresent
	                        + " - but this constant is not defined." );
	                }
	            });
	        }
	
	        return expression;
	    };
	
	    var runDhisFunctions = function(expression, variablesHash, flag){
	        //Called from "runExpression". Only proceed with this logic in case there seems to be dhis function calls: "d2:" is present.
	        if(angular.isDefined(expression) && expression.indexOf("d2:") !== -1){
	            var dhisFunctions = [{name:"d2:daysBetween",parameters:2},
	                {name:"d2:weeksBetween",parameters:2},
	                {name:"d2:monthsBetween",parameters:2},
	                {name:"d2:yearsBetween",parameters:2},
	                {name:"d2:floor",parameters:1},
	                {name:"d2:modulus",parameters:2},
	                {name:"d2:concatenate"},
	                {name:"d2:addDays",parameters:2},
	                {name:"d2:zing",parameters:1},
	                {name:"d2:oizp",parameters:1},
	                {name:"d2:count",parameters:1},
	                {name:"d2:countIfZeroPos",parameters:1},
	                {name:"d2:countIfValue",parameters:2},
	                {name:"d2:ceil",parameters:1},
	                {name:"d2:round",parameters:1},
	                {name:"d2:hasValue",parameters:1},
	                {name:"d2:lastEventDate",parameters:1},
	                {name:"d2:validatePattern",parameters:2},
	                {name:"d2:addControlDigits",parameters:1},
	                {name:"d2:checkControlDigits",parameters:1},
	                {name:"d2:left",parameters:2},
	                {name:"d2:right",parameters:2},
	                {name:"d2:substring",parameters:3},
	                {name:"d2:split",parameters:3},
	                {name:"d2:length",parameters:1}];
	            var continueLooping = true;
	            //Safety harness on 10 loops, in case of unanticipated syntax causing unintencontinued looping
	            for(var i = 0; i < 10 && continueLooping; i++ ) {
	                var expressionUpdated = false;
	                var brokenExecution = false;
	                angular.forEach(dhisFunctions, function(dhisFunction){
	                    //Select the function call, with any number of parameters inside single quotations, or number parameters witout quotations
	                    var regularExFunctionCall = new RegExp(dhisFunction.name + "\\( *(([\\d/\\*\\+\\-%\.]+)|( *'[^']*'))*( *, *(([\\d/\\*\\+\\-%\.]+)|'[^']*'))* *\\)",'g');
	                    var callsToThisFunction = expression.match(regularExFunctionCall);
	                    angular.forEach(callsToThisFunction, function(callToThisFunction){
	                        //Remove the function name and paranthesis:
	                        var justparameters = callToThisFunction.replace(/(^[^\(]+\()|\)$/g,"");
	                        //Remove white spaces before and after parameters:
	                        justparameters = justparameters.trim();
	                        //Then split into single parameters:
	                        var parameters = justparameters.match(/(('[^']+')|([^,]+))/g);
	
	                        //Show error if no parameters is given and the function requires parameters,
	                        //or if the number of parameters is wrong.
	                        if(angular.isDefined(dhisFunction.parameters)){
	                            //But we are only checking parameters where the dhisFunction actually has a defined set of parameters(concatenate, for example, does not have a fixed number);
	                            var numParameters = parameters ? parameters.length : 0;
	                            
	                            if(numParameters !== dhisFunction.parameters){
	                                $log.warn(dhisFunction.name + " was called with the incorrect number of parameters");
	                                
	                                //Mark this function call as broken:
	                                brokenExecution = true;
	                            }
	                        }
	
	                        //In case the function call is nested, the parameter itself contains an expression, run the expression.
	                        if(!brokenExecution && angular.isDefined(parameters) && parameters !== null) {
	                            for (var i = 0; i < parameters.length; i++) {
	                                parameters[i] = runExpression(parameters[i],dhisFunction.name,"parameter:" + i, flag, variablesHash);
	                            }
	                        }
	
	                        //Special block for d2:weeksBetween(*,*) - add such a block for all other dhis functions.
	                        if(brokenExecution) {
	                            //Function call is not possible to evaluate, remove the call:
	                            expression = expression.replace(callToThisFunction, "false");
	                            expressionUpdated = true;
	                        }
	                        else if(dhisFunction.name === "d2:daysBetween") {
	                            var firstdate = $filter('trimquotes')(parameters[0]);
	                            var seconddate = $filter('trimquotes')(parameters[1]);
	                            firstdate = moment(firstdate);
	                            seconddate = moment(seconddate);
	                            //Replace the end evaluation of the dhis function:
	                            expression = expression.replace(callToThisFunction, seconddate.diff(firstdate,'days'));
	                            expressionUpdated = true;
	                        }
	                        else if(dhisFunction.name === "d2:weeksBetween") {
	                            var firstdate = $filter('trimquotes')(parameters[0]);
	                            var seconddate = $filter('trimquotes')(parameters[1]);
	                            firstdate = moment(firstdate);
	                            seconddate = moment(seconddate);
	                            //Replace the end evaluation of the dhis function:
	                            expression = expression.replace(callToThisFunction, seconddate.diff(firstdate,'weeks'));
	                            expressionUpdated = true;
	                        }
	                        else if(dhisFunction.name === "d2:monthsBetween") {
	                            var firstdate = $filter('trimquotes')(parameters[0]);
	                            var seconddate = $filter('trimquotes')(parameters[1]);
	                            firstdate = moment(firstdate);
	                            seconddate = moment(seconddate);
	                            //Replace the end evaluation of the dhis function:
	                            expression = expression.replace(callToThisFunction, seconddate.diff(firstdate,'months'));
	                            expressionUpdated = true;
	                        }
	                        else if(dhisFunction.name === "d2:yearsBetween") {
	                            var firstdate = $filter('trimquotes')(parameters[0]);
	                            var seconddate = $filter('trimquotes')(parameters[1]);
	                            firstdate = moment(firstdate);
	                            seconddate = moment(seconddate);
	                            //Replace the end evaluation of the dhis function:
	                            expression = expression.replace(callToThisFunction, seconddate.diff(firstdate,'years'));
	                            expressionUpdated = true;
	                        }
	                        else if(dhisFunction.name === "d2:floor") {
	                            var floored = Math.floor(parameters[0]);
	                            //Replace the end evaluation of the dhis function:
	                            expression = expression.replace(callToThisFunction, floored);
	                            expressionUpdated = true;
	                        }
	                        else if(dhisFunction.name === "d2:modulus") {
	                            var dividend = Number(parameters[0]);
	                            var divisor = Number(parameters[1]);
	                            var rest = dividend % divisor;
	                            //Replace the end evaluation of the dhis function:
	                            expression = expression.replace(callToThisFunction, rest);
	                            expressionUpdated = true;
	                        }
	                        else if(dhisFunction.name === "d2:concatenate") {
	                            var returnString = "'";
	                            for (var i = 0; i < parameters.length; i++) {
	                                returnString += parameters[i];
	                            }
	                            returnString += "'";
	                            expression = expression.replace(callToThisFunction, returnString);
	                            expressionUpdated = true;
	                        }
	                        else if(dhisFunction.name === "d2:addDays") {
	                            var date = $filter('trimquotes')(parameters[0]);
	                            var daystoadd = $filter('trimquotes')(parameters[1]);
	                            var newdate = DateUtils.format( moment(date, CalendarService.getSetting().momentFormat).add(daystoadd, 'days') );
	                            var newdatestring = "'" + newdate + "'";
	                            //Replace the end evaluation of the dhis function:
	                            expression = expression.replace(callToThisFunction, newdatestring);
	                            expressionUpdated = true;
	                        }
	                        else if(dhisFunction.name === "d2:zing") {
	                            var number = parameters[0];
	                            if( number < 0 ) {
	                                number = 0;
	                            }
	
	                            //Replace the end evaluation of the dhis function:
	                            expression = expression.replace(callToThisFunction, number);
	                            expressionUpdated = true;
	                        }
	                        else if(dhisFunction.name === "d2:oizp") {
	                            var number = parameters[0];
	                            var output = 1;
	                            if( number < 0 ) {
	                                output = 0;
	                            }
	
	                            //Replace the end evaluation of the dhis function:
	                            expression = expression.replace(callToThisFunction, output);
	                            expressionUpdated = true;
	                        }
	                        else if(dhisFunction.name === "d2:count") {
	                            var variableName = parameters[0];
	                            var variableObject = variablesHash[variableName];
	                            var count = 0;
	                            if(variableObject)
	                            {
	                                if(variableObject.hasValue){
	                                    if(variableObject.allValues)
	                                    {
	                                        count = variableObject.allValues.length;
	                                    } else {
	                                        //If there is a value found for the variable, the count is 1 even if there is no list of alternate values
	                                        //This happens for variables of "DATAELEMENT_CURRENT_STAGE" and "TEI_ATTRIBUTE"
	                                        count = 1;
	                                    }
	                                }
	                            }
	                            else
	                            {
	                                $log.warn("could not find variable to count: " + variableName);
	                            }
	
	                            //Replace the end evaluation of the dhis function:
	                            expression = expression.replace(callToThisFunction, count);
	                            expressionUpdated = true;
	                        }
	                        else if(dhisFunction.name === "d2:countIfZeroPos") {
	                            var variableName = $filter('trimvariablequalifiers') (parameters[0]);
	                            var variableObject = variablesHash[variableName];
	
	                            var count = 0;
	                            if(variableObject)
	                            {
	                                if( variableObject.hasValue ) {
	                                    if(variableObject.allValues && variableObject.allValues.length > 0)
	                                    {
	                                        for(var i = 0; i < variableObject.allValues.length; i++)
	                                        {
	                                            if(variableObject.allValues[i] >= 0) {
	                                                count++;
	                                            }
	                                        }
	                                    }
	                                    else {
	                                        //The variable has a value, but no list of alternates. This means we only compare the elements real value
	                                        if(variableObject.variableValue >= 0) {
	                                            count = 1;
	                                        }
	                                    }
	                                }
	                            }
	                            else
	                            {
	                                $log.warn("could not find variable to countifzeropos: " + variableName);
	                            }
	
	                            //Replace the end evaluation of the dhis function:
	                            expression = expression.replace(callToThisFunction, count);
	                            expressionUpdated = true;
	                        }
	                        else if(dhisFunction.name === "d2:countIfValue") {
	                            var variableName = parameters[0];
	                            var variableObject = variablesHash[variableName];
	
	                            var valueToCompare = VariableService.processValue(parameters[1],variableObject.variableType);
	
	                            var count = 0;
	                            if(variableObject)
	                            {
	                                if( variableObject.hasValue )
	                                {
	                                    if( variableObject.allValues )
	                                    {
	                                        for(var i = 0; i < variableObject.allValues.length; i++)
	                                        {
	                                            if(valueToCompare === variableObject.allValues[i]) {
	                                                count++;
	                                            }
	                                        }
	                                    } else {
	                                        //The variable has a value, but no list of alternates. This means we compare the standard variablevalue
	                                        if(valueToCompare === variableObject.variableValue) {
	                                            count = 1;
	                                        }
	                                    }
	
	                                }
	                            }
	                            else
	                            {
	                                $log.warn("could not find variable to countifvalue: " + variableName);
	                            }
	
	                            //Replace the end evaluation of the dhis function:
	                            expression = expression.replace(callToThisFunction, count);
	                            expressionUpdated = true;
	                        }
	                        else if(dhisFunction.name === "d2:ceil") {
	                            var ceiled = Math.ceil(parameters[0]);
	                            //Replace the end evaluation of the dhis function:
	                            expression = expression.replace(callToThisFunction, ceiled);
	                            expressionUpdated = true;
	                        }
	                        else if(dhisFunction.name === "d2:round") {
	                            var rounded = Math.round(parameters[0]);
	                            //Replace the end evaluation of the dhis function:
	                            expression = expression.replace(callToThisFunction, rounded);
	                            expressionUpdated = true;
	                        }
	                        else if(dhisFunction.name === "d2:hasValue") {
	                            var variableName = parameters[0];
	                            var variableObject = variablesHash[variableName];
	                            var valueFound = false;
	                            if(variableObject)
	                            {
	                                if(variableObject.hasValue){
	                                    valueFound = true;
	                                }
	                            }
	                            else
	                            {
	                                $log.warn("could not find variable to check if has value: " + variableName);
	                            }
	
	                            //Replace the end evaluation of the dhis function:
	                            expression = expression.replace(callToThisFunction, valueFound);
	                            expressionUpdated = true;
	                        }
	                        else if(dhisFunction.name === "d2:lastEventDate") {
	                            var variableName = parameters[0];
	                            var variableObject = variablesHash[variableName];
	                            var valueFound = "''";
	                            if(variableObject)
	                            {
	                                if(variableObject.variableEventDate){
	                                    valueFound = VariableService.processValue(variableObject.variableEventDate, 'DATE');
	                                }
	                                else {
	                                    $log.warn("no last event date found for variable: " + variableName);
	                                }
	                            }
	                            else
	                            {
	                                $log.warn("could not find variable to check last event date: " + variableName);
	                            }
	
	                            //Replace the end evaluation of the dhis function:
	                            expression = expression.replace(callToThisFunction, valueFound);
	                            expressionUpdated = true;
	                        }
	                        else if(dhisFunction.name === "d2:validatePattern") {
	                            var inputToValidate = parameters[0].toString();
	                            var pattern = parameters[1];
	                            var regEx = new RegExp(pattern,'g');
	                            var match = inputToValidate.match(regEx);
	                            
	                            var matchFound = false;
	                            if(match !== null && inputToValidate === match[0]) {
	                                matchFound = true;
	                            }
	
	                            //Replace the end evaluation of the dhis function:
	                            expression = expression.replace(callToThisFunction, matchFound);
	                            expressionUpdated = true;
	                        }
	                        else if(dhisFunction.name === "d2:addControlDigits") {
	
	                            var baseNumber = parameters[0];
	                            var baseDigits = baseNumber.split('');
	                            var error = false;
	
	                            var firstDigit = 0;
	                            var secondDigit = 0;
	
	                            if(baseDigits && baseDigits.length < 10 ) {
	                                var firstSum = 0;
	                                var baseNumberLength = baseDigits.length;
	                                //weights support up to 9 base digits:
	                                var firstWeights = [3,7,6,1,8,9,4,5,2];
	                                for(var i = 0; i < baseNumberLength && !error; i++) {
	                                    firstSum += parseInt(baseDigits[i]) * firstWeights[i];
	                                }
	                                firstDigit = firstSum % 11;
	
	                                //Push the first digit to the array before continuing, as the second digit is a result of the
	                                //base digits and the first control digit.
	                                baseDigits.push(firstDigit);
	                                //Weights support up to 9 base digits plus first control digit:
	                                var secondWeights = [5,4,3,2,7,6,5,4,3,2];
	                                var secondSum = 0;
	                                for(var i = 0; i < baseNumberLength + 1 && !error; i++) {
	                                    secondSum += parseInt(baseDigits[i]) * secondWeights[i];
	                                }
	                                secondDigit = secondSum % 11;
	
	                                if(firstDigit === 10) {
	                                    $log.warn("First control digit became 10, replacing with 0");
	                                    firstDigit = 0;
	                                }
	                                if(secondDigit === 10) {
	                                    $log.warn("Second control digit became 10, replacing with 0");
	                                    secondDigit = 0;
	                                }
	                            }
	                            else
	                            {
	                                $log.warn("Base nuber not well formed(" + baseNumberLength + " digits): " + baseNumber);
	                            }
	
	                            if(!error) {
	                                //Replace the end evaluation of the dhis function:
	                                expression = expression.replace(callToThisFunction, baseNumber + firstDigit + secondDigit);
	                                expressionUpdated = true;
	                            }
	                            else
	                            {
	                                //Replace the end evaluation of the dhis function:
	                                expression = expression.replace(callToThisFunction, baseNumber);
	                                expressionUpdated = true;
	                            }
	                        }
	                        else if(dhisFunction.name === "d2:checkControlDigits") {
	                            $log.warn("checkControlDigits not implemented yet");
	
	                            //Replace the end evaluation of the dhis function:
	                            expression = expression.replace(callToThisFunction, parameters[0]);
	                            expressionUpdated = true;
	                        }
	                        else if(dhisFunction.name === "d2:left") {
	                            var string = String(parameters[0]);
	                            var numChars = string.length < parameters[1] ? string.length : parameters[1];
	                            var returnString =  string.substring(0,numChars);
	                            returnString = VariableService.processValue(returnString, 'TEXT');
	                            expression = expression.replace(callToThisFunction, returnString);
	                            expressionUpdated = true;
	                        }
	                        else if(dhisFunction.name === "d2:right") {
	                            var string = String(parameters[0]);
	                            var numChars = string.length < parameters[1] ? string.length : parameters[1];
	                            var returnString =  string.substring(string.length - numChars, string.length);
	                            returnString = VariableService.processValue(returnString, 'TEXT');
	                            expression = expression.replace(callToThisFunction, returnString);
	                            expressionUpdated = true;
	                        }
	                        else if(dhisFunction.name === "d2:substring") {
	                            var string = String(parameters[0]);
	                            var startChar = string.length < parameters[1] - 1 ? -1 : parameters[1];
	                            var endChar = string.length < parameters[2] ? -1 : parameters[2];
	                            if(startChar < 0 || endChar < 0) {
	                                expression = expression.replace(callToThisFunction, "''");
	                                expressionUpdated = true;
	                            } else {
	                                var returnString =  string.substring(startChar, endChar);
	                                returnString = VariableService.processValue(returnString, 'TEXT');
	                                expression = expression.replace(callToThisFunction, returnString);
	                                expressionUpdated = true;
	                            }
	                        }
	                        else if(dhisFunction.name === "d2:split") {
	                            var string = String(parameters[0]);
	                            var splitArray = string.split(parameters[1]);
	                            var returnPart = "";
	                            if (splitArray.length >= parameters[2]) {
	                                returnPart = splitArray[parameters[2]];
	                            }
	                            returnPart = VariableService.processValue(returnPart, 'TEXT');
	                            expression = expression.replace(callToThisFunction, returnPart);
	                            expressionUpdated = true;
	                        }
	                        else if(dhisFunction.name === "d2:length") {
	                            expression = expression.replace(callToThisFunction, String(parameters[0]).length);
	                            expressionUpdated = true;
	                        }
	                    });
	                });
	
	                //We only want to continue looping until we made a successful replacement,
	                //and there is still occurrences of "d2:" in the code. In cases where d2: occur outside
	                //the expected d2: function calls, one unneccesary iteration will be done and the
	                //successfulExecution will be false coming back here, ending the loop. The last iteration
	                //should be zero to marginal performancewise.
	                if(expressionUpdated && expression.indexOf("d2:") !== -1) {
	                    continueLooping = true;
	                } else {
	                    continueLooping = false;
	                }
	            }
	        }
	
	        return expression;
	    };
	
	    var runExpression = function(expression, beforereplacement, identifier, flag, variablesHash ){
	        //determine if expression is true, and actions should be effectuated
	        //If DEBUG mode, use try catch and report errors. If not, omit the heavy try-catch loop.:
	        var answer = false;
	        if(flag && flag.debug) {
	            try{
	
	                var dhisfunctionsevaluated = runDhisFunctions(expression, variablesHash, flag);
	                answer = eval(dhisfunctionsevaluated);
	
	                if(flag.verbose)
	                {
	                    $log.info("Expression with id " + identifier + " was successfully run. Original condition was: " + beforereplacement + " - Evaluation ended up as:" + expression + " - Result of evaluation was:" + answer);
	                }
	            }
	            catch(e)
	            {
	                $log.warn("Expression with id " + identifier + " could not be run. Original condition was: " + beforereplacement + " - Evaluation ended up as:" + expression + " - error message:" + e);
	            }
	        }
	        else {
	            //Just run the expression. This is much faster than the debug route: http://jsperf.com/try-catch-block-loop-performance-comparison
	            var dhisfunctionsevaluated = runDhisFunctions(expression, variablesHash, flag);
	            answer = eval(dhisfunctionsevaluated);
	        }
	        return answer;
	    };
	
	    var determineValueType = function(value) {
	        var valueType = 'TEXT';
	        if(value === 'true' || value === 'false') {
	            valueType = 'BOOLEAN';
	        }
	        else if(angular.isNumber(value) || !isNaN(value)) {
	            if(value % 1 !== 0) {
	                valueType = 'NUMBER';
	            }
	            else {
	                valueType = 'INTEGER';
	            }
	        }
	        return valueType;
	    };
	
	    var performCreateEventAction = function(effect, selectedEntity, selectedEnrollment, currentEvents,executingEvent, programStage){
	        var valArray = [];
	        if(effect.data) {
	            valArray = effect.data.split(',');
	            var newEventDataValues = [];
	            var idList = {active:false};
	
	            angular.forEach(valArray, function(value) {
	                var valParts = value.split(':');                
	                if(valParts && valParts.length >= 1) {
	                    var valId = valParts[0];
	
	                    //Check wether one or more fields is marked as the id to use for comparison purposes:
	                    if(valId.trim().substring(0, 4) === "[id]") {
	                        valId = valId.substring(4,valId.length);
	                        idList[valId] = true;
	                        idList.active = true;
	                    }
	
	                    var valVal = "";
	                    if(valParts.length > 1) {
	                        valVal = valParts[1];
	                    }
	                    var valueType = determineValueType(valVal);
	
	                    var processedValue = VariableService.processValue(valVal, valueType);
	                    processedValue = $filter('trimquotes')(processedValue);
	                    newEventDataValues.push({dataElement:valId,value:processedValue});
	                    newEventDataValues[valId] = processedValue;
	                }
	            });
	
	            var valuesAlreadyExists = false;
	            angular.forEach(currentEvents, function(currentEvent) {
	                var misMatch = false;
	                angular.forEach(newEventDataValues, function(value) {
	                    var valueFound = false;
	                    angular.forEach(currentEvent.dataValues, function(currentDataValue) {
	                        //Only count as mismatch if there is no particular ID to use, or the current field is part of the same ID
	                        if(!idList.active || idList[currentDataValue.dataElement]){
	                            if(currentDataValue.dataElement === value.dataElement) {
	                                valueFound = true;
	                                //Truthy comparison is needed to avoid false negatives for differing variable types:
	                                if( currentDataValue.value != newEventDataValues[value.dataElement] ) {
	                                    misMatch = true;
	                                }
	                            }
	                        }
	                    });
	                    //Also treat no value found as a mismatch, but when ID fields is set, only concider ID fields
	                    if((!idList.active || idList[value.dataElement] ) && !valueFound) {
	                        misMatch = true;
	                    }
	                });
	                if(!misMatch) {
	                    //if no mismatches on this point, the exact same event already exists, and we dont create it.
	                    valuesAlreadyExists = true;
	                }
	            });
	
	            if(!valuesAlreadyExists) {
	                var eventDate = DateUtils.getToday();
	                var dueDate = DateUtils.getToday();
	
	                var newEvent = {
	                    trackedEntityInstance: selectedEnrollment.trackedEntityInstance,
	                    program: selectedEnrollment.program,
	                    programStage: effect.programStage.id,
	                    enrollment: selectedEnrollment.enrollment,
	                    orgUnit: selectedEnrollment.orgUnit,
	                    dueDate: dueDate,
	                    eventDate: eventDate,
	                    notes: [],
	                    dataValues: newEventDataValues,
	                    status: 'ACTIVE',
	                    event: dhis2.util.uid()
	                };
	
	                if(programStage && programStage.dontPersistOnCreate){
	                    newEvent.notPersisted = true;
	                    newEvent.executingEvent = executingEvent;
	                    $rootScope.$broadcast("eventcreated", { event:newEvent });
	                }
	                else{
	                    DHIS2EventFactory.create(newEvent).then(function(result){
	                       $rootScope.$broadcast("eventcreated", { event:newEvent });
	                    }); 
	                }
	                //1 event created
	                return 1;
	            }
	            else
	            {
	                //no events created
	                return 0;
	            }
	        } else {
	            $log.warn("Cannot create event with empty content.");
	        }
	    };
	    
	    var internalExecuteRules = function(allProgramRules, executingEvent, evs, allDataElements, selectedEntity, selectedEnrollment, optionSets, flag) {
	        if(allProgramRules) {
	            var variablesHash = {};
	
	            //Concatenate rules produced by indicator definitions into the other rules:
	            var rules = $filter('filter')(allProgramRules.programRules, {programStageId: null});
	
	            if(executingEvent && executingEvent.programStage){
	                if(!rules) {
	                    rules = [];
	                }
	                rules = rules.concat($filter('filter')(allProgramRules.programRules, {programStageId: executingEvent.programStage}));
	            }
	            if(!rules) {
	                rules = [];
	            }
	            rules = rules.concat(allProgramRules.programIndicators.rules);
	
	            //Run rules in priority - lowest number first(priority null is last)
	            rules = orderByFilter(rules, 'priority');
	
	            variablesHash = VariableService.getVariables(allProgramRules, executingEvent, evs, allDataElements, selectedEntity, selectedEnrollment, optionSets);
	
	            if(angular.isObject(rules) && angular.isArray(rules)){
	                //The program has rules, and we want to run them.
	                //Prepare repository unless it is already prepared:
	                if(angular.isUndefined( $rootScope.ruleeffects ) ) {
	                    $rootScope.ruleeffects = {};
	                }
	
	                var ruleEffectKey = executingEvent.event ? executingEvent.event : executingEvent;
	                if( executingEvent.event && angular.isUndefined( $rootScope.ruleeffects[ruleEffectKey] )){
	                    $rootScope.ruleeffects[ruleEffectKey] = {};
	                }
	
	                if(!angular.isObject(executingEvent) && angular.isUndefined( $rootScope.ruleeffects[ruleEffectKey] )){
	                    $rootScope.ruleeffects[ruleEffectKey] = {};
	                }
	
	                var updatedEffectsExits = false;
	                var eventsCreated = 0;
	
	                angular.forEach(rules, function(rule) {
	                    var ruleEffective = false;
	
	                    var expression = rule.condition;
	                    //Go through and populate variables with actual values, but only if there actually is any replacements to be made(one or more "$" is present)
	                    if(expression) {
	                        if(expression.indexOf('{') !== -1) {
	                            expression = replaceVariables(expression, variablesHash);
	                        }
	                        
	                        //run expression:
	                        if( runExpression(expression, rule.condition, "rule:" + rule.id, flag, variablesHash) ){
	                            ruleEffective = true;
	                        }
	                    } else {
	                        $log.warn("Rule id:'" + rule.id + "'' and name:'" + rule.name + "' had no condition specified. Please check rule configuration.");
	                    }
	
	                    angular.forEach(rule.programRuleActions, function(action){
	                        //In case the effect-hash is not populated, add entries
	                        if(angular.isUndefined( $rootScope.ruleeffects[ruleEffectKey][action.id] )){
	                            $rootScope.ruleeffects[ruleEffectKey][action.id] =  {
	                                id:action.id,
	                                location:action.location,
	                                action:action.programRuleActionType,
	                                dataElement:action.dataElement,
	                                trackedEntityAttribute:action.trackedEntityAttribute,
	                                programStage: action.programStage,
	                                programIndicator: action.programIndicator,
	                                programStageSection: action.programStageSection && action.programStageSection.id ? action.programStageSection.id : null,
	                                content:action.content,
	                                data:action.data,
	                                ineffect:undefined
	                            };
	                        }
	
	                        //In case the rule is effective and contains specific data,
	                        //the effect be refreshed from the variables list.
	                        //If the rule is not effective we can skip this step
	                        if(ruleEffective && action.data)
	                        {
	                            //Preserve old data for comparison:
	                            var oldData = $rootScope.ruleeffects[ruleEffectKey][action.id].data;
	
	                            //The key data might be containing a dollar sign denoting that the key data is a variable.
	                            //To make a lookup in variables hash, we must make a lookup without the dollar sign in the variable name
	                            //The first strategy is to make a direct lookup. In case the "data" expression is more complex, we have to do more replacement and evaluation.
	
	                            var nameWithoutBrackets = action.data.replace('#{','').replace('}','');
	                            if(angular.isDefined(variablesHash[nameWithoutBrackets]))
	                            {
	                                //The variable exists, and is replaced with its corresponding value
	                                $rootScope.ruleeffects[ruleEffectKey][action.id].data =
	                                    variablesHash[nameWithoutBrackets].variableValue;
	                            }
	                            else if(action.data.indexOf('{') !== -1 || action.data.indexOf('d2:') !== -1)
	                            {
	                                //Since the value couldnt be looked up directly, and contains a curly brace or a dhis function call,
	                                //the expression was more complex than replacing a single variable value.
	                                //Now we will have to make a thorough replacement and separate evaluation to find the correct value:
	                                $rootScope.ruleeffects[ruleEffectKey][action.id].data = replaceVariables(action.data, variablesHash);
	                                //In a scenario where the data contains a complex expression, evaluate the expression to compile(calculate) the result:
	                                $rootScope.ruleeffects[ruleEffectKey][action.id].data = runExpression($rootScope.ruleeffects[ruleEffectKey][action.id].data, action.data, "action:" + action.id, flag, variablesHash);
	                            }
	
	                            if(oldData !== $rootScope.ruleeffects[ruleEffectKey][action.id].data) {
	                                updatedEffectsExits = true;
	                            }
	                        }
	
	                        //Update the rule effectiveness if it changed in this evaluation;
	                        if($rootScope.ruleeffects[ruleEffectKey][action.id].ineffect !== ruleEffective)
	                        {
	                            //There is a change in the rule outcome, we need to update the effect object.
	                            updatedEffectsExits = true;
	                            $rootScope.ruleeffects[ruleEffectKey][action.id].ineffect = ruleEffective;
	                        }
	
	                        //In case the rule is of type CREATEEVENT, run event creation:
	                        if($rootScope.ruleeffects[ruleEffectKey][action.id].action === "CREATEEVENT" && $rootScope.ruleeffects[ruleEffectKey][action.id].ineffect){
	                            if(evs && evs.byStage){
	                                if($rootScope.ruleeffects[ruleEffectKey][action.id].programStage) {
	                                    var createdNow = performCreateEventAction($rootScope.ruleeffects[ruleEffectKey][action.id], selectedEntity, selectedEnrollment, evs.byStage[$rootScope.ruleeffects[ruleEffectKey][action.id].programStage.id]);
	                                    eventsCreated += createdNow;
	                                } else {
	                                    $log.warn("No programstage defined for CREATEEVENT action: " + action.id);
	                                }
	                            } else {
	                                $log.warn("Events to evaluate for CREATEEVENT action: " + action.id + ". Could it have been triggered at the wrong time or during registration?");
	                            }
	                        }
	                        //In case the rule is of type "assign variable" and the rule is effective,
	                        //the variable data result needs to be applied to the correct variable:
	                        else if($rootScope.ruleeffects[ruleEffectKey][action.id].action === "ASSIGN" && $rootScope.ruleeffects[ruleEffectKey][action.id].ineffect){
	                            //from earlier evaluation, the data portion of the ruleeffect now contains the value of the variable to be assigned.
	                            //the content portion of the ruleeffect defines the name for the variable, when the qualidisers are removed:
	                            var variabletoassign = $rootScope.ruleeffects[ruleEffectKey][action.id].content ?
	                                $rootScope.ruleeffects[ruleEffectKey][action.id].content.replace("#{","").replace("A{","").replace("}","") : null;
	
	                            if(variabletoassign && !angular.isDefined(variablesHash[variabletoassign])){
	                                //If a variable is mentioned in the content of the rule, but does not exist in the variables hash, show a warning:
	                                $log.warn("Variable " + variabletoassign + " was not defined.");
	                            }
	
	                            if(variablesHash[variabletoassign]){
	                                var updatedValue = $rootScope.ruleeffects[ruleEffectKey][action.id].data;
	                                
	                                var valueType = determineValueType(updatedValue);
	                                
	                                if($rootScope.ruleeffects[ruleEffectKey][action.id].dataElement) {
	                                    updatedValue = VariableService.getDataElementValueOrCodeForValue(variablesHash[variabletoassign].useCodeForOptionSet, updatedValue, $rootScope.ruleeffects[ruleEffectKey][action.id].dataElement.id, allDataElements, optionSets);
	                                }
	                                updatedValue = VariableService.processValue(updatedValue, valueType);
	
	                                variablesHash[variabletoassign] = {
	                                    variableValue:updatedValue,
	                                    variableType:valueType,
	                                    hasValue:true,
	                                    variableEventDate:'',
	                                    variablePrefix:variablesHash[variabletoassign].variablePrefix ? variablesHash[variabletoassign].variablePrefix : '#',
	                                    allValues:[updatedValue]
	                                };
	                                
	                                if(variablesHash[variabletoassign].variableValue !== updatedValue) {
	                                    //If the variable was actually updated, we assume that there is an updated ruleeffect somewhere:
	                                    updatedEffectsExits = true;
	                                }
	                            }
	                        }
	                    });
	                });
	
	                //Broadcast rules finished if there was any actual changes to the event.
	                if(updatedEffectsExits){
	                    $rootScope.$broadcast("ruleeffectsupdated", { event: ruleEffectKey, callerId:flag.callerId, eventsCreated:eventsCreated });
	                }
	            }
	
	            return true;
	        }
	    };
	    
	    var internalProcessEventGrid = function( eventGrid ){
	    	var events = [];
	    	if( eventGrid && eventGrid.rows && eventGrid.headers ){    		
	    		angular.forEach(eventGrid.rows, function(row) {
	    			var ev = {};
	    			var i = 0;
	        		angular.forEach(eventGrid.headers, function(h){
	        			ev[h] = row[i];
	        			i++;
	        		});                            
	            });
	    	}
	    	return events;
	    };
	
	    var internalGetOrLoadScope = function(currentEvent,programStageId,orgUnitId) {        
	        if(crossEventRulesExist) {
	            //If crossEventRulesExist, we need to get a scope that contains more than the current event.
	            if(lastEventId !== currentEvent.event 
	                    || lastEventDate !== currentEvent.eventDate 
	                    || !eventScopeExceptCurrent) {
	                //The scope might need updates, as the parameters of the event has changed
	
	                lastEventId = currentEvent.event;
	                lastEventDate = currentEvent.eventDate;
	
	                
	                var pager = {pageSize: NUMBER_OF_EVENTS_IN_SCOPE};                
	                var ordering = {id:"eventDate",direction:"desc"};
	                
	                return DHIS2EventFactory.getByStage(orgUnitId, programStageId, null, pager, true, null, null, ordering).then(function(events) {                	
	                	var allEventsWithPossibleDuplicates = internalProcessEventGrid( events );                	
	                    var filterUrl = '&dueDateStart=' + DateUtils.formatFromUserToApi(lastEventDate) + '&dueDateEnd=' + DateUtils.formatFromUserToApi(lastEventDate); 
	                    return DHIS2EventFactory.getByStage(orgUnitId, programStageId, null, pager, true, null, filterUrl, ordering).then(function(events) {
	                    	allEventsWithPossibleDuplicates = allEventsWithPossibleDuplicates.concat( internalProcessEventGrid( events ) );
	                        eventScopeExceptCurrent = [];
	                        var eventIdDictionary = {};
	                        angular.forEach(allEventsWithPossibleDuplicates, function(eventInScope) {
	                            if(currentEvent.event !== eventInScope.event 
	                                    && !eventIdDictionary[eventInScope.event]) {
	                                //Add event and update dictionary to avoid duplicates:                                
	                                eventIdDictionary[eventInScope.event] = true;
	                            }
	                        });
	
	                        //make a sorted list of all events to pass to rules execution service:
	                        var allEventsInScope = eventScopeExceptCurrent.concat([currentEvent]);
	                        allEventsInScope = orderByFilter(allEventsInScope, '-eventDate').reverse();
	                        var byStage = {};
	                        byStage[currentEvent.programStage] = allEventsInScope;
	                        return {all: allEventsInScope, byStage:byStage};
	                    });
	                });   
	            }
	            else
	            {
	                //make a sorted list of all events to pass to rules execution service:
	                var allEvents = eventScopeExceptCurrent.concat([currentEvent]);
	                allEvents = orderByFilter(allEvents, '-eventDate').reverse();
	                var byStage = {};
	                byStage[currentEvent.programStage] = allEvents;
	                return $q.when({all: allEvents, byStage:byStage});
	            }
	        }
	        else
	        {
	            //return a scope containing only the current event
	            var byStage = {};
	            byStage[currentEvent.programStage] = [currentEvent];
	            return $q.when({all: [currentEvent], byStage:byStage});
	        }
	    };
	    var internalGetOrLoadRules = function(programId) {
	        //If no rules is stored in memory, or this service is being called in the context of a different program, get the rules again:
	        if(allProgramRules === false || lastProgramId !== programId)
	        {
	            return RulesFactory.loadRules(programId).then(function(rules){                    
	                allProgramRules = rules;
	                lastProgramId = programId;
	
	                //Check if any of the rules is using any source type thar requires a bigger event scope
	                crossEventRulesExist = false;
	                if(rules.programVariables && rules.programVariables.length) {
	                    for(var i = 0; i < rules.programVariables.length; i ++) {
	                        if( rules.programVariables[i].programRuleVariableSourceType ===
	                                "DATAELEMENT_NEWEST_EVENT_PROGRAM" ||
	                            rules.programVariables[i].programRuleVariableSourceType ===
	                                "DATAELEMENT_NEWEST_EVENT_PROGRAM_STAGE" ||
	                            rules.programVariables[i].programRuleVariableSourceType ===
	                                "DATAELEMENT_PREVIOUS_EVENT")
	                        {
	                            crossEventRulesExist = true;
	                        }
	                    }
	                }
	
	                return rules;
	            });  
	        }
	        else
	        {
	            return $q.when(allProgramRules);
	        }
	    };
	    return {
	        executeRules: function(allProgramRules, executingEvent, evs, allDataElements, selectedEntity, selectedEnrollment, optionSets, flags) {
	            internalExecuteRules(allProgramRules, executingEvent, evs, allDataElements, selectedEntity, selectedEnrollment, optionSets, flags);
	        },
	        loadAndExecuteRulesScope: function(currentEvent, programId, programStageId, programStageDataElements, optionSets, orgUnitId, flags){
	            internalGetOrLoadRules(programId).then(function(rules) {
	                internalGetOrLoadScope(currentEvent,programStageId,orgUnitId).then(function(scope) {
	                    internalExecuteRules(rules, currentEvent, scope, programStageDataElements, null, null, optionSets, flags);
	                });
	            });
	        },
	        processRuleEffectsForTrackedEntityAttributes: function(context, currentTei, teiOriginalValues, attributesById, optionSets ) {
	            var hiddenFields = {};
	            var assignedFields = {};
	            var hiddenSections = {};
	            var warningMessages = [];
	            
	            angular.forEach($rootScope.ruleeffects[context], function (effect) {
	                if (effect.ineffect) {
	                    if (effect.action === "HIDEFIELD" && effect.trackedEntityAttribute) {
	                        if (currentTei[effect.trackedEntityAttribute.id]) {
	                            //If a field is going to be hidden, but contains a value, we need to take action;
	                            if (effect.content) {
	                                //TODO: Alerts is going to be replaced with a proper display mecanism.
	                                alert(effect.content);
	                            }
	                            else {
	                                //TODO: Alerts is going to be replaced with a proper display mecanism.
	                                alert(attributesById[effect.trackedEntityAttribute.id].displayName + " was blanked out and hidden by your last action");
	                            }
	
	                            //Blank out the value:
	                            currentTei[effect.trackedEntityAttribute.id] = "";
	                        }
	
	                        hiddenFields[effect.trackedEntityAttribute.id] = true;
	                    } else if (effect.action === "SHOWERROR" && effect.trackedEntityAttribute) {
	                        if(effect.ineffect) {
	                            var headerText =  $translate.instant('validation_error');
	                            var bodyText = effect.content + (effect.data ? effect.data : "");
	
	                            NotificationService.showNotifcationDialog(headerText, bodyText);
	                            if( effect.trackedEntityAttribute ) {
	                                currentTei[effect.trackedEntityAttribute.id] = teiOriginalValues[effect.trackedEntityAttribute.id];
	                            }
	                        }
	                    } else if (effect.action === "SHOWWARNING" && effect.trackedEntityAttribute) {
	                        if(effect.ineffect) {
	                            var message = effect.content + (angular.isDefined(effect.data) ? effect.data : "");
	                            warningMessages.push(message);
	
	                            if( effect.trackedEntityAttribute ) {
	                                warningMessages[effect.trackedEntityAttribute.id] = message;
	                            }
	                        }
	                    }
	                    else if (effect.action === "ASSIGN" && effect.trackedEntityAttribute) {
	                        var processedValue = $filter('trimquotes')(effect.data);
	
	                        if(attributesById[effect.trackedEntityAttribute.id]
	                                && attributesById[effect.trackedEntityAttribute.id].optionSet) {
	                            processedValue = OptionSetService.getName(
	                                    optionSets[attributesById[effect.trackedEntityAttribute.id].optionSet.id].options, processedValue)
	                        }
	
	                        processedValue = processedValue === "true" ? true : processedValue;
	                        processedValue = processedValue === "false" ? false : processedValue;
	
	                        //For "ASSIGN" actions where we have a dataelement, we save the calculated value to the dataelement:
	                        currentTei[effect.trackedEntityAttribute.id] = processedValue;
	                        assignedFields[effect.trackedEntityAttribute.id] = true;
	                    }
	                }
	            });
	            return {currentTei: currentTei, hiddenFields: hiddenFields, hiddenSections: hiddenSections, warningMessages: warningMessages, assignedFields: assignedFields};
	        },
	        processRuleEffectsForEvent: function(eventId, currentEvent, currentEventOriginalValues, prStDes, optionSets ) {
	            var hiddenFields = {};
	            var assignedFields = {};
	            var hiddenSections = {};
	            var warningMessages = [];
	            
	            angular.forEach($rootScope.ruleeffects[eventId], function (effect) {
	                if (effect.ineffect) {
	                    if (effect.action === "HIDEFIELD" && effect.dataElement) {
	                        if(currentEvent[effect.dataElement.id]) {
	                            //If a field is going to be hidden, but contains a value, we need to take action;
	                            if(effect.content) {
	                                //TODO: Alerts is going to be replaced with a proper display mecanism.
	                                alert(effect.content);
	                            }
	                            else {
	                                //TODO: Alerts is going to be replaced with a proper display mecanism.
	                                alert(prStDes[effect.dataElement.id].dataElement.formName + "Was blanked out and hidden by your last action");
	                            }
	
	                        }
	                        
	                        hiddenFields[effect.dataElement.id] = true;
	                    }
	                    else if(effect.action === "HIDESECTION") {
	                        if(effect.programStageSection){
	                            hiddenSections[effect.programStageSection] = effect.programStageSection;
	                        }
	                    }
	                    else if(effect.action === "SHOWERROR" && effect.dataElement.id){
	                        var headerTxt =  $translate.instant('validation_error');
	                        var bodyTxt = effect.content + (effect.data ? effect.data : "");
	                        NotificationService.showNotifcationDialog(headerTxt, bodyTxt);
	
	                        currentEvent[effect.dataElement.id] = currentEventOriginalValues[effect.dataElement.id];
	                    }
	                    else if(effect.action === "SHOWWARNING"){
	                        warningMessages.push(effect.content + (effect.data ? effect.data : ""));
	                    }
	                    else if (effect.action === "ASSIGN" && effect.dataElement) {
	                        var processedValue = $filter('trimquotes')(effect.data);
	
	                        if(prStDes[effect.dataElement.id] 
	                                && prStDes[effect.dataElement.id].dataElement.optionSet) {
	                            processedValue = OptionSetService.getName(
	                                    optionSets[prStDes[effect.dataElement.id].dataElement.optionSet.id].options, processedValue)
	                        }
	
	                        processedValue = processedValue === "true" ? true : processedValue;
	                        processedValue = processedValue === "false" ? false : processedValue;
	
	                        currentEvent[effect.dataElement.id] = processedValue;
	                        assignedFields[effect.dataElement.id] = true;
	                    }
	                }
	            });
	        
	            return {currentEvent: currentEvent, hiddenFields: hiddenFields, hiddenSections: hiddenSections, warningMessages: warningMessages, assignedFields: assignedFields};
	        },
	        processRuleEffectAttribute: function(context, selectedTei, tei, currentEvent, currentEventOriginialValue, affectedEvent, attributesById, prStDes, hiddenFields, hiddenSections, warningMessages, assignedFields, optionSets){
	            //Function used from registration controller to process effects for the tracked entity instance and for the events in the same operation
	            var teiAttributesEffects = this.processRuleEffectsForTrackedEntityAttributes(context, selectedTei, tei, attributesById, optionSets );
	            teiAttributesEffects.selectedTei = teiAttributesEffects.currentTei;
	            
	            if(context === "SINGLE_EVENT" && currentEvent && prStDes ) {
	                var eventEffects = this.processRuleEffectsForEvent("SINGLE_EVENT", currentEvent, currentEventOriginialValue, prStDes, optionSets);
	                teiAttributesEffects.warningMessages = angular.extend(teiAttributesEffects.warningMessages,eventEffects.warningMessages);
	                teiAttributesEffects.hiddenFields = angular.extend(teiAttributesEffects.hiddenFields,eventEffects.hiddenFields);
	                teiAttributesEffects.hiddenSections = angular.extend(teiAttributesEffects.hiddenSections,eventEffects.hiddenSections);
	                teiAttributesEffects.assignedFields = angular.extend(teiAttributesEffects.assignedFields,eventEffects.assignedFields);
	                teiAttributesEffects.currentEvent = eventEffects.currentEvent;
	            }
	            
	            return teiAttributesEffects;
	        }
	    };
	})
	
	/* service for dealing with events */
	.service('DHIS2EventService', function(DateUtils){
	    return {
	        //for simplicity of grid display, events were changed from
	        //event.datavalues = [{dataElement: dataElement, value: value}] to
	        //event[dataElement] = value
	        //now they are changed back for the purpose of storage.
	        reconstructEvent: function(event, programStageDataElements){
	            var e = {};
	
	            e.event         = event.event;
	            e.status        = event.status;
	            e.program       = event.program;
	            e.programStage  = event.programStage;
	            e.orgUnit       = event.orgUnit;
	            e.eventDate     = event.eventDate;
	
	            var dvs = [];
	            angular.forEach(programStageDataElements, function(prStDe){
	                if(event.hasOwnProperty(prStDe.dataElement.id)){
	                    dvs.push({dataElement: prStDe.dataElement.id, value: event[prStDe.dataElement.id]});
	                }
	            });
	
	            e.dataValues = dvs;
	
	            if(event.coordinate){
	                e.coordinate = {latitude: event.coordinate.latitude ? event.coordinate.latitude : '',
	                    longitude: event.coordinate.longitude ? event.coordinate.longitude : ''};
	            }
	
	            return e;
	        },
	        refreshList: function(eventList, currentEvent){
	            if(!eventList || !eventList.length){
	                return;
	            }
	            var continueLoop = true;
	            for(var i=0; i< eventList.length && continueLoop; i++){
	                if(eventList[i].event === currentEvent.event ){
	                    eventList[i] = currentEvent;
	                    continueLoop = false;
	                }
	            }
	            return eventList;
	        },
	        getEventExpiryStatus : function (event, program, selectedOrgUnit) {
	            var completedDate, today, daysAfterCompletion;
	
	            if ((event.orgUnit !== selectedOrgUnit) || ( program.completeEventsExpiryDays === 0) ||
	                !event.status) {
	                return false;
	            }
	
	            completedDate = moment(event.completedDate,'YYYY-MM-DD');
	            today = moment(DateUtils.getToday(),'YYYY-MM-DD');
	            daysAfterCompletion = today.diff(completedDate, 'days');
	            if (daysAfterCompletion < program.completeEventsExpiryDays) {
	                return false;
	            }
	            return true;
	        }
	    };
	})
	
	/* current selections */
	.service('CurrentSelection', function(){
	    this.currentSelection = {};
	    this.relationshipInfo = {};
	    this.optionSets = null;
	    this.attributesById = null;
	    this.ouLevels = null;
	    this.sortedTeiIds = [];
	    this.selectedTeiEvents = null;
	    this.relationshipOwner = {};
	    this.selectedTeiEvents = [];
	    this.fileNames = {};
	    this.orgUnitNames = {};
	    this.location = null;
	    this.advancedSearchOptions = null;
		this.trackedEntities = null;
	
	    this.set = function(currentSelection){
	        this.currentSelection = currentSelection;
	    };
	    this.get = function(){
	        return this.currentSelection;
	    };
	
	    this.setRelationshipInfo = function(relationshipInfo){
	        this.relationshipInfo = relationshipInfo;
	    };
	    this.getRelationshipInfo = function(){
	        return this.relationshipInfo;
	    };
	
	    this.setOptionSets = function(optionSets){
	        this.optionSets = optionSets;
	    };
	    this.getOptionSets = function(){
	        return this.optionSets;
	    };
	
	    this.setAttributesById = function(attributesById){
	        this.attributesById = attributesById;
	    };
	    this.getAttributesById = function(){
	        return this.attributesById;
	    };
	
	    this.setOuLevels = function(ouLevels){
	        this.ouLevels = ouLevels;
	    };
	    this.getOuLevels = function(){
	        return this.ouLevels;
	    };
	
	    this.setSortedTeiIds = function(sortedTeiIds){
	        this.sortedTeiIds = sortedTeiIds;
	    };
	    this.getSortedTeiIds = function(){
	        return this.sortedTeiIds;
	    };
	
	    this.setSelectedTeiEvents = function(selectedTeiEvents){
	        this.selectedTeiEvents = selectedTeiEvents;
	    };
	    this.getSelectedTeiEvents = function(){
	        return this.selectedTeiEvents;
	    };
	
	    this.setRelationshipOwner = function(relationshipOwner){
	        this.relationshipOwner = relationshipOwner;
	    };
	    this.getRelationshipOwner = function(){
	        return this.relationshipOwner;
	    };
	
	    this.setFileNames = function(fileNames){
	        this.fileNames = fileNames;
	    };
	    this.getFileNames = function(){
	        return this.fileNames;
	    };
	    
	    this.setOrgUnitNames = function(orgUnitNames){
	        this.orgUnitNames = orgUnitNames;
	    };
	    this.getOrgUnitNames = function(){
	        return this.orgUnitNames;
	    };
	    
	    this.setLocation = function(location){
	        this.location = location;
	    };
	    this.getLocation = function(){
	        return this.location;
	    };
	    
	    this.setAdvancedSearchOptions = function (searchOptions) {
	        this.advancedSearchOptions = searchOptions;
	    };
	    this.getAdvancedSearchOptions = function () {
	        return this.advancedSearchOptions;
	    };
	
	    this.setTrackedEntities = function (trackedEntities) {
	        this.trackedEntities = trackedEntities;
	    };
	    this.getTrackedEntities = function () {
	        return this.trackedEntities;
	    };
	
	    this.setSortColumn = function (sortColumn) {
	        if (this.advancedSearchOptions) {
	            this.advancedSearchOptions.sortColumn = sortColumn;
	        }
	    };
	
	    this.setColumnReverse = function (reverseSortStatus) {
	        if (this.advancedSearchOptions) {
	            this.advancedSearchOptions.reverse = reverseSortStatus;
	        }
	    };
	
	    this.setGridColumns = function (gridColumns) {
	        if (this.advancedSearchOptions) {
	            this.advancedSearchOptions.gridColumns = gridColumns;
	        }
	    }
	})
	
	.service('AuditHistoryDataService', function( $http, $translate, NotificationService, DHIS2URL ) {
	    this.getAuditHistoryData = function(dataId, dataType ) {
	        var url="";
	        if (dataType === "attribute") {
	            url="/audits/trackedEntityAttributeValue?tei="+dataId+"&skipPaging=true";
	            
	        } else {
	            url="/audits/trackedEntityDataValue?psi="+dataId+"&skipPaging=true";
	        }
	
	        var promise = $http.get(DHIS2URL + url).then(function( response ) {
	            return response.data;
	        }, function( response ) {
	            if( response && response.data && response.data.status === 'ERROR' ) {
	                var headerText = response.data.status;
	                var bodyText = response.data.message ? response.data.message : $translate.instant('unable_to_fetch_data_from_server');
	                NotificationService.showNotifcationDialog(headerText, bodyText);
	            }
	        });
	        return promise;
	    }
	})
	
	
	
	/* Factory for fetching OrgUnit */
	.factory('OrgUnitFactory', function($http, DHIS2URL, $q, $window, $translate, SessionStorageService, DateUtils, CurrentSelection) {
	    var orgUnit, orgUnitPromise, rootOrgUnitPromise,orgUnitTreePromise;
	    var indexedDB = $window.indexedDB;
	    var db = null;
	    function openStore(){
	        var deferred = $q.defer();
	        var request = indexedDB.open("dhis2ou");
	
	        request.onsuccess = function(e) {
	            db = e.target.result;
	            deferred.resolve();
	        };
	
	        request.onerror = function(){
	            deferred.reject();
	        };
	
	        return deferred.promise;
	    }
	    return {
	        getChildren: function(uid){
	            if( orgUnit !== uid ){
	                orgUnitPromise = $http.get( DHIS2URL + '/organisationUnits/'+ uid + '.json?fields=id,path,children[id,displayName,level,children[id]]&paging=false' ).then(function(response){
	                    orgUnit = uid;
	                    return response.data;
	                });
	            }
	            return orgUnitPromise;
	        },
	        get: function(uid){
	            if( orgUnit !== uid ){
	                orgUnitPromise = $http.get( DHIS2URL + '/organisationUnits/'+ uid + '.json?fields=id,displayName,level,path' ).then(function(response){
	                    orgUnit = uid;
	                    return response.data;
	                });
	            }
	            return orgUnitPromise;
	        },
	        getViewTreeRoot: function(){
	            var def = $q.defer();            
	            var settings = SessionStorageService.get('USER_PROFILE');            
	            if( settings && settings.organisationUnits ){
	                var ous = {};
	                ous.organisationUnits = settings && settings.dataViewOrganisationUnits && settings.dataViewOrganisationUnits.length > 0 ? settings.dataViewOrganisationUnits : settings && settings.organisationUnits ? settings.organisationUnits : [];                
	                def.resolve( ous );
	            }
	            else{
	                var url = DHIS2URL + '/me.json?fields=organisationUnits[id,displayName,level,path,children[id,displayName,level,children[id]]],dataViewOrganisationUnits[id,displayName,level,path,children[id,displayName,level,children[id]]]&paging=false';
	                $http.get( url ).then(function(response){
	                    response.data.organisationUnits = response.data.dataViewOrganisationUnits && response.data.dataViewOrganisationUnits.length > 0 ? response.data.dataViewOrganisationUnits : response.data.organisationUnits;
	                    delete response.data.dataViewOrganisationUnits;
	                    def.resolve( response.data );
	                });
	            }            
	            return def.promise;
	        },
	        getSearchTreeRoot: function(){
	            var def = $q.defer();            
	            var settings = SessionStorageService.get('USER_PROFILE');            
	            if( settings && settings.organisationUnits ){
	                var ous = {};
	                ous.organisationUnits = settings && settings.teiSearchOrganisationUnits && settings.teiSearchOrganisationUnits.length > 0 ? settings.teiSearchOrganisationUnits : settings && settings.organisationUnits ? settings.organisationUnits : [];
	                def.resolve( ous );
	            }
	            else{
	                var url = DHIS2URL + '/me.json?fields=organisationUnits[id,displayName,level,path,children[id,displayName,level,children[id]]],teiSearchOrganisationUnits[id,displayName,level,path,children[id,displayName,level,children[id]]]&paging=false';
	                $http.get( url ).then(function(response){
	                    response.data.organisationUnits = response.data.teiSearchOrganisationUnits && response.data.teiSearchOrganisationUnits.length > 0 ? response.data.teiSearchOrganisationUnits : response.data.organisationUnits;
	                    delete response.data.teiSearchOrganisationUnits;
	                    def.resolve( response.data );
	                });
	            }            
	            return def.promise;
	        },
	        getOrgUnits: function(uid,fieldUrl){
	            var url = DHIS2URL + '/organisationUnits.json?filter=id:eq:'+uid+'&'+fieldUrl+'&paging=false';
	            orgUnitTreePromise = $http.get(url).then(function(response){
	                return response.data;
	            });
	            return orgUnitTreePromise;
	        },
	        getOrgUnit: function(uid) {
	            var def = $q.defer();
	            var selectedOrgUnit = CurrentSelection.get()["orgUnit"];//SessionStorageService.get('SELECTED_OU');
	            if (selectedOrgUnit && selectedOrgUnit.id === uid ) {
	                def.resolve( selectedOrgUnit );
	            }
	            else if(uid){
	                this.get(uid).then(function (response) {
	                    def.resolve( response ? response : null );
	                });
	            }
	            return def.promise;
	        },
	        getOrgUnitReportDateRange: function(orgUnit) {
	            var reportDateRange = { maxDate: DateUtils.getToday(), minDate: ''};
	            var cdate = orgUnit.cdate ? orgUnit.cdate : orgUnit.closedDate ? DateUtils.getDateFromUTCString(orgUnit.closedDate) : null;
	            var odate = orgUnit.odate ? orgUnit.odate : orgUnit.openingDate ? DateUtils.getDateFromUTCString(orgUnit.openingDate) : null;
	            if (odate) {
	                /*If the orgunit has an opening date, then it is taken as the min-date otherwise the min-date is open*/
	                reportDateRange.minDate = DateUtils.formatFromApiToUser(odate);
	            }
	            if (cdate) {
	                /*If closed date of the org-unit is later than today then today's date is taken as the max-date otherwise
	                * the closed date of the org-unit is taken as the max-date*/
	                if (DateUtils.isBeforeToday(cdate)) {
	                    reportDateRange.maxDate = DateUtils.formatFromApiToUser(cdate);
	                }
	            }
	            return reportDateRange;
	        },
	        getFromStoreOrServer: function(uid){
	            var deferred = $q.defer();
	            var orgUnitFactory = this;
	            if (db === null) {
	                openStore().then(getOu, function () {
	                    deferred.reject("DB not opened");
	                });
	            }
	            else {                
	                getOu();                
	            }
	
	            function getOu() {
	                var tx = db.transaction(["ou"]);
	                var store = tx.objectStore("ou");
	                var query = store.get(uid);
	
	                query.onsuccess = function(e){
	                    if(e.target.result){
	                        e.target.result.closedStatus = getOrgUnitClosedStatus(e.target.result);
	                        e.target.result.reportDateRange = orgUnitFactory.getOrgUnitReportDateRange(e.target.result);
	                        e.target.result.id = uid;
	                        e.target.result.displayName = e.target.result.n;
	                        delete(e.target.result.n);
	                        deferred.resolve(e.target.result);
	                    }
	                    else{
	                        var t = db.transaction(["ouPartial"]);
	                        var s = t.objectStore("ouPartial");
	                        var q = s.get(uid);
	                        q.onsuccess = function(e){
	                            if( e.target.result ){
	                                e.target.result.closedStatus = getOrgUnitClosedStatus(e.target.result);
	                                e.target.result.reportDateRange = orgUnitFactory.getOrgUnitReportDateRange(e.target.result);
	                                e.target.result.id = uid;
	                                e.target.result.displayName = e.target.result.n;
	                                delete(e.target.result.n);
	                                deferred.resolve(e.target.result);
	                            }
	                            else{
	                                $http.get( DHIS2URL + '/organisationUnits/'+ uid + '.json?fields=id,displayName,closedDate,openingDate' ).then(function(response){
	                                    if( response && response.data ){
	                                        deferred.resolve({
	                                            id: response.data.id,
	                                            displayName: response.data.displayName,
	                                            cdate: response.data.closedDate,
	                                            odate: response.data.openingDate,
	                                            closedStatus: getOrgUnitClosedStatus(response.data),
	                                            reportDateRange: orgUnitFactory.getOrgUnitReportDateRange(response.data)
	                                        });
	                                    }
	                                });
	                            }
	                        };
	                        q.onerror = function(e){                            
	                            deferred.reject();
	                        };
	                    }
	                };
	                query.onerror = function(e){
	                    deferred.reject();
	                };
	            }
	
	
	            function getOrgUnitClosedStatus(ou){
	                var closed = false;
	                if( ou ){
	                    if( ou.cdate ){
	                        closed = DateUtils.isBeforeToday( ou.cdate ) ? true : false;
	                    }
	                    if(!closed && ou.odate ){
	                        closed = DateUtils.isAfterToday( ou.odate ) ? true : false;
	                    }
	                }
	                if(closed) {
	                    setHeaderDelayMessage($translate.instant("orgunit_closed"));
	                } else {
	                    hideHeaderMessage();
	                }
	                return closed;
	            }
	            return deferred.promise;
	        }
	    };
	});

/***/ },
/* 4 */
/***/ function(module, exports) {

	/* global moment, angular, directive, dhis2, selection */
	
	'use strict';
	
	/* Directives */
	
	var d2Directives = angular.module('d2Directives', [])
	
	
	.directive('selectedOrgUnit', function ($timeout, $location) {
	    return {
	        restrict: 'A',
	        link: function (scope, element, attrs) {
	            var orgUnitFromUrl;
	            $("#orgUnitTree").one("ouwtLoaded", function (event, ids, names) {
	                if (dhis2.tc && dhis2.tc.metaDataCached) {
	                    $timeout(function () {
	                        scope.treeLoaded = true;
	                        scope.$apply();
	                    });
	                    selection.responseReceived();
	                }
	                else {
	                    console.log('Finished loading orgunit tree');
	                    orgUnitFromUrl = ($location.search()).ou;
	                    $("#orgUnitTree").addClass("disable-clicks"); //Disable ou selection until meta-data has downloaded
	                    $timeout(function () {
	                        scope.treeLoaded = true;
	                        scope.$apply();
	                    });
	                    downloadMetaData();
	                }
	            });
	
	            //listen to user selection, and inform angular
	            selection.setListenerFunction(setSelectedOu, true);
	            function setSelectedOu(ids, names) {
	                var ou = {id: ids[0], displayName: names[0]};
	                if(orgUnitFromUrl && ou.id !== orgUnitFromUrl) {
	                    selection.setOrgUnitFromURL(orgUnitFromUrl);
	                    orgUnitFromUrl = null;
	                } else {
	                    $timeout(function () {
	                        scope.selectedOrgUnit = ou;
	                        scope.$apply();
	                    });
	                }
	            }
	        }
	    };
	})
	
	.directive('d2SetFocus', function ($timeout) {
	
	    return {
	        scope: { trigger: '@d2SetFocus' },
	        link: function(scope, element) {
	            scope.$watch('trigger', function(value) {
	                if(value === "true") {
	                    $timeout(function() {
	                        element[0].focus();
	                    });
	                }
	            });
	        }
	    };
	})
	
	.directive('d2LeftBar', function () {
	
	    return {
	        restrict: 'E',
	        templateUrl: 'views/left-bar.html',
	        link: function (scope, element, attrs) {
	
	            $("#searchIcon").click(function () {
	                $("#searchSpan").toggle();
	                $("#searchField").focus();
	            });
	
	            $("#searchField").autocomplete({
	                source: "../dhis-web-commons/ouwt/getOrganisationUnitsByName.action",
	                select: function (event, ui) {
	                    $("#searchField").val(ui.item.value);
	                    selection.findByName();
	                }
	            });
	        }
	    };
	})
	
	.directive('blurOrChange', function () {
	
	    return function (scope, elem, attrs) {
	        elem.calendarsPicker({
	            onSelect: function () {
	                scope.$apply(attrs.blurOrChange);
	                $(this).change();
	            }
	        }).change(function () {
	            scope.$apply(attrs.blurOrChange);
	        });
	    };
	})
	
	.directive('d2Enter', function () {
	    return function (scope, element, attrs) {
	        element.bind("keydown keypress", function (event) {
	            if (event.which === 13) {
	                scope.$apply(function () {
	                    scope.$eval(attrs.d2Enter);
	                });
	                event.preventDefault();
	            }
	        });
	    };
	})
	
	.directive('d2PopOver', function ($compile, $templateCache, $translate) {
	
	    return {
	        restrict: 'EA',
	        scope: {
	            content: '=',
	            program: '=',
	            title: '@details',
	            template: "@template",
	            placement: "@placement",
	            trigger: "@trigger"
	        },
	        link: function (scope, element) {
	            var content, program;
	            if (scope.content) {
	                content = $templateCache.get(scope.template);
	                content = $compile(content)(scope);
	                if( scope.program ){
	                    program = $templateCache.get(scope.template);
	                    program = $compile(program)(scope);
	                }
	                var options = {
	                    content: content,
	                    program: program,
	                    placement: scope.placement ? scope.placement : 'auto',
	                    trigger: scope.trigger ? scope.trigger : 'hover',
	                    html: true,
	                    title: $translate.instant('_details')
	                };
	                element.popover(options);
	
	                $('body').on('click', function (e) {
	                    if (!element[0].contains(e.target)) {
	                        element.popover('hide');
	                    }
	                });
	            }
	        }
	    };
	})
	
	.directive('d2Sortable', function ($timeout) {
	
	    return {
	        restrict: 'A',
	        link: function (scope, element, attrs) {
	            element.sortable({
	                connectWith: ".connectedSortable",
	                placeholder: "ui-state-highlight",
	                tolerance: "pointer",
	                handle: '.handle',
	                change: function (event, ui) {
	                    getSortedItems(ui);
	                },
	                receive: function (event, ui) {
	                    getSortedItems(ui);
	                }
	            });
	
	            var getSortedItems = function (ui) {
	                var biggerWidgets = $("#biggerWidget").sortable("toArray");
	                var smallerWidgets = $("#smallerWidget").sortable("toArray");
	                var movedIsIdentifeid = false;
	
	                //look for the moved item in the bigger block
	                for (var i = 0; i < biggerWidgets.length && !movedIsIdentifeid; i++) {
	                    if (biggerWidgets[i] === "") {
	                        biggerWidgets[i] = ui.item[0].id;
	                        movedIsIdentifeid = true;
	                    }
	                }
	
	                //look for the moved item in the smaller block
	                for (var i = 0; i < smallerWidgets.length && !movedIsIdentifeid; i++) {
	                    if (smallerWidgets[i] === "") {
	                        smallerWidgets[i] = ui.item[0].id;
	                        movedIsIdentifeid = true;
	                    }
	                }
	                var layout = {smallerWidgets: smallerWidgets, biggerWidgets: biggerWidgets};
	                scope.applyWidgetsOrderChange( layout );
	            };
	        }
	    };
	})
	
	.directive('serversidePaginator', function factory() {
	
	    return {
	        restrict: 'E',
	        controller: function ($scope, Paginator) {
	            $scope.paginator = Paginator;
	        },
	        templateUrl: './templates/serverside-pagination.html'
	    };
	})
	
	.directive('d2CustomDataEntryForm', function ($compile) {
	    return{
	        restrict: 'E',
	        link: function (scope, elm, attrs) {
	            scope.$watch('customDataEntryForm', function () {
	                if (angular.isObject(scope.customDataEntryForm)) {
	                    elm.html(scope.customDataEntryForm.htmlCode);
	                    $compile(elm.contents())(scope);
	                }
	            });
	        }
	    };
	})
	
	.directive('d2CustomRegistrationForm', function ($compile) {
	    return{
	        restrict: 'E',
	        link: function (scope, elm, attrs) {
	            scope.$watch('customRegistrationForm', function () {
	                if (angular.isObject(scope.customRegistrationForm)) {
	                    elm.html(scope.customRegistrationForm.htmlCode);
	                    $compile(elm.contents())(scope);
	                }
	            });
	        }
	    };
	})
	
	/* TODO: this directive access an element #contextMenu somewhere in the document. Looks like it has to be rewritten */
	.directive('d2ContextMenu', function () {
	
	    return {
	        restrict: 'A',
	        link: function (scope, element, attrs) {
	            var contextMenu = $("#contextMenu");
	
	            element.click(function (e) {
	                var menuHeight = contextMenu.height();
	                var menuWidth = contextMenu.width();
	                var winHeight = $(window).height();
	                var winWidth = $(window).width();
	
	                var pageX = e.pageX;
	                var pageY = e.pageY;
	
	                contextMenu.show();
	
	                if ((menuWidth + pageX) > winWidth) {
	                    pageX -= menuWidth;
	                }
	
	                if ((menuHeight + pageY) > winHeight) {
	                    pageY -= menuHeight;
	
	                    if (pageY < 0) {
	                        pageY = e.pageY;
	                    }
	                }
	
	                contextMenu.css({
	                    left: pageX,
	                    top: pageY
	                });
	
	                return false;
	            });
	
	            contextMenu.on("click", "a", function () {
	                contextMenu.hide();
	            });
	
	            $(document).click(function () {
	                contextMenu.hide();
	            });
	        }
	    };
	})
	
	.directive('d2Date', function (CalendarService, $parse) {
	    return {
	        restrict: 'A',
	        require: 'ngModel',
	        link: function (scope, element, attrs, ctrl) {
	            var calendarSetting = CalendarService.getSetting();
	            var dateFormat = 'yyyy-mm-dd';
	            if (calendarSetting.keyDateFormat === 'dd-MM-yyyy') {
	                dateFormat = 'dd-mm-yyyy';
	            }
	
	            var minDate = $parse(attrs.minDate)(scope);
	            var maxDate = $parse(attrs.maxDate)(scope);
	            var calendar = $.calendars.instance(calendarSetting.keyCalendar);
	
	            var initializeDatePicker = function( sDate, eDate ){
	                element.calendarsPicker({
	                    changeMonth: true,
	                    dateFormat: dateFormat,
	                    yearRange: '-120:+30',
	                    minDate: sDate,
	                    maxDate: eDate,
	                    calendar: calendar,
	                    duration: "fast",
	                    showAnim: "",
	                    renderer: $.calendars.picker.themeRollerRenderer,
	                    onSelect: function () {
	                        $(this).change();
	                    },
	                    onClose:function(){
	                        $(this).blur();
	                    }
	                }).change(function () {
	                    ctrl.$setViewValue(this.value);
	                    this.focus();
	                    scope.$apply();
	                });
	            };
	
	            initializeDatePicker(minDate, maxDate);
	
	            scope.$watch(attrs.minDate, function(value){
	                element.calendarsPicker('destroy');
	                initializeDatePicker( value, $parse(attrs.maxDate)(scope));
	            });
	
	            scope.$watch(attrs.maxDate, function(value){
	                element.calendarsPicker('destroy');
	                initializeDatePicker( $parse(attrs.minDate)(scope), value);
	            });
	        }
	    };
	})
	
	.directive('d2FileInput', function($translate, DHIS2EventService, DHIS2EventFactory, FileService, NotificationService){
	
	    return {
	        restrict: "A",
	        scope: {
	            d2FileInputList: '=',
	            d2FileInput: '=',
	            d2FileInputName: '=',
	            d2FileInputCurrentName: '=',
	            d2FileInputPs: '='
	        },
	        link: function (scope, element, attrs) {
	
	            var de = attrs.inputFieldId;
	
	            var updateModel = function () {
	
	                var update = scope.d2FileInput.event &&  scope.d2FileInput.event !== 'SINGLE_EVENT' ? true : false;
	
	                FileService.upload(element[0].files[0]).then(function(data){
	
	                    if(data && data.status === 'OK' && data.response && data.response.fileResource && data.response.fileResource.id && data.response.fileResource.name){
	                        scope.d2FileInput[de] = data.response.fileResource.id;
	                        scope.d2FileInputCurrentName[de] = data.response.fileResource.name;
	                        if(!scope.d2FileInputName[scope.d2FileInput.event]){
	                            scope.d2FileInputName[scope.d2FileInput.event] = {};
	                        }
	                        scope.d2FileInputName[scope.d2FileInput.event][de] = data.response.fileResource.name;
	                        if( update ){
	                            var updatedSingleValueEvent = {event: scope.d2FileInput.event, dataValues: [{value: data.response.fileResource.id, dataElement:  de}]};
	                            var updatedFullValueEvent = DHIS2EventService.reconstructEvent(scope.d2FileInput, scope.d2FileInputPs.programStageDataElements);
	                            DHIS2EventFactory.updateForSingleValue(updatedSingleValueEvent, updatedFullValueEvent).then(function(data){
	                                scope.d2FileInputList = DHIS2EventService.refreshList(scope.d2FileInputList, scope.d2FileInput);
	                            });
	                        }
	                    }
	                    else{
	                        NotificationService.showNotifcationDialog($translate.instant("error"),
	                            $translate.instant("file_upload_failed"));
	                    }
	
	                });
	            };
	            element.bind('change', updateModel);
	        }
	    };
	})
	
	.directive('d2FileInputDelete', function($parse, $timeout, $translate, FileService, NotificationService){
	
	    return {
	        restrict: "A",
	        link: function (scope, element, attrs) {
	            var valueGetter = $parse(attrs.d2FileInputDelete);
	            var nameGetter = $parse(attrs.d2FileInputName);
	            var nameSetter = nameGetter.assign;
	
	            if(valueGetter(scope)) {
	                FileService.get(valueGetter(scope)).then(function(data){
	                    if(data && data.name && data.id){
	                        $timeout(function(){
	                            nameSetter(scope, data.name);
	                            scope.$apply();
	                        });
	                    }
	                    else{
	                        NotificationService.showNotifcationDialog($translate.instant("error"),
	                            $translate.instant("file_missing"));
	                    }
	                });
	            }
	        }
	    };
	})
	
	.directive('d2Audit', function (CurrentSelection, MetaDataFactory ) {
	    return {
	        restrict: 'E',
	        template: '<span class="hideInPrint audit-icon" title="{{\'audit_history\' | translate}}" data-ng-click="showAuditHistory()">' +
	        '<i class="glyphicon glyphicon-user""></i>' +
	        '</span>',
	        scope: {
	            eventId: '@',
	            type: '@',
	            nameIdMap: '='
	        },
	        controller: function ($scope, $modal) {
	            $scope.showAuditHistory = function () {
	
	                var openModal = function( ops ){
	                    $modal.open({
	                        templateUrl: "./templates/audit-history.html",
	                        controller: "AuditHistoryController",
	                        resolve: {
	                            eventId: function () {
	                                return $scope.eventId;
	                            },
	                            dataType: function () {
	                                return $scope.type;
	                            },
	                            nameIdMap: function () {
	                                return $scope.nameIdMap;
	                            },
	                            optionSets: function(){
	                                return ops;
	                            }
	                        }
	                    });
	                };
	
	                var optionSets = CurrentSelection.getOptionSets();
	                if(!optionSets){
	                    optionSets = [];
	                    MetaDataFactory.getAll('optionSets').then(function(optionSets){
	                        angular.forEach(optionSets, function(optionSet){
	                            optionSets[optionSet.id] = optionSet;
	                        });
	                        CurrentSelection.setOptionSets(optionSets);
	                        openModal(optionSets);
	                    });
	                }
	                else{
	                    openModal(optionSets);
	                }
	            };
	        }
	    };
	})
	
	.directive('d2RadioButton', function (){
	    return {
	        restrict: 'E',
	        templateUrl: './templates/radio-button.html',
	        scope: {
	            required: '=dhRequired',
	            value: '=dhValue',
	            disabled: '=dhDisabled',
	            name: '@dhName',
	            customOnClick: '&dhClick',
	            currentElement: '=dhCurrentElement',
	            event: '=dhEvent',
	            id: '=dhId'
	        },
	        controller: [
	            '$scope',
	            '$element',
	            '$attrs',
	            '$q',
	            'CommonUtils',
	            function($scope, $element, $attrs, $q, CommonUtils){
	
	                $scope.status = "";
	                $scope.clickedButton = "";
	
	                $scope.valueClicked = function (buttonValue){
	
	                    $scope.clickedButton = buttonValue;
	
	                    var originalValue = $scope.value;
	                    var tempValue = buttonValue;
	                    if($scope.value === buttonValue){
	                        tempValue = "";
	                    }
	
	                    if(angular.isDefined($scope.customOnClick)){
	                        var promise = $scope.customOnClick({value: tempValue});
	                        if(angular.isDefined(promise) && angular.isDefined(promise.then)){
	                            promise.then(function(status){
	                                if(angular.isUndefined(status) || status !== "notSaved"){
	                                    $scope.status = "saved";
	                                }
	                                $scope.value = tempValue;
	                            }, function(){
	                                $scope.status = "error";
	                                $scope.value = originalValue;
	                            });
	                        }
	                        else if(angular.isDefined(promise)){
	                            if(promise === false){
	                                $scope.value = originalValue;
	                            }
	                            else {
	                                $scope.value = tempValue;
	                            }
	                        }
	                        else{
	                            $scope.value = tempValue;
	                        }
	                    }
	                    else{
	                        $scope.value = tempValue;
	                    }
	                };
	
	                $scope.getDisabledValue = function(inValue){
	                    return CommonUtils.displayBooleanAsYesNo(inValue);
	                };
	
	                $scope.getDisabledIcon = function(inValue){
	                    if(inValue === true || inValue === "true"){
	                        return "fa fa-check";
	                    }
	                    else if(inValue === false || inValue === "false"){
	                        return "fa fa-times";
	                    }
	                    return '';
	                }
	
	            }],
	        link: function (scope, element, attrs) {
	
	            scope.radioButtonColor = function(buttonValue){
	
	                if(scope.value !== ""){
	                    if(scope.status === "saved"){
	                        if(angular.isUndefined(scope.currentElement) || (scope.currentElement.id === scope.id && scope.currentElement.event === scope.event)){
	                            if(scope.clickedButton === buttonValue){
	                                return 'radio-save-success';
	                            }
	                        }
	                        //different solution with text chosen
	                        /*else if(scope.status === "error"){
	                         if(scope.clickedButton === buttonValue){
	                         return 'radio-save-error';
	                         }
	                         }*/
	                    }
	                }
	                return 'radio-white';
	            };
	
	            scope.errorStatus = function(){
	
	                if(scope.status === 'error'){
	                    if(angular.isUndefined(scope.currentElement) || (scope.currentElement.id === scope.id && scope.currentElement.event === scope.event)){
	                        return true;
	                    }
	                }
	                return false;
	            };
	
	            scope.radioButtonImage = function(buttonValue){
	
	                if(angular.isDefined(scope.value)){
	                    if(scope.value === buttonValue && buttonValue === "true"){
	                        return 'fa fa-stack-1x fa-check';
	                    }
	                    else if(scope.value === buttonValue && buttonValue === "false"){
	                        return 'fa fa-stack-1x fa-times';
	                    }
	                }
	                return 'fa fa-stack-1x';
	            };
	        }
	    };
	})
	
	.directive('d2Radio', function(  DateUtils ){
	    return {
	        restrict: 'EA',            
	        templateUrl: "./templates/radio-input.html",
	        scope: {            
	            id: '=',
	            name: '@d2Name',
	            d2Object: '=',
	            d2ValueSaved: '=',
	            d2Disabled: '=',
	            d2Required: '=',
	            d2Options: '=',
	            d2CallbackFunction: '&d2Function'
	        },
	        link: function (scope, element, attrs) {
	            
	        },
	        controller: function($scope){
	            
	            $scope.model = {radio: $scope.d2Object[$scope.id] ? $scope.d2Object[$scope.id] : null};
	            
	            $scope.saveValue = function( value ){
	                $scope.model.radio = value;
	                if( $scope.model.radio === $scope.d2Object[$scope.id] ){
	                    $scope.model.radio = null;
	                }
	                
	                $scope.d2Object[$scope.id] = $scope.model.radio;
	                if( angular.isDefined( $scope.d2CallbackFunction ) ){
	                    $scope.d2CallbackFunction({value: $scope.model.radio});
	                }
	            };
	        }
	    };
	})
	
	.directive('dhis2Deselect', function ($document) {
	    return {
	        restrict: 'A',
	        scope: {
	            onDeselected: '&dhOnDeselected',
	            id: '@dhId',
	            preSelected: '=dhPreSelected',
	            abortDeselect: '&dhAbortDeselect'
	        },
	        controller: [
	            '$scope',
	            '$element',
	            '$attrs',
	            '$q',
	            function($scope, $element, $attrs, $q){
	
	                $scope.documentEventListenerSet = false;
	                $scope.elementClicked = false;
	
	                $element.on('click', function(event) {
	
	                    $scope.elementClicked = true;
	                    if($scope.documentEventListenerSet === false){
	                        $document.on('click', $scope.documentClick);
	                        $scope.documentEventListenerSet = true;
	                    }
	                });
	
	                $scope.documentClick = function(event){
	                    var modalPresent = $(".modal-backdrop").length > 0;
	                    var calendarPresent = $(".calendars-popup").length > 0;
	                    var calendarPresentInEvent = $(event.target).parents(".calendars-popup").length > 0;
	                    if($scope.abortDeselect()){
	                        $document.off('click', $scope.documentClick);
	                        $scope.documentEventListenerSet = false;
	                    }else if($scope.elementClicked === false &&
	                        modalPresent === false &&
	                        calendarPresent === false &&
	                        calendarPresentInEvent === false){
	                        $scope.onDeselected({id:$scope.id});
	                        $scope.$apply();
	                        $document.off('click', $scope.documentClick);
	                        $scope.documentEventListenerSet = false;
	                    }
	                    $scope.elementClicked = false;
	                };
	
	                if(angular.isDefined($scope.preSelected) && $scope.preSelected === true){
	                    $document.on('click', $scope.documentClick);
	                    $scope.documentEventListenerSet = true;
	                }
	
	            }],
	        link: function (scope, element, attrs) {
	        }
	    };
	})
	
	.directive('d2OrgUnitTree', function(OrgUnitFactory){
	    return {
	        restrict: 'EA',            
	        templateUrl: "./templates/orgunit-input.html",
	        scope: {            
	            selectedOrgUnitId: '@',
	            id: '@',
	            d2Object: '=',
	            d2Disabled: '=',
	            d2Required: '=',
	            d2CallbackFunction: '&d2Function',
	            d2OrgunitNames: '='
	        },
	        link: function (scope, element, attrs) {
	        },
	        controller: function($scope, $modal){
	            
	            if( !$scope.d2OrgUnitNames ){
	                $scope.d2OrgUnitNames = {};
	            }
	            
	            if( $scope.id && $scope.d2Object[$scope.id] ){                
	                OrgUnitFactory.getFromStoreOrServer($scope.d2Object[$scope.id]).then(function (response) {
	                    if(response && response.n) {
	                        $scope.d2OrgunitNames[$scope.d2Object[$scope.id]] = response.n;
	                    }
	                });
	            }
	            
	            $scope.showOrgUnitTree = function( dataElementId ){
	                
	                var modalInstance = $modal.open({
	                    templateUrl: "./templates/orgunit-tree.html",
	                    controller: 'OrgUnitTreeController',
	                    resolve: {
	                        orgUnitId: function(){
	                            return $scope.d2Object[dataElementId] ? $scope.d2Object[dataElementId] : $scope.selectedOrgUnitId;
	                        },
	                        orgUnitNames: function(){
	                            return $scope.d2OrgunitNames;
	                        }
	                    }
	                });
	
	                modalInstance.result.then(function ( res ) {
	                    if( res && res.selected && res.selected.id ){
	                        $scope.d2Object[dataElementId] = res.selected.id;
	                        $scope.d2OrgunitNames = res.names;
	                        if( angular.isDefined( $scope.d2CallbackFunction ) ){
	                            $scope.d2CallbackFunction($scope.d2Object, dataElementId);
	                        }                            
	                    }                    
	                }, function () {
	                });
	            };
	            
	            $scope.removeSelectedOrgUnit = function( dataElementId ){
	                delete $scope.d2Object[dataElementId];
	                if( angular.isDefined( $scope.d2CallbackFunction ) ){
	                    $scope.d2CallbackFunction($scope.d2Object, dataElementId);
	                }
	            };
	        }
	        
	    };
	})
	
	.directive('d2Map', function(){
	    return {
	        restrict: 'E',            
	        templateUrl: "./templates/coordinate-input.html",
	        scope: {
	            id: '@',            
	            d2Object: '=',            
	            d2CallbackFunction: '&d2Function',
	            d2CallbackFunctionParamText: '=d2FunctionParamText',
	            d2CallbackFunctionParamCoordinate: '=d2FunctionParamCoordinate',
	            d2Disabled: '=',
	            d2Required: '=',
	            d2LatSaved: '=',
	            d2LngSaved: '=',
	            d2CoordinateFormat: '='
	        },
	        controller: function($scope, $modal, $filter, $translate, DHIS2COORDINATESIZE, NotificationService){            
	            $scope.coordinateObject = angular.copy( $scope.d2Object );
	            
	            function processCoordinate(){
	            	if( $scope.d2CoordinateFormat === 'TEXT' ){        
	                    if( $scope.d2Object[$scope.id] && $scope.d2Object[$scope.id] !== ''){                        
	                        var coordinatePattern = /^\[-?\d+\.?\d+\,-?\d+\.?\d+\]$/;
	                        if( !coordinatePattern.test( $scope.d2Object[$scope.id] ) ){
	                            NotificationService.showNotifcationDialog($translate.instant('error'), $translate.instant('invalid_coordinate_format') + ":  " + $scope.d2Object[$scope.id] );
	                        }
	                        
	                    	var coordinates = $scope.d2Object[$scope.id].slice(1,-1).split( ",");                        
	                    	if( !dhis2.validation.isNumber( coordinates[0] ) || !dhis2.validation.isNumber( coordinates[0] ) ){
	                            NotificationService.showNotifcationDialog($translate.instant('error'), $translate.instant('invalid_coordinate_format') + ":  " + $scope.d2Object[$scope.id] );
	                    	}
	                        $scope.coordinateObject.coordinate = {latitude: parseFloat(coordinates[1]), longitude: parseFloat(coordinates[0])};
	                    }
	                    else{
	                        $scope.coordinateObject.coordinate = {};
	                    }
	                }            
	                if( !$scope.coordinateObject.coordinate ){
	                    $scope.coordinateObject.coordinate = {};
	                }
	            };
	            
	            processCoordinate();
	            
	            $scope.showMap = function(){                
	                
	            	processCoordinate();            	
	                            
	                var modalInstance = $modal.open({
	                    templateUrl: './templates/map.html',
	                    controller: 'MapController',
	                    windowClass: 'modal-map-window',
	                    resolve: {
	                        location: function () {
	                            return {lat: $scope.coordinateObject.coordinate.latitude, lng:  $scope.coordinateObject.coordinate.longitude};
	                        }
	                    }
	                });
	                
	                modalInstance.result.then(function (location) {                    
	                    if(angular.isObject(location)){
	                    	
	                    	if( dhis2.validation.isNumber( location.lat ) ){
	                    		location.lat = parseFloat( $filter('number')(location.lat, DHIS2COORDINATESIZE) );
	                    	}
	                    	
	                    	if( dhis2.validation.isNumber( location.lng ) ){
	                    		location.lng = parseFloat( $filter('number')(location.lng, DHIS2COORDINATESIZE) );
	                    	}
	                    	
	                        $scope.coordinateObject.coordinate.latitude = location.lat;
	                        $scope.coordinateObject.coordinate.longitude = location.lng;                        
	
	                        if( $scope.d2CoordinateFormat === 'TEXT' ){                        
	                            $scope.d2Object[$scope.id] = '[' + location.lng + ',' + location.lat + ']';
	                            if( angular.isDefined( $scope.d2CallbackFunction ) ){
	                                $scope.d2CallbackFunction( {arg1: $scope.d2CallbackFunctionParamText} );
	                            }
	                        }
	                        else{
	                            $scope.d2Object.coordinate.latitude = location.lat;
	                            $scope.d2Object.coordinate.longitude = location.lng;
	                            if( angular.isDefined( $scope.d2CallbackFunction ) ){
	                                $scope.d2CallbackFunction( {arg1: $scope.d2CallbackFunctionParamCoordinate} );
	                            }
	                        }                                                
	                    }
	                }, function () {
	                });
	            };
	            
	            $scope.coordinateInteracted = function (field, form) {        
	                var status = false;
	                if (field) {
	                    if(angular.isDefined(form)){
	                        status = form.$submitted || field.$dirty;
	                    }
	                    else {
	                        status = $scope.coordinateForm.$submitted || field.$dirty;
	                    }            
	                }
	                return status;
	            };
	            
	            $scope.saveD2Coordinate = function(){
	                
	                var saveCoordinate = function( format, param ){
	                    if( !$scope.coordinateObject.coordinate.longitude && !$scope.coordinateObject.coordinate.latitude ){
	                        if( format === 'COORDINATE' ){
	                            $scope.d2Object.coordinate = {latitude: "", longitude: ""};
	                        }
	                        else{
	                            $scope.d2Object[$scope.id] = '';
	                        }
	                        $scope.d2CallbackFunction( {arg1: param} );                            
	                    }
	                    else{
	                        if( $scope.coordinateObject.coordinate.longitude && $scope.coordinateObject.coordinate.latitude ){
	                            $scope.d2CallbackFunction( {arg1: param} );
	                        }
	                    }                    
	                };
	                
	                if( angular.isDefined( $scope.d2CallbackFunction ) ){
	                	
	                	if( dhis2.validation.isNumber( $scope.coordinateObject.coordinate.latitude ) ){
	                		$scope.coordinateObject.coordinate.latitude = parseFloat( $filter('number')($scope.coordinateObject.coordinate.latitude, DHIS2COORDINATESIZE) );
	                	}
	                	
	                	if( dhis2.validation.isNumber( $scope.coordinateObject.coordinate.longitude ) ){
	                		$scope.coordinateObject.coordinate.longitude = parseFloat( $filter('number')($scope.coordinateObject.coordinate.longitude, DHIS2COORDINATESIZE) );
	                	}
	                	
	                    if( $scope.d2CoordinateFormat === 'TEXT' ){                    
	                        $scope.d2Object[$scope.id] = '[' + $scope.coordinateObject.coordinate.longitude + ',' + $scope.coordinateObject.coordinate.latitude + ']';                        
	                        saveCoordinate( 'TEXT',  $scope.prStDe);
	                    }
	                    else{
	                        $scope.d2Object.coordinate.latitude = $scope.coordinateObject.coordinate.latitude;
	                        $scope.d2Object.coordinate.longitude = $scope.coordinateObject.coordinate.longitude;
	                        
	                        saveCoordinate( 'COORDINATE',  $scope.d2CallbackFunctionParam );                        
	                    }
	                }
	            };    
	        },
	        link: function (scope, element, attrs) {
	            
	        }
	    };
	})
	
	.directive('d2Age', function( CalendarService, DateUtils ){
	    return {
	        restrict: 'EA',            
	        templateUrl: "./templates/age-input.html",
	        scope: {
	            id: '@',
	            d2Object: '=',
	            d2AgeSaved: '=',
	            d2Disabled: '=',
	            d2Required: '=',
	            d2CallbackFunction: '&d2Function'
	        },
	        link: function (scope, element, attrs) {
	            
	        },
	        controller: function($scope){            
	            
	            $scope.age = {};
	            
	            if( $scope.id && $scope.d2Object && $scope.d2Object[$scope.id] ){
	                $scope.age.dob = $scope.d2Object[$scope.id];
	                formatAge();
	            }
	            
	            function formatAge(){
	                if( $scope.age && $scope.age.dob !== "" ){
	                    var _age = DateUtils.getAge( $scope.age.dob );                    
	                    $scope.age.years = _age.years;
	                    $scope.age.months = _age.months;
	                    $scope.age.days = _age.days;
	                }
	            }
	            
	            $scope.$watch('age.dob', function( newValue, oldValue ){
	                if( newValue !== oldValue ){
	                    $scope.d2Object[$scope.id] = $scope.age.dob;
	                    if( angular.isDefined( $scope.d2CallbackFunction ) ){
	                        $scope.d2CallbackFunction($scope.d2Object, $scope.id);
	                    }
	                }
	            });
	            
	            $scope.saveDOB = function(){                
	                formatAge();                
	            };
	            
	            $scope.saveAge = function(){
	                var dob = moment().subtract({days: $scope.age.days ? $scope.age.days : 0, months: $scope.age.months ? $scope.age.months : 0, years: $scope.age.years ? $scope.age.years : 0});
	                $scope.age.dob = DateUtils.format( dob );
	                formatAge();
	            };
	            
	            $scope.removeAge = function(){
	                $scope.age = {};
	            };
	            
	            $scope.ageInteracted = function (field, form) {        
	                var status = false;
	                if (field) {
	                    if(angular.isDefined(form)){
	                        status = form.$submitted || field.$dirty;
	                    }
	                    else {
	                        status = $scope.ageForm.$submitted || field.$dirty;
	                    }            
	                }
	                return status;
	            };
	        }
	    };
	});

/***/ },
/* 5 */
/***/ function(module, exports) {

	angular.module("d2Directives")
	.directive('d2NumberValidator', function() {
	    return {
	        require: 'ngModel',
	        restrict: 'A',
	        link: function (scope, element, attrs, ngModel) {
	            
	            function setValidity(numberType, isRequired){
	                if(numberType === 'NUMBER'){
	                    ngModel.$validators.number = function(value) {
	                    	value = value === 0 ? value.toString(): value; 
	                        return value === 'null' || !value ? !isRequired : dhis2.validation.isNumber(value);
	                    };
	                }
	                else if(numberType === 'INTEGER_POSITIVE'){
	                    ngModel.$validators.posInt = function(value) {
	                    	value = value === 0 ? value.toString(): value; 
	                        return value === 'null' || !value ? !isRequired : dhis2.validation.isPositiveInt(value);
	                    };
	                }
	                else if(numberType === 'INTEGER_NEGATIVE'){
	                    ngModel.$validators.negInt = function(value) {
	                    	value = value === 0 ? value.toString(): value;
	                        return value === 'null' || !value ? !isRequired : dhis2.validation.isNegativeInt(value);
	                    };
	                }
	                else if(numberType === 'INTEGER_ZERO_OR_POSITIVE'){
	                    ngModel.$validators.zeroPositiveInt = function(value) {
	                    	value = value === 0 ? value.toString(): value; 
	                        return value === 'null' || !value ? !isRequired : dhis2.validation.isZeroOrPositiveInt(value);
	                    };
	                }
	                else if(numberType === 'INTEGER'){
	                    ngModel.$validators.integer = function(value) {
	                    	value = value === 0 ? value.toString(): value;
	                        return value === 'null' || !value ? !isRequired : dhis2.validation.isInt(value);
	                    };
	                }
	                if(numberType === 'PERCENTAGE'){
	                    ngModel.$validators.percentValue = function(value) {
	                        if (value < 0 || value > 100) {
	                            return false;
	                        }
	                        value = value === 0 ? value.toString(): value;
	                        return value === 'null' || !value ? !isRequired : dhis2.validation.isNumber(value);
	                    };
	                }
	            }
	
	            var numberType = attrs.numberType;
	            var isRequired = attrs.ngRequired === 'true';            
	            setValidity(numberType, isRequired);
	        }
	    };
	})
	
	.directive("d2DateValidator", function(DateUtils, CalendarService, $parse) {
	    return {
	        restrict: "A",         
	        require: "ngModel",         
	        link: function(scope, element, attrs, ngModel) {
	        	
	            var calendarSetting = CalendarService.getSetting();
	            var isRequired = attrs.ngRequired === 'true';
	        	
	            ngModel.$validators.dateValidator = function(value) {
	                if(!value){
	                    return !isRequired;
	                }                
	                var convertedDate = DateUtils.format(angular.copy(value));
	                var isValid = value === convertedDate;
	                return isValid;
	            };
	            
	            ngModel.$validators.futureDateValidator = function(value) {
	                if(!value){
	                    return !isRequired;
	                }
	                var maxDate = $parse(attrs.maxDate)(scope);
	                var convertedDate = DateUtils.format(angular.copy(value));
	                var isValid = value === convertedDate;
	                if(isValid){
	                    isValid = maxDate === 0 ? !moment(convertedDate, calendarSetting.momentFormat).isAfter(moment(DateUtils.getToday(), calendarSetting.momentFormat)) : isValid;
	                }
	                return isValid;
	            };
	        }
	    };
	})
	
	.directive("d2CustomCoordinateValidator", function() {
	    return {
	        restrict: "A",         
	        require: "ngModel",         
	        link: function(scope, element, attrs, ngModel) {
	            
	            var isRequired = attrs.ngRequired === 'true';
	            
	            ngModel.$validators.customCoordinateValidator = function(value) {
	                if(!value){
	                    return !isRequired;
	                }
	                
	                var coordinate = value.split(",");
	                
	                if( !coordinate || coordinate.length !== 2 ){
	                    return false;
	                }
	
	                if( !dhis2.validation.isNumber(coordinate[0]) ){
	                    return false;
	                }
	                
	                if( !dhis2.validation.isNumber(coordinate[1]) ){
	                    return false;
	                }
	                
	                return coordinate[0] >= -180 && coordinate[0] <= 180 && coordinate[1] >= -90 && coordinate[1] <= 90;
	            };           
	        }
	    };
	})
	
	.directive("d2CoordinateValidator", function() {
	    return {
	        restrict: "A",         
	        require: "ngModel",         
	        link: function(scope, element, attrs, ngModel) {
	            
	            var isRequired = attrs.ngRequired === 'true';
	            
	            if(attrs.name === 'latitude'){
	                ngModel.$validators.latitudeValidator = function(value) {
	                    if(!value){
	                        return !isRequired;
	                    }
	
	                    if(!dhis2.validation.isNumber(value)){
	                        return false;
	                    }
	                    return value >= -90 && value <= 90;
	                };
	            }
	            
	            if(attrs.name === 'longitude'){
	                ngModel.$validators.longitudeValidator = function(value) {
	                    if(!value){
	                        return !isRequired;
	                    }
	
	                    if(!dhis2.validation.isNumber(value)){
	                        return false;
	                    }
	                    return value >= -180 && value <= 180;
	                };
	            }            
	        }
	    };
	})
	
	.directive("d2OptionValidator", function($translate, NotificationService) {
	    return {
	        restrict: "A",         
	        require: "ngModel",         
	        link: function(scope, element, attrs, ngModel) {
	        	
	            var isRequired = attrs.ngRequired === 'true';
	            
	            ngModel.$validators.optionValidator = function(value) {               
	                
	                var res = !value ? !isRequired : true;
	                
	                if(!res){
	                    var headerText = $translate.instant("validation_error");
	                    var bodyText = $translate.instant("option_required");
	                    NotificationService.showNotifcationDialog(headerText, bodyText);
	                }
	                return res;
	            };
	        }
	    };
	})
	
	.directive("d2AttributeValidator", function($q, TEIService, SessionStorageService) {
	    return {
	        restrict: "A",         
	        require: "ngModel",
	        link: function(scope, element, attrs, ngModel) {            
	            
	            function uniqunessValidatior(attributeData){
	                
	                ngModel.$asyncValidators.uniqunessValidator = function (modelValue, viewValue) {
	                    var pager = {pageSize: 1, page: 1, toolBarDisplay: 5};
	                    var deferred = $q.defer(), currentValue = modelValue || viewValue, programUrl = null, ouMode = 'ALL';
	                    
	                    if (currentValue) {
	                        
	                        attributeData.value = currentValue;                        
	                        var attUrl = 'filter=' + attributeData.id + ':EQ:' + attributeData.value;
	                        var ouId = SessionStorageService.get('ouSelected');
	                        
	                        if(attrs.selectedProgram && attributeData.programScope){
	                            programUrl = 'program=' + attrs.selectedProgram;
	                        }
	                        
	                        if(attributeData.orgUnitScope){
	                            ouMode = 'SELECTED';
	                        }                        
	
	                        TEIService.search(ouId, ouMode, null, programUrl, attUrl, pager, true).then(function(data) {
	                            if(attrs.selectedTeiId){
	                                if(data && data.rows && data.rows.length && data.rows[0] && data.rows[0].length && data.rows[0][0] !== attrs.selectedTeiId){
	                                    deferred.reject();
	                                }
	                            }
	                            else{
	                                if (data.rows.length > 0) {    
	                                    deferred.reject();
	                                }
	                            }                            
	                            deferred.resolve();
	                        });
	                    }
	                    else {
	                        deferred.resolve();
	                    }
	
	                    return deferred.promise;
	                };
	            }                      
	            
	            scope.$watch(attrs.ngDisabled, function(value){
	                var attributeData = scope.$eval(attrs.attributeData);
	                if(!value){
	                    if( attributeData && attributeData.unique && !value ){
	                        uniqunessValidatior(attributeData);
	                    }
	                }              
	            });     
	        }
	    };
	});

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';
	
	/* Filters */
	
	var d2Filters = angular.module('d2Filters', [])
	
	.filter('gridFilter', function($filter, CalendarService){
	    
	    return function(data, filters, filterTypes){
	
	        if(!data ){
	            return;
	        }
	        
	        if(!filters){
	            return data;
	        }        
	        else{            
	            
	            var dateFilter = {}, 
	                textFilter = {}, 
	                numberFilter = {},
	                filteredData = data;
	            
	            for(var key in filters){
	                
	                if(filterTypes[key] === 'DATE'){
	                    if(filters[key].start || filters[key].end){
	                        dateFilter[key] = filters[key];
	                    }
	                }
	                else if(filterTypes[key] === 'NUMBER' || 
	                			filterTypes[key] === 'INTEGER' ||
	                			filterTypes[key] === 'INTEGER_POSITIVE' || 
	                			filterTypes[key] === 'INTEGER_NEGATIVE' || 
	                			filterTypes[key] === 'INTEGER_ZERO_OR_POSITIVE'){
	                    if(filters[key].start || filters[key].end){
	                        numberFilter[key] = filters[key];
	                    }
	                }
	                else{
	                    textFilter[key] = filters[key];
	                }
	            }
	            
	            filteredData = $filter('filter')(filteredData, textFilter); 
	            filteredData = $filter('filter')(filteredData, dateFilter, dateComparator);            
	            filteredData = $filter('filter')(filteredData, numberFilter, numberComparator);
	                        
	            return filteredData;
	        } 
	    }; 
	    
	    function dateComparator(data,filter){
	    	var calendarSetting = CalendarService.getSetting(); 
	        var start = moment(filter.start, calendarSetting.momentFormat);
	        var end = moment(filter.end, calendarSetting.momentFormat);  
	        var date = moment(data, calendarSetting.momentFormat); 
	        
	        if(filter.start && filter.end){
	            return ( Date.parse(date) <= Date.parse(end) ) && (Date.parse(date) >= Date.parse(start));
	        }        
	        return ( Date.parse(date) <= Date.parse(end) ) || (Date.parse(date) >= Date.parse(start));
	    }
	    
	    function numberComparator(data,filter){
	        var start = filter.start;
	        var end = filter.end;
	        
	        if(filter.start && filter.end){
	            return ( data <= end ) && ( data >= start );
	        }        
	        return ( data <= end ) || ( data >= start );
	    }
	})
	
	.filter('paginate', function(Paginator) {
	    return function(input, rowsPerPage) {
	        if (!input) {
	            return input;
	        }
	
	        if (rowsPerPage) {
	            Paginator.rowsPerPage = rowsPerPage;
	        }       
	        
	        Paginator.itemCount = input.length;
	
	        return input.slice(parseInt(Paginator.page * Paginator.rowsPerPage), parseInt((Paginator.page + 1) * Paginator.rowsPerPage + 1) - 1);
	    };
	})
	
	/* trim away all single and double quotes in the start and end of a string*/
	.filter('trimquotes', function() {
	    return function(input) {
	        if (!input || (typeof input !== 'string' && !(input instanceof String))) {
	            return input;
	        }
	        
	        var beingTrimmed = input;
	        var trimmingComplete = false;
	        //Trim until no more quotes can be removed.
	        while(!trimmingComplete) {
	            var beforeTrimming = beingTrimmed;
	            beingTrimmed = input.replace(/^'/,"").replace(/'$/,"");
	            beingTrimmed = beingTrimmed.replace(/^"/,"").replace(/"$/,"");
	            
	            if(beforeTrimming.length === beingTrimmed.length) {
	                trimmingComplete = true;
	            }
	        }
	        
	        
	        return beingTrimmed;
	    };
	})
	
	/* filter out confidential attributes from a list */
	.filter('nonConfidential', function() {
	  return function( items ) {
	    var filtered = [];
	    angular.forEach(items, function(item) {
	      if(!item.confidential) {
	        filtered.push(item);
	      }
	    });
	    return filtered;
	  };
	})
	
	/* trim away the qualifiers before and after a variable name */
	.filter('trimvariablequalifiers', function() {
	    return function(input) {
	        if (!input || (typeof input !== 'string' && !(input instanceof String))) {
	            return input;
	        }
	        
	        var trimmed = input.replace(/^[#VCAvca]{/,"").replace(/}$/,"");
	        
	        return trimmed;
	    };
	})
	
	.filter('forLoop', function() {
	    return function(input, start, end) {
	        input = new Array(end - start);
	        for (var i = 0; start < end; start++, i++) {
	            input[i] = start;
	        }
	        return input;
	    };
	})
	
	.filter('parseAge', function(DateUtils){
	    return function(input){        
	        if( DateUtils.isValid( input ) ){            
	            var age = DateUtils.getAge( input );
	            return '[' + age.years + 'y, ' + age.months + 'm, ' + age.days + 'd]';
	        }
	        return input;
	    };
	})
	


/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';
	
	/* Controllers */
	var d2Controllers = angular.module('d2Controllers', [])
	
	//Controller for column show/hide
	.controller('ColumnDisplayController', 
	    function($scope, 
	            $modalInstance,
	            hiddenGridColumns,
	            gridColumns,
	            gridColumnDomainKey,
	            gridColumnKey,
	            gridColumnsInUserStore,
	            GridColumnService){
	    
	    $scope.gridColumns = gridColumns;
	    $scope.hiddenGridColumns = hiddenGridColumns;
	    
	    $scope.close = function () {
	        $modalInstance.close($scope.gridColumns);
	    };
	    
	    $scope.showHideColumns = function(gridColumn){
	       
	        if(gridColumn.show){                
	            $scope.hiddenGridColumns--;            
	        }
	        else{
	            $scope.hiddenGridColumns++;            
	        }
	        
	        if(gridColumnKey) {
	            gridColumnsInUserStore[gridColumnKey] = angular.copy($scope.gridColumns);
	        }
	        GridColumnService.set(gridColumnsInUserStore, gridColumnDomainKey);
	    };    
	})
	
	//controller for dealing with google map
	.controller('MapController',
	        function($scope, 
	                $modalInstance,                
	                $translate,
	                $http,
	                $window,
	                $q,
	                CommonUtils,
	                leafletData,
	                CurrentSelection,
	                DHIS2URL,
	                NotificationService,
	                location) {
	    
	    $scope.tilesDictionary = {
	        openstreetmap: {
	            url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
	            options: {
	                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	            }
	        },
	        googlemap: {
	            layers: {
	                baselayers: {
	                    googleRoadmap: {
	                        name: 'Google Streets',
	                        layerType: 'ROADMAP',
	                        type: 'google'
	                    },
	                    googleHybrid: {
	                        name: 'Google Hybrid',
	                        layerType: 'HYBRID',
	                        type: 'google'
	                    },
	                    googleTerrain: {
	                        name: 'Google Terrain',
	                        layerType: 'TERRAIN',
	                        type: 'google'
	                    }
	                }
	            }
	        }
	    };
	    
	    $scope.tilesDictionaryKeys = ['openstreetmap', 'googlemap'];    
	    
	    $scope.selectedTileKey = 'openstreetmap';
	    
	    $scope.location = location;
	    
	    var currentLevel = 0, ouLevels = CurrentSelection.getOuLevels();
	    
	    $scope.maxZoom = 8;
	    
	    $scope.center = {lat: 8.88, lng: -11.55, zoom: $scope.maxZoom};    
	    
	    var systemSetting = CommonUtils.getSystemSetting();
	    
	    if( !systemSetting.keyGoogleMapsApiKey || systemSetting.keyGoogleMapsApiKey === '' ){
	        NotificationService.showNotifcationDialog($translate.instant("warning"), $translate.instant("missing_google_maps_api_key"));
	        systemSetting.keyGoogleMapsApiKey = 'AIzaSyBjlDmwuON9lJbPMDlh_LI3zGpGtpK9erc';
	    }
	    
	    if( !systemSetting.keyMapzenSearchApiKey || systemSetting.keyMapzenSearchApiKey === '' ){
	        NotificationService.showNotifcationDialog($translate.instant("warning"), $translate.instant("missing_mapzen_search_api_key"));
	        systemSetting.keyMapzenSearchApiKey = 'search-Se1CFzK';
	    }    
	    
	    var setCoordinateLabel = '<i class="fa fa-map-marker fa-2x"></i><span class="small-horizontal-spacing">' + $translate.instant('set_coordinate') + '</span>';
	    var zoomInLabel = '<i class="fa fa-search-plus fa-2x"></i><span class="small-horizontal-spacing">' + $translate.instant('zoom_in') + '</span>';
	    var zoomOutLabel = '<i class="fa fa-search-minus fa-2x"></i><span class="small-horizontal-spacing">' + $translate.instant('zoom_out') + '</span>';
	    var centerMapLabel = '<i class="fa fa-crosshairs fa-2x"></i><span class="small-horizontal-spacing">' + $translate.instant('center_map') + '</span>';
	    
	    var contextmenuItems = [{
	                        text: setCoordinateLabel,
	                        callback: setCoordinate,
	                        index: 0
	                    },
	                    {
	                        separator: true,
	                        index: 1
	                    },
	                    {
	                        text: zoomInLabel,
	                        callback: zoomIn,
	                        index: 2
	                    },
	                    {
	                        text: zoomOutLabel,
	                        callback: zoomOut,
	                        index: 3
	                    },
	                    {
	                        separator: true,
	                        index: 4
	                    },
	                    {
	                        text: centerMapLabel,
	                        callback: centerMap,
	                        index: 5
	                    }];
	                        
	    $scope.mapDefaults = {map: {
	                            contextmenu: true,
	                            contextmenuWidth: 180,
	                            contextmenuItems: contextmenuItems
	                        }};
	    
	    var geojsonMarkerOptions = {
				    radius: 15,
				    fillColor: '#ff7800',
				    color: '#000',
				    weight: 1,
				    opacity: 1,
				    fillOpacity: 0.8
				};
	                        
	    var style = {fillColor: "green",
	                    weight: 1,
	                    opacity: 0.8,
	                    color: 'black',
	                    fillOpacity: 0
	                };
	
	    $scope.marker = $scope.location && $scope.location.lat && $scope.location.lng ? {m1: {lat: $scope.location.lat, lng: $scope.location.lng, draggable: true}} : {};
	    
	    function pointToLayer( feature, latlng ){
	        return L.circleMarker(latlng, geojsonMarkerOptions);
	    };
	    
	    function onEachFeature(feature, layer) {
	        
	        layer.on("mouseover",function(e){            
	            $("#polygon-label").text( feature.properties.name );
	        });
	        layer.on("mouseout",function(e){
	            $("#polygon-label").text('');
	        });        
	        
	        if( layer._layers ){
	            layer.eachLayer(function (l) {
	                l.bindContextMenu({
	                    contextmenu: true,
	                    contextmenuWidth: 180,                
	                    contextmenuItems: [{
	                                    text: setCoordinateLabel,
	                                    callback: function(e){
	                                        setCoordinate(e, feature);
	                                    },
	                                    index: 0
	                                },
	                                {
	                                    separator: true,
	                                    index: 1
	                                },
	                                {
	                                    text: zoomInLabel,
	                                    callback: function(e){
	                                        zoomIn(e, feature);
	                                    },
	                                    index: 2
	                                },
	                                {
	                                    text: zoomOutLabel,
	                                    callback: function(e){
	                                        zoomOut(e, feature);
	                                    },
	                                    index: 3,
	                                    disabled: currentLevel < 1
	                                },
	                                {
	                                    separator: true,
	                                    index: 4
	                                },
	                                {
	                                    text: centerMapLabel,
	                                    callback: function(e){
	                                        centerMap(e, feature);
	                                    },
	                                    index: 5
	                                }]
	                });
	            });
	        }
	        else{
	            layer.bindContextMenu({
	                    contextmenu: true,
	                    contextmenuWidth: 180,
	                    contextmenuInheritItems: false,
	                    contextmenuItems: [{
	                                    text: setCoordinateLabel,
	                                    callback: function(e){
	                                        setCoordinate(e, feature, layer);
	                                    },
	                                    index: 0
	                                },
	                                {
	                                    separator: true,
	                                    index: 1
	                                },
	                                {
	                                    text: zoomInLabel,
	                                    callback: function(e){
	                                        zoomIn(e, feature);
	                                    },
	                                    disabled: true,
	                                    index: 2
	                                },
	                                {
	                                    text: zoomOutLabel,
	                                    callback: function(e){
	                                        zoomOut(e, feature);
	                                    },
	                                    index: 3
	                                },
	                                {
	                                    separator: true,
	                                    index: 4
	                                },
	                                {
	                                    text: centerMapLabel,
	                                    callback: function(e){
	                                        centerMap(e, feature);
	                                    },
	                                    index: 5
	                                }]
	                });
	        }        
	    }    
	            
	    function getGeoJsonByOuLevel(initialize, event, mode) {                    
	        var url = null, parent = null;
	        if (initialize) {
	            currentLevel = 0;
	            url = DHIS2URL + '/organisationUnits.geojson?level=' + ouLevels[currentLevel].level;
	        }
	        else {
	            if (mode === 'IN') {
	                currentLevel++;
	                parent = event.id;
	            }
	            if (mode === 'OUT') {
	                currentLevel--;                
	                var parents = event.properties.parentGraph.substring(1, event.properties.parentGraph.length - 1).split('/');
	                parent = parents[parents.length - 2];
	            }
	            
	            if( ouLevels[currentLevel] && ouLevels[currentLevel].level && parent && !initialize ){
	                url = url = DHIS2URL + '/organisationUnits.geojson?level=' + ouLevels[currentLevel].level + '&parent=' + parent;
	            }
	        }
	
	        if( url ){
	            
	            $http.get(url).success(function (data) {
	
	                $scope.currentGeojson = {data: data, style: style, onEachFeature: onEachFeature, pointToLayer: pointToLayer};
	                
	                leafletData.getMap().then(function( map ){
	                    var latlngs = [];
	                    angular.forEach($scope.currentGeojson.data.features, function(feature){                
	                        if( feature.geometry.type === "Point"){
	                            //latlngs.push( L.latLng( $scope.currentGeojson.data.features[0].geometry.coordinates) );
	                            //isPoints = true;
	                        }
	                        else{
	                            for (var i in feature.geometry.coordinates) {                        
	                                var coord = feature.geometry.coordinates[i];                    
	                                for (var j in coord) {
	                                    var points = coord[j];
	                                    for (var k in points) {
	                                        latlngs.push(L.GeoJSON.coordsToLatLng(points[k]));
	                                    }
	                                }
	                            }                        
	                        }
	                    });
	                    
	                    if( $scope.location && $scope.location.lat && $scope.location.lng ){
	                        map.setView([$scope.location.lat, $scope.location.lng], $scope.maxZoom);
	                    } 
	                    else{
	                        if( latlngs.length > 0 ){                            
	                            map.fitBounds(latlngs, {maxZoom: $scope.maxZoom});
	                        }
	                    }
	                });
	            });
	        }
	    }
	    
	    function zoomMap(event, mode) {
	        if(ouLevels && ouLevels.length > 0){
	            getGeoJsonByOuLevel(false, event, mode);
	        }                    
	    }
	    
	    function setCoordinate(e, feature, layer){
	        if( feature && feature.geometry && feature.geometry.type === 'Point'){
	            var m = feature.geometry.coordinates;            
	            $scope.marker = {m1: {lat: m[1], lng: m[0], draggable: true}};
	        }
	        else{
	            $scope.marker = {m1: {lat: e.latlng.lat, lng: e.latlng.lng, draggable: true}};
	        }
	        
	        $scope.location = {lat: $scope.marker.m1.lat, lng: $scope.marker.m1.lng};
	    };
	    
	    function zoomIn(e, feature){
	        $scope.maxZoom += 2; 
	        if( feature && feature.id ){            
	            zoomMap( feature, 'IN');
	        }
	        else{            
	            $scope.center = angular.copy(e.latlng);            
	            $scope.center.zoom = $scope.maxZoom;
	        }        
	    };
	    
	    function zoomOut(e, feature){
	        $scope.maxZoom -= 2;
	        if( feature && feature.id ){             
	            zoomMap( feature, 'OUT');
	        }
	        else{
	            $scope.center = angular.copy(e.latlng);            
	            $scope.center.zoom = $scope.maxZoom;
	        }
	    };
	    
	    function centerMap(e, feature){
	        $scope.maxZoom += 2;
	        $scope.center.lat = e.latlng.lat;
	        $scope.center.lng = e.latlng.lng;
	    };
	    
	    function integrateMapzen(){
	        
	        leafletData.getMap($scope.selectedTileKey).then(function( map ){
	                        
	            if( $scope.marker && $scope.marker.m1 && $scope.marker.m1.lat && $scope.marker.m1.lng ){
	                map.setView([$scope.marker.m1.lat, $scope.marker.m1.lng], $scope.maxZoom);
	            }
	            
	            $scope.geocoder = L.control.geocoder(systemSetting.keyMapzenSearchApiKey,{
	                markers: {
	                    draggable: true
	                }
	            }).addTo(map);            
	            
	            $scope.geocoder.on('select', function (e) {
	                $scope.marker = {m1: {lat: e.latlng.lat, lng: e.latlng.lng, draggable: true}};
	                $scope.location = {lat: e.latlng.lat, lng: e.latlng.lng};
	
	                $scope.geocoder.marker.on('dragend', function(e){                
	                    var c = e.target.getLatLng();
	                    $scope.marker = {m1: {lat: c.lat, lng: c.lng, draggable: true}};
	                    $scope.location = {lat: c.lat, lng: c.lng};
	                });
	            });
	        });
	    }
	    
	    function loadGoogleMapApi() {
	        
	        var deferred = $q.defer();
	        $window.initMap = function() {
	            deferred.resolve();
	        };
	        
	        var script = document.createElement('script'); 
	        script.src = 'https://maps.google.com/maps/api/js?callback=initMap&key=' + systemSetting.keyGoogleMapsApiKey;
	        document.body.appendChild(script);
	        return deferred.promise;
	    }
	    
	    getGeoJsonByOuLevel(true);
	    
	    integrateMapzen();
	            
	    $scope.setTile = function( tileKey ){        
	        if( tileKey === $scope.selectedTileKey ){
	            return;
	        }        
	        if( tileKey ){
	            if( tileKey === 'openstreetmap' ){
	                $scope.googleMapLayers = null;
	                $scope.selectedTileKey = tileKey;
	                integrateMapzen();
	            }
	            else if( tileKey === 'googlemap' ){
	                if ($window.google && $window.google.maps) {
	                    $scope.selectedTileKey = tileKey;
	                    integrateMapzen();
	                    
	                }else {
	                    loadGoogleMapApi().then(function () {
	                        $scope.selectedTileKey = tileKey;
	                        integrateMapzen();
	                    }, function () {
	                        console.log('Google map loading failed.');
	                    });
	                }
	            }            
	        }
	    };        
	    
	    $scope.close = function () {
	        $modalInstance.close();
	    };
	    
	    $scope.captureCoordinate = function(){
	        if( $scope.location && $scope.location.lng && $scope.location.lat ){
	            $modalInstance.close( $scope.location );
	    	}
	    	else{
	            //notify user
	            NotificationService.showNotifcationDialog($translate.instant("error"), $translate.instant("nothing_captured"));
	            return;
	    	}
	    };
	    
	    function setLocation( args ){
	        if( args ){
	            $scope.marker.m1.lng = args.model.lng;
	            $scope.marker.m1.lat = args.model.lat;
	
	            $scope.location = {lng: args.model.lng, lat: args.model.lat};
	        }
	    }
	    
	    $scope.$on('leafletDirectiveMarker.googlemap.dragend', function (e, args) {
	        setLocation( args );
	    });
	    
	    $scope.$on('leafletDirectiveMarker.openstreetmap.dragend', function (e, args) {
	        setLocation( args );
	    });
	})
	
	//Controller for audit history
	.controller('AuditHistoryController', 
	    function ($scope, 
	            $modalInstance,
	            $translate,
	            AuditHistoryDataService, 
	            DateUtils, 
	            eventId, 
	            dataType, 
	            nameIdMap,
	            optionSets,
	            CommonUtils) {
	
	
	    $scope.model = {type: dataType, 
	    				name: dataType === 'dataElement' ? $translate.instant('data_element') : $translate.instant('attribute'),
	    				searchPlaceholder: dataType === 'dataElement' ? $translate.instant('search_by_data_element') : $translate.instant('search_by_attribute'),
	                    auditColumns: ['name', 'auditType', 'value', 'modifiedBy', 'created'], itemList:[], uniqueRows:[]};
	
	    $scope.close = function () {
	        $modalInstance.close();
	    };
	    $scope.model.showStatus="waiting";
	    AuditHistoryDataService.getAuditHistoryData(eventId, dataType).then(function (data) {
	
	        $scope.model.itemList = [];
	        $scope.model.uniqueRows = [];
	        
	        var reponseData = data.trackedEntityDataValueAudits ? data.trackedEntityDataValueAudits :
	            data.trackedEntityAttributeValueAudits ? data.trackedEntityAttributeValueAudits : null;
	
	        if (reponseData) {
	            for (var index = 0; index < reponseData.length; index++) {                
	                var dataValue = reponseData[index];                
	                var audit = {}, obj = {};
	                if (dataType === "attribute") {
	                    if (nameIdMap[dataValue.trackedEntityAttribute.id]) {
	                        obj = nameIdMap[dataValue.trackedEntityAttribute.id];
	                        audit.name = obj.displayName;
	                        audit.valueType = obj.valueType;
	                    }
	                } else if (dataType === "dataElement") {
	                    if (nameIdMap[dataValue.dataElement.id] && nameIdMap[dataValue.dataElement.id].dataElement) {
	                        obj = nameIdMap[dataValue.dataElement.id].dataElement;
	                        audit.name = obj.displayFormName;
	                        audit.valueType = obj.valueType;
	                    }
	                }
	                
	                dataValue.value = CommonUtils.formatDataValue(null, dataValue.value, obj, optionSets, 'USER');
	                audit.auditType = dataValue.auditType;                
	                audit.value = dataValue.value;
	                audit.modifiedBy = dataValue.modifiedBy;
	                audit.created = DateUtils.formatToHrsMinsSecs(dataValue.created);                
	                
	                $scope.model.itemList.push(audit);
	                if( $scope.model.uniqueRows.indexOf(audit.name) === -1){
	                	$scope.model.uniqueRows.push(audit.name);
	                }
	                
	                if($scope.model.uniqueRows.length > 0){
	                	$scope.model.uniqueRows = $scope.model.uniqueRows.sort();
	                }
	            }
	        }
	        if ($scope.model.itemList.length === 0) {
	            $scope.model.showStatus="data_unavailable";
	        } else {
	            $scope.model.showStatus="data_available";
	        }
	    },function(){
	        $scope.model.showStatus="data_unavailable";
	    });
	})
	
	.controller('OrgUnitTreeController', function($scope, $modalInstance, OrgUnitFactory, orgUnitId, orgUnitNames) {
	    
	    $scope.model = {selectedOrgUnitId: orgUnitId ? orgUnitId : null};
	    $scope.orgUnitNames = orgUnitNames;
	
	    function expandOrgUnit( orgUnit, ou ){
	        if( ou.path.indexOf( orgUnit.path ) !== -1 ){
	            orgUnit.show = true;
	        }
	
	        orgUnit.hasChildren = orgUnit.children && orgUnit.children.length > 0 ? true : false;
	        if( orgUnit.hasChildren ){
	            for( var i=0; i< orgUnit.children.length; i++){
	                if( ou.path.indexOf( orgUnit.children[i].path ) !== -1 ){
	                    orgUnit.children[i].show = true;
	                    expandOrgUnit( orgUnit.children[i], ou );
	                }
	            }
	        }
	        return orgUnit;
	    };
	
	    function attachOrgUnit( orgUnits, orgUnit ){
	        for( var i=0; i< orgUnits.length; i++){
	            if( orgUnits[i].id === orgUnit.id ){
	                orgUnits[i] = orgUnit;
	                orgUnits[i].show = true;
	                orgUnits[i].hasChildren = orgUnits[i].children && orgUnits[i].children.length > 0 ? true : false;
	                return;
	            }
	            if( orgUnits[i].children && orgUnits[i].children.length > 0 ){
	                attachOrgUnit(orgUnits[i].children, orgUnit);
	            }
	        }
	        return orgUnits;
	    };
	
	    //Get orgunits for the logged in user
	    OrgUnitFactory.getViewTreeRoot().then(function(response) {
	        $scope.orgUnits = response.organisationUnits;
	        var selectedOuFetched = false;
	        var levelsFetched = 0;
	        angular.forEach($scope.orgUnits, function(ou){
	            ou.show = true;
	            levelsFetched = ou.level;
	            if( orgUnitId && orgUnitId === ou.id ){
	                selectedOuFetched = true;
	            }
	            angular.forEach(ou.children, function(o){
	                levelsFetched = o.level;
	                o.hasChildren = o.children && o.children.length > 0 ? true : false;
	                if( orgUnitId && !selectedOuFetched && orgUnitId === ou.id ){
	                    selectedOuFetched = true;
	                }
	            });
	        });
	
	        levelsFetched = levelsFetched > 0 ? levelsFetched - 1 : levelsFetched;
	
	        if( orgUnitId && !selectedOuFetched ){
	            var parents = null;
	            OrgUnitFactory.get( orgUnitId ).then(function( ou ){
	                if( ou && ou.path ){
	                    parents = ou.path.substring(1, ou.path.length);
	                    parents = parents.split("/");
	                    if( parents && parents.length > 0 ){
	                        var url = "fields=id,displayName,path,level,";
	                        for( var i=levelsFetched; i<ou.level; i++){
	                            url = url + "children[id,displayName,level,path,";
	                        }
	
	                        url = url.substring(0, url.length-1);
	                        for( var i=levelsFetched; i<ou.level; i++){
	                            url = url + "]";
	                        }
	
	                        OrgUnitFactory.getOrgUnits(parents[levelsFetched], url).then(function(response){
	                            if( response && response.organisationUnits && response.organisationUnits[0] ){
	                                response.organisationUnits[0].show = true;
	                                response.organisationUnits[0].hasChildren = response.organisationUnits[0].children && response.organisationUnits[0].children.length > 0 ? true : false;
	                                response.organisationUnits[0] = expandOrgUnit(response.organisationUnits[0], ou );
	                                $scope.orgUnits = attachOrgUnit( $scope.orgUnits, response.organisationUnits[0] );
	                            }
	                        });
	                    }
	                }
	            });
	        }
	    });
	
	
	    //expand/collapse of search orgunit tree
	    $scope.expandCollapse = function(orgUnit) {
	        if( orgUnit.hasChildren ){
	            //Get children for the selected orgUnit
	            OrgUnitFactory.getChildren(orgUnit.id).then(function(ou) {
	                orgUnit.show = !orgUnit.show;
	                orgUnit.hasChildren = false;
	                orgUnit.children = ou.children;
	                angular.forEach(orgUnit.children, function(ou){
	                    ou.hasChildren = ou.children && ou.children.length > 0 ? true : false;
	                });
	            });
	        }
	        else{
	            orgUnit.show = !orgUnit.show;
	        }
	    };
	
	    $scope.setSelectedOrgUnit = function( orgUnit ){
	    	$scope.model.selectedOrgUnit = {id: orgUnit.id, displayName: orgUnit.displayName};
	        $scope.model.selectedOrgUnitId = orgUnit.id;
	        $scope.orgUnitNames[orgUnit.id] = orgUnit.displayName;
	    };
	
	    $scope.select = function () {
	        $modalInstance.close( {selected: $scope.model.selectedOrgUnit, names: $scope.orgUnitNames} );
	    };
	
	    $scope.close = function(){        
	        $modalInstance.close();
	    };
	});


/***/ },
/* 8 */
/***/ function(module, exports) {

	angular.module('d2Templates', []).run(['$templateCache', function($templateCache) {$templateCache.put('./templates/age-input.html','<div ng-form="ageForm">\n    <div class="input-group" style="width: 100%;">\n        <input type="text" \n               popover="{{\'dob\'| translate}}"\n               popover-trigger="focus"\n               d2-date name="dob" \n               d2-date-validator\n               ng-model="age.dob"\n               blur-or-change="saveDOB()"\n               ng-required="d2Required"\n               ng-disabled="d2Disabled"\n               placeholder="{{\'dob\'| translate}}" \n               title="{{\'dob\'| translate}}" \n               class="form-control no-right-radius"\n               ng-class="{\'input-success\': d2AgeSaved}"/>\n        <span class="input-group-btn empty-span"></span>\n        <input type="number" \n               name="years" \n               popover="{{\'years\'| translate}}"\n               popover-trigger="focus"\n               ng-model="age.years" \n               ng-model-options="{updateOn: \'blur\'}"\n               ng-change="saveAge()"\n               ng-disabled="d2Disabled"\n               d2-number-validator\n               number-type="INTEGER_ZERO_OR_POSITIVE"\n               placeholder="{{\'years\'| translate}}"\n               title="{{\'years\'| translate}}" \n               class="form-control no-right-radius no-left-radius"\n               ng-class="{\'input-success\': d2AgeSaved}"/>\n        <span class="input-group-btn empty-span"></span>\n        <input type="number" \n               name="months" \n               popover="{{\'months\'| translate}}"\n               popover-trigger="focus"\n               ng-model="age.months" \n               ng-model-options="{updateOn: \'blur\'}"\n               ng-change="saveAge()"\n               ng-disabled="d2Disabled"\n               d2-number-validator\n               number-type="INTEGER_ZERO_OR_POSITIVE"\n               placeholder="{{\'months\'| translate}}"\n               title="{{\'months\'| translate}}" \n               class="form-control no-right-radius no-left-radius"\n               ng-class="{\'input-success\': d2AgeSaved}"/>\n        <span class="input-group-btn empty-span"></span>\n        <input type="number" \n               name="days" \n               popover="{{\'days\'| translate}}"\n               popover-trigger="focus"\n               ng-model="age.days" \n               ng-model-options="{updateOn: \'blur\'}"\n               ng-change="saveAge()"\n               ng-disabled="d2Disabled"\n               d2-number-validator\n               number-type="INTEGER_ZERO_OR_POSITIVE"\n               placeholder="{{\'days\'| translate}}"\n               title="{{\'days\'| translate}}" \n               class="form-control no-left-radius no-right-radius"\n               ng-class="{\'input-success\': d2AgeSaved}"/>\n        <span class="input-group-btn"> \n            <button class="btn btn-danger hideInPrint trim" type="button" title="{{\'remove\'| translate}}" ng-click="removeAge()" ng-disabled="!age.dob || d2Disabled"> \n                <i class="fa fa-trash-o"></i> \n            </button>\n        </span>\n    </div>\n    <div ng-messages="ageForm.years.$error" ng-if="ageInteracted(ageForm.years)" class="required" ng-messages-include="./templates/error-messages.html"></div>\n    <div ng-messages="ageForm.months.$error" ng-if="ageInteracted(ageForm.months)" class="required" ng-messages-include="./templates/error-messages.html"></div>\n    <div ng-messages="ageForm.months.$error" ng-if="ageInteracted(ageForm.days)" class="required" ng-messages-include="./templates/error-messages.html"></div>\n</div>');
	$templateCache.put('./templates/audit-history.html','<div class="modal-header">\n    <h2>{{\'audit_history\'| translate}}</h2>\n</div>\n<div class="modal-body page" ng-class="{\'waiting-box\':model.showStatus === \'waiting\'}">\n    <div ng-if="model.showStatus === \'data_available\'">\n        <span class="row">\n            <input class="form-control col-md-7" ng-model="model.searchText" placeholder="{{model.searchPlaceholder}}" type="search" />\n        </span>\n        <div class="scroll">\n            <table class="listTable dhis2-table-striped-border">\n                <thead>\n                    <tr>\n                        <th ng-repeat="col in model.auditColumns">\n                            <span ng-switch="col">\n                                <span ng-switch-when="name">\n                                    {{model.name}}\n                                </span>\n                                <span ng-switch-default>\n                                \t{{col | translate}}\n                                </span>                                    \n                            </span>\n                        </th>\n                    </tr>\n                </thead>\n                <tbody ng-repeat="row in model.uniqueRows">\n                    <tr ng-repeat="item in model.itemList | orderBy: \'created\':reverse | filter: {name: row} | filter: {name: model.searchText}" ng-init="rowIndex = $index">\n                        <td ng-repeat="col in model.auditColumns"\n                            rowspan="{{(model.itemList | filter: {name: row} | filter: model.searchText).length}}"\n                            ng-if="col === \'name\' && rowIndex === 0">\n                            {{item[col]}}\n                        </td>\n                        <td class="wrap-text" ng-repeat="col in model.auditColumns" ng-if="col !== \'name\'">\n                        \t<span ng-if="col === \'value\'">\n                        \t\t<span ng-switch="item.valueType">\n\t\t\t\t                    <span ng-switch-when="BOOLEAN">\n\t\t\t\t                        <span ng-if="item[col] === \'true\'">{{\'yes\'| translate}}</span>\n\t\t\t\t                        <span ng-if="item[col] === \'false\'">{{ \'no\' | translate}}</span>\n\t\t\t\t                    </span>\n\t\t\t\t                    <span ng-switch-when="TRUE_ONLY">\n\t\t\t\t                        <span ng-if="item[col]">\n\t\t\t\t                            <i class="fa fa-check"></i>\n\t\t\t\t                        </span>\n\t\t\t\t                    </span>\n\t\t\t\t                    <span ng-switch-default>{{item[col]}}</span>\n\t\t\t\t                </span>\n                        \t</span>\n                        \t<span ng-if="col !== \'value\'">\n                        \t\t{{item[col]}}\n                        \t</span>\n                        \t                            \n                        </td>\n                    </tr>\n                </tbody>\n            </table>\n        </div>\n    </div>\n    <div ng-if="model.showStatus === \'data_unavailable\'">\n        <div class="alert alert-warning">{{\'audit_history_unavailable\'| translate}}</div>\n    </div>\n    <div ng-if="model.showStatus === \'waiting\'">\n        <i class="fa fa-spinner fa-spin audit-spinner"></i>\n        <div class="loading-audit-data">{{\'loading-audit-data\' | translate}}</div>\n    </div>\n</div>\n<div class="modal-footer" ng-if="model.showStatus !== \'waiting\'">\n    <button type="button" class="btn btn-default" data-ng-click="close()">{{\'close\'| translate}}</button>\n</div>');
	$templateCache.put('./templates/coordinate-input.html','<div  ng-form="coordinateForm">\n    <div class="input-group">\n        <input type="number" \n               ng-model="coordinateObject.coordinate.latitude" \n               placeholder="{{\'latitude\'| translate}}"\n               ng-class="{\'input-success\': d2LatSaved}"\n               name="latitude" \n               d2-coordinate-validator\n               ng-required="d2Required"\n               ng-disabled="d2Disabled"\n               ng-blur="saveD2Coordinate()"\n               class="form-control no-right-radius"/>\n        <span class="input-group-btn empty-span"></span>\n        <input type="number" \n               ng-model="coordinateObject.coordinate.longitude" \n               placeholder="{{\'longitude\'| translate}}"\n               ng-class="{\'input-success\': d2LngSaved}"\n               name="longitude" \n               d2-coordinate-validator\n               ng-required="d2Required"\n               ng-disabled="d2Disabled"\n               ng-blur="saveD2Coordinate()"\n               class="form-control no-left-radius no-right-radius"/>\n        <span class="input-group-btn hideInPrint">\n            <button class="btn btn-grp trim hideInPrint" \n                    type="button"\n                    ng-disabled="{{d2Disabled}}"\n                    title="{{\'get_from_map\'| translate}}"\n                    ng-click="showMap(coordinateObject)"> \n                <i class="fa fa-map-marker"></i>                             \n            </button>\n        </span>    \n    </div>\n    <div ng-messages="coordinateForm.latitude.$error" ng-if="coordinateInteracted(coordinateForm.latitude)" class="required" ng-messages-include="./templates/error-messages.html"></div>\n    <div ng-messages="coordinateForm.longitude.$error" ng-if="coordinateInteracted(coordinateForm.longitude)" class="required" ng-messages-include="./templates/error-messages.html"></div>\n</div>');
	$templateCache.put('./templates/custom-dataentry-form.html','<d2-custom-data-entry-form custom-data-entry-form="customDataEntryForm"></d2-custom-data-entry-form>');
	$templateCache.put('./templates/custom-registration-form.html','<d2-custom-registration-form custom-registration-form="customRegistrationForm"></d2-custom-registration-form>');
	$templateCache.put('./templates/error-messages.html','<span ng-message="required">{{\'required\' | translate}}</span>\n<span ng-message="number">{{\'value_must_be_number\' | translate}}</span>\n<span ng-message="percentValue">{{\'value_must_be_valid_percentValue\' | translate}}</span>\n<span ng-message="posInt">{{\'value_must_be_posInt\' | translate}}</span>\n<span ng-message="negInt">{{\'value_must_be_negInt\' | translate}}</span>\n<span ng-message="zeroPositiveInt">{{\'value_must_be_zeroPositiveInt\' | translate}}</span>\n<span ng-message="integer">{{\'value_must_be_int\' | translate}}</span>\n<span ng-message="dateValidator">{{\'date_required\' | translate}} ({{dhis2CalendarFormat.keyDateFormat}})</span>\n<span ng-message="futureDateValidator">{{\'future_date_not_allowed\' | translate}}</span>\n<span ng-message="optionValidator">{{\'option_required\' | translate}}</span>\n<span ng-message="latitudeValidator">{{\'latitude_required\' | translate}}</span>\n<span ng-message="longitudeValidator">{{\'longitude_required\' | translate}}</span>\n<span ng-message="customCoordinateValidator">{{\'latitude_longitude_required\' | translate}}</span>\n<span ng-message="uniqunessValidator">{{\'value_not_unique\' | translate}}</span>\n<span ng-message="email">{{\'value_must_be_email\' | translate}}</span>\n');
	$templateCache.put('./templates/map.html','<div class="modal-header">\n    <h2>\n        {{\'point_and_click_for_coordinate\'| translate}}        \n    </h2>\n    <div class="align-center">\n        <span id=\'polygon-label\'></span>\n    </div>\n</div>\n<div class="modal-body map-area">\n    <span ng-switch="selectedTileKey">        \n        <span ng-switch-when="openstreetmap">\n            <leaflet id="openstreetmap" lf-center="center" geojson="currentGeojson" defaults="mapDefaults" markers="marker" tiles="tilesDictionary[selectedTileKey]"></leaflet>\n        </span>\n        <span ng-switch-when="googlemap">\n            <leaflet id="googlemap" lf-center="center" geojson="currentGeojson" defaults="mapDefaults" markers="marker" layers="tilesDictionary[selectedTileKey].layers"></leaflet>\n        </span>\n    </span>\n</div>\n<div class="modal-footer">\n    \n    <div class="pull-left">\n        <ul class="nav nav-pills">\n            <li ng-class="{true: \'active\'} [selectedTileKey === key]" ng-repeat="key in tilesDictionaryKeys">\n                <a href ng-click="setTile(key)">{{key | translate}}</a>\n            </li>\n        </ul>\n    </div>\n    \n    <button class="btn btn-primary" data-ng-click="captureCoordinate()">{{\'capture\'| translate}}</button>\n    <button class="btn btn-default" data-ng-click="close()">{{\'cancel\'| translate}}</button>        \n</div>');
	$templateCache.put('./templates/orgunit-input.html','<div class="input-group">    \n    <input type="text" name="foo" ng-disabled="true" class="form-control" placeholder="{{\'please_select\' | translate}}" ng-model="d2OrgunitNames[d2Object[id]]" ng-disabled="{{d2Disabled}}" ng-required="{{d2Required}}"> \n    <span class="input-group-btn"> \n        <button class="btn btn-danger hideInPrint trim" type="button" title="{{\'remove\' | translate}}" ng-disabled="d2Disabled" ng-click="removeSelectedOrgUnit(id)" ng-if="d2Object[id]"> \n            <i class="fa fa-trash-o"></i> \n        </button> \n        <button class="btn btn-default hideInPrint trim" type="button" title="{{\'get_from_tree\' | translate}}" ng-disabled="d2Disabled" ng-click="showOrgUnitTree(id)"> \n            <i class="fa fa-plus-square-o"></i> \n        </button> \n    </span> \n</div>');
	$templateCache.put('./templates/orgunit-tree.html','<div class="modal-header page">\n    <h3>{{\'org_unit\'| translate}}</h3>\n</div>\n<div class="modal-body page">\n    <div class="org-unit-tree" data-stop-propagation="true">\n        <script type="text/ng-template" id="orgUnitTree.html">\n            <span class="org-unit-tree-button" ng-click="expandCollapse(orgUnit)" ng-show="orgUnit.show && orgUnit.children.length > 0"><i class="fa fa-minus-square-o"></i></span>\n            <span class="org-unit-tree-button" ng-click="expandCollapse(orgUnit)" ng-show="(!orgUnit.show && orgUnit.children.length > 0) || (!orgUnit.show && orgUnit.hasChildren)"><i class="fa fa-plus-square-o"></i></span>\n            <span class="org-unit-tree-button" ng-click="setSelectedOrgUnit(orgUnit)" ng-class="{\'selected-org-unit\' : orgUnit.id === model.selectedOrgUnitId}">{{orgUnit.displayName}}</span>\n            <ul class="tree" id="tree" ng-show="orgUnit.show">\n                <li ng-repeat="orgUnit in orgUnit.children | orderBy:\'displayName\'" ng-include="\'orgUnitTree.html\'"></li>\n            </ul>\n        </script>\n        <ul class="tree" id="tree">\n            <li ng-repeat="orgUnit in orgUnits | orderBy:\'displayName\'" ng-include="\'orgUnitTree.html\'"></li>\n        </ul>\n    </div>\n</div>\n<div class="modal-footer page">\n    <button class="btn btn-primary" data-ng-click="select()">{{\'select\'| translate}}</button>\n    <button class="btn btn-default" data-ng-click="close()">{{\'close\'| translate}}</button>\n</div>');
	$templateCache.put('./templates/radio-button.html','<!--\nCopyright (c) 2015, UiO\nAll rights reserved.\n\nRedistribution and use in source and binary forms, with or without\nmodification, are permitted provided that the following conditions are met:\n\n* Redistributions of source code must retain the above copyright notice, this\n  list of conditions and the following disclaimer.\n* Redistributions in binary form must reproduce the above copyright notice,\n  this list of conditions and the following disclaimer in the documentation\n  and/or other materials provided with the distribution.\n\nTHIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"\nAND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE\nIMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE\nARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE\nLIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR\nCONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF\nSUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS\nINTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN\nCONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)\nARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE\nPOSSIBILITY OF SUCH DAMAGE.\n-->\n \n\n<div tabindex="0" ng-if="!disabled" class="custom-radio-group custom-radio-container">\n    <span ng-click="valueClicked(\'true\')" class="cursor-pointer">\n        <span class="fa-stack">                                                                                                        \n            <span class=\'fa fa-stack-1x fa-circle radio-default fa-stack-custom-large\' ng-class=\'radioButtonColor("true")\'></span>        \n            <span class="fa fa-stack-1x fa-circle-thin fa-stack-custom-large"></span>\n            <span class="fa-stack-custom-small" ng-class="radioButtonImage(\'true\')"></span>\n        </span>\n        <span class="custom-radio-text">\n            {{\'Yes\' | translate }}\n        </span>\n    </span>\n    &nbsp;&nbsp;    \n    <span ng-click="valueClicked(\'false\')" class="cursor-pointer">\n        <span class="fa-stack">                                                                                                        \n            <span class=\'fa fa-stack-1x fa-circle fa-stack-custom-large\' ng-class=\'radioButtonColor("false")\'></span>                                                    \n            <span class="fa fa-stack-1x fa-circle-thin fa-stack-custom-large"></span>\n            <span class="fa-stack-custom-small" ng-class="radioButtonImage(\'false\')"></span>\n        </span>\n        <span class="custom-radio-text">\n            {{\'No\' | translate }}\n        </span>        \n    </span>\n    <div ng-if="status === \'error\'" class="custom-radio-error input-error"><span>{{\'save failed\' | translate}}</span></div>\n    \n    \n    <div ng-show="false">\n        <label class="radio-inline">                                                    \n            <input class="radio-display-none" ng-required="required" style=\'margin-top: 1px\' type="radio" ng-model="value" ng-disabled="disabled" name="{{name}}" value="true">                                                    \n        </label>                                                \n        <label class="radio-inline">\n            <input class="radio-display-none" ng-required="required" style=\'margin-top: 1px\' type="radio" ng-model="value" ng-disabled="disabled" name="{{name}}" value="false">\n        </label>\n    </div>\n</div>\n<div ng-if="disabled" class="custom-radio-container">\n    <span class="fa-icon-width" ng-class="getDisabledIcon(value)"></span>\n    <span>{{getDisabledValue(value) | translate}}</span>         \n</div>');
	$templateCache.put('./templates/radio-input.html','<span ng-repeat="option in d2Options" \n      class="col-sm-12 form-control cursor-pointer" \n      ng-disabled="d2Disabled"\n      ng-class="{\'input-success\': d2ValueSaved && model.radio === option.displayName}"\n      ng-click="saveValue(option.displayName)">\n    <span class="fa fa-circle-thin fa-stack-custom-large" ng-if="option.displayName !== model.radio"></span> \n    <span class="fa fa-dot-circle-o fa-stack-custom-large" ng-if="option.displayName === model.radio"></span> \n    {{option.displayName}}\n</span>\n\n\n<span ng-show="false">\n    <label ng-repeat="option in d2Options" class="radio-display-none">\n    <input type="radio" \n           name="{{name}}"\n           ng-required="d2Required"\n           ng-disabled="d2Disabled"\n           ng-model="model.radio"\n           value="{{option.displayName}}"> {{option.displayName}}\n    </label>    \n</span>');
	$templateCache.put('./templates/serverside-pagination.html','<div class="paging-container">\n    <table style="background-color: #ebf0f6;" width=\'100%\'>\n        <tr>\n            <td>\n                {{\'total_number_of_pages\'| translate}}: {{pager.pageCount}}\n            </td>\n            <td>\n                <span>{{\'rows_per_page\'| translate}}:</span> <input type="text" min="1" style="width:50px;" ng-model="pager.pageSize" d2-enter="resetPageSize()" ng-blur="resetPageSize()"> \n            </td>\n            <td>\n                <span>{{\'jump_to_page\'| translate}}:</span> <input type="text" min="1" style="width:50px;" ng-model="pager.page" d2-enter="jumpToPage()" ng-blur="jumpToPage()"> \n            </td>\n        </tr>\n        <tr>\n            <td colspan="3"><hr/></td>\n        </tr>\n        <tr>\n            <td colspan="3">\n                <div class="paging">\n                    <span ng-show="pager.page > 1">\n                        <a href ng-click="getPage(1)" title="{{\'first\'| translate}}"> \n                            &laquo;&laquo;\n                        </a>\n                        <a href ng-click="getPage(pager.page - 1)" title="{{\'previous\'| translate}}"> \n                            &laquo;\n                        </a>                    \n                    </span>\n                    <span ng-hide="pager.page > 1">\n                        <span title="{{\'first\'| translate}}">&laquo;&laquo;</span>\n                        <span title="{{\'previous\'| translate}}">&laquo;</span>\n                    </span>\n                    <a href ng-click="getPage(i+1)" title="{{\'page\'| translate}} {{i + 1}}" ng-repeat="i in []| forLoop:paginator.lowerLimit():pager.pageCount | limitTo : pager.toolBarDisplay" ng-class="pager.page == i + 1 && \'active\'">\n                        {{i + 1}}\n                    </a>\n\n                    <span ng-show="pager.page < pager.pageCount">\n                        <a href ng-click="getPage(pager.page + 1)" title="{{\'next\'| translate}}" > \n                            &raquo;\n                        </a>\n                        <a href ng-click="getPage(pager.pageCount)" title="{{\'last\'| translate}}"> \n                            &raquo;&raquo;\n                        </a>\n                    </span>\n                    <span ng-hide="pager.page < pager.pageCount">\n                        <span class="next" title="{{\'next\'| translate}}">&raquo; </span>\n                        <span class="last" title="{{\'last\'| translate}}">&raquo;&raquo;</span>\n                    </span>\n                </div>\n            </td>\n        </tr>\n    </table>   \n</div>');}]);

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
	 Leaflet, a JavaScript library for mobile-friendly interactive maps. http://leafletjs.com
	 (c) 2010-2013, Vladimir Agafonkin
	 (c) 2010-2011, CloudMade
	*/
	(function (window, document, undefined) {
	var oldL = window.L,
	    L = {};
	
	L.version = '0.7.7';
	
	// define Leaflet for Node module pattern loaders, including Browserify
	if (typeof module === 'object' && typeof module.exports === 'object') {
		module.exports = L;
	
	// define Leaflet as an AMD module
	} else if (true) {
		!(__WEBPACK_AMD_DEFINE_FACTORY__ = (L), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}
	
	// define Leaflet as a global L variable, saving the original L to restore later if needed
	
	L.noConflict = function () {
		window.L = oldL;
		return this;
	};
	
	window.L = L;
	
	
	/*
	 * L.Util contains various utility functions used throughout Leaflet code.
	 */
	
	L.Util = {
		extend: function (dest) { // (Object[, Object, ...]) ->
			var sources = Array.prototype.slice.call(arguments, 1),
			    i, j, len, src;
	
			for (j = 0, len = sources.length; j < len; j++) {
				src = sources[j] || {};
				for (i in src) {
					if (src.hasOwnProperty(i)) {
						dest[i] = src[i];
					}
				}
			}
			return dest;
		},
	
		bind: function (fn, obj) { // (Function, Object) -> Function
			var args = arguments.length > 2 ? Array.prototype.slice.call(arguments, 2) : null;
			return function () {
				return fn.apply(obj, args || arguments);
			};
		},
	
		stamp: (function () {
			var lastId = 0,
			    key = '_leaflet_id';
			return function (obj) {
				obj[key] = obj[key] || ++lastId;
				return obj[key];
			};
		}()),
	
		invokeEach: function (obj, method, context) {
			var i, args;
	
			if (typeof obj === 'object') {
				args = Array.prototype.slice.call(arguments, 3);
	
				for (i in obj) {
					method.apply(context, [i, obj[i]].concat(args));
				}
				return true;
			}
	
			return false;
		},
	
		limitExecByInterval: function (fn, time, context) {
			var lock, execOnUnlock;
	
			return function wrapperFn() {
				var args = arguments;
	
				if (lock) {
					execOnUnlock = true;
					return;
				}
	
				lock = true;
	
				setTimeout(function () {
					lock = false;
	
					if (execOnUnlock) {
						wrapperFn.apply(context, args);
						execOnUnlock = false;
					}
				}, time);
	
				fn.apply(context, args);
			};
		},
	
		falseFn: function () {
			return false;
		},
	
		formatNum: function (num, digits) {
			var pow = Math.pow(10, digits || 5);
			return Math.round(num * pow) / pow;
		},
	
		trim: function (str) {
			return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
		},
	
		splitWords: function (str) {
			return L.Util.trim(str).split(/\s+/);
		},
	
		setOptions: function (obj, options) {
			obj.options = L.extend({}, obj.options, options);
			return obj.options;
		},
	
		getParamString: function (obj, existingUrl, uppercase) {
			var params = [];
			for (var i in obj) {
				params.push(encodeURIComponent(uppercase ? i.toUpperCase() : i) + '=' + encodeURIComponent(obj[i]));
			}
			return ((!existingUrl || existingUrl.indexOf('?') === -1) ? '?' : '&') + params.join('&');
		},
		template: function (str, data) {
			return str.replace(/\{ *([\w_]+) *\}/g, function (str, key) {
				var value = data[key];
				if (value === undefined) {
					throw new Error('No value provided for variable ' + str);
				} else if (typeof value === 'function') {
					value = value(data);
				}
				return value;
			});
		},
	
		isArray: Array.isArray || function (obj) {
			return (Object.prototype.toString.call(obj) === '[object Array]');
		},
	
		emptyImageUrl: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='
	};
	
	(function () {
	
		// inspired by http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	
		function getPrefixed(name) {
			var i, fn,
			    prefixes = ['webkit', 'moz', 'o', 'ms'];
	
			for (i = 0; i < prefixes.length && !fn; i++) {
				fn = window[prefixes[i] + name];
			}
	
			return fn;
		}
	
		var lastTime = 0;
	
		function timeoutDefer(fn) {
			var time = +new Date(),
			    timeToCall = Math.max(0, 16 - (time - lastTime));
	
			lastTime = time + timeToCall;
			return window.setTimeout(fn, timeToCall);
		}
	
		var requestFn = window.requestAnimationFrame ||
		        getPrefixed('RequestAnimationFrame') || timeoutDefer;
	
		var cancelFn = window.cancelAnimationFrame ||
		        getPrefixed('CancelAnimationFrame') ||
		        getPrefixed('CancelRequestAnimationFrame') ||
		        function (id) { window.clearTimeout(id); };
	
	
		L.Util.requestAnimFrame = function (fn, context, immediate, element) {
			fn = L.bind(fn, context);
	
			if (immediate && requestFn === timeoutDefer) {
				fn();
			} else {
				return requestFn.call(window, fn, element);
			}
		};
	
		L.Util.cancelAnimFrame = function (id) {
			if (id) {
				cancelFn.call(window, id);
			}
		};
	
	}());
	
	// shortcuts for most used utility functions
	L.extend = L.Util.extend;
	L.bind = L.Util.bind;
	L.stamp = L.Util.stamp;
	L.setOptions = L.Util.setOptions;
	
	
	/*
	 * L.Class powers the OOP facilities of the library.
	 * Thanks to John Resig and Dean Edwards for inspiration!
	 */
	
	L.Class = function () {};
	
	L.Class.extend = function (props) {
	
		// extended class with the new prototype
		var NewClass = function () {
	
			// call the constructor
			if (this.initialize) {
				this.initialize.apply(this, arguments);
			}
	
			// call all constructor hooks
			if (this._initHooks) {
				this.callInitHooks();
			}
		};
	
		// instantiate class without calling constructor
		var F = function () {};
		F.prototype = this.prototype;
	
		var proto = new F();
		proto.constructor = NewClass;
	
		NewClass.prototype = proto;
	
		//inherit parent's statics
		for (var i in this) {
			if (this.hasOwnProperty(i) && i !== 'prototype') {
				NewClass[i] = this[i];
			}
		}
	
		// mix static properties into the class
		if (props.statics) {
			L.extend(NewClass, props.statics);
			delete props.statics;
		}
	
		// mix includes into the prototype
		if (props.includes) {
			L.Util.extend.apply(null, [proto].concat(props.includes));
			delete props.includes;
		}
	
		// merge options
		if (props.options && proto.options) {
			props.options = L.extend({}, proto.options, props.options);
		}
	
		// mix given properties into the prototype
		L.extend(proto, props);
	
		proto._initHooks = [];
	
		var parent = this;
		// jshint camelcase: false
		NewClass.__super__ = parent.prototype;
	
		// add method for calling all hooks
		proto.callInitHooks = function () {
	
			if (this._initHooksCalled) { return; }
	
			if (parent.prototype.callInitHooks) {
				parent.prototype.callInitHooks.call(this);
			}
	
			this._initHooksCalled = true;
	
			for (var i = 0, len = proto._initHooks.length; i < len; i++) {
				proto._initHooks[i].call(this);
			}
		};
	
		return NewClass;
	};
	
	
	// method for adding properties to prototype
	L.Class.include = function (props) {
		L.extend(this.prototype, props);
	};
	
	// merge new default options to the Class
	L.Class.mergeOptions = function (options) {
		L.extend(this.prototype.options, options);
	};
	
	// add a constructor hook
	L.Class.addInitHook = function (fn) { // (Function) || (String, args...)
		var args = Array.prototype.slice.call(arguments, 1);
	
		var init = typeof fn === 'function' ? fn : function () {
			this[fn].apply(this, args);
		};
	
		this.prototype._initHooks = this.prototype._initHooks || [];
		this.prototype._initHooks.push(init);
	};
	
	
	/*
	 * L.Mixin.Events is used to add custom events functionality to Leaflet classes.
	 */
	
	var eventsKey = '_leaflet_events';
	
	L.Mixin = {};
	
	L.Mixin.Events = {
	
		addEventListener: function (types, fn, context) { // (String, Function[, Object]) or (Object[, Object])
	
			// types can be a map of types/handlers
			if (L.Util.invokeEach(types, this.addEventListener, this, fn, context)) { return this; }
	
			var events = this[eventsKey] = this[eventsKey] || {},
			    contextId = context && context !== this && L.stamp(context),
			    i, len, event, type, indexKey, indexLenKey, typeIndex;
	
			// types can be a string of space-separated words
			types = L.Util.splitWords(types);
	
			for (i = 0, len = types.length; i < len; i++) {
				event = {
					action: fn,
					context: context || this
				};
				type = types[i];
	
				if (contextId) {
					// store listeners of a particular context in a separate hash (if it has an id)
					// gives a major performance boost when removing thousands of map layers
	
					indexKey = type + '_idx';
					indexLenKey = indexKey + '_len';
	
					typeIndex = events[indexKey] = events[indexKey] || {};
	
					if (!typeIndex[contextId]) {
						typeIndex[contextId] = [];
	
						// keep track of the number of keys in the index to quickly check if it's empty
						events[indexLenKey] = (events[indexLenKey] || 0) + 1;
					}
	
					typeIndex[contextId].push(event);
	
	
				} else {
					events[type] = events[type] || [];
					events[type].push(event);
				}
			}
	
			return this;
		},
	
		hasEventListeners: function (type) { // (String) -> Boolean
			var events = this[eventsKey];
			return !!events && ((type in events && events[type].length > 0) ||
			                    (type + '_idx' in events && events[type + '_idx_len'] > 0));
		},
	
		removeEventListener: function (types, fn, context) { // ([String, Function, Object]) or (Object[, Object])
	
			if (!this[eventsKey]) {
				return this;
			}
	
			if (!types) {
				return this.clearAllEventListeners();
			}
	
			if (L.Util.invokeEach(types, this.removeEventListener, this, fn, context)) { return this; }
	
			var events = this[eventsKey],
			    contextId = context && context !== this && L.stamp(context),
			    i, len, type, listeners, j, indexKey, indexLenKey, typeIndex, removed;
	
			types = L.Util.splitWords(types);
	
			for (i = 0, len = types.length; i < len; i++) {
				type = types[i];
				indexKey = type + '_idx';
				indexLenKey = indexKey + '_len';
	
				typeIndex = events[indexKey];
	
				if (!fn) {
					// clear all listeners for a type if function isn't specified
					delete events[type];
					delete events[indexKey];
					delete events[indexLenKey];
	
				} else {
					listeners = contextId && typeIndex ? typeIndex[contextId] : events[type];
	
					if (listeners) {
						for (j = listeners.length - 1; j >= 0; j--) {
							if ((listeners[j].action === fn) && (!context || (listeners[j].context === context))) {
								removed = listeners.splice(j, 1);
								// set the old action to a no-op, because it is possible
								// that the listener is being iterated over as part of a dispatch
								removed[0].action = L.Util.falseFn;
							}
						}
	
						if (context && typeIndex && (listeners.length === 0)) {
							delete typeIndex[contextId];
							events[indexLenKey]--;
						}
					}
				}
			}
	
			return this;
		},
	
		clearAllEventListeners: function () {
			delete this[eventsKey];
			return this;
		},
	
		fireEvent: function (type, data) { // (String[, Object])
			if (!this.hasEventListeners(type)) {
				return this;
			}
	
			var event = L.Util.extend({}, data, { type: type, target: this });
	
			var events = this[eventsKey],
			    listeners, i, len, typeIndex, contextId;
	
			if (events[type]) {
				// make sure adding/removing listeners inside other listeners won't cause infinite loop
				listeners = events[type].slice();
	
				for (i = 0, len = listeners.length; i < len; i++) {
					listeners[i].action.call(listeners[i].context, event);
				}
			}
	
			// fire event for the context-indexed listeners as well
			typeIndex = events[type + '_idx'];
	
			for (contextId in typeIndex) {
				listeners = typeIndex[contextId].slice();
	
				if (listeners) {
					for (i = 0, len = listeners.length; i < len; i++) {
						listeners[i].action.call(listeners[i].context, event);
					}
				}
			}
	
			return this;
		},
	
		addOneTimeEventListener: function (types, fn, context) {
	
			if (L.Util.invokeEach(types, this.addOneTimeEventListener, this, fn, context)) { return this; }
	
			var handler = L.bind(function () {
				this
				    .removeEventListener(types, fn, context)
				    .removeEventListener(types, handler, context);
			}, this);
	
			return this
			    .addEventListener(types, fn, context)
			    .addEventListener(types, handler, context);
		}
	};
	
	L.Mixin.Events.on = L.Mixin.Events.addEventListener;
	L.Mixin.Events.off = L.Mixin.Events.removeEventListener;
	L.Mixin.Events.once = L.Mixin.Events.addOneTimeEventListener;
	L.Mixin.Events.fire = L.Mixin.Events.fireEvent;
	
	
	/*
	 * L.Browser handles different browser and feature detections for internal Leaflet use.
	 */
	
	(function () {
	
		var ie = 'ActiveXObject' in window,
			ielt9 = ie && !document.addEventListener,
	
		    // terrible browser detection to work around Safari / iOS / Android browser bugs
		    ua = navigator.userAgent.toLowerCase(),
		    webkit = ua.indexOf('webkit') !== -1,
		    chrome = ua.indexOf('chrome') !== -1,
		    phantomjs = ua.indexOf('phantom') !== -1,
		    android = ua.indexOf('android') !== -1,
		    android23 = ua.search('android [23]') !== -1,
			gecko = ua.indexOf('gecko') !== -1,
	
		    mobile = typeof orientation !== undefined + '',
		    msPointer = !window.PointerEvent && window.MSPointerEvent,
			pointer = (window.PointerEvent && window.navigator.pointerEnabled) ||
					  msPointer,
		    retina = ('devicePixelRatio' in window && window.devicePixelRatio > 1) ||
		             ('matchMedia' in window && window.matchMedia('(min-resolution:144dpi)') &&
		              window.matchMedia('(min-resolution:144dpi)').matches),
	
		    doc = document.documentElement,
		    ie3d = ie && ('transition' in doc.style),
		    webkit3d = ('WebKitCSSMatrix' in window) && ('m11' in new window.WebKitCSSMatrix()) && !android23,
		    gecko3d = 'MozPerspective' in doc.style,
		    opera3d = 'OTransition' in doc.style,
		    any3d = !window.L_DISABLE_3D && (ie3d || webkit3d || gecko3d || opera3d) && !phantomjs;
	
		var touch = !window.L_NO_TOUCH && !phantomjs && (pointer || 'ontouchstart' in window ||
			(window.DocumentTouch && document instanceof window.DocumentTouch));
	
		L.Browser = {
			ie: ie,
			ielt9: ielt9,
			webkit: webkit,
			gecko: gecko && !webkit && !window.opera && !ie,
	
			android: android,
			android23: android23,
	
			chrome: chrome,
	
			ie3d: ie3d,
			webkit3d: webkit3d,
			gecko3d: gecko3d,
			opera3d: opera3d,
			any3d: any3d,
	
			mobile: mobile,
			mobileWebkit: mobile && webkit,
			mobileWebkit3d: mobile && webkit3d,
			mobileOpera: mobile && window.opera,
	
			touch: touch,
			msPointer: msPointer,
			pointer: pointer,
	
			retina: retina
		};
	
	}());
	
	
	/*
	 * L.Point represents a point with x and y coordinates.
	 */
	
	L.Point = function (/*Number*/ x, /*Number*/ y, /*Boolean*/ round) {
		this.x = (round ? Math.round(x) : x);
		this.y = (round ? Math.round(y) : y);
	};
	
	L.Point.prototype = {
	
		clone: function () {
			return new L.Point(this.x, this.y);
		},
	
		// non-destructive, returns a new point
		add: function (point) {
			return this.clone()._add(L.point(point));
		},
	
		// destructive, used directly for performance in situations where it's safe to modify existing point
		_add: function (point) {
			this.x += point.x;
			this.y += point.y;
			return this;
		},
	
		subtract: function (point) {
			return this.clone()._subtract(L.point(point));
		},
	
		_subtract: function (point) {
			this.x -= point.x;
			this.y -= point.y;
			return this;
		},
	
		divideBy: function (num) {
			return this.clone()._divideBy(num);
		},
	
		_divideBy: function (num) {
			this.x /= num;
			this.y /= num;
			return this;
		},
	
		multiplyBy: function (num) {
			return this.clone()._multiplyBy(num);
		},
	
		_multiplyBy: function (num) {
			this.x *= num;
			this.y *= num;
			return this;
		},
	
		round: function () {
			return this.clone()._round();
		},
	
		_round: function () {
			this.x = Math.round(this.x);
			this.y = Math.round(this.y);
			return this;
		},
	
		floor: function () {
			return this.clone()._floor();
		},
	
		_floor: function () {
			this.x = Math.floor(this.x);
			this.y = Math.floor(this.y);
			return this;
		},
	
		distanceTo: function (point) {
			point = L.point(point);
	
			var x = point.x - this.x,
			    y = point.y - this.y;
	
			return Math.sqrt(x * x + y * y);
		},
	
		equals: function (point) {
			point = L.point(point);
	
			return point.x === this.x &&
			       point.y === this.y;
		},
	
		contains: function (point) {
			point = L.point(point);
	
			return Math.abs(point.x) <= Math.abs(this.x) &&
			       Math.abs(point.y) <= Math.abs(this.y);
		},
	
		toString: function () {
			return 'Point(' +
			        L.Util.formatNum(this.x) + ', ' +
			        L.Util.formatNum(this.y) + ')';
		}
	};
	
	L.point = function (x, y, round) {
		if (x instanceof L.Point) {
			return x;
		}
		if (L.Util.isArray(x)) {
			return new L.Point(x[0], x[1]);
		}
		if (x === undefined || x === null) {
			return x;
		}
		return new L.Point(x, y, round);
	};
	
	
	/*
	 * L.Bounds represents a rectangular area on the screen in pixel coordinates.
	 */
	
	L.Bounds = function (a, b) { //(Point, Point) or Point[]
		if (!a) { return; }
	
		var points = b ? [a, b] : a;
	
		for (var i = 0, len = points.length; i < len; i++) {
			this.extend(points[i]);
		}
	};
	
	L.Bounds.prototype = {
		// extend the bounds to contain the given point
		extend: function (point) { // (Point)
			point = L.point(point);
	
			if (!this.min && !this.max) {
				this.min = point.clone();
				this.max = point.clone();
			} else {
				this.min.x = Math.min(point.x, this.min.x);
				this.max.x = Math.max(point.x, this.max.x);
				this.min.y = Math.min(point.y, this.min.y);
				this.max.y = Math.max(point.y, this.max.y);
			}
			return this;
		},
	
		getCenter: function (round) { // (Boolean) -> Point
			return new L.Point(
			        (this.min.x + this.max.x) / 2,
			        (this.min.y + this.max.y) / 2, round);
		},
	
		getBottomLeft: function () { // -> Point
			return new L.Point(this.min.x, this.max.y);
		},
	
		getTopRight: function () { // -> Point
			return new L.Point(this.max.x, this.min.y);
		},
	
		getSize: function () {
			return this.max.subtract(this.min);
		},
	
		contains: function (obj) { // (Bounds) or (Point) -> Boolean
			var min, max;
	
			if (typeof obj[0] === 'number' || obj instanceof L.Point) {
				obj = L.point(obj);
			} else {
				obj = L.bounds(obj);
			}
	
			if (obj instanceof L.Bounds) {
				min = obj.min;
				max = obj.max;
			} else {
				min = max = obj;
			}
	
			return (min.x >= this.min.x) &&
			       (max.x <= this.max.x) &&
			       (min.y >= this.min.y) &&
			       (max.y <= this.max.y);
		},
	
		intersects: function (bounds) { // (Bounds) -> Boolean
			bounds = L.bounds(bounds);
	
			var min = this.min,
			    max = this.max,
			    min2 = bounds.min,
			    max2 = bounds.max,
			    xIntersects = (max2.x >= min.x) && (min2.x <= max.x),
			    yIntersects = (max2.y >= min.y) && (min2.y <= max.y);
	
			return xIntersects && yIntersects;
		},
	
		isValid: function () {
			return !!(this.min && this.max);
		}
	};
	
	L.bounds = function (a, b) { // (Bounds) or (Point, Point) or (Point[])
		if (!a || a instanceof L.Bounds) {
			return a;
		}
		return new L.Bounds(a, b);
	};
	
	
	/*
	 * L.Transformation is an utility class to perform simple point transformations through a 2d-matrix.
	 */
	
	L.Transformation = function (a, b, c, d) {
		this._a = a;
		this._b = b;
		this._c = c;
		this._d = d;
	};
	
	L.Transformation.prototype = {
		transform: function (point, scale) { // (Point, Number) -> Point
			return this._transform(point.clone(), scale);
		},
	
		// destructive transform (faster)
		_transform: function (point, scale) {
			scale = scale || 1;
			point.x = scale * (this._a * point.x + this._b);
			point.y = scale * (this._c * point.y + this._d);
			return point;
		},
	
		untransform: function (point, scale) {
			scale = scale || 1;
			return new L.Point(
			        (point.x / scale - this._b) / this._a,
			        (point.y / scale - this._d) / this._c);
		}
	};
	
	
	/*
	 * L.DomUtil contains various utility functions for working with DOM.
	 */
	
	L.DomUtil = {
		get: function (id) {
			return (typeof id === 'string' ? document.getElementById(id) : id);
		},
	
		getStyle: function (el, style) {
	
			var value = el.style[style];
	
			if (!value && el.currentStyle) {
				value = el.currentStyle[style];
			}
	
			if ((!value || value === 'auto') && document.defaultView) {
				var css = document.defaultView.getComputedStyle(el, null);
				value = css ? css[style] : null;
			}
	
			return value === 'auto' ? null : value;
		},
	
		getViewportOffset: function (element) {
	
			var top = 0,
			    left = 0,
			    el = element,
			    docBody = document.body,
			    docEl = document.documentElement,
			    pos;
	
			do {
				top  += el.offsetTop  || 0;
				left += el.offsetLeft || 0;
	
				//add borders
				top += parseInt(L.DomUtil.getStyle(el, 'borderTopWidth'), 10) || 0;
				left += parseInt(L.DomUtil.getStyle(el, 'borderLeftWidth'), 10) || 0;
	
				pos = L.DomUtil.getStyle(el, 'position');
	
				if (el.offsetParent === docBody && pos === 'absolute') { break; }
	
				if (pos === 'fixed') {
					top  += docBody.scrollTop  || docEl.scrollTop  || 0;
					left += docBody.scrollLeft || docEl.scrollLeft || 0;
					break;
				}
	
				if (pos === 'relative' && !el.offsetLeft) {
					var width = L.DomUtil.getStyle(el, 'width'),
					    maxWidth = L.DomUtil.getStyle(el, 'max-width'),
					    r = el.getBoundingClientRect();
	
					if (width !== 'none' || maxWidth !== 'none') {
						left += r.left + el.clientLeft;
					}
	
					//calculate full y offset since we're breaking out of the loop
					top += r.top + (docBody.scrollTop  || docEl.scrollTop  || 0);
	
					break;
				}
	
				el = el.offsetParent;
	
			} while (el);
	
			el = element;
	
			do {
				if (el === docBody) { break; }
	
				top  -= el.scrollTop  || 0;
				left -= el.scrollLeft || 0;
	
				el = el.parentNode;
			} while (el);
	
			return new L.Point(left, top);
		},
	
		documentIsLtr: function () {
			if (!L.DomUtil._docIsLtrCached) {
				L.DomUtil._docIsLtrCached = true;
				L.DomUtil._docIsLtr = L.DomUtil.getStyle(document.body, 'direction') === 'ltr';
			}
			return L.DomUtil._docIsLtr;
		},
	
		create: function (tagName, className, container) {
	
			var el = document.createElement(tagName);
			el.className = className;
	
			if (container) {
				container.appendChild(el);
			}
	
			return el;
		},
	
		hasClass: function (el, name) {
			if (el.classList !== undefined) {
				return el.classList.contains(name);
			}
			var className = L.DomUtil._getClass(el);
			return className.length > 0 && new RegExp('(^|\\s)' + name + '(\\s|$)').test(className);
		},
	
		addClass: function (el, name) {
			if (el.classList !== undefined) {
				var classes = L.Util.splitWords(name);
				for (var i = 0, len = classes.length; i < len; i++) {
					el.classList.add(classes[i]);
				}
			} else if (!L.DomUtil.hasClass(el, name)) {
				var className = L.DomUtil._getClass(el);
				L.DomUtil._setClass(el, (className ? className + ' ' : '') + name);
			}
		},
	
		removeClass: function (el, name) {
			if (el.classList !== undefined) {
				el.classList.remove(name);
			} else {
				L.DomUtil._setClass(el, L.Util.trim((' ' + L.DomUtil._getClass(el) + ' ').replace(' ' + name + ' ', ' ')));
			}
		},
	
		_setClass: function (el, name) {
			if (el.className.baseVal === undefined) {
				el.className = name;
			} else {
				// in case of SVG element
				el.className.baseVal = name;
			}
		},
	
		_getClass: function (el) {
			return el.className.baseVal === undefined ? el.className : el.className.baseVal;
		},
	
		setOpacity: function (el, value) {
	
			if ('opacity' in el.style) {
				el.style.opacity = value;
	
			} else if ('filter' in el.style) {
	
				var filter = false,
				    filterName = 'DXImageTransform.Microsoft.Alpha';
	
				// filters collection throws an error if we try to retrieve a filter that doesn't exist
				try {
					filter = el.filters.item(filterName);
				} catch (e) {
					// don't set opacity to 1 if we haven't already set an opacity,
					// it isn't needed and breaks transparent pngs.
					if (value === 1) { return; }
				}
	
				value = Math.round(value * 100);
	
				if (filter) {
					filter.Enabled = (value !== 100);
					filter.Opacity = value;
				} else {
					el.style.filter += ' progid:' + filterName + '(opacity=' + value + ')';
				}
			}
		},
	
		testProp: function (props) {
	
			var style = document.documentElement.style;
	
			for (var i = 0; i < props.length; i++) {
				if (props[i] in style) {
					return props[i];
				}
			}
			return false;
		},
	
		getTranslateString: function (point) {
			// on WebKit browsers (Chrome/Safari/iOS Safari/Android) using translate3d instead of translate
			// makes animation smoother as it ensures HW accel is used. Firefox 13 doesn't care
			// (same speed either way), Opera 12 doesn't support translate3d
	
			var is3d = L.Browser.webkit3d,
			    open = 'translate' + (is3d ? '3d' : '') + '(',
			    close = (is3d ? ',0' : '') + ')';
	
			return open + point.x + 'px,' + point.y + 'px' + close;
		},
	
		getScaleString: function (scale, origin) {
	
			var preTranslateStr = L.DomUtil.getTranslateString(origin.add(origin.multiplyBy(-1 * scale))),
			    scaleStr = ' scale(' + scale + ') ';
	
			return preTranslateStr + scaleStr;
		},
	
		setPosition: function (el, point, disable3D) { // (HTMLElement, Point[, Boolean])
	
			// jshint camelcase: false
			el._leaflet_pos = point;
	
			if (!disable3D && L.Browser.any3d) {
				el.style[L.DomUtil.TRANSFORM] =  L.DomUtil.getTranslateString(point);
			} else {
				el.style.left = point.x + 'px';
				el.style.top = point.y + 'px';
			}
		},
	
		getPosition: function (el) {
			// this method is only used for elements previously positioned using setPosition,
			// so it's safe to cache the position for performance
	
			// jshint camelcase: false
			return el._leaflet_pos;
		}
	};
	
	
	// prefix style property names
	
	L.DomUtil.TRANSFORM = L.DomUtil.testProp(
	        ['transform', 'WebkitTransform', 'OTransform', 'MozTransform', 'msTransform']);
	
	// webkitTransition comes first because some browser versions that drop vendor prefix don't do
	// the same for the transitionend event, in particular the Android 4.1 stock browser
	
	L.DomUtil.TRANSITION = L.DomUtil.testProp(
	        ['webkitTransition', 'transition', 'OTransition', 'MozTransition', 'msTransition']);
	
	L.DomUtil.TRANSITION_END =
	        L.DomUtil.TRANSITION === 'webkitTransition' || L.DomUtil.TRANSITION === 'OTransition' ?
	        L.DomUtil.TRANSITION + 'End' : 'transitionend';
	
	(function () {
	    if ('onselectstart' in document) {
	        L.extend(L.DomUtil, {
	            disableTextSelection: function () {
	                L.DomEvent.on(window, 'selectstart', L.DomEvent.preventDefault);
	            },
	
	            enableTextSelection: function () {
	                L.DomEvent.off(window, 'selectstart', L.DomEvent.preventDefault);
	            }
	        });
	    } else {
	        var userSelectProperty = L.DomUtil.testProp(
	            ['userSelect', 'WebkitUserSelect', 'OUserSelect', 'MozUserSelect', 'msUserSelect']);
	
	        L.extend(L.DomUtil, {
	            disableTextSelection: function () {
	                if (userSelectProperty) {
	                    var style = document.documentElement.style;
	                    this._userSelect = style[userSelectProperty];
	                    style[userSelectProperty] = 'none';
	                }
	            },
	
	            enableTextSelection: function () {
	                if (userSelectProperty) {
	                    document.documentElement.style[userSelectProperty] = this._userSelect;
	                    delete this._userSelect;
	                }
	            }
	        });
	    }
	
		L.extend(L.DomUtil, {
			disableImageDrag: function () {
				L.DomEvent.on(window, 'dragstart', L.DomEvent.preventDefault);
			},
	
			enableImageDrag: function () {
				L.DomEvent.off(window, 'dragstart', L.DomEvent.preventDefault);
			}
		});
	})();
	
	
	/*
	 * L.LatLng represents a geographical point with latitude and longitude coordinates.
	 */
	
	L.LatLng = function (lat, lng, alt) { // (Number, Number, Number)
		lat = parseFloat(lat);
		lng = parseFloat(lng);
	
		if (isNaN(lat) || isNaN(lng)) {
			throw new Error('Invalid LatLng object: (' + lat + ', ' + lng + ')');
		}
	
		this.lat = lat;
		this.lng = lng;
	
		if (alt !== undefined) {
			this.alt = parseFloat(alt);
		}
	};
	
	L.extend(L.LatLng, {
		DEG_TO_RAD: Math.PI / 180,
		RAD_TO_DEG: 180 / Math.PI,
		MAX_MARGIN: 1.0E-9 // max margin of error for the "equals" check
	});
	
	L.LatLng.prototype = {
		equals: function (obj) { // (LatLng) -> Boolean
			if (!obj) { return false; }
	
			obj = L.latLng(obj);
	
			var margin = Math.max(
			        Math.abs(this.lat - obj.lat),
			        Math.abs(this.lng - obj.lng));
	
			return margin <= L.LatLng.MAX_MARGIN;
		},
	
		toString: function (precision) { // (Number) -> String
			return 'LatLng(' +
			        L.Util.formatNum(this.lat, precision) + ', ' +
			        L.Util.formatNum(this.lng, precision) + ')';
		},
	
		// Haversine distance formula, see http://en.wikipedia.org/wiki/Haversine_formula
		// TODO move to projection code, LatLng shouldn't know about Earth
		distanceTo: function (other) { // (LatLng) -> Number
			other = L.latLng(other);
	
			var R = 6378137, // earth radius in meters
			    d2r = L.LatLng.DEG_TO_RAD,
			    dLat = (other.lat - this.lat) * d2r,
			    dLon = (other.lng - this.lng) * d2r,
			    lat1 = this.lat * d2r,
			    lat2 = other.lat * d2r,
			    sin1 = Math.sin(dLat / 2),
			    sin2 = Math.sin(dLon / 2);
	
			var a = sin1 * sin1 + sin2 * sin2 * Math.cos(lat1) * Math.cos(lat2);
	
			return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		},
	
		wrap: function (a, b) { // (Number, Number) -> LatLng
			var lng = this.lng;
	
			a = a || -180;
			b = b ||  180;
	
			lng = (lng + b) % (b - a) + (lng < a || lng === b ? b : a);
	
			return new L.LatLng(this.lat, lng);
		}
	};
	
	L.latLng = function (a, b) { // (LatLng) or ([Number, Number]) or (Number, Number)
		if (a instanceof L.LatLng) {
			return a;
		}
		if (L.Util.isArray(a)) {
			if (typeof a[0] === 'number' || typeof a[0] === 'string') {
				return new L.LatLng(a[0], a[1], a[2]);
			} else {
				return null;
			}
		}
		if (a === undefined || a === null) {
			return a;
		}
		if (typeof a === 'object' && 'lat' in a) {
			return new L.LatLng(a.lat, 'lng' in a ? a.lng : a.lon);
		}
		if (b === undefined) {
			return null;
		}
		return new L.LatLng(a, b);
	};
	
	
	
	/*
	 * L.LatLngBounds represents a rectangular area on the map in geographical coordinates.
	 */
	
	L.LatLngBounds = function (southWest, northEast) { // (LatLng, LatLng) or (LatLng[])
		if (!southWest) { return; }
	
		var latlngs = northEast ? [southWest, northEast] : southWest;
	
		for (var i = 0, len = latlngs.length; i < len; i++) {
			this.extend(latlngs[i]);
		}
	};
	
	L.LatLngBounds.prototype = {
		// extend the bounds to contain the given point or bounds
		extend: function (obj) { // (LatLng) or (LatLngBounds)
			if (!obj) { return this; }
	
			var latLng = L.latLng(obj);
			if (latLng !== null) {
				obj = latLng;
			} else {
				obj = L.latLngBounds(obj);
			}
	
			if (obj instanceof L.LatLng) {
				if (!this._southWest && !this._northEast) {
					this._southWest = new L.LatLng(obj.lat, obj.lng);
					this._northEast = new L.LatLng(obj.lat, obj.lng);
				} else {
					this._southWest.lat = Math.min(obj.lat, this._southWest.lat);
					this._southWest.lng = Math.min(obj.lng, this._southWest.lng);
	
					this._northEast.lat = Math.max(obj.lat, this._northEast.lat);
					this._northEast.lng = Math.max(obj.lng, this._northEast.lng);
				}
			} else if (obj instanceof L.LatLngBounds) {
				this.extend(obj._southWest);
				this.extend(obj._northEast);
			}
			return this;
		},
	
		// extend the bounds by a percentage
		pad: function (bufferRatio) { // (Number) -> LatLngBounds
			var sw = this._southWest,
			    ne = this._northEast,
			    heightBuffer = Math.abs(sw.lat - ne.lat) * bufferRatio,
			    widthBuffer = Math.abs(sw.lng - ne.lng) * bufferRatio;
	
			return new L.LatLngBounds(
			        new L.LatLng(sw.lat - heightBuffer, sw.lng - widthBuffer),
			        new L.LatLng(ne.lat + heightBuffer, ne.lng + widthBuffer));
		},
	
		getCenter: function () { // -> LatLng
			return new L.LatLng(
			        (this._southWest.lat + this._northEast.lat) / 2,
			        (this._southWest.lng + this._northEast.lng) / 2);
		},
	
		getSouthWest: function () {
			return this._southWest;
		},
	
		getNorthEast: function () {
			return this._northEast;
		},
	
		getNorthWest: function () {
			return new L.LatLng(this.getNorth(), this.getWest());
		},
	
		getSouthEast: function () {
			return new L.LatLng(this.getSouth(), this.getEast());
		},
	
		getWest: function () {
			return this._southWest.lng;
		},
	
		getSouth: function () {
			return this._southWest.lat;
		},
	
		getEast: function () {
			return this._northEast.lng;
		},
	
		getNorth: function () {
			return this._northEast.lat;
		},
	
		contains: function (obj) { // (LatLngBounds) or (LatLng) -> Boolean
			if (typeof obj[0] === 'number' || obj instanceof L.LatLng) {
				obj = L.latLng(obj);
			} else {
				obj = L.latLngBounds(obj);
			}
	
			var sw = this._southWest,
			    ne = this._northEast,
			    sw2, ne2;
	
			if (obj instanceof L.LatLngBounds) {
				sw2 = obj.getSouthWest();
				ne2 = obj.getNorthEast();
			} else {
				sw2 = ne2 = obj;
			}
	
			return (sw2.lat >= sw.lat) && (ne2.lat <= ne.lat) &&
			       (sw2.lng >= sw.lng) && (ne2.lng <= ne.lng);
		},
	
		intersects: function (bounds) { // (LatLngBounds)
			bounds = L.latLngBounds(bounds);
	
			var sw = this._southWest,
			    ne = this._northEast,
			    sw2 = bounds.getSouthWest(),
			    ne2 = bounds.getNorthEast(),
	
			    latIntersects = (ne2.lat >= sw.lat) && (sw2.lat <= ne.lat),
			    lngIntersects = (ne2.lng >= sw.lng) && (sw2.lng <= ne.lng);
	
			return latIntersects && lngIntersects;
		},
	
		toBBoxString: function () {
			return [this.getWest(), this.getSouth(), this.getEast(), this.getNorth()].join(',');
		},
	
		equals: function (bounds) { // (LatLngBounds)
			if (!bounds) { return false; }
	
			bounds = L.latLngBounds(bounds);
	
			return this._southWest.equals(bounds.getSouthWest()) &&
			       this._northEast.equals(bounds.getNorthEast());
		},
	
		isValid: function () {
			return !!(this._southWest && this._northEast);
		}
	};
	
	//TODO International date line?
	
	L.latLngBounds = function (a, b) { // (LatLngBounds) or (LatLng, LatLng)
		if (!a || a instanceof L.LatLngBounds) {
			return a;
		}
		return new L.LatLngBounds(a, b);
	};
	
	
	/*
	 * L.Projection contains various geographical projections used by CRS classes.
	 */
	
	L.Projection = {};
	
	
	/*
	 * Spherical Mercator is the most popular map projection, used by EPSG:3857 CRS used by default.
	 */
	
	L.Projection.SphericalMercator = {
		MAX_LATITUDE: 85.0511287798,
	
		project: function (latlng) { // (LatLng) -> Point
			var d = L.LatLng.DEG_TO_RAD,
			    max = this.MAX_LATITUDE,
			    lat = Math.max(Math.min(max, latlng.lat), -max),
			    x = latlng.lng * d,
			    y = lat * d;
	
			y = Math.log(Math.tan((Math.PI / 4) + (y / 2)));
	
			return new L.Point(x, y);
		},
	
		unproject: function (point) { // (Point, Boolean) -> LatLng
			var d = L.LatLng.RAD_TO_DEG,
			    lng = point.x * d,
			    lat = (2 * Math.atan(Math.exp(point.y)) - (Math.PI / 2)) * d;
	
			return new L.LatLng(lat, lng);
		}
	};
	
	
	/*
	 * Simple equirectangular (Plate Carree) projection, used by CRS like EPSG:4326 and Simple.
	 */
	
	L.Projection.LonLat = {
		project: function (latlng) {
			return new L.Point(latlng.lng, latlng.lat);
		},
	
		unproject: function (point) {
			return new L.LatLng(point.y, point.x);
		}
	};
	
	
	/*
	 * L.CRS is a base object for all defined CRS (Coordinate Reference Systems) in Leaflet.
	 */
	
	L.CRS = {
		latLngToPoint: function (latlng, zoom) { // (LatLng, Number) -> Point
			var projectedPoint = this.projection.project(latlng),
			    scale = this.scale(zoom);
	
			return this.transformation._transform(projectedPoint, scale);
		},
	
		pointToLatLng: function (point, zoom) { // (Point, Number[, Boolean]) -> LatLng
			var scale = this.scale(zoom),
			    untransformedPoint = this.transformation.untransform(point, scale);
	
			return this.projection.unproject(untransformedPoint);
		},
	
		project: function (latlng) {
			return this.projection.project(latlng);
		},
	
		scale: function (zoom) {
			return 256 * Math.pow(2, zoom);
		},
	
		getSize: function (zoom) {
			var s = this.scale(zoom);
			return L.point(s, s);
		}
	};
	
	
	/*
	 * A simple CRS that can be used for flat non-Earth maps like panoramas or game maps.
	 */
	
	L.CRS.Simple = L.extend({}, L.CRS, {
		projection: L.Projection.LonLat,
		transformation: new L.Transformation(1, 0, -1, 0),
	
		scale: function (zoom) {
			return Math.pow(2, zoom);
		}
	});
	
	
	/*
	 * L.CRS.EPSG3857 (Spherical Mercator) is the most common CRS for web mapping
	 * and is used by Leaflet by default.
	 */
	
	L.CRS.EPSG3857 = L.extend({}, L.CRS, {
		code: 'EPSG:3857',
	
		projection: L.Projection.SphericalMercator,
		transformation: new L.Transformation(0.5 / Math.PI, 0.5, -0.5 / Math.PI, 0.5),
	
		project: function (latlng) { // (LatLng) -> Point
			var projectedPoint = this.projection.project(latlng),
			    earthRadius = 6378137;
			return projectedPoint.multiplyBy(earthRadius);
		}
	});
	
	L.CRS.EPSG900913 = L.extend({}, L.CRS.EPSG3857, {
		code: 'EPSG:900913'
	});
	
	
	/*
	 * L.CRS.EPSG4326 is a CRS popular among advanced GIS specialists.
	 */
	
	L.CRS.EPSG4326 = L.extend({}, L.CRS, {
		code: 'EPSG:4326',
	
		projection: L.Projection.LonLat,
		transformation: new L.Transformation(1 / 360, 0.5, -1 / 360, 0.5)
	});
	
	
	/*
	 * L.Map is the central class of the API - it is used to create a map.
	 */
	
	L.Map = L.Class.extend({
	
		includes: L.Mixin.Events,
	
		options: {
			crs: L.CRS.EPSG3857,
	
			/*
			center: LatLng,
			zoom: Number,
			layers: Array,
			*/
	
			fadeAnimation: L.DomUtil.TRANSITION && !L.Browser.android23,
			trackResize: true,
			markerZoomAnimation: L.DomUtil.TRANSITION && L.Browser.any3d
		},
	
		initialize: function (id, options) { // (HTMLElement or String, Object)
			options = L.setOptions(this, options);
	
	
			this._initContainer(id);
			this._initLayout();
	
			// hack for https://github.com/Leaflet/Leaflet/issues/1980
			this._onResize = L.bind(this._onResize, this);
	
			this._initEvents();
	
			if (options.maxBounds) {
				this.setMaxBounds(options.maxBounds);
			}
	
			if (options.center && options.zoom !== undefined) {
				this.setView(L.latLng(options.center), options.zoom, {reset: true});
			}
	
			this._handlers = [];
	
			this._layers = {};
			this._zoomBoundLayers = {};
			this._tileLayersNum = 0;
	
			this.callInitHooks();
	
			this._addLayers(options.layers);
		},
	
	
		// public methods that modify map state
	
		// replaced by animation-powered implementation in Map.PanAnimation.js
		setView: function (center, zoom) {
			zoom = zoom === undefined ? this.getZoom() : zoom;
			this._resetView(L.latLng(center), this._limitZoom(zoom));
			return this;
		},
	
		setZoom: function (zoom, options) {
			if (!this._loaded) {
				this._zoom = this._limitZoom(zoom);
				return this;
			}
			return this.setView(this.getCenter(), zoom, {zoom: options});
		},
	
		zoomIn: function (delta, options) {
			return this.setZoom(this._zoom + (delta || 1), options);
		},
	
		zoomOut: function (delta, options) {
			return this.setZoom(this._zoom - (delta || 1), options);
		},
	
		setZoomAround: function (latlng, zoom, options) {
			var scale = this.getZoomScale(zoom),
			    viewHalf = this.getSize().divideBy(2),
			    containerPoint = latlng instanceof L.Point ? latlng : this.latLngToContainerPoint(latlng),
	
			    centerOffset = containerPoint.subtract(viewHalf).multiplyBy(1 - 1 / scale),
			    newCenter = this.containerPointToLatLng(viewHalf.add(centerOffset));
	
			return this.setView(newCenter, zoom, {zoom: options});
		},
	
		fitBounds: function (bounds, options) {
	
			options = options || {};
			bounds = bounds.getBounds ? bounds.getBounds() : L.latLngBounds(bounds);
	
			var paddingTL = L.point(options.paddingTopLeft || options.padding || [0, 0]),
			    paddingBR = L.point(options.paddingBottomRight || options.padding || [0, 0]),
	
			    zoom = this.getBoundsZoom(bounds, false, paddingTL.add(paddingBR));
	
			zoom = (options.maxZoom) ? Math.min(options.maxZoom, zoom) : zoom;
	
			var paddingOffset = paddingBR.subtract(paddingTL).divideBy(2),
	
			    swPoint = this.project(bounds.getSouthWest(), zoom),
			    nePoint = this.project(bounds.getNorthEast(), zoom),
			    center = this.unproject(swPoint.add(nePoint).divideBy(2).add(paddingOffset), zoom);
	
			return this.setView(center, zoom, options);
		},
	
		fitWorld: function (options) {
			return this.fitBounds([[-90, -180], [90, 180]], options);
		},
	
		panTo: function (center, options) { // (LatLng)
			return this.setView(center, this._zoom, {pan: options});
		},
	
		panBy: function (offset) { // (Point)
			// replaced with animated panBy in Map.PanAnimation.js
			this.fire('movestart');
	
			this._rawPanBy(L.point(offset));
	
			this.fire('move');
			return this.fire('moveend');
		},
	
		setMaxBounds: function (bounds) {
			bounds = L.latLngBounds(bounds);
	
			this.options.maxBounds = bounds;
	
			if (!bounds) {
				return this.off('moveend', this._panInsideMaxBounds, this);
			}
	
			if (this._loaded) {
				this._panInsideMaxBounds();
			}
	
			return this.on('moveend', this._panInsideMaxBounds, this);
		},
	
		panInsideBounds: function (bounds, options) {
			var center = this.getCenter(),
				newCenter = this._limitCenter(center, this._zoom, bounds);
	
			if (center.equals(newCenter)) { return this; }
	
			return this.panTo(newCenter, options);
		},
	
		addLayer: function (layer) {
			// TODO method is too big, refactor
	
			var id = L.stamp(layer);
	
			if (this._layers[id]) { return this; }
	
			this._layers[id] = layer;
	
			// TODO getMaxZoom, getMinZoom in ILayer (instead of options)
			if (layer.options && (!isNaN(layer.options.maxZoom) || !isNaN(layer.options.minZoom))) {
				this._zoomBoundLayers[id] = layer;
				this._updateZoomLevels();
			}
	
			// TODO looks ugly, refactor!!!
			if (this.options.zoomAnimation && L.TileLayer && (layer instanceof L.TileLayer)) {
				this._tileLayersNum++;
				this._tileLayersToLoad++;
				layer.on('load', this._onTileLayerLoad, this);
			}
	
			if (this._loaded) {
				this._layerAdd(layer);
			}
	
			return this;
		},
	
		removeLayer: function (layer) {
			var id = L.stamp(layer);
	
			if (!this._layers[id]) { return this; }
	
			if (this._loaded) {
				layer.onRemove(this);
			}
	
			delete this._layers[id];
	
			if (this._loaded) {
				this.fire('layerremove', {layer: layer});
			}
	
			if (this._zoomBoundLayers[id]) {
				delete this._zoomBoundLayers[id];
				this._updateZoomLevels();
			}
	
			// TODO looks ugly, refactor
			if (this.options.zoomAnimation && L.TileLayer && (layer instanceof L.TileLayer)) {
				this._tileLayersNum--;
				this._tileLayersToLoad--;
				layer.off('load', this._onTileLayerLoad, this);
			}
	
			return this;
		},
	
		hasLayer: function (layer) {
			if (!layer) { return false; }
	
			return (L.stamp(layer) in this._layers);
		},
	
		eachLayer: function (method, context) {
			for (var i in this._layers) {
				method.call(context, this._layers[i]);
			}
			return this;
		},
	
		invalidateSize: function (options) {
			if (!this._loaded) { return this; }
	
			options = L.extend({
				animate: false,
				pan: true
			}, options === true ? {animate: true} : options);
	
			var oldSize = this.getSize();
			this._sizeChanged = true;
			this._initialCenter = null;
	
			var newSize = this.getSize(),
			    oldCenter = oldSize.divideBy(2).round(),
			    newCenter = newSize.divideBy(2).round(),
			    offset = oldCenter.subtract(newCenter);
	
			if (!offset.x && !offset.y) { return this; }
	
			if (options.animate && options.pan) {
				this.panBy(offset);
	
			} else {
				if (options.pan) {
					this._rawPanBy(offset);
				}
	
				this.fire('move');
	
				if (options.debounceMoveend) {
					clearTimeout(this._sizeTimer);
					this._sizeTimer = setTimeout(L.bind(this.fire, this, 'moveend'), 200);
				} else {
					this.fire('moveend');
				}
			}
	
			return this.fire('resize', {
				oldSize: oldSize,
				newSize: newSize
			});
		},
	
		// TODO handler.addTo
		addHandler: function (name, HandlerClass) {
			if (!HandlerClass) { return this; }
	
			var handler = this[name] = new HandlerClass(this);
	
			this._handlers.push(handler);
	
			if (this.options[name]) {
				handler.enable();
			}
	
			return this;
		},
	
		remove: function () {
			if (this._loaded) {
				this.fire('unload');
			}
	
			this._initEvents('off');
	
			try {
				// throws error in IE6-8
				delete this._container._leaflet;
			} catch (e) {
				this._container._leaflet = undefined;
			}
	
			this._clearPanes();
			if (this._clearControlPos) {
				this._clearControlPos();
			}
	
			this._clearHandlers();
	
			return this;
		},
	
	
		// public methods for getting map state
	
		getCenter: function () { // (Boolean) -> LatLng
			this._checkIfLoaded();
	
			if (this._initialCenter && !this._moved()) {
				return this._initialCenter;
			}
			return this.layerPointToLatLng(this._getCenterLayerPoint());
		},
	
		getZoom: function () {
			return this._zoom;
		},
	
		getBounds: function () {
			var bounds = this.getPixelBounds(),
			    sw = this.unproject(bounds.getBottomLeft()),
			    ne = this.unproject(bounds.getTopRight());
	
			return new L.LatLngBounds(sw, ne);
		},
	
		getMinZoom: function () {
			return this.options.minZoom === undefined ?
				(this._layersMinZoom === undefined ? 0 : this._layersMinZoom) :
				this.options.minZoom;
		},
	
		getMaxZoom: function () {
			return this.options.maxZoom === undefined ?
				(this._layersMaxZoom === undefined ? Infinity : this._layersMaxZoom) :
				this.options.maxZoom;
		},
	
		getBoundsZoom: function (bounds, inside, padding) { // (LatLngBounds[, Boolean, Point]) -> Number
			bounds = L.latLngBounds(bounds);
	
			var zoom = this.getMinZoom() - (inside ? 1 : 0),
			    maxZoom = this.getMaxZoom(),
			    size = this.getSize(),
	
			    nw = bounds.getNorthWest(),
			    se = bounds.getSouthEast(),
	
			    zoomNotFound = true,
			    boundsSize;
	
			padding = L.point(padding || [0, 0]);
	
			do {
				zoom++;
				boundsSize = this.project(se, zoom).subtract(this.project(nw, zoom)).add(padding);
				zoomNotFound = !inside ? size.contains(boundsSize) : boundsSize.x < size.x || boundsSize.y < size.y;
	
			} while (zoomNotFound && zoom <= maxZoom);
	
			if (zoomNotFound && inside) {
				return null;
			}
	
			return inside ? zoom : zoom - 1;
		},
	
		getSize: function () {
			if (!this._size || this._sizeChanged) {
				this._size = new L.Point(
					this._container.clientWidth,
					this._container.clientHeight);
	
				this._sizeChanged = false;
			}
			return this._size.clone();
		},
	
		getPixelBounds: function () {
			var topLeftPoint = this._getTopLeftPoint();
			return new L.Bounds(topLeftPoint, topLeftPoint.add(this.getSize()));
		},
	
		getPixelOrigin: function () {
			this._checkIfLoaded();
			return this._initialTopLeftPoint;
		},
	
		getPanes: function () {
			return this._panes;
		},
	
		getContainer: function () {
			return this._container;
		},
	
	
		// TODO replace with universal implementation after refactoring projections
	
		getZoomScale: function (toZoom) {
			var crs = this.options.crs;
			return crs.scale(toZoom) / crs.scale(this._zoom);
		},
	
		getScaleZoom: function (scale) {
			return this._zoom + (Math.log(scale) / Math.LN2);
		},
	
	
		// conversion methods
	
		project: function (latlng, zoom) { // (LatLng[, Number]) -> Point
			zoom = zoom === undefined ? this._zoom : zoom;
			return this.options.crs.latLngToPoint(L.latLng(latlng), zoom);
		},
	
		unproject: function (point, zoom) { // (Point[, Number]) -> LatLng
			zoom = zoom === undefined ? this._zoom : zoom;
			return this.options.crs.pointToLatLng(L.point(point), zoom);
		},
	
		layerPointToLatLng: function (point) { // (Point)
			var projectedPoint = L.point(point).add(this.getPixelOrigin());
			return this.unproject(projectedPoint);
		},
	
		latLngToLayerPoint: function (latlng) { // (LatLng)
			var projectedPoint = this.project(L.latLng(latlng))._round();
			return projectedPoint._subtract(this.getPixelOrigin());
		},
	
		containerPointToLayerPoint: function (point) { // (Point)
			return L.point(point).subtract(this._getMapPanePos());
		},
	
		layerPointToContainerPoint: function (point) { // (Point)
			return L.point(point).add(this._getMapPanePos());
		},
	
		containerPointToLatLng: function (point) {
			var layerPoint = this.containerPointToLayerPoint(L.point(point));
			return this.layerPointToLatLng(layerPoint);
		},
	
		latLngToContainerPoint: function (latlng) {
			return this.layerPointToContainerPoint(this.latLngToLayerPoint(L.latLng(latlng)));
		},
	
		mouseEventToContainerPoint: function (e) { // (MouseEvent)
			return L.DomEvent.getMousePosition(e, this._container);
		},
	
		mouseEventToLayerPoint: function (e) { // (MouseEvent)
			return this.containerPointToLayerPoint(this.mouseEventToContainerPoint(e));
		},
	
		mouseEventToLatLng: function (e) { // (MouseEvent)
			return this.layerPointToLatLng(this.mouseEventToLayerPoint(e));
		},
	
	
		// map initialization methods
	
		_initContainer: function (id) {
			var container = this._container = L.DomUtil.get(id);
	
			if (!container) {
				throw new Error('Map container not found.');
			} else if (container._leaflet) {
				throw new Error('Map container is already initialized.');
			}
	
			container._leaflet = true;
		},
	
		_initLayout: function () {
			var container = this._container;
	
			L.DomUtil.addClass(container, 'leaflet-container' +
				(L.Browser.touch ? ' leaflet-touch' : '') +
				(L.Browser.retina ? ' leaflet-retina' : '') +
				(L.Browser.ielt9 ? ' leaflet-oldie' : '') +
				(this.options.fadeAnimation ? ' leaflet-fade-anim' : ''));
	
			var position = L.DomUtil.getStyle(container, 'position');
	
			if (position !== 'absolute' && position !== 'relative' && position !== 'fixed') {
				container.style.position = 'relative';
			}
	
			this._initPanes();
	
			if (this._initControlPos) {
				this._initControlPos();
			}
		},
	
		_initPanes: function () {
			var panes = this._panes = {};
	
			this._mapPane = panes.mapPane = this._createPane('leaflet-map-pane', this._container);
	
			this._tilePane = panes.tilePane = this._createPane('leaflet-tile-pane', this._mapPane);
			panes.objectsPane = this._createPane('leaflet-objects-pane', this._mapPane);
			panes.shadowPane = this._createPane('leaflet-shadow-pane');
			panes.overlayPane = this._createPane('leaflet-overlay-pane');
			panes.markerPane = this._createPane('leaflet-marker-pane');
			panes.popupPane = this._createPane('leaflet-popup-pane');
	
			var zoomHide = ' leaflet-zoom-hide';
	
			if (!this.options.markerZoomAnimation) {
				L.DomUtil.addClass(panes.markerPane, zoomHide);
				L.DomUtil.addClass(panes.shadowPane, zoomHide);
				L.DomUtil.addClass(panes.popupPane, zoomHide);
			}
		},
	
		_createPane: function (className, container) {
			return L.DomUtil.create('div', className, container || this._panes.objectsPane);
		},
	
		_clearPanes: function () {
			this._container.removeChild(this._mapPane);
		},
	
		_addLayers: function (layers) {
			layers = layers ? (L.Util.isArray(layers) ? layers : [layers]) : [];
	
			for (var i = 0, len = layers.length; i < len; i++) {
				this.addLayer(layers[i]);
			}
		},
	
	
		// private methods that modify map state
	
		_resetView: function (center, zoom, preserveMapOffset, afterZoomAnim) {
	
			var zoomChanged = (this._zoom !== zoom);
	
			if (!afterZoomAnim) {
				this.fire('movestart');
	
				if (zoomChanged) {
					this.fire('zoomstart');
				}
			}
	
			this._zoom = zoom;
			this._initialCenter = center;
	
			this._initialTopLeftPoint = this._getNewTopLeftPoint(center);
	
			if (!preserveMapOffset) {
				L.DomUtil.setPosition(this._mapPane, new L.Point(0, 0));
			} else {
				this._initialTopLeftPoint._add(this._getMapPanePos());
			}
	
			this._tileLayersToLoad = this._tileLayersNum;
	
			var loading = !this._loaded;
			this._loaded = true;
	
			this.fire('viewreset', {hard: !preserveMapOffset});
	
			if (loading) {
				this.fire('load');
				this.eachLayer(this._layerAdd, this);
			}
	
			this.fire('move');
	
			if (zoomChanged || afterZoomAnim) {
				this.fire('zoomend');
			}
	
			this.fire('moveend', {hard: !preserveMapOffset});
		},
	
		_rawPanBy: function (offset) {
			L.DomUtil.setPosition(this._mapPane, this._getMapPanePos().subtract(offset));
		},
	
		_getZoomSpan: function () {
			return this.getMaxZoom() - this.getMinZoom();
		},
	
		_updateZoomLevels: function () {
			var i,
				minZoom = Infinity,
				maxZoom = -Infinity,
				oldZoomSpan = this._getZoomSpan();
	
			for (i in this._zoomBoundLayers) {
				var layer = this._zoomBoundLayers[i];
				if (!isNaN(layer.options.minZoom)) {
					minZoom = Math.min(minZoom, layer.options.minZoom);
				}
				if (!isNaN(layer.options.maxZoom)) {
					maxZoom = Math.max(maxZoom, layer.options.maxZoom);
				}
			}
	
			if (i === undefined) { // we have no tilelayers
				this._layersMaxZoom = this._layersMinZoom = undefined;
			} else {
				this._layersMaxZoom = maxZoom;
				this._layersMinZoom = minZoom;
			}
	
			if (oldZoomSpan !== this._getZoomSpan()) {
				this.fire('zoomlevelschange');
			}
		},
	
		_panInsideMaxBounds: function () {
			this.panInsideBounds(this.options.maxBounds);
		},
	
		_checkIfLoaded: function () {
			if (!this._loaded) {
				throw new Error('Set map center and zoom first.');
			}
		},
	
		// map events
	
		_initEvents: function (onOff) {
			if (!L.DomEvent) { return; }
	
			onOff = onOff || 'on';
	
			L.DomEvent[onOff](this._container, 'click', this._onMouseClick, this);
	
			var events = ['dblclick', 'mousedown', 'mouseup', 'mouseenter',
			              'mouseleave', 'mousemove', 'contextmenu'],
			    i, len;
	
			for (i = 0, len = events.length; i < len; i++) {
				L.DomEvent[onOff](this._container, events[i], this._fireMouseEvent, this);
			}
	
			if (this.options.trackResize) {
				L.DomEvent[onOff](window, 'resize', this._onResize, this);
			}
		},
	
		_onResize: function () {
			L.Util.cancelAnimFrame(this._resizeRequest);
			this._resizeRequest = L.Util.requestAnimFrame(
			        function () { this.invalidateSize({debounceMoveend: true}); }, this, false, this._container);
		},
	
		_onMouseClick: function (e) {
			if (!this._loaded || (!e._simulated &&
			        ((this.dragging && this.dragging.moved()) ||
			         (this.boxZoom  && this.boxZoom.moved()))) ||
			            L.DomEvent._skipped(e)) { return; }
	
			this.fire('preclick');
			this._fireMouseEvent(e);
		},
	
		_fireMouseEvent: function (e) {
			if (!this._loaded || L.DomEvent._skipped(e)) { return; }
	
			var type = e.type;
	
			type = (type === 'mouseenter' ? 'mouseover' : (type === 'mouseleave' ? 'mouseout' : type));
	
			if (!this.hasEventListeners(type)) { return; }
	
			if (type === 'contextmenu') {
				L.DomEvent.preventDefault(e);
			}
	
			var containerPoint = this.mouseEventToContainerPoint(e),
			    layerPoint = this.containerPointToLayerPoint(containerPoint),
			    latlng = this.layerPointToLatLng(layerPoint);
	
			this.fire(type, {
				latlng: latlng,
				layerPoint: layerPoint,
				containerPoint: containerPoint,
				originalEvent: e
			});
		},
	
		_onTileLayerLoad: function () {
			this._tileLayersToLoad--;
			if (this._tileLayersNum && !this._tileLayersToLoad) {
				this.fire('tilelayersload');
			}
		},
	
		_clearHandlers: function () {
			for (var i = 0, len = this._handlers.length; i < len; i++) {
				this._handlers[i].disable();
			}
		},
	
		whenReady: function (callback, context) {
			if (this._loaded) {
				callback.call(context || this, this);
			} else {
				this.on('load', callback, context);
			}
			return this;
		},
	
		_layerAdd: function (layer) {
			layer.onAdd(this);
			this.fire('layeradd', {layer: layer});
		},
	
	
		// private methods for getting map state
	
		_getMapPanePos: function () {
			return L.DomUtil.getPosition(this._mapPane);
		},
	
		_moved: function () {
			var pos = this._getMapPanePos();
			return pos && !pos.equals([0, 0]);
		},
	
		_getTopLeftPoint: function () {
			return this.getPixelOrigin().subtract(this._getMapPanePos());
		},
	
		_getNewTopLeftPoint: function (center, zoom) {
			var viewHalf = this.getSize()._divideBy(2);
			// TODO round on display, not calculation to increase precision?
			return this.project(center, zoom)._subtract(viewHalf)._round();
		},
	
		_latLngToNewLayerPoint: function (latlng, newZoom, newCenter) {
			var topLeft = this._getNewTopLeftPoint(newCenter, newZoom).add(this._getMapPanePos());
			return this.project(latlng, newZoom)._subtract(topLeft);
		},
	
		// layer point of the current center
		_getCenterLayerPoint: function () {
			return this.containerPointToLayerPoint(this.getSize()._divideBy(2));
		},
	
		// offset of the specified place to the current center in pixels
		_getCenterOffset: function (latlng) {
			return this.latLngToLayerPoint(latlng).subtract(this._getCenterLayerPoint());
		},
	
		// adjust center for view to get inside bounds
		_limitCenter: function (center, zoom, bounds) {
	
			if (!bounds) { return center; }
	
			var centerPoint = this.project(center, zoom),
			    viewHalf = this.getSize().divideBy(2),
			    viewBounds = new L.Bounds(centerPoint.subtract(viewHalf), centerPoint.add(viewHalf)),
			    offset = this._getBoundsOffset(viewBounds, bounds, zoom);
	
			return this.unproject(centerPoint.add(offset), zoom);
		},
	
		// adjust offset for view to get inside bounds
		_limitOffset: function (offset, bounds) {
			if (!bounds) { return offset; }
	
			var viewBounds = this.getPixelBounds(),
			    newBounds = new L.Bounds(viewBounds.min.add(offset), viewBounds.max.add(offset));
	
			return offset.add(this._getBoundsOffset(newBounds, bounds));
		},
	
		// returns offset needed for pxBounds to get inside maxBounds at a specified zoom
		_getBoundsOffset: function (pxBounds, maxBounds, zoom) {
			var nwOffset = this.project(maxBounds.getNorthWest(), zoom).subtract(pxBounds.min),
			    seOffset = this.project(maxBounds.getSouthEast(), zoom).subtract(pxBounds.max),
	
			    dx = this._rebound(nwOffset.x, -seOffset.x),
			    dy = this._rebound(nwOffset.y, -seOffset.y);
	
			return new L.Point(dx, dy);
		},
	
		_rebound: function (left, right) {
			return left + right > 0 ?
				Math.round(left - right) / 2 :
				Math.max(0, Math.ceil(left)) - Math.max(0, Math.floor(right));
		},
	
		_limitZoom: function (zoom) {
			var min = this.getMinZoom(),
			    max = this.getMaxZoom();
	
			return Math.max(min, Math.min(max, zoom));
		}
	});
	
	L.map = function (id, options) {
		return new L.Map(id, options);
	};
	
	
	/*
	 * Mercator projection that takes into account that the Earth is not a perfect sphere.
	 * Less popular than spherical mercator; used by projections like EPSG:3395.
	 */
	
	L.Projection.Mercator = {
		MAX_LATITUDE: 85.0840591556,
	
		R_MINOR: 6356752.314245179,
		R_MAJOR: 6378137,
	
		project: function (latlng) { // (LatLng) -> Point
			var d = L.LatLng.DEG_TO_RAD,
			    max = this.MAX_LATITUDE,
			    lat = Math.max(Math.min(max, latlng.lat), -max),
			    r = this.R_MAJOR,
			    r2 = this.R_MINOR,
			    x = latlng.lng * d * r,
			    y = lat * d,
			    tmp = r2 / r,
			    eccent = Math.sqrt(1.0 - tmp * tmp),
			    con = eccent * Math.sin(y);
	
			con = Math.pow((1 - con) / (1 + con), eccent * 0.5);
	
			var ts = Math.tan(0.5 * ((Math.PI * 0.5) - y)) / con;
			y = -r * Math.log(ts);
	
			return new L.Point(x, y);
		},
	
		unproject: function (point) { // (Point, Boolean) -> LatLng
			var d = L.LatLng.RAD_TO_DEG,
			    r = this.R_MAJOR,
			    r2 = this.R_MINOR,
			    lng = point.x * d / r,
			    tmp = r2 / r,
			    eccent = Math.sqrt(1 - (tmp * tmp)),
			    ts = Math.exp(- point.y / r),
			    phi = (Math.PI / 2) - 2 * Math.atan(ts),
			    numIter = 15,
			    tol = 1e-7,
			    i = numIter,
			    dphi = 0.1,
			    con;
	
			while ((Math.abs(dphi) > tol) && (--i > 0)) {
				con = eccent * Math.sin(phi);
				dphi = (Math.PI / 2) - 2 * Math.atan(ts *
				            Math.pow((1.0 - con) / (1.0 + con), 0.5 * eccent)) - phi;
				phi += dphi;
			}
	
			return new L.LatLng(phi * d, lng);
		}
	};
	
	
	
	L.CRS.EPSG3395 = L.extend({}, L.CRS, {
		code: 'EPSG:3395',
	
		projection: L.Projection.Mercator,
	
		transformation: (function () {
			var m = L.Projection.Mercator,
			    r = m.R_MAJOR,
			    scale = 0.5 / (Math.PI * r);
	
			return new L.Transformation(scale, 0.5, -scale, 0.5);
		}())
	});
	
	
	/*
	 * L.TileLayer is used for standard xyz-numbered tile layers.
	 */
	
	L.TileLayer = L.Class.extend({
		includes: L.Mixin.Events,
	
		options: {
			minZoom: 0,
			maxZoom: 18,
			tileSize: 256,
			subdomains: 'abc',
			errorTileUrl: '',
			attribution: '',
			zoomOffset: 0,
			opacity: 1,
			/*
			maxNativeZoom: null,
			zIndex: null,
			tms: false,
			continuousWorld: false,
			noWrap: false,
			zoomReverse: false,
			detectRetina: false,
			reuseTiles: false,
			bounds: false,
			*/
			unloadInvisibleTiles: L.Browser.mobile,
			updateWhenIdle: L.Browser.mobile
		},
	
		initialize: function (url, options) {
			options = L.setOptions(this, options);
	
			// detecting retina displays, adjusting tileSize and zoom levels
			if (options.detectRetina && L.Browser.retina && options.maxZoom > 0) {
	
				options.tileSize = Math.floor(options.tileSize / 2);
				options.zoomOffset++;
	
				if (options.minZoom > 0) {
					options.minZoom--;
				}
				this.options.maxZoom--;
			}
	
			if (options.bounds) {
				options.bounds = L.latLngBounds(options.bounds);
			}
	
			this._url = url;
	
			var subdomains = this.options.subdomains;
	
			if (typeof subdomains === 'string') {
				this.options.subdomains = subdomains.split('');
			}
		},
	
		onAdd: function (map) {
			this._map = map;
			this._animated = map._zoomAnimated;
	
			// create a container div for tiles
			this._initContainer();
	
			// set up events
			map.on({
				'viewreset': this._reset,
				'moveend': this._update
			}, this);
	
			if (this._animated) {
				map.on({
					'zoomanim': this._animateZoom,
					'zoomend': this._endZoomAnim
				}, this);
			}
	
			if (!this.options.updateWhenIdle) {
				this._limitedUpdate = L.Util.limitExecByInterval(this._update, 150, this);
				map.on('move', this._limitedUpdate, this);
			}
	
			this._reset();
			this._update();
		},
	
		addTo: function (map) {
			map.addLayer(this);
			return this;
		},
	
		onRemove: function (map) {
			this._container.parentNode.removeChild(this._container);
	
			map.off({
				'viewreset': this._reset,
				'moveend': this._update
			}, this);
	
			if (this._animated) {
				map.off({
					'zoomanim': this._animateZoom,
					'zoomend': this._endZoomAnim
				}, this);
			}
	
			if (!this.options.updateWhenIdle) {
				map.off('move', this._limitedUpdate, this);
			}
	
			this._container = null;
			this._map = null;
		},
	
		bringToFront: function () {
			var pane = this._map._panes.tilePane;
	
			if (this._container) {
				pane.appendChild(this._container);
				this._setAutoZIndex(pane, Math.max);
			}
	
			return this;
		},
	
		bringToBack: function () {
			var pane = this._map._panes.tilePane;
	
			if (this._container) {
				pane.insertBefore(this._container, pane.firstChild);
				this._setAutoZIndex(pane, Math.min);
			}
	
			return this;
		},
	
		getAttribution: function () {
			return this.options.attribution;
		},
	
		getContainer: function () {
			return this._container;
		},
	
		setOpacity: function (opacity) {
			this.options.opacity = opacity;
	
			if (this._map) {
				this._updateOpacity();
			}
	
			return this;
		},
	
		setZIndex: function (zIndex) {
			this.options.zIndex = zIndex;
			this._updateZIndex();
	
			return this;
		},
	
		setUrl: function (url, noRedraw) {
			this._url = url;
	
			if (!noRedraw) {
				this.redraw();
			}
	
			return this;
		},
	
		redraw: function () {
			if (this._map) {
				this._reset({hard: true});
				this._update();
			}
			return this;
		},
	
		_updateZIndex: function () {
			if (this._container && this.options.zIndex !== undefined) {
				this._container.style.zIndex = this.options.zIndex;
			}
		},
	
		_setAutoZIndex: function (pane, compare) {
	
			var layers = pane.children,
			    edgeZIndex = -compare(Infinity, -Infinity), // -Infinity for max, Infinity for min
			    zIndex, i, len;
	
			for (i = 0, len = layers.length; i < len; i++) {
	
				if (layers[i] !== this._container) {
					zIndex = parseInt(layers[i].style.zIndex, 10);
	
					if (!isNaN(zIndex)) {
						edgeZIndex = compare(edgeZIndex, zIndex);
					}
				}
			}
	
			this.options.zIndex = this._container.style.zIndex =
			        (isFinite(edgeZIndex) ? edgeZIndex : 0) + compare(1, -1);
		},
	
		_updateOpacity: function () {
			var i,
			    tiles = this._tiles;
	
			if (L.Browser.ielt9) {
				for (i in tiles) {
					L.DomUtil.setOpacity(tiles[i], this.options.opacity);
				}
			} else {
				L.DomUtil.setOpacity(this._container, this.options.opacity);
			}
		},
	
		_initContainer: function () {
			var tilePane = this._map._panes.tilePane;
	
			if (!this._container) {
				this._container = L.DomUtil.create('div', 'leaflet-layer');
	
				this._updateZIndex();
	
				if (this._animated) {
					var className = 'leaflet-tile-container';
	
					this._bgBuffer = L.DomUtil.create('div', className, this._container);
					this._tileContainer = L.DomUtil.create('div', className, this._container);
	
				} else {
					this._tileContainer = this._container;
				}
	
				tilePane.appendChild(this._container);
	
				if (this.options.opacity < 1) {
					this._updateOpacity();
				}
			}
		},
	
		_reset: function (e) {
			for (var key in this._tiles) {
				this.fire('tileunload', {tile: this._tiles[key]});
			}
	
			this._tiles = {};
			this._tilesToLoad = 0;
	
			if (this.options.reuseTiles) {
				this._unusedTiles = [];
			}
	
			this._tileContainer.innerHTML = '';
	
			if (this._animated && e && e.hard) {
				this._clearBgBuffer();
			}
	
			this._initContainer();
		},
	
		_getTileSize: function () {
			var map = this._map,
			    zoom = map.getZoom() + this.options.zoomOffset,
			    zoomN = this.options.maxNativeZoom,
			    tileSize = this.options.tileSize;
	
			if (zoomN && zoom > zoomN) {
				tileSize = Math.round(map.getZoomScale(zoom) / map.getZoomScale(zoomN) * tileSize);
			}
	
			return tileSize;
		},
	
		_update: function () {
	
			if (!this._map) { return; }
	
			var map = this._map,
			    bounds = map.getPixelBounds(),
			    zoom = map.getZoom(),
			    tileSize = this._getTileSize();
	
			if (zoom > this.options.maxZoom || zoom < this.options.minZoom) {
				return;
			}
	
			var tileBounds = L.bounds(
			        bounds.min.divideBy(tileSize)._floor(),
			        bounds.max.divideBy(tileSize)._floor());
	
			this._addTilesFromCenterOut(tileBounds);
	
			if (this.options.unloadInvisibleTiles || this.options.reuseTiles) {
				this._removeOtherTiles(tileBounds);
			}
		},
	
		_addTilesFromCenterOut: function (bounds) {
			var queue = [],
			    center = bounds.getCenter();
	
			var j, i, point;
	
			for (j = bounds.min.y; j <= bounds.max.y; j++) {
				for (i = bounds.min.x; i <= bounds.max.x; i++) {
					point = new L.Point(i, j);
	
					if (this._tileShouldBeLoaded(point)) {
						queue.push(point);
					}
				}
			}
	
			var tilesToLoad = queue.length;
	
			if (tilesToLoad === 0) { return; }
	
			// load tiles in order of their distance to center
			queue.sort(function (a, b) {
				return a.distanceTo(center) - b.distanceTo(center);
			});
	
			var fragment = document.createDocumentFragment();
	
			// if its the first batch of tiles to load
			if (!this._tilesToLoad) {
				this.fire('loading');
			}
	
			this._tilesToLoad += tilesToLoad;
	
			for (i = 0; i < tilesToLoad; i++) {
				this._addTile(queue[i], fragment);
			}
	
			this._tileContainer.appendChild(fragment);
		},
	
		_tileShouldBeLoaded: function (tilePoint) {
			if ((tilePoint.x + ':' + tilePoint.y) in this._tiles) {
				return false; // already loaded
			}
	
			var options = this.options;
	
			if (!options.continuousWorld) {
				var limit = this._getWrapTileNum();
	
				// don't load if exceeds world bounds
				if ((options.noWrap && (tilePoint.x < 0 || tilePoint.x >= limit.x)) ||
					tilePoint.y < 0 || tilePoint.y >= limit.y) { return false; }
			}
	
			if (options.bounds) {
				var tileSize = this._getTileSize(),
				    nwPoint = tilePoint.multiplyBy(tileSize),
				    sePoint = nwPoint.add([tileSize, tileSize]),
				    nw = this._map.unproject(nwPoint),
				    se = this._map.unproject(sePoint);
	
				// TODO temporary hack, will be removed after refactoring projections
				// https://github.com/Leaflet/Leaflet/issues/1618
				if (!options.continuousWorld && !options.noWrap) {
					nw = nw.wrap();
					se = se.wrap();
				}
	
				if (!options.bounds.intersects([nw, se])) { return false; }
			}
	
			return true;
		},
	
		_removeOtherTiles: function (bounds) {
			var kArr, x, y, key;
	
			for (key in this._tiles) {
				kArr = key.split(':');
				x = parseInt(kArr[0], 10);
				y = parseInt(kArr[1], 10);
	
				// remove tile if it's out of bounds
				if (x < bounds.min.x || x > bounds.max.x || y < bounds.min.y || y > bounds.max.y) {
					this._removeTile(key);
				}
			}
		},
	
		_removeTile: function (key) {
			var tile = this._tiles[key];
	
			this.fire('tileunload', {tile: tile, url: tile.src});
	
			if (this.options.reuseTiles) {
				L.DomUtil.removeClass(tile, 'leaflet-tile-loaded');
				this._unusedTiles.push(tile);
	
			} else if (tile.parentNode === this._tileContainer) {
				this._tileContainer.removeChild(tile);
			}
	
			// for https://github.com/CloudMade/Leaflet/issues/137
			if (!L.Browser.android) {
				tile.onload = null;
				tile.src = L.Util.emptyImageUrl;
			}
	
			delete this._tiles[key];
		},
	
		_addTile: function (tilePoint, container) {
			var tilePos = this._getTilePos(tilePoint);
	
			// get unused tile - or create a new tile
			var tile = this._getTile();
	
			/*
			Chrome 20 layouts much faster with top/left (verify with timeline, frames)
			Android 4 browser has display issues with top/left and requires transform instead
			(other browsers don't currently care) - see debug/hacks/jitter.html for an example
			*/
			L.DomUtil.setPosition(tile, tilePos, L.Browser.chrome);
	
			this._tiles[tilePoint.x + ':' + tilePoint.y] = tile;
	
			this._loadTile(tile, tilePoint);
	
			if (tile.parentNode !== this._tileContainer) {
				container.appendChild(tile);
			}
		},
	
		_getZoomForUrl: function () {
	
			var options = this.options,
			    zoom = this._map.getZoom();
	
			if (options.zoomReverse) {
				zoom = options.maxZoom - zoom;
			}
	
			zoom += options.zoomOffset;
	
			return options.maxNativeZoom ? Math.min(zoom, options.maxNativeZoom) : zoom;
		},
	
		_getTilePos: function (tilePoint) {
			var origin = this._map.getPixelOrigin(),
			    tileSize = this._getTileSize();
	
			return tilePoint.multiplyBy(tileSize).subtract(origin);
		},
	
		// image-specific code (override to implement e.g. Canvas or SVG tile layer)
	
		getTileUrl: function (tilePoint) {
			return L.Util.template(this._url, L.extend({
				s: this._getSubdomain(tilePoint),
				z: tilePoint.z,
				x: tilePoint.x,
				y: tilePoint.y
			}, this.options));
		},
	
		_getWrapTileNum: function () {
			var crs = this._map.options.crs,
			    size = crs.getSize(this._map.getZoom());
			return size.divideBy(this._getTileSize())._floor();
		},
	
		_adjustTilePoint: function (tilePoint) {
	
			var limit = this._getWrapTileNum();
	
			// wrap tile coordinates
			if (!this.options.continuousWorld && !this.options.noWrap) {
				tilePoint.x = ((tilePoint.x % limit.x) + limit.x) % limit.x;
			}
	
			if (this.options.tms) {
				tilePoint.y = limit.y - tilePoint.y - 1;
			}
	
			tilePoint.z = this._getZoomForUrl();
		},
	
		_getSubdomain: function (tilePoint) {
			var index = Math.abs(tilePoint.x + tilePoint.y) % this.options.subdomains.length;
			return this.options.subdomains[index];
		},
	
		_getTile: function () {
			if (this.options.reuseTiles && this._unusedTiles.length > 0) {
				var tile = this._unusedTiles.pop();
				this._resetTile(tile);
				return tile;
			}
			return this._createTile();
		},
	
		// Override if data stored on a tile needs to be cleaned up before reuse
		_resetTile: function (/*tile*/) {},
	
		_createTile: function () {
			var tile = L.DomUtil.create('img', 'leaflet-tile');
			tile.style.width = tile.style.height = this._getTileSize() + 'px';
			tile.galleryimg = 'no';
	
			tile.onselectstart = tile.onmousemove = L.Util.falseFn;
	
			if (L.Browser.ielt9 && this.options.opacity !== undefined) {
				L.DomUtil.setOpacity(tile, this.options.opacity);
			}
			// without this hack, tiles disappear after zoom on Chrome for Android
			// https://github.com/Leaflet/Leaflet/issues/2078
			if (L.Browser.mobileWebkit3d) {
				tile.style.WebkitBackfaceVisibility = 'hidden';
			}
			return tile;
		},
	
		_loadTile: function (tile, tilePoint) {
			tile._layer  = this;
			tile.onload  = this._tileOnLoad;
			tile.onerror = this._tileOnError;
	
			this._adjustTilePoint(tilePoint);
			tile.src     = this.getTileUrl(tilePoint);
	
			this.fire('tileloadstart', {
				tile: tile,
				url: tile.src
			});
		},
	
		_tileLoaded: function () {
			this._tilesToLoad--;
	
			if (this._animated) {
				L.DomUtil.addClass(this._tileContainer, 'leaflet-zoom-animated');
			}
	
			if (!this._tilesToLoad) {
				this.fire('load');
	
				if (this._animated) {
					// clear scaled tiles after all new tiles are loaded (for performance)
					clearTimeout(this._clearBgBufferTimer);
					this._clearBgBufferTimer = setTimeout(L.bind(this._clearBgBuffer, this), 500);
				}
			}
		},
	
		_tileOnLoad: function () {
			var layer = this._layer;
	
			//Only if we are loading an actual image
			if (this.src !== L.Util.emptyImageUrl) {
				L.DomUtil.addClass(this, 'leaflet-tile-loaded');
	
				layer.fire('tileload', {
					tile: this,
					url: this.src
				});
			}
	
			layer._tileLoaded();
		},
	
		_tileOnError: function () {
			var layer = this._layer;
	
			layer.fire('tileerror', {
				tile: this,
				url: this.src
			});
	
			var newUrl = layer.options.errorTileUrl;
			if (newUrl) {
				this.src = newUrl;
			}
	
			layer._tileLoaded();
		}
	});
	
	L.tileLayer = function (url, options) {
		return new L.TileLayer(url, options);
	};
	
	
	/*
	 * L.TileLayer.WMS is used for putting WMS tile layers on the map.
	 */
	
	L.TileLayer.WMS = L.TileLayer.extend({
	
		defaultWmsParams: {
			service: 'WMS',
			request: 'GetMap',
			version: '1.1.1',
			layers: '',
			styles: '',
			format: 'image/jpeg',
			transparent: false
		},
	
		initialize: function (url, options) { // (String, Object)
	
			this._url = url;
	
			var wmsParams = L.extend({}, this.defaultWmsParams),
			    tileSize = options.tileSize || this.options.tileSize;
	
			if (options.detectRetina && L.Browser.retina) {
				wmsParams.width = wmsParams.height = tileSize * 2;
			} else {
				wmsParams.width = wmsParams.height = tileSize;
			}
	
			for (var i in options) {
				// all keys that are not TileLayer options go to WMS params
				if (!this.options.hasOwnProperty(i) && i !== 'crs') {
					wmsParams[i] = options[i];
				}
			}
	
			this.wmsParams = wmsParams;
	
			L.setOptions(this, options);
		},
	
		onAdd: function (map) {
	
			this._crs = this.options.crs || map.options.crs;
	
			this._wmsVersion = parseFloat(this.wmsParams.version);
	
			var projectionKey = this._wmsVersion >= 1.3 ? 'crs' : 'srs';
			this.wmsParams[projectionKey] = this._crs.code;
	
			L.TileLayer.prototype.onAdd.call(this, map);
		},
	
		getTileUrl: function (tilePoint) { // (Point, Number) -> String
	
			var map = this._map,
			    tileSize = this.options.tileSize,
	
			    nwPoint = tilePoint.multiplyBy(tileSize),
			    sePoint = nwPoint.add([tileSize, tileSize]),
	
			    nw = this._crs.project(map.unproject(nwPoint, tilePoint.z)),
			    se = this._crs.project(map.unproject(sePoint, tilePoint.z)),
			    bbox = this._wmsVersion >= 1.3 && this._crs === L.CRS.EPSG4326 ?
			        [se.y, nw.x, nw.y, se.x].join(',') :
			        [nw.x, se.y, se.x, nw.y].join(','),
	
			    url = L.Util.template(this._url, {s: this._getSubdomain(tilePoint)});
	
			return url + L.Util.getParamString(this.wmsParams, url, true) + '&BBOX=' + bbox;
		},
	
		setParams: function (params, noRedraw) {
	
			L.extend(this.wmsParams, params);
	
			if (!noRedraw) {
				this.redraw();
			}
	
			return this;
		}
	});
	
	L.tileLayer.wms = function (url, options) {
		return new L.TileLayer.WMS(url, options);
	};
	
	
	/*
	 * L.TileLayer.Canvas is a class that you can use as a base for creating
	 * dynamically drawn Canvas-based tile layers.
	 */
	
	L.TileLayer.Canvas = L.TileLayer.extend({
		options: {
			async: false
		},
	
		initialize: function (options) {
			L.setOptions(this, options);
		},
	
		redraw: function () {
			if (this._map) {
				this._reset({hard: true});
				this._update();
			}
	
			for (var i in this._tiles) {
				this._redrawTile(this._tiles[i]);
			}
			return this;
		},
	
		_redrawTile: function (tile) {
			this.drawTile(tile, tile._tilePoint, this._map._zoom);
		},
	
		_createTile: function () {
			var tile = L.DomUtil.create('canvas', 'leaflet-tile');
			tile.width = tile.height = this.options.tileSize;
			tile.onselectstart = tile.onmousemove = L.Util.falseFn;
			return tile;
		},
	
		_loadTile: function (tile, tilePoint) {
			tile._layer = this;
			tile._tilePoint = tilePoint;
	
			this._redrawTile(tile);
	
			if (!this.options.async) {
				this.tileDrawn(tile);
			}
		},
	
		drawTile: function (/*tile, tilePoint*/) {
			// override with rendering code
		},
	
		tileDrawn: function (tile) {
			this._tileOnLoad.call(tile);
		}
	});
	
	
	L.tileLayer.canvas = function (options) {
		return new L.TileLayer.Canvas(options);
	};
	
	
	/*
	 * L.ImageOverlay is used to overlay images over the map (to specific geographical bounds).
	 */
	
	L.ImageOverlay = L.Class.extend({
		includes: L.Mixin.Events,
	
		options: {
			opacity: 1
		},
	
		initialize: function (url, bounds, options) { // (String, LatLngBounds, Object)
			this._url = url;
			this._bounds = L.latLngBounds(bounds);
	
			L.setOptions(this, options);
		},
	
		onAdd: function (map) {
			this._map = map;
	
			if (!this._image) {
				this._initImage();
			}
	
			map._panes.overlayPane.appendChild(this._image);
	
			map.on('viewreset', this._reset, this);
	
			if (map.options.zoomAnimation && L.Browser.any3d) {
				map.on('zoomanim', this._animateZoom, this);
			}
	
			this._reset();
		},
	
		onRemove: function (map) {
			map.getPanes().overlayPane.removeChild(this._image);
	
			map.off('viewreset', this._reset, this);
	
			if (map.options.zoomAnimation) {
				map.off('zoomanim', this._animateZoom, this);
			}
		},
	
		addTo: function (map) {
			map.addLayer(this);
			return this;
		},
	
		setOpacity: function (opacity) {
			this.options.opacity = opacity;
			this._updateOpacity();
			return this;
		},
	
		// TODO remove bringToFront/bringToBack duplication from TileLayer/Path
		bringToFront: function () {
			if (this._image) {
				this._map._panes.overlayPane.appendChild(this._image);
			}
			return this;
		},
	
		bringToBack: function () {
			var pane = this._map._panes.overlayPane;
			if (this._image) {
				pane.insertBefore(this._image, pane.firstChild);
			}
			return this;
		},
	
		setUrl: function (url) {
			this._url = url;
			this._image.src = this._url;
		},
	
		getAttribution: function () {
			return this.options.attribution;
		},
	
		_initImage: function () {
			this._image = L.DomUtil.create('img', 'leaflet-image-layer');
	
			if (this._map.options.zoomAnimation && L.Browser.any3d) {
				L.DomUtil.addClass(this._image, 'leaflet-zoom-animated');
			} else {
				L.DomUtil.addClass(this._image, 'leaflet-zoom-hide');
			}
	
			this._updateOpacity();
	
			//TODO createImage util method to remove duplication
			L.extend(this._image, {
				galleryimg: 'no',
				onselectstart: L.Util.falseFn,
				onmousemove: L.Util.falseFn,
				onload: L.bind(this._onImageLoad, this),
				src: this._url
			});
		},
	
		_animateZoom: function (e) {
			var map = this._map,
			    image = this._image,
			    scale = map.getZoomScale(e.zoom),
			    nw = this._bounds.getNorthWest(),
			    se = this._bounds.getSouthEast(),
	
			    topLeft = map._latLngToNewLayerPoint(nw, e.zoom, e.center),
			    size = map._latLngToNewLayerPoint(se, e.zoom, e.center)._subtract(topLeft),
			    origin = topLeft._add(size._multiplyBy((1 / 2) * (1 - 1 / scale)));
	
			image.style[L.DomUtil.TRANSFORM] =
			        L.DomUtil.getTranslateString(origin) + ' scale(' + scale + ') ';
		},
	
		_reset: function () {
			var image   = this._image,
			    topLeft = this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
			    size = this._map.latLngToLayerPoint(this._bounds.getSouthEast())._subtract(topLeft);
	
			L.DomUtil.setPosition(image, topLeft);
	
			image.style.width  = size.x + 'px';
			image.style.height = size.y + 'px';
		},
	
		_onImageLoad: function () {
			this.fire('load');
		},
	
		_updateOpacity: function () {
			L.DomUtil.setOpacity(this._image, this.options.opacity);
		}
	});
	
	L.imageOverlay = function (url, bounds, options) {
		return new L.ImageOverlay(url, bounds, options);
	};
	
	
	/*
	 * L.Icon is an image-based icon class that you can use with L.Marker for custom markers.
	 */
	
	L.Icon = L.Class.extend({
		options: {
			/*
			iconUrl: (String) (required)
			iconRetinaUrl: (String) (optional, used for retina devices if detected)
			iconSize: (Point) (can be set through CSS)
			iconAnchor: (Point) (centered by default, can be set in CSS with negative margins)
			popupAnchor: (Point) (if not specified, popup opens in the anchor point)
			shadowUrl: (String) (no shadow by default)
			shadowRetinaUrl: (String) (optional, used for retina devices if detected)
			shadowSize: (Point)
			shadowAnchor: (Point)
			*/
			className: ''
		},
	
		initialize: function (options) {
			L.setOptions(this, options);
		},
	
		createIcon: function (oldIcon) {
			return this._createIcon('icon', oldIcon);
		},
	
		createShadow: function (oldIcon) {
			return this._createIcon('shadow', oldIcon);
		},
	
		_createIcon: function (name, oldIcon) {
			var src = this._getIconUrl(name);
	
			if (!src) {
				if (name === 'icon') {
					throw new Error('iconUrl not set in Icon options (see the docs).');
				}
				return null;
			}
	
			var img;
			if (!oldIcon || oldIcon.tagName !== 'IMG') {
				img = this._createImg(src);
			} else {
				img = this._createImg(src, oldIcon);
			}
			this._setIconStyles(img, name);
	
			return img;
		},
	
		_setIconStyles: function (img, name) {
			var options = this.options,
			    size = L.point(options[name + 'Size']),
			    anchor;
	
			if (name === 'shadow') {
				anchor = L.point(options.shadowAnchor || options.iconAnchor);
			} else {
				anchor = L.point(options.iconAnchor);
			}
	
			if (!anchor && size) {
				anchor = size.divideBy(2, true);
			}
	
			img.className = 'leaflet-marker-' + name + ' ' + options.className;
	
			if (anchor) {
				img.style.marginLeft = (-anchor.x) + 'px';
				img.style.marginTop  = (-anchor.y) + 'px';
			}
	
			if (size) {
				img.style.width  = size.x + 'px';
				img.style.height = size.y + 'px';
			}
		},
	
		_createImg: function (src, el) {
			el = el || document.createElement('img');
			el.src = src;
			return el;
		},
	
		_getIconUrl: function (name) {
			if (L.Browser.retina && this.options[name + 'RetinaUrl']) {
				return this.options[name + 'RetinaUrl'];
			}
			return this.options[name + 'Url'];
		}
	});
	
	L.icon = function (options) {
		return new L.Icon(options);
	};
	
	
	/*
	 * L.Icon.Default is the blue marker icon used by default in Leaflet.
	 */
	
	L.Icon.Default = L.Icon.extend({
	
		options: {
			iconSize: [25, 41],
			iconAnchor: [12, 41],
			popupAnchor: [1, -34],
	
			shadowSize: [41, 41]
		},
	
		_getIconUrl: function (name) {
			var key = name + 'Url';
	
			if (this.options[key]) {
				return this.options[key];
			}
	
			if (L.Browser.retina && name === 'icon') {
				name += '-2x';
			}
	
			var path = L.Icon.Default.imagePath;
	
			if (!path) {
				throw new Error('Couldn\'t autodetect L.Icon.Default.imagePath, set it manually.');
			}
	
			return path + '/marker-' + name + '.png';
		}
	});
	
	L.Icon.Default.imagePath = (function () {
		var scripts = document.getElementsByTagName('script'),
		    leafletRe = /[\/^]leaflet[\-\._]?([\w\-\._]*)\.js\??/;
	
		var i, len, src, matches, path;
	
		for (i = 0, len = scripts.length; i < len; i++) {
			src = scripts[i].src;
			matches = src.match(leafletRe);
	
			if (matches) {
				path = src.split(leafletRe)[0];
				return (path ? path + '/' : '') + 'images';
			}
		}
	}());
	
	
	/*
	 * L.Marker is used to display clickable/draggable icons on the map.
	 */
	
	L.Marker = L.Class.extend({
	
		includes: L.Mixin.Events,
	
		options: {
			icon: new L.Icon.Default(),
			title: '',
			alt: '',
			clickable: true,
			draggable: false,
			keyboard: true,
			zIndexOffset: 0,
			opacity: 1,
			riseOnHover: false,
			riseOffset: 250
		},
	
		initialize: function (latlng, options) {
			L.setOptions(this, options);
			this._latlng = L.latLng(latlng);
		},
	
		onAdd: function (map) {
			this._map = map;
	
			map.on('viewreset', this.update, this);
	
			this._initIcon();
			this.update();
			this.fire('add');
	
			if (map.options.zoomAnimation && map.options.markerZoomAnimation) {
				map.on('zoomanim', this._animateZoom, this);
			}
		},
	
		addTo: function (map) {
			map.addLayer(this);
			return this;
		},
	
		onRemove: function (map) {
			if (this.dragging) {
				this.dragging.disable();
			}
	
			this._removeIcon();
			this._removeShadow();
	
			this.fire('remove');
	
			map.off({
				'viewreset': this.update,
				'zoomanim': this._animateZoom
			}, this);
	
			this._map = null;
		},
	
		getLatLng: function () {
			return this._latlng;
		},
	
		setLatLng: function (latlng) {
			this._latlng = L.latLng(latlng);
	
			this.update();
	
			return this.fire('move', { latlng: this._latlng });
		},
	
		setZIndexOffset: function (offset) {
			this.options.zIndexOffset = offset;
			this.update();
	
			return this;
		},
	
		setIcon: function (icon) {
	
			this.options.icon = icon;
	
			if (this._map) {
				this._initIcon();
				this.update();
			}
	
			if (this._popup) {
				this.bindPopup(this._popup);
			}
	
			return this;
		},
	
		update: function () {
			if (this._icon) {
				this._setPos(this._map.latLngToLayerPoint(this._latlng).round());
			}
			return this;
		},
	
		_initIcon: function () {
			var options = this.options,
			    map = this._map,
			    animation = (map.options.zoomAnimation && map.options.markerZoomAnimation),
			    classToAdd = animation ? 'leaflet-zoom-animated' : 'leaflet-zoom-hide';
	
			var icon = options.icon.createIcon(this._icon),
				addIcon = false;
	
			// if we're not reusing the icon, remove the old one and init new one
			if (icon !== this._icon) {
				if (this._icon) {
					this._removeIcon();
				}
				addIcon = true;
	
				if (options.title) {
					icon.title = options.title;
				}
	
				if (options.alt) {
					icon.alt = options.alt;
				}
			}
	
			L.DomUtil.addClass(icon, classToAdd);
	
			if (options.keyboard) {
				icon.tabIndex = '0';
			}
	
			this._icon = icon;
	
			this._initInteraction();
	
			if (options.riseOnHover) {
				L.DomEvent
					.on(icon, 'mouseover', this._bringToFront, this)
					.on(icon, 'mouseout', this._resetZIndex, this);
			}
	
			var newShadow = options.icon.createShadow(this._shadow),
				addShadow = false;
	
			if (newShadow !== this._shadow) {
				this._removeShadow();
				addShadow = true;
			}
	
			if (newShadow) {
				L.DomUtil.addClass(newShadow, classToAdd);
			}
			this._shadow = newShadow;
	
	
			if (options.opacity < 1) {
				this._updateOpacity();
			}
	
	
			var panes = this._map._panes;
	
			if (addIcon) {
				panes.markerPane.appendChild(this._icon);
			}
	
			if (newShadow && addShadow) {
				panes.shadowPane.appendChild(this._shadow);
			}
		},
	
		_removeIcon: function () {
			if (this.options.riseOnHover) {
				L.DomEvent
				    .off(this._icon, 'mouseover', this._bringToFront)
				    .off(this._icon, 'mouseout', this._resetZIndex);
			}
	
			this._map._panes.markerPane.removeChild(this._icon);
	
			this._icon = null;
		},
	
		_removeShadow: function () {
			if (this._shadow) {
				this._map._panes.shadowPane.removeChild(this._shadow);
			}
			this._shadow = null;
		},
	
		_setPos: function (pos) {
			L.DomUtil.setPosition(this._icon, pos);
	
			if (this._shadow) {
				L.DomUtil.setPosition(this._shadow, pos);
			}
	
			this._zIndex = pos.y + this.options.zIndexOffset;
	
			this._resetZIndex();
		},
	
		_updateZIndex: function (offset) {
			this._icon.style.zIndex = this._zIndex + offset;
		},
	
		_animateZoom: function (opt) {
			var pos = this._map._latLngToNewLayerPoint(this._latlng, opt.zoom, opt.center).round();
	
			this._setPos(pos);
		},
	
		_initInteraction: function () {
	
			if (!this.options.clickable) { return; }
	
			// TODO refactor into something shared with Map/Path/etc. to DRY it up
	
			var icon = this._icon,
			    events = ['dblclick', 'mousedown', 'mouseover', 'mouseout', 'contextmenu'];
	
			L.DomUtil.addClass(icon, 'leaflet-clickable');
			L.DomEvent.on(icon, 'click', this._onMouseClick, this);
			L.DomEvent.on(icon, 'keypress', this._onKeyPress, this);
	
			for (var i = 0; i < events.length; i++) {
				L.DomEvent.on(icon, events[i], this._fireMouseEvent, this);
			}
	
			if (L.Handler.MarkerDrag) {
				this.dragging = new L.Handler.MarkerDrag(this);
	
				if (this.options.draggable) {
					this.dragging.enable();
				}
			}
		},
	
		_onMouseClick: function (e) {
			var wasDragged = this.dragging && this.dragging.moved();
	
			if (this.hasEventListeners(e.type) || wasDragged) {
				L.DomEvent.stopPropagation(e);
			}
	
			if (wasDragged) { return; }
	
			if ((!this.dragging || !this.dragging._enabled) && this._map.dragging && this._map.dragging.moved()) { return; }
	
			this.fire(e.type, {
				originalEvent: e,
				latlng: this._latlng
			});
		},
	
		_onKeyPress: function (e) {
			if (e.keyCode === 13) {
				this.fire('click', {
					originalEvent: e,
					latlng: this._latlng
				});
			}
		},
	
		_fireMouseEvent: function (e) {
	
			this.fire(e.type, {
				originalEvent: e,
				latlng: this._latlng
			});
	
			// TODO proper custom event propagation
			// this line will always be called if marker is in a FeatureGroup
			if (e.type === 'contextmenu' && this.hasEventListeners(e.type)) {
				L.DomEvent.preventDefault(e);
			}
			if (e.type !== 'mousedown') {
				L.DomEvent.stopPropagation(e);
			} else {
				L.DomEvent.preventDefault(e);
			}
		},
	
		setOpacity: function (opacity) {
			this.options.opacity = opacity;
			if (this._map) {
				this._updateOpacity();
			}
	
			return this;
		},
	
		_updateOpacity: function () {
			L.DomUtil.setOpacity(this._icon, this.options.opacity);
			if (this._shadow) {
				L.DomUtil.setOpacity(this._shadow, this.options.opacity);
			}
		},
	
		_bringToFront: function () {
			this._updateZIndex(this.options.riseOffset);
		},
	
		_resetZIndex: function () {
			this._updateZIndex(0);
		}
	});
	
	L.marker = function (latlng, options) {
		return new L.Marker(latlng, options);
	};
	
	
	/*
	 * L.DivIcon is a lightweight HTML-based icon class (as opposed to the image-based L.Icon)
	 * to use with L.Marker.
	 */
	
	L.DivIcon = L.Icon.extend({
		options: {
			iconSize: [12, 12], // also can be set through CSS
			/*
			iconAnchor: (Point)
			popupAnchor: (Point)
			html: (String)
			bgPos: (Point)
			*/
			className: 'leaflet-div-icon',
			html: false
		},
	
		createIcon: function (oldIcon) {
			var div = (oldIcon && oldIcon.tagName === 'DIV') ? oldIcon : document.createElement('div'),
			    options = this.options;
	
			if (options.html !== false) {
				div.innerHTML = options.html;
			} else {
				div.innerHTML = '';
			}
	
			if (options.bgPos) {
				div.style.backgroundPosition =
				        (-options.bgPos.x) + 'px ' + (-options.bgPos.y) + 'px';
			}
	
			this._setIconStyles(div, 'icon');
			return div;
		},
	
		createShadow: function () {
			return null;
		}
	});
	
	L.divIcon = function (options) {
		return new L.DivIcon(options);
	};
	
	
	/*
	 * L.Popup is used for displaying popups on the map.
	 */
	
	L.Map.mergeOptions({
		closePopupOnClick: true
	});
	
	L.Popup = L.Class.extend({
		includes: L.Mixin.Events,
	
		options: {
			minWidth: 50,
			maxWidth: 300,
			// maxHeight: null,
			autoPan: true,
			closeButton: true,
			offset: [0, 7],
			autoPanPadding: [5, 5],
			// autoPanPaddingTopLeft: null,
			// autoPanPaddingBottomRight: null,
			keepInView: false,
			className: '',
			zoomAnimation: true
		},
	
		initialize: function (options, source) {
			L.setOptions(this, options);
	
			this._source = source;
			this._animated = L.Browser.any3d && this.options.zoomAnimation;
			this._isOpen = false;
		},
	
		onAdd: function (map) {
			this._map = map;
	
			if (!this._container) {
				this._initLayout();
			}
	
			var animFade = map.options.fadeAnimation;
	
			if (animFade) {
				L.DomUtil.setOpacity(this._container, 0);
			}
			map._panes.popupPane.appendChild(this._container);
	
			map.on(this._getEvents(), this);
	
			this.update();
	
			if (animFade) {
				L.DomUtil.setOpacity(this._container, 1);
			}
	
			this.fire('open');
	
			map.fire('popupopen', {popup: this});
	
			if (this._source) {
				this._source.fire('popupopen', {popup: this});
			}
		},
	
		addTo: function (map) {
			map.addLayer(this);
			return this;
		},
	
		openOn: function (map) {
			map.openPopup(this);
			return this;
		},
	
		onRemove: function (map) {
			map._panes.popupPane.removeChild(this._container);
	
			L.Util.falseFn(this._container.offsetWidth); // force reflow
	
			map.off(this._getEvents(), this);
	
			if (map.options.fadeAnimation) {
				L.DomUtil.setOpacity(this._container, 0);
			}
	
			this._map = null;
	
			this.fire('close');
	
			map.fire('popupclose', {popup: this});
	
			if (this._source) {
				this._source.fire('popupclose', {popup: this});
			}
		},
	
		getLatLng: function () {
			return this._latlng;
		},
	
		setLatLng: function (latlng) {
			this._latlng = L.latLng(latlng);
			if (this._map) {
				this._updatePosition();
				this._adjustPan();
			}
			return this;
		},
	
		getContent: function () {
			return this._content;
		},
	
		setContent: function (content) {
			this._content = content;
			this.update();
			return this;
		},
	
		update: function () {
			if (!this._map) { return; }
	
			this._container.style.visibility = 'hidden';
	
			this._updateContent();
			this._updateLayout();
			this._updatePosition();
	
			this._container.style.visibility = '';
	
			this._adjustPan();
		},
	
		_getEvents: function () {
			var events = {
				viewreset: this._updatePosition
			};
	
			if (this._animated) {
				events.zoomanim = this._zoomAnimation;
			}
			if ('closeOnClick' in this.options ? this.options.closeOnClick : this._map.options.closePopupOnClick) {
				events.preclick = this._close;
			}
			if (this.options.keepInView) {
				events.moveend = this._adjustPan;
			}
	
			return events;
		},
	
		_close: function () {
			if (this._map) {
				this._map.closePopup(this);
			}
		},
	
		_initLayout: function () {
			var prefix = 'leaflet-popup',
				containerClass = prefix + ' ' + this.options.className + ' leaflet-zoom-' +
				        (this._animated ? 'animated' : 'hide'),
				container = this._container = L.DomUtil.create('div', containerClass),
				closeButton;
	
			if (this.options.closeButton) {
				closeButton = this._closeButton =
				        L.DomUtil.create('a', prefix + '-close-button', container);
				closeButton.href = '#close';
				closeButton.innerHTML = '&#215;';
				L.DomEvent.disableClickPropagation(closeButton);
	
				L.DomEvent.on(closeButton, 'click', this._onCloseButtonClick, this);
			}
	
			var wrapper = this._wrapper =
			        L.DomUtil.create('div', prefix + '-content-wrapper', container);
			L.DomEvent.disableClickPropagation(wrapper);
	
			this._contentNode = L.DomUtil.create('div', prefix + '-content', wrapper);
	
			L.DomEvent.disableScrollPropagation(this._contentNode);
			L.DomEvent.on(wrapper, 'contextmenu', L.DomEvent.stopPropagation);
	
			this._tipContainer = L.DomUtil.create('div', prefix + '-tip-container', container);
			this._tip = L.DomUtil.create('div', prefix + '-tip', this._tipContainer);
		},
	
		_updateContent: function () {
			if (!this._content) { return; }
	
			if (typeof this._content === 'string') {
				this._contentNode.innerHTML = this._content;
			} else {
				while (this._contentNode.hasChildNodes()) {
					this._contentNode.removeChild(this._contentNode.firstChild);
				}
				this._contentNode.appendChild(this._content);
			}
			this.fire('contentupdate');
		},
	
		_updateLayout: function () {
			var container = this._contentNode,
			    style = container.style;
	
			style.width = '';
			style.whiteSpace = 'nowrap';
	
			var width = container.offsetWidth;
			width = Math.min(width, this.options.maxWidth);
			width = Math.max(width, this.options.minWidth);
	
			style.width = (width + 1) + 'px';
			style.whiteSpace = '';
	
			style.height = '';
	
			var height = container.offsetHeight,
			    maxHeight = this.options.maxHeight,
			    scrolledClass = 'leaflet-popup-scrolled';
	
			if (maxHeight && height > maxHeight) {
				style.height = maxHeight + 'px';
				L.DomUtil.addClass(container, scrolledClass);
			} else {
				L.DomUtil.removeClass(container, scrolledClass);
			}
	
			this._containerWidth = this._container.offsetWidth;
		},
	
		_updatePosition: function () {
			if (!this._map) { return; }
	
			var pos = this._map.latLngToLayerPoint(this._latlng),
			    animated = this._animated,
			    offset = L.point(this.options.offset);
	
			if (animated) {
				L.DomUtil.setPosition(this._container, pos);
			}
	
			this._containerBottom = -offset.y - (animated ? 0 : pos.y);
			this._containerLeft = -Math.round(this._containerWidth / 2) + offset.x + (animated ? 0 : pos.x);
	
			// bottom position the popup in case the height of the popup changes (images loading etc)
			this._container.style.bottom = this._containerBottom + 'px';
			this._container.style.left = this._containerLeft + 'px';
		},
	
		_zoomAnimation: function (opt) {
			var pos = this._map._latLngToNewLayerPoint(this._latlng, opt.zoom, opt.center);
	
			L.DomUtil.setPosition(this._container, pos);
		},
	
		_adjustPan: function () {
			if (!this.options.autoPan) { return; }
	
			var map = this._map,
			    containerHeight = this._container.offsetHeight,
			    containerWidth = this._containerWidth,
	
			    layerPos = new L.Point(this._containerLeft, -containerHeight - this._containerBottom);
	
			if (this._animated) {
				layerPos._add(L.DomUtil.getPosition(this._container));
			}
	
			var containerPos = map.layerPointToContainerPoint(layerPos),
			    padding = L.point(this.options.autoPanPadding),
			    paddingTL = L.point(this.options.autoPanPaddingTopLeft || padding),
			    paddingBR = L.point(this.options.autoPanPaddingBottomRight || padding),
			    size = map.getSize(),
			    dx = 0,
			    dy = 0;
	
			if (containerPos.x + containerWidth + paddingBR.x > size.x) { // right
				dx = containerPos.x + containerWidth - size.x + paddingBR.x;
			}
			if (containerPos.x - dx - paddingTL.x < 0) { // left
				dx = containerPos.x - paddingTL.x;
			}
			if (containerPos.y + containerHeight + paddingBR.y > size.y) { // bottom
				dy = containerPos.y + containerHeight - size.y + paddingBR.y;
			}
			if (containerPos.y - dy - paddingTL.y < 0) { // top
				dy = containerPos.y - paddingTL.y;
			}
	
			if (dx || dy) {
				map
				    .fire('autopanstart')
				    .panBy([dx, dy]);
			}
		},
	
		_onCloseButtonClick: function (e) {
			this._close();
			L.DomEvent.stop(e);
		}
	});
	
	L.popup = function (options, source) {
		return new L.Popup(options, source);
	};
	
	
	L.Map.include({
		openPopup: function (popup, latlng, options) { // (Popup) or (String || HTMLElement, LatLng[, Object])
			this.closePopup();
	
			if (!(popup instanceof L.Popup)) {
				var content = popup;
	
				popup = new L.Popup(options)
				    .setLatLng(latlng)
				    .setContent(content);
			}
			popup._isOpen = true;
	
			this._popup = popup;
			return this.addLayer(popup);
		},
	
		closePopup: function (popup) {
			if (!popup || popup === this._popup) {
				popup = this._popup;
				this._popup = null;
			}
			if (popup) {
				this.removeLayer(popup);
				popup._isOpen = false;
			}
			return this;
		}
	});
	
	
	/*
	 * Popup extension to L.Marker, adding popup-related methods.
	 */
	
	L.Marker.include({
		openPopup: function () {
			if (this._popup && this._map && !this._map.hasLayer(this._popup)) {
				this._popup.setLatLng(this._latlng);
				this._map.openPopup(this._popup);
			}
	
			return this;
		},
	
		closePopup: function () {
			if (this._popup) {
				this._popup._close();
			}
			return this;
		},
	
		togglePopup: function () {
			if (this._popup) {
				if (this._popup._isOpen) {
					this.closePopup();
				} else {
					this.openPopup();
				}
			}
			return this;
		},
	
		bindPopup: function (content, options) {
			var anchor = L.point(this.options.icon.options.popupAnchor || [0, 0]);
	
			anchor = anchor.add(L.Popup.prototype.options.offset);
	
			if (options && options.offset) {
				anchor = anchor.add(options.offset);
			}
	
			options = L.extend({offset: anchor}, options);
	
			if (!this._popupHandlersAdded) {
				this
				    .on('click', this.togglePopup, this)
				    .on('remove', this.closePopup, this)
				    .on('move', this._movePopup, this);
				this._popupHandlersAdded = true;
			}
	
			if (content instanceof L.Popup) {
				L.setOptions(content, options);
				this._popup = content;
				content._source = this;
			} else {
				this._popup = new L.Popup(options, this)
					.setContent(content);
			}
	
			return this;
		},
	
		setPopupContent: function (content) {
			if (this._popup) {
				this._popup.setContent(content);
			}
			return this;
		},
	
		unbindPopup: function () {
			if (this._popup) {
				this._popup = null;
				this
				    .off('click', this.togglePopup, this)
				    .off('remove', this.closePopup, this)
				    .off('move', this._movePopup, this);
				this._popupHandlersAdded = false;
			}
			return this;
		},
	
		getPopup: function () {
			return this._popup;
		},
	
		_movePopup: function (e) {
			this._popup.setLatLng(e.latlng);
		}
	});
	
	
	/*
	 * L.LayerGroup is a class to combine several layers into one so that
	 * you can manipulate the group (e.g. add/remove it) as one layer.
	 */
	
	L.LayerGroup = L.Class.extend({
		initialize: function (layers) {
			this._layers = {};
	
			var i, len;
	
			if (layers) {
				for (i = 0, len = layers.length; i < len; i++) {
					this.addLayer(layers[i]);
				}
			}
		},
	
		addLayer: function (layer) {
			var id = this.getLayerId(layer);
	
			this._layers[id] = layer;
	
			if (this._map) {
				this._map.addLayer(layer);
			}
	
			return this;
		},
	
		removeLayer: function (layer) {
			var id = layer in this._layers ? layer : this.getLayerId(layer);
	
			if (this._map && this._layers[id]) {
				this._map.removeLayer(this._layers[id]);
			}
	
			delete this._layers[id];
	
			return this;
		},
	
		hasLayer: function (layer) {
			if (!layer) { return false; }
	
			return (layer in this._layers || this.getLayerId(layer) in this._layers);
		},
	
		clearLayers: function () {
			this.eachLayer(this.removeLayer, this);
			return this;
		},
	
		invoke: function (methodName) {
			var args = Array.prototype.slice.call(arguments, 1),
			    i, layer;
	
			for (i in this._layers) {
				layer = this._layers[i];
	
				if (layer[methodName]) {
					layer[methodName].apply(layer, args);
				}
			}
	
			return this;
		},
	
		onAdd: function (map) {
			this._map = map;
			this.eachLayer(map.addLayer, map);
		},
	
		onRemove: function (map) {
			this.eachLayer(map.removeLayer, map);
			this._map = null;
		},
	
		addTo: function (map) {
			map.addLayer(this);
			return this;
		},
	
		eachLayer: function (method, context) {
			for (var i in this._layers) {
				method.call(context, this._layers[i]);
			}
			return this;
		},
	
		getLayer: function (id) {
			return this._layers[id];
		},
	
		getLayers: function () {
			var layers = [];
	
			for (var i in this._layers) {
				layers.push(this._layers[i]);
			}
			return layers;
		},
	
		setZIndex: function (zIndex) {
			return this.invoke('setZIndex', zIndex);
		},
	
		getLayerId: function (layer) {
			return L.stamp(layer);
		}
	});
	
	L.layerGroup = function (layers) {
		return new L.LayerGroup(layers);
	};
	
	
	/*
	 * L.FeatureGroup extends L.LayerGroup by introducing mouse events and additional methods
	 * shared between a group of interactive layers (like vectors or markers).
	 */
	
	L.FeatureGroup = L.LayerGroup.extend({
		includes: L.Mixin.Events,
	
		statics: {
			EVENTS: 'click dblclick mouseover mouseout mousemove contextmenu popupopen popupclose'
		},
	
		addLayer: function (layer) {
			if (this.hasLayer(layer)) {
				return this;
			}
	
			if ('on' in layer) {
				layer.on(L.FeatureGroup.EVENTS, this._propagateEvent, this);
			}
	
			L.LayerGroup.prototype.addLayer.call(this, layer);
	
			if (this._popupContent && layer.bindPopup) {
				layer.bindPopup(this._popupContent, this._popupOptions);
			}
	
			return this.fire('layeradd', {layer: layer});
		},
	
		removeLayer: function (layer) {
			if (!this.hasLayer(layer)) {
				return this;
			}
			if (layer in this._layers) {
				layer = this._layers[layer];
			}
	
			if ('off' in layer) {
				layer.off(L.FeatureGroup.EVENTS, this._propagateEvent, this);
			}
	
			L.LayerGroup.prototype.removeLayer.call(this, layer);
	
			if (this._popupContent) {
				this.invoke('unbindPopup');
			}
	
			return this.fire('layerremove', {layer: layer});
		},
	
		bindPopup: function (content, options) {
			this._popupContent = content;
			this._popupOptions = options;
			return this.invoke('bindPopup', content, options);
		},
	
		openPopup: function (latlng) {
			// open popup on the first layer
			for (var id in this._layers) {
				this._layers[id].openPopup(latlng);
				break;
			}
			return this;
		},
	
		setStyle: function (style) {
			return this.invoke('setStyle', style);
		},
	
		bringToFront: function () {
			return this.invoke('bringToFront');
		},
	
		bringToBack: function () {
			return this.invoke('bringToBack');
		},
	
		getBounds: function () {
			var bounds = new L.LatLngBounds();
	
			this.eachLayer(function (layer) {
				bounds.extend(layer instanceof L.Marker ? layer.getLatLng() : layer.getBounds());
			});
	
			return bounds;
		},
	
		_propagateEvent: function (e) {
			e = L.extend({
				layer: e.target,
				target: this
			}, e);
			this.fire(e.type, e);
		}
	});
	
	L.featureGroup = function (layers) {
		return new L.FeatureGroup(layers);
	};
	
	
	/*
	 * L.Path is a base class for rendering vector paths on a map. Inherited by Polyline, Circle, etc.
	 */
	
	L.Path = L.Class.extend({
		includes: [L.Mixin.Events],
	
		statics: {
			// how much to extend the clip area around the map view
			// (relative to its size, e.g. 0.5 is half the screen in each direction)
			// set it so that SVG element doesn't exceed 1280px (vectors flicker on dragend if it is)
			CLIP_PADDING: (function () {
				var max = L.Browser.mobile ? 1280 : 2000,
				    target = (max / Math.max(window.outerWidth, window.outerHeight) - 1) / 2;
				return Math.max(0, Math.min(0.5, target));
			})()
		},
	
		options: {
			stroke: true,
			color: '#0033ff',
			dashArray: null,
			lineCap: null,
			lineJoin: null,
			weight: 5,
			opacity: 0.5,
	
			fill: false,
			fillColor: null, //same as color by default
			fillOpacity: 0.2,
	
			clickable: true
		},
	
		initialize: function (options) {
			L.setOptions(this, options);
		},
	
		onAdd: function (map) {
			this._map = map;
	
			if (!this._container) {
				this._initElements();
				this._initEvents();
			}
	
			this.projectLatlngs();
			this._updatePath();
	
			if (this._container) {
				this._map._pathRoot.appendChild(this._container);
			}
	
			this.fire('add');
	
			map.on({
				'viewreset': this.projectLatlngs,
				'moveend': this._updatePath
			}, this);
		},
	
		addTo: function (map) {
			map.addLayer(this);
			return this;
		},
	
		onRemove: function (map) {
			map._pathRoot.removeChild(this._container);
	
			// Need to fire remove event before we set _map to null as the event hooks might need the object
			this.fire('remove');
			this._map = null;
	
			if (L.Browser.vml) {
				this._container = null;
				this._stroke = null;
				this._fill = null;
			}
	
			map.off({
				'viewreset': this.projectLatlngs,
				'moveend': this._updatePath
			}, this);
		},
	
		projectLatlngs: function () {
			// do all projection stuff here
		},
	
		setStyle: function (style) {
			L.setOptions(this, style);
	
			if (this._container) {
				this._updateStyle();
			}
	
			return this;
		},
	
		redraw: function () {
			if (this._map) {
				this.projectLatlngs();
				this._updatePath();
			}
			return this;
		}
	});
	
	L.Map.include({
		_updatePathViewport: function () {
			var p = L.Path.CLIP_PADDING,
			    size = this.getSize(),
			    panePos = L.DomUtil.getPosition(this._mapPane),
			    min = panePos.multiplyBy(-1)._subtract(size.multiplyBy(p)._round()),
			    max = min.add(size.multiplyBy(1 + p * 2)._round());
	
			this._pathViewport = new L.Bounds(min, max);
		}
	});
	
	
	/*
	 * Extends L.Path with SVG-specific rendering code.
	 */
	
	L.Path.SVG_NS = 'http://www.w3.org/2000/svg';
	
	L.Browser.svg = !!(document.createElementNS && document.createElementNS(L.Path.SVG_NS, 'svg').createSVGRect);
	
	L.Path = L.Path.extend({
		statics: {
			SVG: L.Browser.svg
		},
	
		bringToFront: function () {
			var root = this._map._pathRoot,
			    path = this._container;
	
			if (path && root.lastChild !== path) {
				root.appendChild(path);
			}
			return this;
		},
	
		bringToBack: function () {
			var root = this._map._pathRoot,
			    path = this._container,
			    first = root.firstChild;
	
			if (path && first !== path) {
				root.insertBefore(path, first);
			}
			return this;
		},
	
		getPathString: function () {
			// form path string here
		},
	
		_createElement: function (name) {
			return document.createElementNS(L.Path.SVG_NS, name);
		},
	
		_initElements: function () {
			this._map._initPathRoot();
			this._initPath();
			this._initStyle();
		},
	
		_initPath: function () {
			this._container = this._createElement('g');
	
			this._path = this._createElement('path');
	
			if (this.options.className) {
				L.DomUtil.addClass(this._path, this.options.className);
			}
	
			this._container.appendChild(this._path);
		},
	
		_initStyle: function () {
			if (this.options.stroke) {
				this._path.setAttribute('stroke-linejoin', 'round');
				this._path.setAttribute('stroke-linecap', 'round');
			}
			if (this.options.fill) {
				this._path.setAttribute('fill-rule', 'evenodd');
			}
			if (this.options.pointerEvents) {
				this._path.setAttribute('pointer-events', this.options.pointerEvents);
			}
			if (!this.options.clickable && !this.options.pointerEvents) {
				this._path.setAttribute('pointer-events', 'none');
			}
			this._updateStyle();
		},
	
		_updateStyle: function () {
			if (this.options.stroke) {
				this._path.setAttribute('stroke', this.options.color);
				this._path.setAttribute('stroke-opacity', this.options.opacity);
				this._path.setAttribute('stroke-width', this.options.weight);
				if (this.options.dashArray) {
					this._path.setAttribute('stroke-dasharray', this.options.dashArray);
				} else {
					this._path.removeAttribute('stroke-dasharray');
				}
				if (this.options.lineCap) {
					this._path.setAttribute('stroke-linecap', this.options.lineCap);
				}
				if (this.options.lineJoin) {
					this._path.setAttribute('stroke-linejoin', this.options.lineJoin);
				}
			} else {
				this._path.setAttribute('stroke', 'none');
			}
			if (this.options.fill) {
				this._path.setAttribute('fill', this.options.fillColor || this.options.color);
				this._path.setAttribute('fill-opacity', this.options.fillOpacity);
			} else {
				this._path.setAttribute('fill', 'none');
			}
		},
	
		_updatePath: function () {
			var str = this.getPathString();
			if (!str) {
				// fix webkit empty string parsing bug
				str = 'M0 0';
			}
			this._path.setAttribute('d', str);
		},
	
		// TODO remove duplication with L.Map
		_initEvents: function () {
			if (this.options.clickable) {
				if (L.Browser.svg || !L.Browser.vml) {
					L.DomUtil.addClass(this._path, 'leaflet-clickable');
				}
	
				L.DomEvent.on(this._container, 'click', this._onMouseClick, this);
	
				var events = ['dblclick', 'mousedown', 'mouseover',
				              'mouseout', 'mousemove', 'contextmenu'];
				for (var i = 0; i < events.length; i++) {
					L.DomEvent.on(this._container, events[i], this._fireMouseEvent, this);
				}
			}
		},
	
		_onMouseClick: function (e) {
			if (this._map.dragging && this._map.dragging.moved()) { return; }
	
			this._fireMouseEvent(e);
		},
	
		_fireMouseEvent: function (e) {
			if (!this._map || !this.hasEventListeners(e.type)) { return; }
	
			var map = this._map,
			    containerPoint = map.mouseEventToContainerPoint(e),
			    layerPoint = map.containerPointToLayerPoint(containerPoint),
			    latlng = map.layerPointToLatLng(layerPoint);
	
			this.fire(e.type, {
				latlng: latlng,
				layerPoint: layerPoint,
				containerPoint: containerPoint,
				originalEvent: e
			});
	
			if (e.type === 'contextmenu') {
				L.DomEvent.preventDefault(e);
			}
			if (e.type !== 'mousemove') {
				L.DomEvent.stopPropagation(e);
			}
		}
	});
	
	L.Map.include({
		_initPathRoot: function () {
			if (!this._pathRoot) {
				this._pathRoot = L.Path.prototype._createElement('svg');
				this._panes.overlayPane.appendChild(this._pathRoot);
	
				if (this.options.zoomAnimation && L.Browser.any3d) {
					L.DomUtil.addClass(this._pathRoot, 'leaflet-zoom-animated');
	
					this.on({
						'zoomanim': this._animatePathZoom,
						'zoomend': this._endPathZoom
					});
				} else {
					L.DomUtil.addClass(this._pathRoot, 'leaflet-zoom-hide');
				}
	
				this.on('moveend', this._updateSvgViewport);
				this._updateSvgViewport();
			}
		},
	
		_animatePathZoom: function (e) {
			var scale = this.getZoomScale(e.zoom),
			    offset = this._getCenterOffset(e.center)._multiplyBy(-scale)._add(this._pathViewport.min);
	
			this._pathRoot.style[L.DomUtil.TRANSFORM] =
			        L.DomUtil.getTranslateString(offset) + ' scale(' + scale + ') ';
	
			this._pathZooming = true;
		},
	
		_endPathZoom: function () {
			this._pathZooming = false;
		},
	
		_updateSvgViewport: function () {
	
			if (this._pathZooming) {
				// Do not update SVGs while a zoom animation is going on otherwise the animation will break.
				// When the zoom animation ends we will be updated again anyway
				// This fixes the case where you do a momentum move and zoom while the move is still ongoing.
				return;
			}
	
			this._updatePathViewport();
	
			var vp = this._pathViewport,
			    min = vp.min,
			    max = vp.max,
			    width = max.x - min.x,
			    height = max.y - min.y,
			    root = this._pathRoot,
			    pane = this._panes.overlayPane;
	
			// Hack to make flicker on drag end on mobile webkit less irritating
			if (L.Browser.mobileWebkit) {
				pane.removeChild(root);
			}
	
			L.DomUtil.setPosition(root, min);
			root.setAttribute('width', width);
			root.setAttribute('height', height);
			root.setAttribute('viewBox', [min.x, min.y, width, height].join(' '));
	
			if (L.Browser.mobileWebkit) {
				pane.appendChild(root);
			}
		}
	});
	
	
	/*
	 * Popup extension to L.Path (polylines, polygons, circles), adding popup-related methods.
	 */
	
	L.Path.include({
	
		bindPopup: function (content, options) {
	
			if (content instanceof L.Popup) {
				this._popup = content;
			} else {
				if (!this._popup || options) {
					this._popup = new L.Popup(options, this);
				}
				this._popup.setContent(content);
			}
	
			if (!this._popupHandlersAdded) {
				this
				    .on('click', this._openPopup, this)
				    .on('remove', this.closePopup, this);
	
				this._popupHandlersAdded = true;
			}
	
			return this;
		},
	
		unbindPopup: function () {
			if (this._popup) {
				this._popup = null;
				this
				    .off('click', this._openPopup)
				    .off('remove', this.closePopup);
	
				this._popupHandlersAdded = false;
			}
			return this;
		},
	
		openPopup: function (latlng) {
	
			if (this._popup) {
				// open the popup from one of the path's points if not specified
				latlng = latlng || this._latlng ||
				         this._latlngs[Math.floor(this._latlngs.length / 2)];
	
				this._openPopup({latlng: latlng});
			}
	
			return this;
		},
	
		closePopup: function () {
			if (this._popup) {
				this._popup._close();
			}
			return this;
		},
	
		_openPopup: function (e) {
			this._popup.setLatLng(e.latlng);
			this._map.openPopup(this._popup);
		}
	});
	
	
	/*
	 * Vector rendering for IE6-8 through VML.
	 * Thanks to Dmitry Baranovsky and his Raphael library for inspiration!
	 */
	
	L.Browser.vml = !L.Browser.svg && (function () {
		try {
			var div = document.createElement('div');
			div.innerHTML = '<v:shape adj="1"/>';
	
			var shape = div.firstChild;
			shape.style.behavior = 'url(#default#VML)';
	
			return shape && (typeof shape.adj === 'object');
	
		} catch (e) {
			return false;
		}
	}());
	
	L.Path = L.Browser.svg || !L.Browser.vml ? L.Path : L.Path.extend({
		statics: {
			VML: true,
			CLIP_PADDING: 0.02
		},
	
		_createElement: (function () {
			try {
				document.namespaces.add('lvml', 'urn:schemas-microsoft-com:vml');
				return function (name) {
					return document.createElement('<lvml:' + name + ' class="lvml">');
				};
			} catch (e) {
				return function (name) {
					return document.createElement(
					        '<' + name + ' xmlns="urn:schemas-microsoft.com:vml" class="lvml">');
				};
			}
		}()),
	
		_initPath: function () {
			var container = this._container = this._createElement('shape');
	
			L.DomUtil.addClass(container, 'leaflet-vml-shape' +
				(this.options.className ? ' ' + this.options.className : ''));
	
			if (this.options.clickable) {
				L.DomUtil.addClass(container, 'leaflet-clickable');
			}
	
			container.coordsize = '1 1';
	
			this._path = this._createElement('path');
			container.appendChild(this._path);
	
			this._map._pathRoot.appendChild(container);
		},
	
		_initStyle: function () {
			this._updateStyle();
		},
	
		_updateStyle: function () {
			var stroke = this._stroke,
			    fill = this._fill,
			    options = this.options,
			    container = this._container;
	
			container.stroked = options.stroke;
			container.filled = options.fill;
	
			if (options.stroke) {
				if (!stroke) {
					stroke = this._stroke = this._createElement('stroke');
					stroke.endcap = 'round';
					container.appendChild(stroke);
				}
				stroke.weight = options.weight + 'px';
				stroke.color = options.color;
				stroke.opacity = options.opacity;
	
				if (options.dashArray) {
					stroke.dashStyle = L.Util.isArray(options.dashArray) ?
					    options.dashArray.join(' ') :
					    options.dashArray.replace(/( *, *)/g, ' ');
				} else {
					stroke.dashStyle = '';
				}
				if (options.lineCap) {
					stroke.endcap = options.lineCap.replace('butt', 'flat');
				}
				if (options.lineJoin) {
					stroke.joinstyle = options.lineJoin;
				}
	
			} else if (stroke) {
				container.removeChild(stroke);
				this._stroke = null;
			}
	
			if (options.fill) {
				if (!fill) {
					fill = this._fill = this._createElement('fill');
					container.appendChild(fill);
				}
				fill.color = options.fillColor || options.color;
				fill.opacity = options.fillOpacity;
	
			} else if (fill) {
				container.removeChild(fill);
				this._fill = null;
			}
		},
	
		_updatePath: function () {
			var style = this._container.style;
	
			style.display = 'none';
			this._path.v = this.getPathString() + ' '; // the space fixes IE empty path string bug
			style.display = '';
		}
	});
	
	L.Map.include(L.Browser.svg || !L.Browser.vml ? {} : {
		_initPathRoot: function () {
			if (this._pathRoot) { return; }
	
			var root = this._pathRoot = document.createElement('div');
			root.className = 'leaflet-vml-container';
			this._panes.overlayPane.appendChild(root);
	
			this.on('moveend', this._updatePathViewport);
			this._updatePathViewport();
		}
	});
	
	
	/*
	 * Vector rendering for all browsers that support canvas.
	 */
	
	L.Browser.canvas = (function () {
		return !!document.createElement('canvas').getContext;
	}());
	
	L.Path = (L.Path.SVG && !window.L_PREFER_CANVAS) || !L.Browser.canvas ? L.Path : L.Path.extend({
		statics: {
			//CLIP_PADDING: 0.02, // not sure if there's a need to set it to a small value
			CANVAS: true,
			SVG: false
		},
	
		redraw: function () {
			if (this._map) {
				this.projectLatlngs();
				this._requestUpdate();
			}
			return this;
		},
	
		setStyle: function (style) {
			L.setOptions(this, style);
	
			if (this._map) {
				this._updateStyle();
				this._requestUpdate();
			}
			return this;
		},
	
		onRemove: function (map) {
			map
			    .off('viewreset', this.projectLatlngs, this)
			    .off('moveend', this._updatePath, this);
	
			if (this.options.clickable) {
				this._map.off('click', this._onClick, this);
				this._map.off('mousemove', this._onMouseMove, this);
			}
	
			this._requestUpdate();
			
			this.fire('remove');
			this._map = null;
		},
	
		_requestUpdate: function () {
			if (this._map && !L.Path._updateRequest) {
				L.Path._updateRequest = L.Util.requestAnimFrame(this._fireMapMoveEnd, this._map);
			}
		},
	
		_fireMapMoveEnd: function () {
			L.Path._updateRequest = null;
			this.fire('moveend');
		},
	
		_initElements: function () {
			this._map._initPathRoot();
			this._ctx = this._map._canvasCtx;
		},
	
		_updateStyle: function () {
			var options = this.options;
	
			if (options.stroke) {
				this._ctx.lineWidth = options.weight;
				this._ctx.strokeStyle = options.color;
			}
			if (options.fill) {
				this._ctx.fillStyle = options.fillColor || options.color;
			}
	
			if (options.lineCap) {
				this._ctx.lineCap = options.lineCap;
			}
			if (options.lineJoin) {
				this._ctx.lineJoin = options.lineJoin;
			}
		},
	
		_drawPath: function () {
			var i, j, len, len2, point, drawMethod;
	
			this._ctx.beginPath();
	
			for (i = 0, len = this._parts.length; i < len; i++) {
				for (j = 0, len2 = this._parts[i].length; j < len2; j++) {
					point = this._parts[i][j];
					drawMethod = (j === 0 ? 'move' : 'line') + 'To';
	
					this._ctx[drawMethod](point.x, point.y);
				}
				// TODO refactor ugly hack
				if (this instanceof L.Polygon) {
					this._ctx.closePath();
				}
			}
		},
	
		_checkIfEmpty: function () {
			return !this._parts.length;
		},
	
		_updatePath: function () {
			if (this._checkIfEmpty()) { return; }
	
			var ctx = this._ctx,
			    options = this.options;
	
			this._drawPath();
			ctx.save();
			this._updateStyle();
	
			if (options.fill) {
				ctx.globalAlpha = options.fillOpacity;
				ctx.fill(options.fillRule || 'evenodd');
			}
	
			if (options.stroke) {
				ctx.globalAlpha = options.opacity;
				ctx.stroke();
			}
	
			ctx.restore();
	
			// TODO optimization: 1 fill/stroke for all features with equal style instead of 1 for each feature
		},
	
		_initEvents: function () {
			if (this.options.clickable) {
				this._map.on('mousemove', this._onMouseMove, this);
				this._map.on('click dblclick contextmenu', this._fireMouseEvent, this);
			}
		},
	
		_fireMouseEvent: function (e) {
			if (this._containsPoint(e.layerPoint)) {
				this.fire(e.type, e);
			}
		},
	
		_onMouseMove: function (e) {
			if (!this._map || this._map._animatingZoom) { return; }
	
			// TODO don't do on each move
			if (this._containsPoint(e.layerPoint)) {
				this._ctx.canvas.style.cursor = 'pointer';
				this._mouseInside = true;
				this.fire('mouseover', e);
	
			} else if (this._mouseInside) {
				this._ctx.canvas.style.cursor = '';
				this._mouseInside = false;
				this.fire('mouseout', e);
			}
		}
	});
	
	L.Map.include((L.Path.SVG && !window.L_PREFER_CANVAS) || !L.Browser.canvas ? {} : {
		_initPathRoot: function () {
			var root = this._pathRoot,
			    ctx;
	
			if (!root) {
				root = this._pathRoot = document.createElement('canvas');
				root.style.position = 'absolute';
				ctx = this._canvasCtx = root.getContext('2d');
	
				ctx.lineCap = 'round';
				ctx.lineJoin = 'round';
	
				this._panes.overlayPane.appendChild(root);
	
				if (this.options.zoomAnimation) {
					this._pathRoot.className = 'leaflet-zoom-animated';
					this.on('zoomanim', this._animatePathZoom);
					this.on('zoomend', this._endPathZoom);
				}
				this.on('moveend', this._updateCanvasViewport);
				this._updateCanvasViewport();
			}
		},
	
		_updateCanvasViewport: function () {
			// don't redraw while zooming. See _updateSvgViewport for more details
			if (this._pathZooming) { return; }
			this._updatePathViewport();
	
			var vp = this._pathViewport,
			    min = vp.min,
			    size = vp.max.subtract(min),
			    root = this._pathRoot;
	
			//TODO check if this works properly on mobile webkit
			L.DomUtil.setPosition(root, min);
			root.width = size.x;
			root.height = size.y;
			root.getContext('2d').translate(-min.x, -min.y);
		}
	});
	
	
	/*
	 * L.LineUtil contains different utility functions for line segments
	 * and polylines (clipping, simplification, distances, etc.)
	 */
	
	/*jshint bitwise:false */ // allow bitwise operations for this file
	
	L.LineUtil = {
	
		// Simplify polyline with vertex reduction and Douglas-Peucker simplification.
		// Improves rendering performance dramatically by lessening the number of points to draw.
	
		simplify: function (/*Point[]*/ points, /*Number*/ tolerance) {
			if (!tolerance || !points.length) {
				return points.slice();
			}
	
			var sqTolerance = tolerance * tolerance;
	
			// stage 1: vertex reduction
			points = this._reducePoints(points, sqTolerance);
	
			// stage 2: Douglas-Peucker simplification
			points = this._simplifyDP(points, sqTolerance);
	
			return points;
		},
	
		// distance from a point to a segment between two points
		pointToSegmentDistance:  function (/*Point*/ p, /*Point*/ p1, /*Point*/ p2) {
			return Math.sqrt(this._sqClosestPointOnSegment(p, p1, p2, true));
		},
	
		closestPointOnSegment: function (/*Point*/ p, /*Point*/ p1, /*Point*/ p2) {
			return this._sqClosestPointOnSegment(p, p1, p2);
		},
	
		// Douglas-Peucker simplification, see http://en.wikipedia.org/wiki/Douglas-Peucker_algorithm
		_simplifyDP: function (points, sqTolerance) {
	
			var len = points.length,
			    ArrayConstructor = typeof Uint8Array !== undefined + '' ? Uint8Array : Array,
			    markers = new ArrayConstructor(len);
	
			markers[0] = markers[len - 1] = 1;
	
			this._simplifyDPStep(points, markers, sqTolerance, 0, len - 1);
	
			var i,
			    newPoints = [];
	
			for (i = 0; i < len; i++) {
				if (markers[i]) {
					newPoints.push(points[i]);
				}
			}
	
			return newPoints;
		},
	
		_simplifyDPStep: function (points, markers, sqTolerance, first, last) {
	
			var maxSqDist = 0,
			    index, i, sqDist;
	
			for (i = first + 1; i <= last - 1; i++) {
				sqDist = this._sqClosestPointOnSegment(points[i], points[first], points[last], true);
	
				if (sqDist > maxSqDist) {
					index = i;
					maxSqDist = sqDist;
				}
			}
	
			if (maxSqDist > sqTolerance) {
				markers[index] = 1;
	
				this._simplifyDPStep(points, markers, sqTolerance, first, index);
				this._simplifyDPStep(points, markers, sqTolerance, index, last);
			}
		},
	
		// reduce points that are too close to each other to a single point
		_reducePoints: function (points, sqTolerance) {
			var reducedPoints = [points[0]];
	
			for (var i = 1, prev = 0, len = points.length; i < len; i++) {
				if (this._sqDist(points[i], points[prev]) > sqTolerance) {
					reducedPoints.push(points[i]);
					prev = i;
				}
			}
			if (prev < len - 1) {
				reducedPoints.push(points[len - 1]);
			}
			return reducedPoints;
		},
	
		// Cohen-Sutherland line clipping algorithm.
		// Used to avoid rendering parts of a polyline that are not currently visible.
	
		clipSegment: function (a, b, bounds, useLastCode) {
			var codeA = useLastCode ? this._lastCode : this._getBitCode(a, bounds),
			    codeB = this._getBitCode(b, bounds),
	
			    codeOut, p, newCode;
	
			// save 2nd code to avoid calculating it on the next segment
			this._lastCode = codeB;
	
			while (true) {
				// if a,b is inside the clip window (trivial accept)
				if (!(codeA | codeB)) {
					return [a, b];
				// if a,b is outside the clip window (trivial reject)
				} else if (codeA & codeB) {
					return false;
				// other cases
				} else {
					codeOut = codeA || codeB;
					p = this._getEdgeIntersection(a, b, codeOut, bounds);
					newCode = this._getBitCode(p, bounds);
	
					if (codeOut === codeA) {
						a = p;
						codeA = newCode;
					} else {
						b = p;
						codeB = newCode;
					}
				}
			}
		},
	
		_getEdgeIntersection: function (a, b, code, bounds) {
			var dx = b.x - a.x,
			    dy = b.y - a.y,
			    min = bounds.min,
			    max = bounds.max;
	
			if (code & 8) { // top
				return new L.Point(a.x + dx * (max.y - a.y) / dy, max.y);
			} else if (code & 4) { // bottom
				return new L.Point(a.x + dx * (min.y - a.y) / dy, min.y);
			} else if (code & 2) { // right
				return new L.Point(max.x, a.y + dy * (max.x - a.x) / dx);
			} else if (code & 1) { // left
				return new L.Point(min.x, a.y + dy * (min.x - a.x) / dx);
			}
		},
	
		_getBitCode: function (/*Point*/ p, bounds) {
			var code = 0;
	
			if (p.x < bounds.min.x) { // left
				code |= 1;
			} else if (p.x > bounds.max.x) { // right
				code |= 2;
			}
			if (p.y < bounds.min.y) { // bottom
				code |= 4;
			} else if (p.y > bounds.max.y) { // top
				code |= 8;
			}
	
			return code;
		},
	
		// square distance (to avoid unnecessary Math.sqrt calls)
		_sqDist: function (p1, p2) {
			var dx = p2.x - p1.x,
			    dy = p2.y - p1.y;
			return dx * dx + dy * dy;
		},
	
		// return closest point on segment or distance to that point
		_sqClosestPointOnSegment: function (p, p1, p2, sqDist) {
			var x = p1.x,
			    y = p1.y,
			    dx = p2.x - x,
			    dy = p2.y - y,
			    dot = dx * dx + dy * dy,
			    t;
	
			if (dot > 0) {
				t = ((p.x - x) * dx + (p.y - y) * dy) / dot;
	
				if (t > 1) {
					x = p2.x;
					y = p2.y;
				} else if (t > 0) {
					x += dx * t;
					y += dy * t;
				}
			}
	
			dx = p.x - x;
			dy = p.y - y;
	
			return sqDist ? dx * dx + dy * dy : new L.Point(x, y);
		}
	};
	
	
	/*
	 * L.Polyline is used to display polylines on a map.
	 */
	
	L.Polyline = L.Path.extend({
		initialize: function (latlngs, options) {
			L.Path.prototype.initialize.call(this, options);
	
			this._latlngs = this._convertLatLngs(latlngs);
		},
	
		options: {
			// how much to simplify the polyline on each zoom level
			// more = better performance and smoother look, less = more accurate
			smoothFactor: 1.0,
			noClip: false
		},
	
		projectLatlngs: function () {
			this._originalPoints = [];
	
			for (var i = 0, len = this._latlngs.length; i < len; i++) {
				this._originalPoints[i] = this._map.latLngToLayerPoint(this._latlngs[i]);
			}
		},
	
		getPathString: function () {
			for (var i = 0, len = this._parts.length, str = ''; i < len; i++) {
				str += this._getPathPartStr(this._parts[i]);
			}
			return str;
		},
	
		getLatLngs: function () {
			return this._latlngs;
		},
	
		setLatLngs: function (latlngs) {
			this._latlngs = this._convertLatLngs(latlngs);
			return this.redraw();
		},
	
		addLatLng: function (latlng) {
			this._latlngs.push(L.latLng(latlng));
			return this.redraw();
		},
	
		spliceLatLngs: function () { // (Number index, Number howMany)
			var removed = [].splice.apply(this._latlngs, arguments);
			this._convertLatLngs(this._latlngs, true);
			this.redraw();
			return removed;
		},
	
		closestLayerPoint: function (p) {
			var minDistance = Infinity, parts = this._parts, p1, p2, minPoint = null;
	
			for (var j = 0, jLen = parts.length; j < jLen; j++) {
				var points = parts[j];
				for (var i = 1, len = points.length; i < len; i++) {
					p1 = points[i - 1];
					p2 = points[i];
					var sqDist = L.LineUtil._sqClosestPointOnSegment(p, p1, p2, true);
					if (sqDist < minDistance) {
						minDistance = sqDist;
						minPoint = L.LineUtil._sqClosestPointOnSegment(p, p1, p2);
					}
				}
			}
			if (minPoint) {
				minPoint.distance = Math.sqrt(minDistance);
			}
			return minPoint;
		},
	
		getBounds: function () {
			return new L.LatLngBounds(this.getLatLngs());
		},
	
		_convertLatLngs: function (latlngs, overwrite) {
			var i, len, target = overwrite ? latlngs : [];
	
			for (i = 0, len = latlngs.length; i < len; i++) {
				if (L.Util.isArray(latlngs[i]) && typeof latlngs[i][0] !== 'number') {
					return;
				}
				target[i] = L.latLng(latlngs[i]);
			}
			return target;
		},
	
		_initEvents: function () {
			L.Path.prototype._initEvents.call(this);
		},
	
		_getPathPartStr: function (points) {
			var round = L.Path.VML;
	
			for (var j = 0, len2 = points.length, str = '', p; j < len2; j++) {
				p = points[j];
				if (round) {
					p._round();
				}
				str += (j ? 'L' : 'M') + p.x + ' ' + p.y;
			}
			return str;
		},
	
		_clipPoints: function () {
			var points = this._originalPoints,
			    len = points.length,
			    i, k, segment;
	
			if (this.options.noClip) {
				this._parts = [points];
				return;
			}
	
			this._parts = [];
	
			var parts = this._parts,
			    vp = this._map._pathViewport,
			    lu = L.LineUtil;
	
			for (i = 0, k = 0; i < len - 1; i++) {
				segment = lu.clipSegment(points[i], points[i + 1], vp, i);
				if (!segment) {
					continue;
				}
	
				parts[k] = parts[k] || [];
				parts[k].push(segment[0]);
	
				// if segment goes out of screen, or it's the last one, it's the end of the line part
				if ((segment[1] !== points[i + 1]) || (i === len - 2)) {
					parts[k].push(segment[1]);
					k++;
				}
			}
		},
	
		// simplify each clipped part of the polyline
		_simplifyPoints: function () {
			var parts = this._parts,
			    lu = L.LineUtil;
	
			for (var i = 0, len = parts.length; i < len; i++) {
				parts[i] = lu.simplify(parts[i], this.options.smoothFactor);
			}
		},
	
		_updatePath: function () {
			if (!this._map) { return; }
	
			this._clipPoints();
			this._simplifyPoints();
	
			L.Path.prototype._updatePath.call(this);
		}
	});
	
	L.polyline = function (latlngs, options) {
		return new L.Polyline(latlngs, options);
	};
	
	
	/*
	 * L.PolyUtil contains utility functions for polygons (clipping, etc.).
	 */
	
	/*jshint bitwise:false */ // allow bitwise operations here
	
	L.PolyUtil = {};
	
	/*
	 * Sutherland-Hodgeman polygon clipping algorithm.
	 * Used to avoid rendering parts of a polygon that are not currently visible.
	 */
	L.PolyUtil.clipPolygon = function (points, bounds) {
		var clippedPoints,
		    edges = [1, 4, 2, 8],
		    i, j, k,
		    a, b,
		    len, edge, p,
		    lu = L.LineUtil;
	
		for (i = 0, len = points.length; i < len; i++) {
			points[i]._code = lu._getBitCode(points[i], bounds);
		}
	
		// for each edge (left, bottom, right, top)
		for (k = 0; k < 4; k++) {
			edge = edges[k];
			clippedPoints = [];
	
			for (i = 0, len = points.length, j = len - 1; i < len; j = i++) {
				a = points[i];
				b = points[j];
	
				// if a is inside the clip window
				if (!(a._code & edge)) {
					// if b is outside the clip window (a->b goes out of screen)
					if (b._code & edge) {
						p = lu._getEdgeIntersection(b, a, edge, bounds);
						p._code = lu._getBitCode(p, bounds);
						clippedPoints.push(p);
					}
					clippedPoints.push(a);
	
				// else if b is inside the clip window (a->b enters the screen)
				} else if (!(b._code & edge)) {
					p = lu._getEdgeIntersection(b, a, edge, bounds);
					p._code = lu._getBitCode(p, bounds);
					clippedPoints.push(p);
				}
			}
			points = clippedPoints;
		}
	
		return points;
	};
	
	
	/*
	 * L.Polygon is used to display polygons on a map.
	 */
	
	L.Polygon = L.Polyline.extend({
		options: {
			fill: true
		},
	
		initialize: function (latlngs, options) {
			L.Polyline.prototype.initialize.call(this, latlngs, options);
			this._initWithHoles(latlngs);
		},
	
		_initWithHoles: function (latlngs) {
			var i, len, hole;
			if (latlngs && L.Util.isArray(latlngs[0]) && (typeof latlngs[0][0] !== 'number')) {
				this._latlngs = this._convertLatLngs(latlngs[0]);
				this._holes = latlngs.slice(1);
	
				for (i = 0, len = this._holes.length; i < len; i++) {
					hole = this._holes[i] = this._convertLatLngs(this._holes[i]);
					if (hole[0].equals(hole[hole.length - 1])) {
						hole.pop();
					}
				}
			}
	
			// filter out last point if its equal to the first one
			latlngs = this._latlngs;
	
			if (latlngs.length >= 2 && latlngs[0].equals(latlngs[latlngs.length - 1])) {
				latlngs.pop();
			}
		},
	
		projectLatlngs: function () {
			L.Polyline.prototype.projectLatlngs.call(this);
	
			// project polygon holes points
			// TODO move this logic to Polyline to get rid of duplication
			this._holePoints = [];
	
			if (!this._holes) { return; }
	
			var i, j, len, len2;
	
			for (i = 0, len = this._holes.length; i < len; i++) {
				this._holePoints[i] = [];
	
				for (j = 0, len2 = this._holes[i].length; j < len2; j++) {
					this._holePoints[i][j] = this._map.latLngToLayerPoint(this._holes[i][j]);
				}
			}
		},
	
		setLatLngs: function (latlngs) {
			if (latlngs && L.Util.isArray(latlngs[0]) && (typeof latlngs[0][0] !== 'number')) {
				this._initWithHoles(latlngs);
				return this.redraw();
			} else {
				return L.Polyline.prototype.setLatLngs.call(this, latlngs);
			}
		},
	
		_clipPoints: function () {
			var points = this._originalPoints,
			    newParts = [];
	
			this._parts = [points].concat(this._holePoints);
	
			if (this.options.noClip) { return; }
	
			for (var i = 0, len = this._parts.length; i < len; i++) {
				var clipped = L.PolyUtil.clipPolygon(this._parts[i], this._map._pathViewport);
				if (clipped.length) {
					newParts.push(clipped);
				}
			}
	
			this._parts = newParts;
		},
	
		_getPathPartStr: function (points) {
			var str = L.Polyline.prototype._getPathPartStr.call(this, points);
			return str + (L.Browser.svg ? 'z' : 'x');
		}
	});
	
	L.polygon = function (latlngs, options) {
		return new L.Polygon(latlngs, options);
	};
	
	
	/*
	 * Contains L.MultiPolyline and L.MultiPolygon layers.
	 */
	
	(function () {
		function createMulti(Klass) {
	
			return L.FeatureGroup.extend({
	
				initialize: function (latlngs, options) {
					this._layers = {};
					this._options = options;
					this.setLatLngs(latlngs);
				},
	
				setLatLngs: function (latlngs) {
					var i = 0,
					    len = latlngs.length;
	
					this.eachLayer(function (layer) {
						if (i < len) {
							layer.setLatLngs(latlngs[i++]);
						} else {
							this.removeLayer(layer);
						}
					}, this);
	
					while (i < len) {
						this.addLayer(new Klass(latlngs[i++], this._options));
					}
	
					return this;
				},
	
				getLatLngs: function () {
					var latlngs = [];
	
					this.eachLayer(function (layer) {
						latlngs.push(layer.getLatLngs());
					});
	
					return latlngs;
				}
			});
		}
	
		L.MultiPolyline = createMulti(L.Polyline);
		L.MultiPolygon = createMulti(L.Polygon);
	
		L.multiPolyline = function (latlngs, options) {
			return new L.MultiPolyline(latlngs, options);
		};
	
		L.multiPolygon = function (latlngs, options) {
			return new L.MultiPolygon(latlngs, options);
		};
	}());
	
	
	/*
	 * L.Rectangle extends Polygon and creates a rectangle when passed a LatLngBounds object.
	 */
	
	L.Rectangle = L.Polygon.extend({
		initialize: function (latLngBounds, options) {
			L.Polygon.prototype.initialize.call(this, this._boundsToLatLngs(latLngBounds), options);
		},
	
		setBounds: function (latLngBounds) {
			this.setLatLngs(this._boundsToLatLngs(latLngBounds));
		},
	
		_boundsToLatLngs: function (latLngBounds) {
			latLngBounds = L.latLngBounds(latLngBounds);
			return [
				latLngBounds.getSouthWest(),
				latLngBounds.getNorthWest(),
				latLngBounds.getNorthEast(),
				latLngBounds.getSouthEast()
			];
		}
	});
	
	L.rectangle = function (latLngBounds, options) {
		return new L.Rectangle(latLngBounds, options);
	};
	
	
	/*
	 * L.Circle is a circle overlay (with a certain radius in meters).
	 */
	
	L.Circle = L.Path.extend({
		initialize: function (latlng, radius, options) {
			L.Path.prototype.initialize.call(this, options);
	
			this._latlng = L.latLng(latlng);
			this._mRadius = radius;
		},
	
		options: {
			fill: true
		},
	
		setLatLng: function (latlng) {
			this._latlng = L.latLng(latlng);
			return this.redraw();
		},
	
		setRadius: function (radius) {
			this._mRadius = radius;
			return this.redraw();
		},
	
		projectLatlngs: function () {
			var lngRadius = this._getLngRadius(),
			    latlng = this._latlng,
			    pointLeft = this._map.latLngToLayerPoint([latlng.lat, latlng.lng - lngRadius]);
	
			this._point = this._map.latLngToLayerPoint(latlng);
			this._radius = Math.max(this._point.x - pointLeft.x, 1);
		},
	
		getBounds: function () {
			var lngRadius = this._getLngRadius(),
			    latRadius = (this._mRadius / 40075017) * 360,
			    latlng = this._latlng;
	
			return new L.LatLngBounds(
			        [latlng.lat - latRadius, latlng.lng - lngRadius],
			        [latlng.lat + latRadius, latlng.lng + lngRadius]);
		},
	
		getLatLng: function () {
			return this._latlng;
		},
	
		getPathString: function () {
			var p = this._point,
			    r = this._radius;
	
			if (this._checkIfEmpty()) {
				return '';
			}
	
			if (L.Browser.svg) {
				return 'M' + p.x + ',' + (p.y - r) +
				       'A' + r + ',' + r + ',0,1,1,' +
				       (p.x - 0.1) + ',' + (p.y - r) + ' z';
			} else {
				p._round();
				r = Math.round(r);
				return 'AL ' + p.x + ',' + p.y + ' ' + r + ',' + r + ' 0,' + (65535 * 360);
			}
		},
	
		getRadius: function () {
			return this._mRadius;
		},
	
		// TODO Earth hardcoded, move into projection code!
	
		_getLatRadius: function () {
			return (this._mRadius / 40075017) * 360;
		},
	
		_getLngRadius: function () {
			return this._getLatRadius() / Math.cos(L.LatLng.DEG_TO_RAD * this._latlng.lat);
		},
	
		_checkIfEmpty: function () {
			if (!this._map) {
				return false;
			}
			var vp = this._map._pathViewport,
			    r = this._radius,
			    p = this._point;
	
			return p.x - r > vp.max.x || p.y - r > vp.max.y ||
			       p.x + r < vp.min.x || p.y + r < vp.min.y;
		}
	});
	
	L.circle = function (latlng, radius, options) {
		return new L.Circle(latlng, radius, options);
	};
	
	
	/*
	 * L.CircleMarker is a circle overlay with a permanent pixel radius.
	 */
	
	L.CircleMarker = L.Circle.extend({
		options: {
			radius: 10,
			weight: 2
		},
	
		initialize: function (latlng, options) {
			L.Circle.prototype.initialize.call(this, latlng, null, options);
			this._radius = this.options.radius;
		},
	
		projectLatlngs: function () {
			this._point = this._map.latLngToLayerPoint(this._latlng);
		},
	
		_updateStyle : function () {
			L.Circle.prototype._updateStyle.call(this);
			this.setRadius(this.options.radius);
		},
	
		setLatLng: function (latlng) {
			L.Circle.prototype.setLatLng.call(this, latlng);
			if (this._popup && this._popup._isOpen) {
				this._popup.setLatLng(latlng);
			}
			return this;
		},
	
		setRadius: function (radius) {
			this.options.radius = this._radius = radius;
			return this.redraw();
		},
	
		getRadius: function () {
			return this._radius;
		}
	});
	
	L.circleMarker = function (latlng, options) {
		return new L.CircleMarker(latlng, options);
	};
	
	
	/*
	 * Extends L.Polyline to be able to manually detect clicks on Canvas-rendered polylines.
	 */
	
	L.Polyline.include(!L.Path.CANVAS ? {} : {
		_containsPoint: function (p, closed) {
			var i, j, k, len, len2, dist, part,
			    w = this.options.weight / 2;
	
			if (L.Browser.touch) {
				w += 10; // polyline click tolerance on touch devices
			}
	
			for (i = 0, len = this._parts.length; i < len; i++) {
				part = this._parts[i];
				for (j = 0, len2 = part.length, k = len2 - 1; j < len2; k = j++) {
					if (!closed && (j === 0)) {
						continue;
					}
	
					dist = L.LineUtil.pointToSegmentDistance(p, part[k], part[j]);
	
					if (dist <= w) {
						return true;
					}
				}
			}
			return false;
		}
	});
	
	
	/*
	 * Extends L.Polygon to be able to manually detect clicks on Canvas-rendered polygons.
	 */
	
	L.Polygon.include(!L.Path.CANVAS ? {} : {
		_containsPoint: function (p) {
			var inside = false,
			    part, p1, p2,
			    i, j, k,
			    len, len2;
	
			// TODO optimization: check if within bounds first
	
			if (L.Polyline.prototype._containsPoint.call(this, p, true)) {
				// click on polygon border
				return true;
			}
	
			// ray casting algorithm for detecting if point is in polygon
	
			for (i = 0, len = this._parts.length; i < len; i++) {
				part = this._parts[i];
	
				for (j = 0, len2 = part.length, k = len2 - 1; j < len2; k = j++) {
					p1 = part[j];
					p2 = part[k];
	
					if (((p1.y > p.y) !== (p2.y > p.y)) &&
							(p.x < (p2.x - p1.x) * (p.y - p1.y) / (p2.y - p1.y) + p1.x)) {
						inside = !inside;
					}
				}
			}
	
			return inside;
		}
	});
	
	
	/*
	 * Extends L.Circle with Canvas-specific code.
	 */
	
	L.Circle.include(!L.Path.CANVAS ? {} : {
		_drawPath: function () {
			var p = this._point;
			this._ctx.beginPath();
			this._ctx.arc(p.x, p.y, this._radius, 0, Math.PI * 2, false);
		},
	
		_containsPoint: function (p) {
			var center = this._point,
			    w2 = this.options.stroke ? this.options.weight / 2 : 0;
	
			return (p.distanceTo(center) <= this._radius + w2);
		}
	});
	
	
	/*
	 * CircleMarker canvas specific drawing parts.
	 */
	
	L.CircleMarker.include(!L.Path.CANVAS ? {} : {
		_updateStyle: function () {
			L.Path.prototype._updateStyle.call(this);
		}
	});
	
	
	/*
	 * L.GeoJSON turns any GeoJSON data into a Leaflet layer.
	 */
	
	L.GeoJSON = L.FeatureGroup.extend({
	
		initialize: function (geojson, options) {
			L.setOptions(this, options);
	
			this._layers = {};
	
			if (geojson) {
				this.addData(geojson);
			}
		},
	
		addData: function (geojson) {
			var features = L.Util.isArray(geojson) ? geojson : geojson.features,
			    i, len, feature;
	
			if (features) {
				for (i = 0, len = features.length; i < len; i++) {
					// Only add this if geometry or geometries are set and not null
					feature = features[i];
					if (feature.geometries || feature.geometry || feature.features || feature.coordinates) {
						this.addData(features[i]);
					}
				}
				return this;
			}
	
			var options = this.options;
	
			if (options.filter && !options.filter(geojson)) { return; }
	
			var layer = L.GeoJSON.geometryToLayer(geojson, options.pointToLayer, options.coordsToLatLng, options);
			layer.feature = L.GeoJSON.asFeature(geojson);
	
			layer.defaultOptions = layer.options;
			this.resetStyle(layer);
	
			if (options.onEachFeature) {
				options.onEachFeature(geojson, layer);
			}
	
			return this.addLayer(layer);
		},
	
		resetStyle: function (layer) {
			var style = this.options.style;
			if (style) {
				// reset any custom styles
				L.Util.extend(layer.options, layer.defaultOptions);
	
				this._setLayerStyle(layer, style);
			}
		},
	
		setStyle: function (style) {
			this.eachLayer(function (layer) {
				this._setLayerStyle(layer, style);
			}, this);
		},
	
		_setLayerStyle: function (layer, style) {
			if (typeof style === 'function') {
				style = style(layer.feature);
			}
			if (layer.setStyle) {
				layer.setStyle(style);
			}
		}
	});
	
	L.extend(L.GeoJSON, {
		geometryToLayer: function (geojson, pointToLayer, coordsToLatLng, vectorOptions) {
			var geometry = geojson.type === 'Feature' ? geojson.geometry : geojson,
			    coords = geometry.coordinates,
			    layers = [],
			    latlng, latlngs, i, len;
	
			coordsToLatLng = coordsToLatLng || this.coordsToLatLng;
	
			switch (geometry.type) {
			case 'Point':
				latlng = coordsToLatLng(coords);
				return pointToLayer ? pointToLayer(geojson, latlng) : new L.Marker(latlng);
	
			case 'MultiPoint':
				for (i = 0, len = coords.length; i < len; i++) {
					latlng = coordsToLatLng(coords[i]);
					layers.push(pointToLayer ? pointToLayer(geojson, latlng) : new L.Marker(latlng));
				}
				return new L.FeatureGroup(layers);
	
			case 'LineString':
				latlngs = this.coordsToLatLngs(coords, 0, coordsToLatLng);
				return new L.Polyline(latlngs, vectorOptions);
	
			case 'Polygon':
				if (coords.length === 2 && !coords[1].length) {
					throw new Error('Invalid GeoJSON object.');
				}
				latlngs = this.coordsToLatLngs(coords, 1, coordsToLatLng);
				return new L.Polygon(latlngs, vectorOptions);
	
			case 'MultiLineString':
				latlngs = this.coordsToLatLngs(coords, 1, coordsToLatLng);
				return new L.MultiPolyline(latlngs, vectorOptions);
	
			case 'MultiPolygon':
				latlngs = this.coordsToLatLngs(coords, 2, coordsToLatLng);
				return new L.MultiPolygon(latlngs, vectorOptions);
	
			case 'GeometryCollection':
				for (i = 0, len = geometry.geometries.length; i < len; i++) {
	
					layers.push(this.geometryToLayer({
						geometry: geometry.geometries[i],
						type: 'Feature',
						properties: geojson.properties
					}, pointToLayer, coordsToLatLng, vectorOptions));
				}
				return new L.FeatureGroup(layers);
	
			default:
				throw new Error('Invalid GeoJSON object.');
			}
		},
	
		coordsToLatLng: function (coords) { // (Array[, Boolean]) -> LatLng
			return new L.LatLng(coords[1], coords[0], coords[2]);
		},
	
		coordsToLatLngs: function (coords, levelsDeep, coordsToLatLng) { // (Array[, Number, Function]) -> Array
			var latlng, i, len,
			    latlngs = [];
	
			for (i = 0, len = coords.length; i < len; i++) {
				latlng = levelsDeep ?
				        this.coordsToLatLngs(coords[i], levelsDeep - 1, coordsToLatLng) :
				        (coordsToLatLng || this.coordsToLatLng)(coords[i]);
	
				latlngs.push(latlng);
			}
	
			return latlngs;
		},
	
		latLngToCoords: function (latlng) {
			var coords = [latlng.lng, latlng.lat];
	
			if (latlng.alt !== undefined) {
				coords.push(latlng.alt);
			}
			return coords;
		},
	
		latLngsToCoords: function (latLngs) {
			var coords = [];
	
			for (var i = 0, len = latLngs.length; i < len; i++) {
				coords.push(L.GeoJSON.latLngToCoords(latLngs[i]));
			}
	
			return coords;
		},
	
		getFeature: function (layer, newGeometry) {
			return layer.feature ? L.extend({}, layer.feature, {geometry: newGeometry}) : L.GeoJSON.asFeature(newGeometry);
		},
	
		asFeature: function (geoJSON) {
			if (geoJSON.type === 'Feature') {
				return geoJSON;
			}
	
			return {
				type: 'Feature',
				properties: {},
				geometry: geoJSON
			};
		}
	});
	
	var PointToGeoJSON = {
		toGeoJSON: function () {
			return L.GeoJSON.getFeature(this, {
				type: 'Point',
				coordinates: L.GeoJSON.latLngToCoords(this.getLatLng())
			});
		}
	};
	
	L.Marker.include(PointToGeoJSON);
	L.Circle.include(PointToGeoJSON);
	L.CircleMarker.include(PointToGeoJSON);
	
	L.Polyline.include({
		toGeoJSON: function () {
			return L.GeoJSON.getFeature(this, {
				type: 'LineString',
				coordinates: L.GeoJSON.latLngsToCoords(this.getLatLngs())
			});
		}
	});
	
	L.Polygon.include({
		toGeoJSON: function () {
			var coords = [L.GeoJSON.latLngsToCoords(this.getLatLngs())],
			    i, len, hole;
	
			coords[0].push(coords[0][0]);
	
			if (this._holes) {
				for (i = 0, len = this._holes.length; i < len; i++) {
					hole = L.GeoJSON.latLngsToCoords(this._holes[i]);
					hole.push(hole[0]);
					coords.push(hole);
				}
			}
	
			return L.GeoJSON.getFeature(this, {
				type: 'Polygon',
				coordinates: coords
			});
		}
	});
	
	(function () {
		function multiToGeoJSON(type) {
			return function () {
				var coords = [];
	
				this.eachLayer(function (layer) {
					coords.push(layer.toGeoJSON().geometry.coordinates);
				});
	
				return L.GeoJSON.getFeature(this, {
					type: type,
					coordinates: coords
				});
			};
		}
	
		L.MultiPolyline.include({toGeoJSON: multiToGeoJSON('MultiLineString')});
		L.MultiPolygon.include({toGeoJSON: multiToGeoJSON('MultiPolygon')});
	
		L.LayerGroup.include({
			toGeoJSON: function () {
	
				var geometry = this.feature && this.feature.geometry,
					jsons = [],
					json;
	
				if (geometry && geometry.type === 'MultiPoint') {
					return multiToGeoJSON('MultiPoint').call(this);
				}
	
				var isGeometryCollection = geometry && geometry.type === 'GeometryCollection';
	
				this.eachLayer(function (layer) {
					if (layer.toGeoJSON) {
						json = layer.toGeoJSON();
						jsons.push(isGeometryCollection ? json.geometry : L.GeoJSON.asFeature(json));
					}
				});
	
				if (isGeometryCollection) {
					return L.GeoJSON.getFeature(this, {
						geometries: jsons,
						type: 'GeometryCollection'
					});
				}
	
				return {
					type: 'FeatureCollection',
					features: jsons
				};
			}
		});
	}());
	
	L.geoJson = function (geojson, options) {
		return new L.GeoJSON(geojson, options);
	};
	
	
	/*
	 * L.DomEvent contains functions for working with DOM events.
	 */
	
	L.DomEvent = {
		/* inspired by John Resig, Dean Edwards and YUI addEvent implementations */
		addListener: function (obj, type, fn, context) { // (HTMLElement, String, Function[, Object])
	
			var id = L.stamp(fn),
			    key = '_leaflet_' + type + id,
			    handler, originalHandler, newType;
	
			if (obj[key]) { return this; }
	
			handler = function (e) {
				return fn.call(context || obj, e || L.DomEvent._getEvent());
			};
	
			if (L.Browser.pointer && type.indexOf('touch') === 0) {
				return this.addPointerListener(obj, type, handler, id);
			}
			if (L.Browser.touch && (type === 'dblclick') && this.addDoubleTapListener) {
				this.addDoubleTapListener(obj, handler, id);
			}
	
			if ('addEventListener' in obj) {
	
				if (type === 'mousewheel') {
					obj.addEventListener('DOMMouseScroll', handler, false);
					obj.addEventListener(type, handler, false);
	
				} else if ((type === 'mouseenter') || (type === 'mouseleave')) {
	
					originalHandler = handler;
					newType = (type === 'mouseenter' ? 'mouseover' : 'mouseout');
	
					handler = function (e) {
						if (!L.DomEvent._checkMouse(obj, e)) { return; }
						return originalHandler(e);
					};
	
					obj.addEventListener(newType, handler, false);
	
				} else if (type === 'click' && L.Browser.android) {
					originalHandler = handler;
					handler = function (e) {
						return L.DomEvent._filterClick(e, originalHandler);
					};
	
					obj.addEventListener(type, handler, false);
				} else {
					obj.addEventListener(type, handler, false);
				}
	
			} else if ('attachEvent' in obj) {
				obj.attachEvent('on' + type, handler);
			}
	
			obj[key] = handler;
	
			return this;
		},
	
		removeListener: function (obj, type, fn) {  // (HTMLElement, String, Function)
	
			var id = L.stamp(fn),
			    key = '_leaflet_' + type + id,
			    handler = obj[key];
	
			if (!handler) { return this; }
	
			if (L.Browser.pointer && type.indexOf('touch') === 0) {
				this.removePointerListener(obj, type, id);
			} else if (L.Browser.touch && (type === 'dblclick') && this.removeDoubleTapListener) {
				this.removeDoubleTapListener(obj, id);
	
			} else if ('removeEventListener' in obj) {
	
				if (type === 'mousewheel') {
					obj.removeEventListener('DOMMouseScroll', handler, false);
					obj.removeEventListener(type, handler, false);
	
				} else if ((type === 'mouseenter') || (type === 'mouseleave')) {
					obj.removeEventListener((type === 'mouseenter' ? 'mouseover' : 'mouseout'), handler, false);
				} else {
					obj.removeEventListener(type, handler, false);
				}
			} else if ('detachEvent' in obj) {
				obj.detachEvent('on' + type, handler);
			}
	
			obj[key] = null;
	
			return this;
		},
	
		stopPropagation: function (e) {
	
			if (e.stopPropagation) {
				e.stopPropagation();
			} else {
				e.cancelBubble = true;
			}
			L.DomEvent._skipped(e);
	
			return this;
		},
	
		disableScrollPropagation: function (el) {
			var stop = L.DomEvent.stopPropagation;
	
			return L.DomEvent
				.on(el, 'mousewheel', stop)
				.on(el, 'MozMousePixelScroll', stop);
		},
	
		disableClickPropagation: function (el) {
			var stop = L.DomEvent.stopPropagation;
	
			for (var i = L.Draggable.START.length - 1; i >= 0; i--) {
				L.DomEvent.on(el, L.Draggable.START[i], stop);
			}
	
			return L.DomEvent
				.on(el, 'click', L.DomEvent._fakeStop)
				.on(el, 'dblclick', stop);
		},
	
		preventDefault: function (e) {
	
			if (e.preventDefault) {
				e.preventDefault();
			} else {
				e.returnValue = false;
			}
			return this;
		},
	
		stop: function (e) {
			return L.DomEvent
				.preventDefault(e)
				.stopPropagation(e);
		},
	
		getMousePosition: function (e, container) {
			if (!container) {
				return new L.Point(e.clientX, e.clientY);
			}
	
			var rect = container.getBoundingClientRect();
	
			return new L.Point(
				e.clientX - rect.left - container.clientLeft,
				e.clientY - rect.top - container.clientTop);
		},
	
		getWheelDelta: function (e) {
	
			var delta = 0;
	
			if (e.wheelDelta) {
				delta = e.wheelDelta / 120;
			}
			if (e.detail) {
				delta = -e.detail / 3;
			}
			return delta;
		},
	
		_skipEvents: {},
	
		_fakeStop: function (e) {
			// fakes stopPropagation by setting a special event flag, checked/reset with L.DomEvent._skipped(e)
			L.DomEvent._skipEvents[e.type] = true;
		},
	
		_skipped: function (e) {
			var skipped = this._skipEvents[e.type];
			// reset when checking, as it's only used in map container and propagates outside of the map
			this._skipEvents[e.type] = false;
			return skipped;
		},
	
		// check if element really left/entered the event target (for mouseenter/mouseleave)
		_checkMouse: function (el, e) {
	
			var related = e.relatedTarget;
	
			if (!related) { return true; }
	
			try {
				while (related && (related !== el)) {
					related = related.parentNode;
				}
			} catch (err) {
				return false;
			}
			return (related !== el);
		},
	
		_getEvent: function () { // evil magic for IE
			/*jshint noarg:false */
			var e = window.event;
			if (!e) {
				var caller = arguments.callee.caller;
				while (caller) {
					e = caller['arguments'][0];
					if (e && window.Event === e.constructor) {
						break;
					}
					caller = caller.caller;
				}
			}
			return e;
		},
	
		// this is a horrible workaround for a bug in Android where a single touch triggers two click events
		_filterClick: function (e, handler) {
			var timeStamp = (e.timeStamp || e.originalEvent.timeStamp),
				elapsed = L.DomEvent._lastClick && (timeStamp - L.DomEvent._lastClick);
	
			// are they closer together than 500ms yet more than 100ms?
			// Android typically triggers them ~300ms apart while multiple listeners
			// on the same event should be triggered far faster;
			// or check if click is simulated on the element, and if it is, reject any non-simulated events
	
			if ((elapsed && elapsed > 100 && elapsed < 500) || (e.target._simulatedClick && !e._simulated)) {
				L.DomEvent.stop(e);
				return;
			}
			L.DomEvent._lastClick = timeStamp;
	
			return handler(e);
		}
	};
	
	L.DomEvent.on = L.DomEvent.addListener;
	L.DomEvent.off = L.DomEvent.removeListener;
	
	
	/*
	 * L.Draggable allows you to add dragging capabilities to any element. Supports mobile devices too.
	 */
	
	L.Draggable = L.Class.extend({
		includes: L.Mixin.Events,
	
		statics: {
			START: L.Browser.touch ? ['touchstart', 'mousedown'] : ['mousedown'],
			END: {
				mousedown: 'mouseup',
				touchstart: 'touchend',
				pointerdown: 'touchend',
				MSPointerDown: 'touchend'
			},
			MOVE: {
				mousedown: 'mousemove',
				touchstart: 'touchmove',
				pointerdown: 'touchmove',
				MSPointerDown: 'touchmove'
			}
		},
	
		initialize: function (element, dragStartTarget) {
			this._element = element;
			this._dragStartTarget = dragStartTarget || element;
		},
	
		enable: function () {
			if (this._enabled) { return; }
	
			for (var i = L.Draggable.START.length - 1; i >= 0; i--) {
				L.DomEvent.on(this._dragStartTarget, L.Draggable.START[i], this._onDown, this);
			}
	
			this._enabled = true;
		},
	
		disable: function () {
			if (!this._enabled) { return; }
	
			for (var i = L.Draggable.START.length - 1; i >= 0; i--) {
				L.DomEvent.off(this._dragStartTarget, L.Draggable.START[i], this._onDown, this);
			}
	
			this._enabled = false;
			this._moved = false;
		},
	
		_onDown: function (e) {
			this._moved = false;
	
			if (e.shiftKey || ((e.which !== 1) && (e.button !== 1) && !e.touches)) { return; }
	
			L.DomEvent.stopPropagation(e);
	
			if (L.Draggable._disabled) { return; }
	
			L.DomUtil.disableImageDrag();
			L.DomUtil.disableTextSelection();
	
			if (this._moving) { return; }
	
			var first = e.touches ? e.touches[0] : e;
	
			this._startPoint = new L.Point(first.clientX, first.clientY);
			this._startPos = this._newPos = L.DomUtil.getPosition(this._element);
	
			L.DomEvent
			    .on(document, L.Draggable.MOVE[e.type], this._onMove, this)
			    .on(document, L.Draggable.END[e.type], this._onUp, this);
		},
	
		_onMove: function (e) {
			if (e.touches && e.touches.length > 1) {
				this._moved = true;
				return;
			}
	
			var first = (e.touches && e.touches.length === 1 ? e.touches[0] : e),
			    newPoint = new L.Point(first.clientX, first.clientY),
			    offset = newPoint.subtract(this._startPoint);
	
			if (!offset.x && !offset.y) { return; }
			if (L.Browser.touch && Math.abs(offset.x) + Math.abs(offset.y) < 3) { return; }
	
			L.DomEvent.preventDefault(e);
	
			if (!this._moved) {
				this.fire('dragstart');
	
				this._moved = true;
				this._startPos = L.DomUtil.getPosition(this._element).subtract(offset);
	
				L.DomUtil.addClass(document.body, 'leaflet-dragging');
				this._lastTarget = e.target || e.srcElement;
				L.DomUtil.addClass(this._lastTarget, 'leaflet-drag-target');
			}
	
			this._newPos = this._startPos.add(offset);
			this._moving = true;
	
			L.Util.cancelAnimFrame(this._animRequest);
			this._animRequest = L.Util.requestAnimFrame(this._updatePosition, this, true, this._dragStartTarget);
		},
	
		_updatePosition: function () {
			this.fire('predrag');
			L.DomUtil.setPosition(this._element, this._newPos);
			this.fire('drag');
		},
	
		_onUp: function () {
			L.DomUtil.removeClass(document.body, 'leaflet-dragging');
	
			if (this._lastTarget) {
				L.DomUtil.removeClass(this._lastTarget, 'leaflet-drag-target');
				this._lastTarget = null;
			}
	
			for (var i in L.Draggable.MOVE) {
				L.DomEvent
				    .off(document, L.Draggable.MOVE[i], this._onMove)
				    .off(document, L.Draggable.END[i], this._onUp);
			}
	
			L.DomUtil.enableImageDrag();
			L.DomUtil.enableTextSelection();
	
			if (this._moved && this._moving) {
				// ensure drag is not fired after dragend
				L.Util.cancelAnimFrame(this._animRequest);
	
				this.fire('dragend', {
					distance: this._newPos.distanceTo(this._startPos)
				});
			}
	
			this._moving = false;
		}
	});
	
	
	/*
		L.Handler is a base class for handler classes that are used internally to inject
		interaction features like dragging to classes like Map and Marker.
	*/
	
	L.Handler = L.Class.extend({
		initialize: function (map) {
			this._map = map;
		},
	
		enable: function () {
			if (this._enabled) { return; }
	
			this._enabled = true;
			this.addHooks();
		},
	
		disable: function () {
			if (!this._enabled) { return; }
	
			this._enabled = false;
			this.removeHooks();
		},
	
		enabled: function () {
			return !!this._enabled;
		}
	});
	
	
	/*
	 * L.Handler.MapDrag is used to make the map draggable (with panning inertia), enabled by default.
	 */
	
	L.Map.mergeOptions({
		dragging: true,
	
		inertia: !L.Browser.android23,
		inertiaDeceleration: 3400, // px/s^2
		inertiaMaxSpeed: Infinity, // px/s
		inertiaThreshold: L.Browser.touch ? 32 : 18, // ms
		easeLinearity: 0.25,
	
		// TODO refactor, move to CRS
		worldCopyJump: false
	});
	
	L.Map.Drag = L.Handler.extend({
		addHooks: function () {
			if (!this._draggable) {
				var map = this._map;
	
				this._draggable = new L.Draggable(map._mapPane, map._container);
	
				this._draggable.on({
					'dragstart': this._onDragStart,
					'drag': this._onDrag,
					'dragend': this._onDragEnd
				}, this);
	
				if (map.options.worldCopyJump) {
					this._draggable.on('predrag', this._onPreDrag, this);
					map.on('viewreset', this._onViewReset, this);
	
					map.whenReady(this._onViewReset, this);
				}
			}
			this._draggable.enable();
		},
	
		removeHooks: function () {
			this._draggable.disable();
		},
	
		moved: function () {
			return this._draggable && this._draggable._moved;
		},
	
		_onDragStart: function () {
			var map = this._map;
	
			if (map._panAnim) {
				map._panAnim.stop();
			}
	
			map
			    .fire('movestart')
			    .fire('dragstart');
	
			if (map.options.inertia) {
				this._positions = [];
				this._times = [];
			}
		},
	
		_onDrag: function () {
			if (this._map.options.inertia) {
				var time = this._lastTime = +new Date(),
				    pos = this._lastPos = this._draggable._newPos;
	
				this._positions.push(pos);
				this._times.push(time);
	
				if (time - this._times[0] > 200) {
					this._positions.shift();
					this._times.shift();
				}
			}
	
			this._map
			    .fire('move')
			    .fire('drag');
		},
	
		_onViewReset: function () {
			// TODO fix hardcoded Earth values
			var pxCenter = this._map.getSize()._divideBy(2),
			    pxWorldCenter = this._map.latLngToLayerPoint([0, 0]);
	
			this._initialWorldOffset = pxWorldCenter.subtract(pxCenter).x;
			this._worldWidth = this._map.project([0, 180]).x;
		},
	
		_onPreDrag: function () {
			// TODO refactor to be able to adjust map pane position after zoom
			var worldWidth = this._worldWidth,
			    halfWidth = Math.round(worldWidth / 2),
			    dx = this._initialWorldOffset,
			    x = this._draggable._newPos.x,
			    newX1 = (x - halfWidth + dx) % worldWidth + halfWidth - dx,
			    newX2 = (x + halfWidth + dx) % worldWidth - halfWidth - dx,
			    newX = Math.abs(newX1 + dx) < Math.abs(newX2 + dx) ? newX1 : newX2;
	
			this._draggable._newPos.x = newX;
		},
	
		_onDragEnd: function (e) {
			var map = this._map,
			    options = map.options,
			    delay = +new Date() - this._lastTime,
	
			    noInertia = !options.inertia || delay > options.inertiaThreshold || !this._positions[0];
	
			map.fire('dragend', e);
	
			if (noInertia) {
				map.fire('moveend');
	
			} else {
	
				var direction = this._lastPos.subtract(this._positions[0]),
				    duration = (this._lastTime + delay - this._times[0]) / 1000,
				    ease = options.easeLinearity,
	
				    speedVector = direction.multiplyBy(ease / duration),
				    speed = speedVector.distanceTo([0, 0]),
	
				    limitedSpeed = Math.min(options.inertiaMaxSpeed, speed),
				    limitedSpeedVector = speedVector.multiplyBy(limitedSpeed / speed),
	
				    decelerationDuration = limitedSpeed / (options.inertiaDeceleration * ease),
				    offset = limitedSpeedVector.multiplyBy(-decelerationDuration / 2).round();
	
				if (!offset.x || !offset.y) {
					map.fire('moveend');
	
				} else {
					offset = map._limitOffset(offset, map.options.maxBounds);
	
					L.Util.requestAnimFrame(function () {
						map.panBy(offset, {
							duration: decelerationDuration,
							easeLinearity: ease,
							noMoveStart: true
						});
					});
				}
			}
		}
	});
	
	L.Map.addInitHook('addHandler', 'dragging', L.Map.Drag);
	
	
	/*
	 * L.Handler.DoubleClickZoom is used to handle double-click zoom on the map, enabled by default.
	 */
	
	L.Map.mergeOptions({
		doubleClickZoom: true
	});
	
	L.Map.DoubleClickZoom = L.Handler.extend({
		addHooks: function () {
			this._map.on('dblclick', this._onDoubleClick, this);
		},
	
		removeHooks: function () {
			this._map.off('dblclick', this._onDoubleClick, this);
		},
	
		_onDoubleClick: function (e) {
			var map = this._map,
			    zoom = map.getZoom() + (e.originalEvent.shiftKey ? -1 : 1);
	
			if (map.options.doubleClickZoom === 'center') {
				map.setZoom(zoom);
			} else {
				map.setZoomAround(e.containerPoint, zoom);
			}
		}
	});
	
	L.Map.addInitHook('addHandler', 'doubleClickZoom', L.Map.DoubleClickZoom);
	
	
	/*
	 * L.Handler.ScrollWheelZoom is used by L.Map to enable mouse scroll wheel zoom on the map.
	 */
	
	L.Map.mergeOptions({
		scrollWheelZoom: true
	});
	
	L.Map.ScrollWheelZoom = L.Handler.extend({
		addHooks: function () {
			L.DomEvent.on(this._map._container, 'mousewheel', this._onWheelScroll, this);
			L.DomEvent.on(this._map._container, 'MozMousePixelScroll', L.DomEvent.preventDefault);
			this._delta = 0;
		},
	
		removeHooks: function () {
			L.DomEvent.off(this._map._container, 'mousewheel', this._onWheelScroll);
			L.DomEvent.off(this._map._container, 'MozMousePixelScroll', L.DomEvent.preventDefault);
		},
	
		_onWheelScroll: function (e) {
			var delta = L.DomEvent.getWheelDelta(e);
	
			this._delta += delta;
			this._lastMousePos = this._map.mouseEventToContainerPoint(e);
	
			if (!this._startTime) {
				this._startTime = +new Date();
			}
	
			var left = Math.max(40 - (+new Date() - this._startTime), 0);
	
			clearTimeout(this._timer);
			this._timer = setTimeout(L.bind(this._performZoom, this), left);
	
			L.DomEvent.preventDefault(e);
			L.DomEvent.stopPropagation(e);
		},
	
		_performZoom: function () {
			var map = this._map,
			    delta = this._delta,
			    zoom = map.getZoom();
	
			delta = delta > 0 ? Math.ceil(delta) : Math.floor(delta);
			delta = Math.max(Math.min(delta, 4), -4);
			delta = map._limitZoom(zoom + delta) - zoom;
	
			this._delta = 0;
			this._startTime = null;
	
			if (!delta) { return; }
	
			if (map.options.scrollWheelZoom === 'center') {
				map.setZoom(zoom + delta);
			} else {
				map.setZoomAround(this._lastMousePos, zoom + delta);
			}
		}
	});
	
	L.Map.addInitHook('addHandler', 'scrollWheelZoom', L.Map.ScrollWheelZoom);
	
	
	/*
	 * Extends the event handling code with double tap support for mobile browsers.
	 */
	
	L.extend(L.DomEvent, {
	
		_touchstart: L.Browser.msPointer ? 'MSPointerDown' : L.Browser.pointer ? 'pointerdown' : 'touchstart',
		_touchend: L.Browser.msPointer ? 'MSPointerUp' : L.Browser.pointer ? 'pointerup' : 'touchend',
	
		// inspired by Zepto touch code by Thomas Fuchs
		addDoubleTapListener: function (obj, handler, id) {
			var last,
			    doubleTap = false,
			    delay = 250,
			    touch,
			    pre = '_leaflet_',
			    touchstart = this._touchstart,
			    touchend = this._touchend,
			    trackedTouches = [];
	
			function onTouchStart(e) {
				var count;
	
				if (L.Browser.pointer) {
					trackedTouches.push(e.pointerId);
					count = trackedTouches.length;
				} else {
					count = e.touches.length;
				}
				if (count > 1) {
					return;
				}
	
				var now = Date.now(),
					delta = now - (last || now);
	
				touch = e.touches ? e.touches[0] : e;
				doubleTap = (delta > 0 && delta <= delay);
				last = now;
			}
	
			function onTouchEnd(e) {
				if (L.Browser.pointer) {
					var idx = trackedTouches.indexOf(e.pointerId);
					if (idx === -1) {
						return;
					}
					trackedTouches.splice(idx, 1);
				}
	
				if (doubleTap) {
					if (L.Browser.pointer) {
						// work around .type being readonly with MSPointer* events
						var newTouch = { },
							prop;
	
						// jshint forin:false
						for (var i in touch) {
							prop = touch[i];
							if (typeof prop === 'function') {
								newTouch[i] = prop.bind(touch);
							} else {
								newTouch[i] = prop;
							}
						}
						touch = newTouch;
					}
					touch.type = 'dblclick';
					handler(touch);
					last = null;
				}
			}
			obj[pre + touchstart + id] = onTouchStart;
			obj[pre + touchend + id] = onTouchEnd;
	
			// on pointer we need to listen on the document, otherwise a drag starting on the map and moving off screen
			// will not come through to us, so we will lose track of how many touches are ongoing
			var endElement = L.Browser.pointer ? document.documentElement : obj;
	
			obj.addEventListener(touchstart, onTouchStart, false);
			endElement.addEventListener(touchend, onTouchEnd, false);
	
			if (L.Browser.pointer) {
				endElement.addEventListener(L.DomEvent.POINTER_CANCEL, onTouchEnd, false);
			}
	
			return this;
		},
	
		removeDoubleTapListener: function (obj, id) {
			var pre = '_leaflet_';
	
			obj.removeEventListener(this._touchstart, obj[pre + this._touchstart + id], false);
			(L.Browser.pointer ? document.documentElement : obj).removeEventListener(
			        this._touchend, obj[pre + this._touchend + id], false);
	
			if (L.Browser.pointer) {
				document.documentElement.removeEventListener(L.DomEvent.POINTER_CANCEL, obj[pre + this._touchend + id],
					false);
			}
	
			return this;
		}
	});
	
	
	/*
	 * Extends L.DomEvent to provide touch support for Internet Explorer and Windows-based devices.
	 */
	
	L.extend(L.DomEvent, {
	
		//static
		POINTER_DOWN: L.Browser.msPointer ? 'MSPointerDown' : 'pointerdown',
		POINTER_MOVE: L.Browser.msPointer ? 'MSPointerMove' : 'pointermove',
		POINTER_UP: L.Browser.msPointer ? 'MSPointerUp' : 'pointerup',
		POINTER_CANCEL: L.Browser.msPointer ? 'MSPointerCancel' : 'pointercancel',
	
		_pointers: [],
		_pointerDocumentListener: false,
	
		// Provides a touch events wrapper for (ms)pointer events.
		// Based on changes by veproza https://github.com/CloudMade/Leaflet/pull/1019
		//ref http://www.w3.org/TR/pointerevents/ https://www.w3.org/Bugs/Public/show_bug.cgi?id=22890
	
		addPointerListener: function (obj, type, handler, id) {
	
			switch (type) {
			case 'touchstart':
				return this.addPointerListenerStart(obj, type, handler, id);
			case 'touchend':
				return this.addPointerListenerEnd(obj, type, handler, id);
			case 'touchmove':
				return this.addPointerListenerMove(obj, type, handler, id);
			default:
				throw 'Unknown touch event type';
			}
		},
	
		addPointerListenerStart: function (obj, type, handler, id) {
			var pre = '_leaflet_',
			    pointers = this._pointers;
	
			var cb = function (e) {
				if (e.pointerType !== 'mouse' && e.pointerType !== e.MSPOINTER_TYPE_MOUSE) {
					L.DomEvent.preventDefault(e);
				}
	
				var alreadyInArray = false;
				for (var i = 0; i < pointers.length; i++) {
					if (pointers[i].pointerId === e.pointerId) {
						alreadyInArray = true;
						break;
					}
				}
				if (!alreadyInArray) {
					pointers.push(e);
				}
	
				e.touches = pointers.slice();
				e.changedTouches = [e];
	
				handler(e);
			};
	
			obj[pre + 'touchstart' + id] = cb;
			obj.addEventListener(this.POINTER_DOWN, cb, false);
	
			// need to also listen for end events to keep the _pointers list accurate
			// this needs to be on the body and never go away
			if (!this._pointerDocumentListener) {
				var internalCb = function (e) {
					for (var i = 0; i < pointers.length; i++) {
						if (pointers[i].pointerId === e.pointerId) {
							pointers.splice(i, 1);
							break;
						}
					}
				};
				//We listen on the documentElement as any drags that end by moving the touch off the screen get fired there
				document.documentElement.addEventListener(this.POINTER_UP, internalCb, false);
				document.documentElement.addEventListener(this.POINTER_CANCEL, internalCb, false);
	
				this._pointerDocumentListener = true;
			}
	
			return this;
		},
	
		addPointerListenerMove: function (obj, type, handler, id) {
			var pre = '_leaflet_',
			    touches = this._pointers;
	
			function cb(e) {
	
				// don't fire touch moves when mouse isn't down
				if ((e.pointerType === e.MSPOINTER_TYPE_MOUSE || e.pointerType === 'mouse') && e.buttons === 0) { return; }
	
				for (var i = 0; i < touches.length; i++) {
					if (touches[i].pointerId === e.pointerId) {
						touches[i] = e;
						break;
					}
				}
	
				e.touches = touches.slice();
				e.changedTouches = [e];
	
				handler(e);
			}
	
			obj[pre + 'touchmove' + id] = cb;
			obj.addEventListener(this.POINTER_MOVE, cb, false);
	
			return this;
		},
	
		addPointerListenerEnd: function (obj, type, handler, id) {
			var pre = '_leaflet_',
			    touches = this._pointers;
	
			var cb = function (e) {
				for (var i = 0; i < touches.length; i++) {
					if (touches[i].pointerId === e.pointerId) {
						touches.splice(i, 1);
						break;
					}
				}
	
				e.touches = touches.slice();
				e.changedTouches = [e];
	
				handler(e);
			};
	
			obj[pre + 'touchend' + id] = cb;
			obj.addEventListener(this.POINTER_UP, cb, false);
			obj.addEventListener(this.POINTER_CANCEL, cb, false);
	
			return this;
		},
	
		removePointerListener: function (obj, type, id) {
			var pre = '_leaflet_',
			    cb = obj[pre + type + id];
	
			switch (type) {
			case 'touchstart':
				obj.removeEventListener(this.POINTER_DOWN, cb, false);
				break;
			case 'touchmove':
				obj.removeEventListener(this.POINTER_MOVE, cb, false);
				break;
			case 'touchend':
				obj.removeEventListener(this.POINTER_UP, cb, false);
				obj.removeEventListener(this.POINTER_CANCEL, cb, false);
				break;
			}
	
			return this;
		}
	});
	
	
	/*
	 * L.Handler.TouchZoom is used by L.Map to add pinch zoom on supported mobile browsers.
	 */
	
	L.Map.mergeOptions({
		touchZoom: L.Browser.touch && !L.Browser.android23,
		bounceAtZoomLimits: true
	});
	
	L.Map.TouchZoom = L.Handler.extend({
		addHooks: function () {
			L.DomEvent.on(this._map._container, 'touchstart', this._onTouchStart, this);
		},
	
		removeHooks: function () {
			L.DomEvent.off(this._map._container, 'touchstart', this._onTouchStart, this);
		},
	
		_onTouchStart: function (e) {
			var map = this._map;
	
			if (!e.touches || e.touches.length !== 2 || map._animatingZoom || this._zooming) { return; }
	
			var p1 = map.mouseEventToLayerPoint(e.touches[0]),
			    p2 = map.mouseEventToLayerPoint(e.touches[1]),
			    viewCenter = map._getCenterLayerPoint();
	
			this._startCenter = p1.add(p2)._divideBy(2);
			this._startDist = p1.distanceTo(p2);
	
			this._moved = false;
			this._zooming = true;
	
			this._centerOffset = viewCenter.subtract(this._startCenter);
	
			if (map._panAnim) {
				map._panAnim.stop();
			}
	
			L.DomEvent
			    .on(document, 'touchmove', this._onTouchMove, this)
			    .on(document, 'touchend', this._onTouchEnd, this);
	
			L.DomEvent.preventDefault(e);
		},
	
		_onTouchMove: function (e) {
			var map = this._map;
	
			if (!e.touches || e.touches.length !== 2 || !this._zooming) { return; }
	
			var p1 = map.mouseEventToLayerPoint(e.touches[0]),
			    p2 = map.mouseEventToLayerPoint(e.touches[1]);
	
			this._scale = p1.distanceTo(p2) / this._startDist;
			this._delta = p1._add(p2)._divideBy(2)._subtract(this._startCenter);
	
			if (this._scale === 1) { return; }
	
			if (!map.options.bounceAtZoomLimits) {
				if ((map.getZoom() === map.getMinZoom() && this._scale < 1) ||
				    (map.getZoom() === map.getMaxZoom() && this._scale > 1)) { return; }
			}
	
			if (!this._moved) {
				L.DomUtil.addClass(map._mapPane, 'leaflet-touching');
	
				map
				    .fire('movestart')
				    .fire('zoomstart');
	
				this._moved = true;
			}
	
			L.Util.cancelAnimFrame(this._animRequest);
			this._animRequest = L.Util.requestAnimFrame(
			        this._updateOnMove, this, true, this._map._container);
	
			L.DomEvent.preventDefault(e);
		},
	
		_updateOnMove: function () {
			var map = this._map,
			    origin = this._getScaleOrigin(),
			    center = map.layerPointToLatLng(origin),
			    zoom = map.getScaleZoom(this._scale);
	
			map._animateZoom(center, zoom, this._startCenter, this._scale, this._delta, false, true);
		},
	
		_onTouchEnd: function () {
			if (!this._moved || !this._zooming) {
				this._zooming = false;
				return;
			}
	
			var map = this._map;
	
			this._zooming = false;
			L.DomUtil.removeClass(map._mapPane, 'leaflet-touching');
			L.Util.cancelAnimFrame(this._animRequest);
	
			L.DomEvent
			    .off(document, 'touchmove', this._onTouchMove)
			    .off(document, 'touchend', this._onTouchEnd);
	
			var origin = this._getScaleOrigin(),
			    center = map.layerPointToLatLng(origin),
	
			    oldZoom = map.getZoom(),
			    floatZoomDelta = map.getScaleZoom(this._scale) - oldZoom,
			    roundZoomDelta = (floatZoomDelta > 0 ?
			            Math.ceil(floatZoomDelta) : Math.floor(floatZoomDelta)),
	
			    zoom = map._limitZoom(oldZoom + roundZoomDelta),
			    scale = map.getZoomScale(zoom) / this._scale;
	
			map._animateZoom(center, zoom, origin, scale);
		},
	
		_getScaleOrigin: function () {
			var centerOffset = this._centerOffset.subtract(this._delta).divideBy(this._scale);
			return this._startCenter.add(centerOffset);
		}
	});
	
	L.Map.addInitHook('addHandler', 'touchZoom', L.Map.TouchZoom);
	
	
	/*
	 * L.Map.Tap is used to enable mobile hacks like quick taps and long hold.
	 */
	
	L.Map.mergeOptions({
		tap: true,
		tapTolerance: 15
	});
	
	L.Map.Tap = L.Handler.extend({
		addHooks: function () {
			L.DomEvent.on(this._map._container, 'touchstart', this._onDown, this);
		},
	
		removeHooks: function () {
			L.DomEvent.off(this._map._container, 'touchstart', this._onDown, this);
		},
	
		_onDown: function (e) {
			if (!e.touches) { return; }
	
			L.DomEvent.preventDefault(e);
	
			this._fireClick = true;
	
			// don't simulate click or track longpress if more than 1 touch
			if (e.touches.length > 1) {
				this._fireClick = false;
				clearTimeout(this._holdTimeout);
				return;
			}
	
			var first = e.touches[0],
			    el = first.target;
	
			this._startPos = this._newPos = new L.Point(first.clientX, first.clientY);
	
			// if touching a link, highlight it
			if (el.tagName && el.tagName.toLowerCase() === 'a') {
				L.DomUtil.addClass(el, 'leaflet-active');
			}
	
			// simulate long hold but setting a timeout
			this._holdTimeout = setTimeout(L.bind(function () {
				if (this._isTapValid()) {
					this._fireClick = false;
					this._onUp();
					this._simulateEvent('contextmenu', first);
				}
			}, this), 1000);
	
			L.DomEvent
				.on(document, 'touchmove', this._onMove, this)
				.on(document, 'touchend', this._onUp, this);
		},
	
		_onUp: function (e) {
			clearTimeout(this._holdTimeout);
	
			L.DomEvent
				.off(document, 'touchmove', this._onMove, this)
				.off(document, 'touchend', this._onUp, this);
	
			if (this._fireClick && e && e.changedTouches) {
	
				var first = e.changedTouches[0],
				    el = first.target;
	
				if (el && el.tagName && el.tagName.toLowerCase() === 'a') {
					L.DomUtil.removeClass(el, 'leaflet-active');
				}
	
				// simulate click if the touch didn't move too much
				if (this._isTapValid()) {
					this._simulateEvent('click', first);
				}
			}
		},
	
		_isTapValid: function () {
			return this._newPos.distanceTo(this._startPos) <= this._map.options.tapTolerance;
		},
	
		_onMove: function (e) {
			var first = e.touches[0];
			this._newPos = new L.Point(first.clientX, first.clientY);
		},
	
		_simulateEvent: function (type, e) {
			var simulatedEvent = document.createEvent('MouseEvents');
	
			simulatedEvent._simulated = true;
			e.target._simulatedClick = true;
	
			simulatedEvent.initMouseEvent(
			        type, true, true, window, 1,
			        e.screenX, e.screenY,
			        e.clientX, e.clientY,
			        false, false, false, false, 0, null);
	
			e.target.dispatchEvent(simulatedEvent);
		}
	});
	
	if (L.Browser.touch && !L.Browser.pointer) {
		L.Map.addInitHook('addHandler', 'tap', L.Map.Tap);
	}
	
	
	/*
	 * L.Handler.ShiftDragZoom is used to add shift-drag zoom interaction to the map
	  * (zoom to a selected bounding box), enabled by default.
	 */
	
	L.Map.mergeOptions({
		boxZoom: true
	});
	
	L.Map.BoxZoom = L.Handler.extend({
		initialize: function (map) {
			this._map = map;
			this._container = map._container;
			this._pane = map._panes.overlayPane;
			this._moved = false;
		},
	
		addHooks: function () {
			L.DomEvent.on(this._container, 'mousedown', this._onMouseDown, this);
		},
	
		removeHooks: function () {
			L.DomEvent.off(this._container, 'mousedown', this._onMouseDown);
			this._moved = false;
		},
	
		moved: function () {
			return this._moved;
		},
	
		_onMouseDown: function (e) {
			this._moved = false;
	
			if (!e.shiftKey || ((e.which !== 1) && (e.button !== 1))) { return false; }
	
			L.DomUtil.disableTextSelection();
			L.DomUtil.disableImageDrag();
	
			this._startLayerPoint = this._map.mouseEventToLayerPoint(e);
	
			L.DomEvent
			    .on(document, 'mousemove', this._onMouseMove, this)
			    .on(document, 'mouseup', this._onMouseUp, this)
			    .on(document, 'keydown', this._onKeyDown, this);
		},
	
		_onMouseMove: function (e) {
			if (!this._moved) {
				this._box = L.DomUtil.create('div', 'leaflet-zoom-box', this._pane);
				L.DomUtil.setPosition(this._box, this._startLayerPoint);
	
				//TODO refactor: move cursor to styles
				this._container.style.cursor = 'crosshair';
				this._map.fire('boxzoomstart');
			}
	
			var startPoint = this._startLayerPoint,
			    box = this._box,
	
			    layerPoint = this._map.mouseEventToLayerPoint(e),
			    offset = layerPoint.subtract(startPoint),
	
			    newPos = new L.Point(
			        Math.min(layerPoint.x, startPoint.x),
			        Math.min(layerPoint.y, startPoint.y));
	
			L.DomUtil.setPosition(box, newPos);
	
			this._moved = true;
	
			// TODO refactor: remove hardcoded 4 pixels
			box.style.width  = (Math.max(0, Math.abs(offset.x) - 4)) + 'px';
			box.style.height = (Math.max(0, Math.abs(offset.y) - 4)) + 'px';
		},
	
		_finish: function () {
			if (this._moved) {
				this._pane.removeChild(this._box);
				this._container.style.cursor = '';
			}
	
			L.DomUtil.enableTextSelection();
			L.DomUtil.enableImageDrag();
	
			L.DomEvent
			    .off(document, 'mousemove', this._onMouseMove)
			    .off(document, 'mouseup', this._onMouseUp)
			    .off(document, 'keydown', this._onKeyDown);
		},
	
		_onMouseUp: function (e) {
	
			this._finish();
	
			var map = this._map,
			    layerPoint = map.mouseEventToLayerPoint(e);
	
			if (this._startLayerPoint.equals(layerPoint)) { return; }
	
			var bounds = new L.LatLngBounds(
			        map.layerPointToLatLng(this._startLayerPoint),
			        map.layerPointToLatLng(layerPoint));
	
			map.fitBounds(bounds);
	
			map.fire('boxzoomend', {
				boxZoomBounds: bounds
			});
		},
	
		_onKeyDown: function (e) {
			if (e.keyCode === 27) {
				this._finish();
			}
		}
	});
	
	L.Map.addInitHook('addHandler', 'boxZoom', L.Map.BoxZoom);
	
	
	/*
	 * L.Map.Keyboard is handling keyboard interaction with the map, enabled by default.
	 */
	
	L.Map.mergeOptions({
		keyboard: true,
		keyboardPanOffset: 80,
		keyboardZoomOffset: 1
	});
	
	L.Map.Keyboard = L.Handler.extend({
	
		keyCodes: {
			left:    [37],
			right:   [39],
			down:    [40],
			up:      [38],
			zoomIn:  [187, 107, 61, 171],
			zoomOut: [189, 109, 173]
		},
	
		initialize: function (map) {
			this._map = map;
	
			this._setPanOffset(map.options.keyboardPanOffset);
			this._setZoomOffset(map.options.keyboardZoomOffset);
		},
	
		addHooks: function () {
			var container = this._map._container;
	
			// make the container focusable by tabbing
			if (container.tabIndex === -1) {
				container.tabIndex = '0';
			}
	
			L.DomEvent
			    .on(container, 'focus', this._onFocus, this)
			    .on(container, 'blur', this._onBlur, this)
			    .on(container, 'mousedown', this._onMouseDown, this);
	
			this._map
			    .on('focus', this._addHooks, this)
			    .on('blur', this._removeHooks, this);
		},
	
		removeHooks: function () {
			this._removeHooks();
	
			var container = this._map._container;
	
			L.DomEvent
			    .off(container, 'focus', this._onFocus, this)
			    .off(container, 'blur', this._onBlur, this)
			    .off(container, 'mousedown', this._onMouseDown, this);
	
			this._map
			    .off('focus', this._addHooks, this)
			    .off('blur', this._removeHooks, this);
		},
	
		_onMouseDown: function () {
			if (this._focused) { return; }
	
			var body = document.body,
			    docEl = document.documentElement,
			    top = body.scrollTop || docEl.scrollTop,
			    left = body.scrollLeft || docEl.scrollLeft;
	
			this._map._container.focus();
	
			window.scrollTo(left, top);
		},
	
		_onFocus: function () {
			this._focused = true;
			this._map.fire('focus');
		},
	
		_onBlur: function () {
			this._focused = false;
			this._map.fire('blur');
		},
	
		_setPanOffset: function (pan) {
			var keys = this._panKeys = {},
			    codes = this.keyCodes,
			    i, len;
	
			for (i = 0, len = codes.left.length; i < len; i++) {
				keys[codes.left[i]] = [-1 * pan, 0];
			}
			for (i = 0, len = codes.right.length; i < len; i++) {
				keys[codes.right[i]] = [pan, 0];
			}
			for (i = 0, len = codes.down.length; i < len; i++) {
				keys[codes.down[i]] = [0, pan];
			}
			for (i = 0, len = codes.up.length; i < len; i++) {
				keys[codes.up[i]] = [0, -1 * pan];
			}
		},
	
		_setZoomOffset: function (zoom) {
			var keys = this._zoomKeys = {},
			    codes = this.keyCodes,
			    i, len;
	
			for (i = 0, len = codes.zoomIn.length; i < len; i++) {
				keys[codes.zoomIn[i]] = zoom;
			}
			for (i = 0, len = codes.zoomOut.length; i < len; i++) {
				keys[codes.zoomOut[i]] = -zoom;
			}
		},
	
		_addHooks: function () {
			L.DomEvent.on(document, 'keydown', this._onKeyDown, this);
		},
	
		_removeHooks: function () {
			L.DomEvent.off(document, 'keydown', this._onKeyDown, this);
		},
	
		_onKeyDown: function (e) {
			var key = e.keyCode,
			    map = this._map;
	
			if (key in this._panKeys) {
	
				if (map._panAnim && map._panAnim._inProgress) { return; }
	
				map.panBy(this._panKeys[key]);
	
				if (map.options.maxBounds) {
					map.panInsideBounds(map.options.maxBounds);
				}
	
			} else if (key in this._zoomKeys) {
				map.setZoom(map.getZoom() + this._zoomKeys[key]);
	
			} else {
				return;
			}
	
			L.DomEvent.stop(e);
		}
	});
	
	L.Map.addInitHook('addHandler', 'keyboard', L.Map.Keyboard);
	
	
	/*
	 * L.Handler.MarkerDrag is used internally by L.Marker to make the markers draggable.
	 */
	
	L.Handler.MarkerDrag = L.Handler.extend({
		initialize: function (marker) {
			this._marker = marker;
		},
	
		addHooks: function () {
			var icon = this._marker._icon;
			if (!this._draggable) {
				this._draggable = new L.Draggable(icon, icon);
			}
	
			this._draggable
				.on('dragstart', this._onDragStart, this)
				.on('drag', this._onDrag, this)
				.on('dragend', this._onDragEnd, this);
			this._draggable.enable();
			L.DomUtil.addClass(this._marker._icon, 'leaflet-marker-draggable');
		},
	
		removeHooks: function () {
			this._draggable
				.off('dragstart', this._onDragStart, this)
				.off('drag', this._onDrag, this)
				.off('dragend', this._onDragEnd, this);
	
			this._draggable.disable();
			L.DomUtil.removeClass(this._marker._icon, 'leaflet-marker-draggable');
		},
	
		moved: function () {
			return this._draggable && this._draggable._moved;
		},
	
		_onDragStart: function () {
			this._marker
			    .closePopup()
			    .fire('movestart')
			    .fire('dragstart');
		},
	
		_onDrag: function () {
			var marker = this._marker,
			    shadow = marker._shadow,
			    iconPos = L.DomUtil.getPosition(marker._icon),
			    latlng = marker._map.layerPointToLatLng(iconPos);
	
			// update shadow position
			if (shadow) {
				L.DomUtil.setPosition(shadow, iconPos);
			}
	
			marker._latlng = latlng;
	
			marker
			    .fire('move', {latlng: latlng})
			    .fire('drag');
		},
	
		_onDragEnd: function (e) {
			this._marker
			    .fire('moveend')
			    .fire('dragend', e);
		}
	});
	
	
	/*
	 * L.Control is a base class for implementing map controls. Handles positioning.
	 * All other controls extend from this class.
	 */
	
	L.Control = L.Class.extend({
		options: {
			position: 'topright'
		},
	
		initialize: function (options) {
			L.setOptions(this, options);
		},
	
		getPosition: function () {
			return this.options.position;
		},
	
		setPosition: function (position) {
			var map = this._map;
	
			if (map) {
				map.removeControl(this);
			}
	
			this.options.position = position;
	
			if (map) {
				map.addControl(this);
			}
	
			return this;
		},
	
		getContainer: function () {
			return this._container;
		},
	
		addTo: function (map) {
			this._map = map;
	
			var container = this._container = this.onAdd(map),
			    pos = this.getPosition(),
			    corner = map._controlCorners[pos];
	
			L.DomUtil.addClass(container, 'leaflet-control');
	
			if (pos.indexOf('bottom') !== -1) {
				corner.insertBefore(container, corner.firstChild);
			} else {
				corner.appendChild(container);
			}
	
			return this;
		},
	
		removeFrom: function (map) {
			var pos = this.getPosition(),
			    corner = map._controlCorners[pos];
	
			corner.removeChild(this._container);
			this._map = null;
	
			if (this.onRemove) {
				this.onRemove(map);
			}
	
			return this;
		},
	
		_refocusOnMap: function () {
			if (this._map) {
				this._map.getContainer().focus();
			}
		}
	});
	
	L.control = function (options) {
		return new L.Control(options);
	};
	
	
	// adds control-related methods to L.Map
	
	L.Map.include({
		addControl: function (control) {
			control.addTo(this);
			return this;
		},
	
		removeControl: function (control) {
			control.removeFrom(this);
			return this;
		},
	
		_initControlPos: function () {
			var corners = this._controlCorners = {},
			    l = 'leaflet-',
			    container = this._controlContainer =
			            L.DomUtil.create('div', l + 'control-container', this._container);
	
			function createCorner(vSide, hSide) {
				var className = l + vSide + ' ' + l + hSide;
	
				corners[vSide + hSide] = L.DomUtil.create('div', className, container);
			}
	
			createCorner('top', 'left');
			createCorner('top', 'right');
			createCorner('bottom', 'left');
			createCorner('bottom', 'right');
		},
	
		_clearControlPos: function () {
			this._container.removeChild(this._controlContainer);
		}
	});
	
	
	/*
	 * L.Control.Zoom is used for the default zoom buttons on the map.
	 */
	
	L.Control.Zoom = L.Control.extend({
		options: {
			position: 'topleft',
			zoomInText: '+',
			zoomInTitle: 'Zoom in',
			zoomOutText: '-',
			zoomOutTitle: 'Zoom out'
		},
	
		onAdd: function (map) {
			var zoomName = 'leaflet-control-zoom',
			    container = L.DomUtil.create('div', zoomName + ' leaflet-bar');
	
			this._map = map;
	
			this._zoomInButton  = this._createButton(
			        this.options.zoomInText, this.options.zoomInTitle,
			        zoomName + '-in',  container, this._zoomIn,  this);
			this._zoomOutButton = this._createButton(
			        this.options.zoomOutText, this.options.zoomOutTitle,
			        zoomName + '-out', container, this._zoomOut, this);
	
			this._updateDisabled();
			map.on('zoomend zoomlevelschange', this._updateDisabled, this);
	
			return container;
		},
	
		onRemove: function (map) {
			map.off('zoomend zoomlevelschange', this._updateDisabled, this);
		},
	
		_zoomIn: function (e) {
			this._map.zoomIn(e.shiftKey ? 3 : 1);
		},
	
		_zoomOut: function (e) {
			this._map.zoomOut(e.shiftKey ? 3 : 1);
		},
	
		_createButton: function (html, title, className, container, fn, context) {
			var link = L.DomUtil.create('a', className, container);
			link.innerHTML = html;
			link.href = '#';
			link.title = title;
	
			var stop = L.DomEvent.stopPropagation;
	
			L.DomEvent
			    .on(link, 'click', stop)
			    .on(link, 'mousedown', stop)
			    .on(link, 'dblclick', stop)
			    .on(link, 'click', L.DomEvent.preventDefault)
			    .on(link, 'click', fn, context)
			    .on(link, 'click', this._refocusOnMap, context);
	
			return link;
		},
	
		_updateDisabled: function () {
			var map = this._map,
				className = 'leaflet-disabled';
	
			L.DomUtil.removeClass(this._zoomInButton, className);
			L.DomUtil.removeClass(this._zoomOutButton, className);
	
			if (map._zoom === map.getMinZoom()) {
				L.DomUtil.addClass(this._zoomOutButton, className);
			}
			if (map._zoom === map.getMaxZoom()) {
				L.DomUtil.addClass(this._zoomInButton, className);
			}
		}
	});
	
	L.Map.mergeOptions({
		zoomControl: true
	});
	
	L.Map.addInitHook(function () {
		if (this.options.zoomControl) {
			this.zoomControl = new L.Control.Zoom();
			this.addControl(this.zoomControl);
		}
	});
	
	L.control.zoom = function (options) {
		return new L.Control.Zoom(options);
	};
	
	
	
	/*
	 * L.Control.Attribution is used for displaying attribution on the map (added by default).
	 */
	
	L.Control.Attribution = L.Control.extend({
		options: {
			position: 'bottomright',
			prefix: '<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>'
		},
	
		initialize: function (options) {
			L.setOptions(this, options);
	
			this._attributions = {};
		},
	
		onAdd: function (map) {
			this._container = L.DomUtil.create('div', 'leaflet-control-attribution');
			L.DomEvent.disableClickPropagation(this._container);
	
			for (var i in map._layers) {
				if (map._layers[i].getAttribution) {
					this.addAttribution(map._layers[i].getAttribution());
				}
			}
			
			map
			    .on('layeradd', this._onLayerAdd, this)
			    .on('layerremove', this._onLayerRemove, this);
	
			this._update();
	
			return this._container;
		},
	
		onRemove: function (map) {
			map
			    .off('layeradd', this._onLayerAdd)
			    .off('layerremove', this._onLayerRemove);
	
		},
	
		setPrefix: function (prefix) {
			this.options.prefix = prefix;
			this._update();
			return this;
		},
	
		addAttribution: function (text) {
			if (!text) { return; }
	
			if (!this._attributions[text]) {
				this._attributions[text] = 0;
			}
			this._attributions[text]++;
	
			this._update();
	
			return this;
		},
	
		removeAttribution: function (text) {
			if (!text) { return; }
	
			if (this._attributions[text]) {
				this._attributions[text]--;
				this._update();
			}
	
			return this;
		},
	
		_update: function () {
			if (!this._map) { return; }
	
			var attribs = [];
	
			for (var i in this._attributions) {
				if (this._attributions[i]) {
					attribs.push(i);
				}
			}
	
			var prefixAndAttribs = [];
	
			if (this.options.prefix) {
				prefixAndAttribs.push(this.options.prefix);
			}
			if (attribs.length) {
				prefixAndAttribs.push(attribs.join(', '));
			}
	
			this._container.innerHTML = prefixAndAttribs.join(' | ');
		},
	
		_onLayerAdd: function (e) {
			if (e.layer.getAttribution) {
				this.addAttribution(e.layer.getAttribution());
			}
		},
	
		_onLayerRemove: function (e) {
			if (e.layer.getAttribution) {
				this.removeAttribution(e.layer.getAttribution());
			}
		}
	});
	
	L.Map.mergeOptions({
		attributionControl: true
	});
	
	L.Map.addInitHook(function () {
		if (this.options.attributionControl) {
			this.attributionControl = (new L.Control.Attribution()).addTo(this);
		}
	});
	
	L.control.attribution = function (options) {
		return new L.Control.Attribution(options);
	};
	
	
	/*
	 * L.Control.Scale is used for displaying metric/imperial scale on the map.
	 */
	
	L.Control.Scale = L.Control.extend({
		options: {
			position: 'bottomleft',
			maxWidth: 100,
			metric: true,
			imperial: true,
			updateWhenIdle: false
		},
	
		onAdd: function (map) {
			this._map = map;
	
			var className = 'leaflet-control-scale',
			    container = L.DomUtil.create('div', className),
			    options = this.options;
	
			this._addScales(options, className, container);
	
			map.on(options.updateWhenIdle ? 'moveend' : 'move', this._update, this);
			map.whenReady(this._update, this);
	
			return container;
		},
	
		onRemove: function (map) {
			map.off(this.options.updateWhenIdle ? 'moveend' : 'move', this._update, this);
		},
	
		_addScales: function (options, className, container) {
			if (options.metric) {
				this._mScale = L.DomUtil.create('div', className + '-line', container);
			}
			if (options.imperial) {
				this._iScale = L.DomUtil.create('div', className + '-line', container);
			}
		},
	
		_update: function () {
			var bounds = this._map.getBounds(),
			    centerLat = bounds.getCenter().lat,
			    halfWorldMeters = 6378137 * Math.PI * Math.cos(centerLat * Math.PI / 180),
			    dist = halfWorldMeters * (bounds.getNorthEast().lng - bounds.getSouthWest().lng) / 180,
	
			    size = this._map.getSize(),
			    options = this.options,
			    maxMeters = 0;
	
			if (size.x > 0) {
				maxMeters = dist * (options.maxWidth / size.x);
			}
	
			this._updateScales(options, maxMeters);
		},
	
		_updateScales: function (options, maxMeters) {
			if (options.metric && maxMeters) {
				this._updateMetric(maxMeters);
			}
	
			if (options.imperial && maxMeters) {
				this._updateImperial(maxMeters);
			}
		},
	
		_updateMetric: function (maxMeters) {
			var meters = this._getRoundNum(maxMeters);
	
			this._mScale.style.width = this._getScaleWidth(meters / maxMeters) + 'px';
			this._mScale.innerHTML = meters < 1000 ? meters + ' m' : (meters / 1000) + ' km';
		},
	
		_updateImperial: function (maxMeters) {
			var maxFeet = maxMeters * 3.2808399,
			    scale = this._iScale,
			    maxMiles, miles, feet;
	
			if (maxFeet > 5280) {
				maxMiles = maxFeet / 5280;
				miles = this._getRoundNum(maxMiles);
	
				scale.style.width = this._getScaleWidth(miles / maxMiles) + 'px';
				scale.innerHTML = miles + ' mi';
	
			} else {
				feet = this._getRoundNum(maxFeet);
	
				scale.style.width = this._getScaleWidth(feet / maxFeet) + 'px';
				scale.innerHTML = feet + ' ft';
			}
		},
	
		_getScaleWidth: function (ratio) {
			return Math.round(this.options.maxWidth * ratio) - 10;
		},
	
		_getRoundNum: function (num) {
			var pow10 = Math.pow(10, (Math.floor(num) + '').length - 1),
			    d = num / pow10;
	
			d = d >= 10 ? 10 : d >= 5 ? 5 : d >= 3 ? 3 : d >= 2 ? 2 : 1;
	
			return pow10 * d;
		}
	});
	
	L.control.scale = function (options) {
		return new L.Control.Scale(options);
	};
	
	
	/*
	 * L.Control.Layers is a control to allow users to switch between different layers on the map.
	 */
	
	L.Control.Layers = L.Control.extend({
		options: {
			collapsed: true,
			position: 'topright',
			autoZIndex: true
		},
	
		initialize: function (baseLayers, overlays, options) {
			L.setOptions(this, options);
	
			this._layers = {};
			this._lastZIndex = 0;
			this._handlingClick = false;
	
			for (var i in baseLayers) {
				this._addLayer(baseLayers[i], i);
			}
	
			for (i in overlays) {
				this._addLayer(overlays[i], i, true);
			}
		},
	
		onAdd: function (map) {
			this._initLayout();
			this._update();
	
			map
			    .on('layeradd', this._onLayerChange, this)
			    .on('layerremove', this._onLayerChange, this);
	
			return this._container;
		},
	
		onRemove: function (map) {
			map
			    .off('layeradd', this._onLayerChange, this)
			    .off('layerremove', this._onLayerChange, this);
		},
	
		addBaseLayer: function (layer, name) {
			this._addLayer(layer, name);
			this._update();
			return this;
		},
	
		addOverlay: function (layer, name) {
			this._addLayer(layer, name, true);
			this._update();
			return this;
		},
	
		removeLayer: function (layer) {
			var id = L.stamp(layer);
			delete this._layers[id];
			this._update();
			return this;
		},
	
		_initLayout: function () {
			var className = 'leaflet-control-layers',
			    container = this._container = L.DomUtil.create('div', className);
	
			//Makes this work on IE10 Touch devices by stopping it from firing a mouseout event when the touch is released
			container.setAttribute('aria-haspopup', true);
	
			if (!L.Browser.touch) {
				L.DomEvent
					.disableClickPropagation(container)
					.disableScrollPropagation(container);
			} else {
				L.DomEvent.on(container, 'click', L.DomEvent.stopPropagation);
			}
	
			var form = this._form = L.DomUtil.create('form', className + '-list');
	
			if (this.options.collapsed) {
				if (!L.Browser.android) {
					L.DomEvent
					    .on(container, 'mouseover', this._expand, this)
					    .on(container, 'mouseout', this._collapse, this);
				}
				var link = this._layersLink = L.DomUtil.create('a', className + '-toggle', container);
				link.href = '#';
				link.title = 'Layers';
	
				if (L.Browser.touch) {
					L.DomEvent
					    .on(link, 'click', L.DomEvent.stop)
					    .on(link, 'click', this._expand, this);
				}
				else {
					L.DomEvent.on(link, 'focus', this._expand, this);
				}
				//Work around for Firefox android issue https://github.com/Leaflet/Leaflet/issues/2033
				L.DomEvent.on(form, 'click', function () {
					setTimeout(L.bind(this._onInputClick, this), 0);
				}, this);
	
				this._map.on('click', this._collapse, this);
				// TODO keyboard accessibility
			} else {
				this._expand();
			}
	
			this._baseLayersList = L.DomUtil.create('div', className + '-base', form);
			this._separator = L.DomUtil.create('div', className + '-separator', form);
			this._overlaysList = L.DomUtil.create('div', className + '-overlays', form);
	
			container.appendChild(form);
		},
	
		_addLayer: function (layer, name, overlay) {
			var id = L.stamp(layer);
	
			this._layers[id] = {
				layer: layer,
				name: name,
				overlay: overlay
			};
	
			if (this.options.autoZIndex && layer.setZIndex) {
				this._lastZIndex++;
				layer.setZIndex(this._lastZIndex);
			}
		},
	
		_update: function () {
			if (!this._container) {
				return;
			}
	
			this._baseLayersList.innerHTML = '';
			this._overlaysList.innerHTML = '';
	
			var baseLayersPresent = false,
			    overlaysPresent = false,
			    i, obj;
	
			for (i in this._layers) {
				obj = this._layers[i];
				this._addItem(obj);
				overlaysPresent = overlaysPresent || obj.overlay;
				baseLayersPresent = baseLayersPresent || !obj.overlay;
			}
	
			this._separator.style.display = overlaysPresent && baseLayersPresent ? '' : 'none';
		},
	
		_onLayerChange: function (e) {
			var obj = this._layers[L.stamp(e.layer)];
	
			if (!obj) { return; }
	
			if (!this._handlingClick) {
				this._update();
			}
	
			var type = obj.overlay ?
				(e.type === 'layeradd' ? 'overlayadd' : 'overlayremove') :
				(e.type === 'layeradd' ? 'baselayerchange' : null);
	
			if (type) {
				this._map.fire(type, obj);
			}
		},
	
		// IE7 bugs out if you create a radio dynamically, so you have to do it this hacky way (see http://bit.ly/PqYLBe)
		_createRadioElement: function (name, checked) {
	
			var radioHtml = '<input type="radio" class="leaflet-control-layers-selector" name="' + name + '"';
			if (checked) {
				radioHtml += ' checked="checked"';
			}
			radioHtml += '/>';
	
			var radioFragment = document.createElement('div');
			radioFragment.innerHTML = radioHtml;
	
			return radioFragment.firstChild;
		},
	
		_addItem: function (obj) {
			var label = document.createElement('label'),
			    input,
			    checked = this._map.hasLayer(obj.layer);
	
			if (obj.overlay) {
				input = document.createElement('input');
				input.type = 'checkbox';
				input.className = 'leaflet-control-layers-selector';
				input.defaultChecked = checked;
			} else {
				input = this._createRadioElement('leaflet-base-layers', checked);
			}
	
			input.layerId = L.stamp(obj.layer);
	
			L.DomEvent.on(input, 'click', this._onInputClick, this);
	
			var name = document.createElement('span');
			name.innerHTML = ' ' + obj.name;
	
			label.appendChild(input);
			label.appendChild(name);
	
			var container = obj.overlay ? this._overlaysList : this._baseLayersList;
			container.appendChild(label);
	
			return label;
		},
	
		_onInputClick: function () {
			var i, input, obj,
			    inputs = this._form.getElementsByTagName('input'),
			    inputsLen = inputs.length;
	
			this._handlingClick = true;
	
			for (i = 0; i < inputsLen; i++) {
				input = inputs[i];
				obj = this._layers[input.layerId];
	
				if (input.checked && !this._map.hasLayer(obj.layer)) {
					this._map.addLayer(obj.layer);
	
				} else if (!input.checked && this._map.hasLayer(obj.layer)) {
					this._map.removeLayer(obj.layer);
				}
			}
	
			this._handlingClick = false;
	
			this._refocusOnMap();
		},
	
		_expand: function () {
			L.DomUtil.addClass(this._container, 'leaflet-control-layers-expanded');
		},
	
		_collapse: function () {
			this._container.className = this._container.className.replace(' leaflet-control-layers-expanded', '');
		}
	});
	
	L.control.layers = function (baseLayers, overlays, options) {
		return new L.Control.Layers(baseLayers, overlays, options);
	};
	
	
	/*
	 * L.PosAnimation is used by Leaflet internally for pan animations.
	 */
	
	L.PosAnimation = L.Class.extend({
		includes: L.Mixin.Events,
	
		run: function (el, newPos, duration, easeLinearity) { // (HTMLElement, Point[, Number, Number])
			this.stop();
	
			this._el = el;
			this._inProgress = true;
			this._newPos = newPos;
	
			this.fire('start');
	
			el.style[L.DomUtil.TRANSITION] = 'all ' + (duration || 0.25) +
			        's cubic-bezier(0,0,' + (easeLinearity || 0.5) + ',1)';
	
			L.DomEvent.on(el, L.DomUtil.TRANSITION_END, this._onTransitionEnd, this);
			L.DomUtil.setPosition(el, newPos);
	
			// toggle reflow, Chrome flickers for some reason if you don't do this
			L.Util.falseFn(el.offsetWidth);
	
			// there's no native way to track value updates of transitioned properties, so we imitate this
			this._stepTimer = setInterval(L.bind(this._onStep, this), 50);
		},
	
		stop: function () {
			if (!this._inProgress) { return; }
	
			// if we just removed the transition property, the element would jump to its final position,
			// so we need to make it stay at the current position
	
			L.DomUtil.setPosition(this._el, this._getPos());
			this._onTransitionEnd();
			L.Util.falseFn(this._el.offsetWidth); // force reflow in case we are about to start a new animation
		},
	
		_onStep: function () {
			var stepPos = this._getPos();
			if (!stepPos) {
				this._onTransitionEnd();
				return;
			}
			// jshint camelcase: false
			// make L.DomUtil.getPosition return intermediate position value during animation
			this._el._leaflet_pos = stepPos;
	
			this.fire('step');
		},
	
		// you can't easily get intermediate values of properties animated with CSS3 Transitions,
		// we need to parse computed style (in case of transform it returns matrix string)
	
		_transformRe: /([-+]?(?:\d*\.)?\d+)\D*, ([-+]?(?:\d*\.)?\d+)\D*\)/,
	
		_getPos: function () {
			var left, top, matches,
			    el = this._el,
			    style = window.getComputedStyle(el);
	
			if (L.Browser.any3d) {
				matches = style[L.DomUtil.TRANSFORM].match(this._transformRe);
				if (!matches) { return; }
				left = parseFloat(matches[1]);
				top  = parseFloat(matches[2]);
			} else {
				left = parseFloat(style.left);
				top  = parseFloat(style.top);
			}
	
			return new L.Point(left, top, true);
		},
	
		_onTransitionEnd: function () {
			L.DomEvent.off(this._el, L.DomUtil.TRANSITION_END, this._onTransitionEnd, this);
	
			if (!this._inProgress) { return; }
			this._inProgress = false;
	
			this._el.style[L.DomUtil.TRANSITION] = '';
	
			// jshint camelcase: false
			// make sure L.DomUtil.getPosition returns the final position value after animation
			this._el._leaflet_pos = this._newPos;
	
			clearInterval(this._stepTimer);
	
			this.fire('step').fire('end');
		}
	
	});
	
	
	/*
	 * Extends L.Map to handle panning animations.
	 */
	
	L.Map.include({
	
		setView: function (center, zoom, options) {
	
			zoom = zoom === undefined ? this._zoom : this._limitZoom(zoom);
			center = this._limitCenter(L.latLng(center), zoom, this.options.maxBounds);
			options = options || {};
	
			if (this._panAnim) {
				this._panAnim.stop();
			}
	
			if (this._loaded && !options.reset && options !== true) {
	
				if (options.animate !== undefined) {
					options.zoom = L.extend({animate: options.animate}, options.zoom);
					options.pan = L.extend({animate: options.animate}, options.pan);
				}
	
				// try animating pan or zoom
				var animated = (this._zoom !== zoom) ?
					this._tryAnimatedZoom && this._tryAnimatedZoom(center, zoom, options.zoom) :
					this._tryAnimatedPan(center, options.pan);
	
				if (animated) {
					// prevent resize handler call, the view will refresh after animation anyway
					clearTimeout(this._sizeTimer);
					return this;
				}
			}
	
			// animation didn't start, just reset the map view
			this._resetView(center, zoom);
	
			return this;
		},
	
		panBy: function (offset, options) {
			offset = L.point(offset).round();
			options = options || {};
	
			if (!offset.x && !offset.y) {
				return this;
			}
	
			if (!this._panAnim) {
				this._panAnim = new L.PosAnimation();
	
				this._panAnim.on({
					'step': this._onPanTransitionStep,
					'end': this._onPanTransitionEnd
				}, this);
			}
	
			// don't fire movestart if animating inertia
			if (!options.noMoveStart) {
				this.fire('movestart');
			}
	
			// animate pan unless animate: false specified
			if (options.animate !== false) {
				L.DomUtil.addClass(this._mapPane, 'leaflet-pan-anim');
	
				var newPos = this._getMapPanePos().subtract(offset);
				this._panAnim.run(this._mapPane, newPos, options.duration || 0.25, options.easeLinearity);
			} else {
				this._rawPanBy(offset);
				this.fire('move').fire('moveend');
			}
	
			return this;
		},
	
		_onPanTransitionStep: function () {
			this.fire('move');
		},
	
		_onPanTransitionEnd: function () {
			L.DomUtil.removeClass(this._mapPane, 'leaflet-pan-anim');
			this.fire('moveend');
		},
	
		_tryAnimatedPan: function (center, options) {
			// difference between the new and current centers in pixels
			var offset = this._getCenterOffset(center)._floor();
	
			// don't animate too far unless animate: true specified in options
			if ((options && options.animate) !== true && !this.getSize().contains(offset)) { return false; }
	
			this.panBy(offset, options);
	
			return true;
		}
	});
	
	
	/*
	 * L.PosAnimation fallback implementation that powers Leaflet pan animations
	 * in browsers that don't support CSS3 Transitions.
	 */
	
	L.PosAnimation = L.DomUtil.TRANSITION ? L.PosAnimation : L.PosAnimation.extend({
	
		run: function (el, newPos, duration, easeLinearity) { // (HTMLElement, Point[, Number, Number])
			this.stop();
	
			this._el = el;
			this._inProgress = true;
			this._duration = duration || 0.25;
			this._easeOutPower = 1 / Math.max(easeLinearity || 0.5, 0.2);
	
			this._startPos = L.DomUtil.getPosition(el);
			this._offset = newPos.subtract(this._startPos);
			this._startTime = +new Date();
	
			this.fire('start');
	
			this._animate();
		},
	
		stop: function () {
			if (!this._inProgress) { return; }
	
			this._step();
			this._complete();
		},
	
		_animate: function () {
			// animation loop
			this._animId = L.Util.requestAnimFrame(this._animate, this);
			this._step();
		},
	
		_step: function () {
			var elapsed = (+new Date()) - this._startTime,
			    duration = this._duration * 1000;
	
			if (elapsed < duration) {
				this._runFrame(this._easeOut(elapsed / duration));
			} else {
				this._runFrame(1);
				this._complete();
			}
		},
	
		_runFrame: function (progress) {
			var pos = this._startPos.add(this._offset.multiplyBy(progress));
			L.DomUtil.setPosition(this._el, pos);
	
			this.fire('step');
		},
	
		_complete: function () {
			L.Util.cancelAnimFrame(this._animId);
	
			this._inProgress = false;
			this.fire('end');
		},
	
		_easeOut: function (t) {
			return 1 - Math.pow(1 - t, this._easeOutPower);
		}
	});
	
	
	/*
	 * Extends L.Map to handle zoom animations.
	 */
	
	L.Map.mergeOptions({
		zoomAnimation: true,
		zoomAnimationThreshold: 4
	});
	
	if (L.DomUtil.TRANSITION) {
	
		L.Map.addInitHook(function () {
			// don't animate on browsers without hardware-accelerated transitions or old Android/Opera
			this._zoomAnimated = this.options.zoomAnimation && L.DomUtil.TRANSITION &&
					L.Browser.any3d && !L.Browser.android23 && !L.Browser.mobileOpera;
	
			// zoom transitions run with the same duration for all layers, so if one of transitionend events
			// happens after starting zoom animation (propagating to the map pane), we know that it ended globally
			if (this._zoomAnimated) {
				L.DomEvent.on(this._mapPane, L.DomUtil.TRANSITION_END, this._catchTransitionEnd, this);
			}
		});
	}
	
	L.Map.include(!L.DomUtil.TRANSITION ? {} : {
	
		_catchTransitionEnd: function (e) {
			if (this._animatingZoom && e.propertyName.indexOf('transform') >= 0) {
				this._onZoomTransitionEnd();
			}
		},
	
		_nothingToAnimate: function () {
			return !this._container.getElementsByClassName('leaflet-zoom-animated').length;
		},
	
		_tryAnimatedZoom: function (center, zoom, options) {
	
			if (this._animatingZoom) { return true; }
	
			options = options || {};
	
			// don't animate if disabled, not supported or zoom difference is too large
			if (!this._zoomAnimated || options.animate === false || this._nothingToAnimate() ||
			        Math.abs(zoom - this._zoom) > this.options.zoomAnimationThreshold) { return false; }
	
			// offset is the pixel coords of the zoom origin relative to the current center
			var scale = this.getZoomScale(zoom),
			    offset = this._getCenterOffset(center)._divideBy(1 - 1 / scale),
				origin = this._getCenterLayerPoint()._add(offset);
	
			// don't animate if the zoom origin isn't within one screen from the current center, unless forced
			if (options.animate !== true && !this.getSize().contains(offset)) { return false; }
	
			this
			    .fire('movestart')
			    .fire('zoomstart');
	
			this._animateZoom(center, zoom, origin, scale, null, true);
	
			return true;
		},
	
		_animateZoom: function (center, zoom, origin, scale, delta, backwards, forTouchZoom) {
	
			if (!forTouchZoom) {
				this._animatingZoom = true;
			}
	
			// put transform transition on all layers with leaflet-zoom-animated class
			L.DomUtil.addClass(this._mapPane, 'leaflet-zoom-anim');
	
			// remember what center/zoom to set after animation
			this._animateToCenter = center;
			this._animateToZoom = zoom;
	
			// disable any dragging during animation
			if (L.Draggable) {
				L.Draggable._disabled = true;
			}
	
			L.Util.requestAnimFrame(function () {
				this.fire('zoomanim', {
					center: center,
					zoom: zoom,
					origin: origin,
					scale: scale,
					delta: delta,
					backwards: backwards
				});
				// horrible hack to work around a Chrome bug https://github.com/Leaflet/Leaflet/issues/3689
				setTimeout(L.bind(this._onZoomTransitionEnd, this), 250);
			}, this);
		},
	
		_onZoomTransitionEnd: function () {
			if (!this._animatingZoom) { return; }
	
			this._animatingZoom = false;
	
			L.DomUtil.removeClass(this._mapPane, 'leaflet-zoom-anim');
	
			L.Util.requestAnimFrame(function () {
				this._resetView(this._animateToCenter, this._animateToZoom, true, true);
	
				if (L.Draggable) {
					L.Draggable._disabled = false;
				}
			}, this);
		}
	});
	
	
	/*
		Zoom animation logic for L.TileLayer.
	*/
	
	L.TileLayer.include({
		_animateZoom: function (e) {
			if (!this._animating) {
				this._animating = true;
				this._prepareBgBuffer();
			}
	
			var bg = this._bgBuffer,
			    transform = L.DomUtil.TRANSFORM,
			    initialTransform = e.delta ? L.DomUtil.getTranslateString(e.delta) : bg.style[transform],
			    scaleStr = L.DomUtil.getScaleString(e.scale, e.origin);
	
			bg.style[transform] = e.backwards ?
					scaleStr + ' ' + initialTransform :
					initialTransform + ' ' + scaleStr;
		},
	
		_endZoomAnim: function () {
			var front = this._tileContainer,
			    bg = this._bgBuffer;
	
			front.style.visibility = '';
			front.parentNode.appendChild(front); // Bring to fore
	
			// force reflow
			L.Util.falseFn(bg.offsetWidth);
	
			var zoom = this._map.getZoom();
			if (zoom > this.options.maxZoom || zoom < this.options.minZoom) {
				this._clearBgBuffer();
			}
	
			this._animating = false;
		},
	
		_clearBgBuffer: function () {
			var map = this._map;
	
			if (map && !map._animatingZoom && !map.touchZoom._zooming) {
				this._bgBuffer.innerHTML = '';
				this._bgBuffer.style[L.DomUtil.TRANSFORM] = '';
			}
		},
	
		_prepareBgBuffer: function () {
	
			var front = this._tileContainer,
			    bg = this._bgBuffer;
	
			// if foreground layer doesn't have many tiles but bg layer does,
			// keep the existing bg layer and just zoom it some more
	
			var bgLoaded = this._getLoadedTilesPercentage(bg),
			    frontLoaded = this._getLoadedTilesPercentage(front);
	
			if (bg && bgLoaded > 0.5 && frontLoaded < 0.5) {
	
				front.style.visibility = 'hidden';
				this._stopLoadingImages(front);
				return;
			}
	
			// prepare the buffer to become the front tile pane
			bg.style.visibility = 'hidden';
			bg.style[L.DomUtil.TRANSFORM] = '';
	
			// switch out the current layer to be the new bg layer (and vice-versa)
			this._tileContainer = bg;
			bg = this._bgBuffer = front;
	
			this._stopLoadingImages(bg);
	
			//prevent bg buffer from clearing right after zoom
			clearTimeout(this._clearBgBufferTimer);
		},
	
		_getLoadedTilesPercentage: function (container) {
			var tiles = container.getElementsByTagName('img'),
			    i, len, count = 0;
	
			for (i = 0, len = tiles.length; i < len; i++) {
				if (tiles[i].complete) {
					count++;
				}
			}
			return count / len;
		},
	
		// stops loading all tiles in the background layer
		_stopLoadingImages: function (container) {
			var tiles = Array.prototype.slice.call(container.getElementsByTagName('img')),
			    i, len, tile;
	
			for (i = 0, len = tiles.length; i < len; i++) {
				tile = tiles[i];
	
				if (!tile.complete) {
					tile.onload = L.Util.falseFn;
					tile.onerror = L.Util.falseFn;
					tile.src = L.Util.emptyImageUrl;
	
					tile.parentNode.removeChild(tile);
				}
			}
		}
	});
	
	
	/*
	 * Provides L.Map with convenient shortcuts for using browser geolocation features.
	 */
	
	L.Map.include({
		_defaultLocateOptions: {
			watch: false,
			setView: false,
			maxZoom: Infinity,
			timeout: 10000,
			maximumAge: 0,
			enableHighAccuracy: false
		},
	
		locate: function (/*Object*/ options) {
	
			options = this._locateOptions = L.extend(this._defaultLocateOptions, options);
	
			if (!navigator.geolocation) {
				this._handleGeolocationError({
					code: 0,
					message: 'Geolocation not supported.'
				});
				return this;
			}
	
			var onResponse = L.bind(this._handleGeolocationResponse, this),
				onError = L.bind(this._handleGeolocationError, this);
	
			if (options.watch) {
				this._locationWatchId =
				        navigator.geolocation.watchPosition(onResponse, onError, options);
			} else {
				navigator.geolocation.getCurrentPosition(onResponse, onError, options);
			}
			return this;
		},
	
		stopLocate: function () {
			if (navigator.geolocation) {
				navigator.geolocation.clearWatch(this._locationWatchId);
			}
			if (this._locateOptions) {
				this._locateOptions.setView = false;
			}
			return this;
		},
	
		_handleGeolocationError: function (error) {
			var c = error.code,
			    message = error.message ||
			            (c === 1 ? 'permission denied' :
			            (c === 2 ? 'position unavailable' : 'timeout'));
	
			if (this._locateOptions.setView && !this._loaded) {
				this.fitWorld();
			}
	
			this.fire('locationerror', {
				code: c,
				message: 'Geolocation error: ' + message + '.'
			});
		},
	
		_handleGeolocationResponse: function (pos) {
			var lat = pos.coords.latitude,
			    lng = pos.coords.longitude,
			    latlng = new L.LatLng(lat, lng),
	
			    latAccuracy = 180 * pos.coords.accuracy / 40075017,
			    lngAccuracy = latAccuracy / Math.cos(L.LatLng.DEG_TO_RAD * lat),
	
			    bounds = L.latLngBounds(
			            [lat - latAccuracy, lng - lngAccuracy],
			            [lat + latAccuracy, lng + lngAccuracy]),
	
			    options = this._locateOptions;
	
			if (options.setView) {
				var zoom = Math.min(this.getBoundsZoom(bounds), options.maxZoom);
				this.setView(latlng, zoom);
			}
	
			var data = {
				latlng: latlng,
				bounds: bounds,
				timestamp: pos.timestamp
			};
	
			for (var i in pos.coords) {
				if (typeof pos.coords[i] === 'number') {
					data[i] = pos.coords[i];
				}
			}
	
			this.fire('locationfound', data);
		}
	});
	
	
	}(window, document));

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
	 * leaflet-geocoder-mapzen
	 * Leaflet plugin to search (geocode) using Mapzen Search or your
	 * own hosted version of the Pelias Geocoder API.
	 *
	 * License: MIT
	 * (c) Mapzen
	 */
	;(function (factory) { // eslint-disable-line no-extra-semi
	  var L;
	  if (true) {
	    // AMD
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(9)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof module !== 'undefined') {
	    // Node/CommonJS
	    L = require('leaflet');
	    module.exports = factory(L);
	  } else {
	    // Browser globals
	    if (typeof window.L === 'undefined') {
	      throw new Error('Leaflet must be loaded first');
	    }
	    factory(window.L);
	  }
	}(function (L) {
	  'use strict';
	
	  var MINIMUM_INPUT_LENGTH_FOR_AUTOCOMPLETE = 1;
	  var FULL_WIDTH_MARGIN = 20; // in pixels
	  var FULL_WIDTH_TOUCH_ADJUSTED_MARGIN = 4; // in pixels
	  var RESULTS_HEIGHT_MARGIN = 20; // in pixels
	  var API_RATE_LIMIT = 250; // in ms, throttled time between subsequent requests to API
	
	  L.Control.Geocoder = L.Control.extend({
	
	    includes: L.Mixin.Events,
	
	    options: {
	      position: 'topleft',
	      attribution: 'Geocoding by <a href="https://mapzen.com/projects/search/">Mapzen</a>',
	      url: 'https://search.mapzen.com/v1',
	      placeholder: 'Search',
	      title: 'Search',
	      bounds: false,
	      latlng: null,
	      layers: null,
	      panToPoint: true,
	      pointIcon: true, // 'images/point_icon.png',
	      polygonIcon: true, // 'images/polygon_icon.png',
	      fullWidth: 650,
	      markers: true,
	      expanded: false,
	      autocomplete: true
	    },
	
	    initialize: function (apiKey, options) {
	      // For IE8 compatibility (if XDomainRequest is present),
	      // we set the default value of options.url to the protocol-relative
	      // version, because XDomainRequest does not allow http-to-https requests
	      // This is set first so it can always be overridden by the user
	      if (window.XDomainRequest) {
	        this.options.url = '//search.mapzen.com/v1';
	      }
	
	      // If the apiKey is omitted entirely and the
	      // first parameter is actually the options
	      if (typeof apiKey === 'object' && !!apiKey) {
	        options = apiKey;
	      } else {
	        this.apiKey = apiKey;
	      }
	
	      // Now merge user-specified options
	      L.Util.setOptions(this, options);
	      this.marker;
	      this.markers = [];
	    },
	
	    getLayers: function (params) {
	      var layers = this.options.layers;
	
	      if (!layers) {
	        return params;
	      }
	
	      params.layers = layers;
	      return params;
	    },
	
	    getBoundingBoxParam: function (params) {
	      /*
	       * this.options.bounds can be one of the following
	       * true //Boolean - take the map bounds
	       * false //Boolean - no bounds
	       * L.latLngBounds(...) //Object
	       * [[10, 10], [40, 60]] //Array
	      */
	      var bounds = this.options.bounds;
	
	      // If falsy, bail
	      if (!bounds) {
	        return params;
	      }
	
	      // If set to true, use map bounds
	      // If it is a valid L.LatLngBounds object, get its values
	      // If it is an array, try running it through L.LatLngBounds
	      if (bounds === true) {
	        bounds = this._map.getBounds();
	        params = makeParamsFromLeaflet(params, bounds);
	      } else if (typeof bounds === 'object' && bounds.isValid && bounds.isValid()) {
	        params = makeParamsFromLeaflet(params, bounds);
	      } else if (L.Util.isArray(bounds)) {
	        var latLngBounds = L.latLngBounds(bounds);
	        if (latLngBounds.isValid && latLngBounds.isValid()) {
	          params = makeParamsFromLeaflet(params, latLngBounds);
	        }
	      }
	
	      function makeParamsFromLeaflet (params, latLngBounds) {
	        params['boundary.rect.min_lon'] = latLngBounds.getWest();
	        params['boundary.rect.min_lat'] = latLngBounds.getSouth();
	        params['boundary.rect.max_lon'] = latLngBounds.getEast();
	        params['boundary.rect.max_lat'] = latLngBounds.getNorth();
	        return params;
	      }
	
	      return params;
	    },
	
	    getLatlngParam: function (params) {
	      /*
	       * this.options.latlng can be one of the following
	       * [50, 30] //Array
	       * {lon: 30, lat: 50} //Object
	       * {lat: 50, lng: 30} //Object
	       * L.latLng(50, 30) //Object
	       * true //Boolean - take the map center
	       * false //Boolean - No latlng to be considered
	      */
	      var latlng = this.options.latlng;
	
	      if (!latlng) {
	        return params;
	      }
	
	      if (latlng.constructor === Array) {
	        // TODO Check for array size, throw errors if invalid lat/lon
	        params['focus.point.lat'] = latlng[0];
	        params['focus.point.lon'] = latlng[1];
	      } else if (typeof latlng !== 'object') {
	        // fallback to the map's center L.latLng()
	        latlng = this._map.getCenter();
	        params['focus.point.lat'] = latlng.lat;
	        params['focus.point.lon'] = latlng.lng;
	      } else {
	        // TODO Check for valid L.LatLng Object or Object thats in the form of {lat:..,lon:..}
	        // TODO Check for valid lat/lon values, Error handling
	        params['focus.point.lat'] = latlng.lat;
	        params['focus.point.lon'] = latlng.lng ? latlng.lng : latlng.lon;
	      }
	
	      return params;
	    },
	
	    search: function (input) {
	      // Prevent lack of input from sending a malformed query to Pelias
	      if (!input) return;
	
	      var url = this.options.url + '/search';
	      var params = {
	        text: input
	      };
	
	      this.callPelias(url, params, 'search');
	    },
	
	    autocomplete: throttle(function (input) {
	      // Prevent lack of input from sending a malformed query to Pelias
	      if (!input) return;
	
	      var url = this.options.url + '/autocomplete';
	      var params = {
	        text: input
	      };
	
	      this.callPelias(url, params, 'autocomplete');
	    }, API_RATE_LIMIT),
	
	    // Timestamp of the last response which was successfully rendered to the UI.
	    // The time represents when the request was *sent*, not when it was recieved.
	    maxReqTimestampRendered: new Date().getTime(),
	
	    callPelias: function (endpoint, params, type) {
	      params = this.getBoundingBoxParam(params);
	      params = this.getLatlngParam(params);
	      params = this.getLayers(params);
	
	      // Search API key
	      if (this.apiKey) {
	        params.api_key = this.apiKey;
	      }
	
	      L.DomUtil.addClass(this._search, 'leaflet-pelias-loading');
	
	      // Track when the request began
	      var reqStartedAt = new Date().getTime();
	
	      AJAX.request(endpoint, params, function (err, results) {
	        L.DomUtil.removeClass(this._search, 'leaflet-pelias-loading');
	
	        if (err) {
	          var errorMessage;
	          switch (err.code) {
	            // Error codes.
	            // https://mapzen.com/documentation/search/http-status-codes/
	            case 403:
	              errorMessage = 'A valid API key is needed for this search feature.';
	              break;
	            case 404:
	              errorMessage = 'The search service cannot be found. :-(';
	              break;
	            case 408:
	              errorMessage = 'The search service took too long to respond. Try again in a second.';
	              break;
	            case 429:
	              errorMessage = 'There were too many requests. Try again in a second.';
	              break;
	            case 500:
	              errorMessage = 'The search service is not working right now. Please try again later.';
	              break;
	            case 502:
	              errorMessage = 'Connection lost. Please try again later.';
	              break;
	            // Note the status code is 0 if CORS is not enabled on the error response
	            default:
	              errorMessage = 'The search service is having problems :-(';
	              break;
	          }
	          this.showMessage(errorMessage);
	          this.fire('error', {
	            results: results,
	            endpoint: endpoint,
	            requestType: type,
	            params: params,
	            errorCode: err.code,
	            errorMessage: errorMessage
	          });
	        }
	
	        if (results && results.features) {
	          // Ignore requests that started before a request which has already
	          // been successfully rendered on to the UI.
	          if (this.maxReqTimestampRendered < reqStartedAt) {
	            this.maxReqTimestampRendered = reqStartedAt;
	            this.showResults(results.features);
	            this.fire('results', {
	              results: results,
	              endpoint: endpoint,
	              requestType: type,
	              params: params
	            });
	          }
	          // Else ignore the request, it is stale.
	        }
	      }, this);
	    },
	
	    highlight: function (text, focus) {
	      var r = RegExp('(' + escapeRegExp(focus) + ')', 'gi');
	      return text.replace(r, '<strong>$1</strong>');
	    },
	
	    getIconType: function (layer) {
	      var pointIcon = this.options.pointIcon;
	      var polygonIcon = this.options.polygonIcon;
	      var classPrefix = 'leaflet-pelias-layer-icon-';
	
	      if (layer.match('venue') || layer.match('address')) {
	        if (pointIcon === true) {
	          return {
	            type: 'class',
	            value: classPrefix + 'point'
	          };
	        } else if (pointIcon === false) {
	          return false;
	        } else {
	          return {
	            type: 'image',
	            value: pointIcon
	          };
	        }
	      } else {
	        if (polygonIcon === true) {
	          return {
	            type: 'class',
	            value: classPrefix + 'polygon'
	          };
	        } else if (polygonIcon === false) {
	          return false;
	        } else {
	          return {
	            type: 'image',
	            value: polygonIcon
	          };
	        }
	      }
	    },
	
	    showResults: function (features) {
	      // Exit function if there are no features
	      if (features.length === 0) {
	        this.showMessage('No results were found.');
	        return;
	      }
	
	      var resultsContainer = this._results;
	
	      // Reset and display results container
	      resultsContainer.innerHTML = '';
	      resultsContainer.style.display = 'block';
	      // manage result box height
	      resultsContainer.style.maxHeight = (this._map.getSize().y - resultsContainer.offsetTop - this._container.offsetTop - RESULTS_HEIGHT_MARGIN) + 'px';
	
	      var list = L.DomUtil.create('ul', 'leaflet-pelias-list', resultsContainer);
	
	      for (var i = 0, j = features.length; i < j; i++) {
	        var feature = features[i];
	        var resultItem = L.DomUtil.create('li', 'leaflet-pelias-result', list);
	
	        resultItem.feature = feature;
	        resultItem.layer = feature.properties.layer;
	
	        // Deprecated
	        // Use L.GeoJSON.coordsToLatLng(resultItem.feature.geometry.coordinates) instead
	        // This returns a L.LatLng object that can be used throughout Leaflet
	        resultItem.coords = feature.geometry.coordinates;
	
	        var icon = this.getIconType(feature.properties.layer);
	        if (icon) {
	          // Point or polygon icon
	          // May be a class or an image path
	          var layerIconContainer = L.DomUtil.create('span', 'leaflet-pelias-layer-icon-container', resultItem);
	          var layerIcon;
	
	          if (icon.type === 'class') {
	            layerIcon = L.DomUtil.create('div', 'leaflet-pelias-layer-icon ' + icon.value, layerIconContainer);
	          } else {
	            layerIcon = L.DomUtil.create('img', 'leaflet-pelias-layer-icon', layerIconContainer);
	            layerIcon.src = icon.value;
	          }
	
	          layerIcon.title = 'layer: ' + feature.properties.layer;
	        }
	
	        if (this._input.value.length > 0) {
	          resultItem.innerHTML += this.highlight(feature.properties.label, this._input.value);
	        }
	      }
	    },
	
	    showMessage: function (text) {
	      var resultsContainer = this._results;
	
	      // Reset and display results container
	      resultsContainer.innerHTML = '';
	      resultsContainer.style.display = 'block';
	
	      var messageEl = L.DomUtil.create('div', 'leaflet-pelias-message', resultsContainer);
	      messageEl.textContent = text;
	    },
	
	    removeMarkers: function () {
	      if (this.options.markers) {
	        for (var i = 0; i < this.markers.length; i++) {
	          this._map.removeLayer(this.markers[i]);
	        }
	        this.markers = [];
	      }
	    },
	
	    showMarker: function (text, latlng) {
	      this.removeMarkers();
	      this._map.setView(latlng, this._map.getZoom() || 8);
	
	      var markerOptions = (typeof this.options.markers === 'object') ? this.options.markers : {};
	
	      if (this.options.markers) {
	        this.marker = new L.marker(latlng, markerOptions).bindPopup(text); // eslint-disable-line new-cap
	        this._map.addLayer(this.marker);
	        this.markers.push(this.marker);
	        this.marker.openPopup();
	      }
	    },
	
	    setSelectedResult: function (selected, originalEvent) {
	      var latlng = L.GeoJSON.coordsToLatLng(selected.feature.geometry.coordinates);
	      this._input.value = selected.innerText || selected.textContent;
	      this.showMarker(selected.innerHTML, latlng);
	      this.fire('select', {
	        originalEvent: originalEvent,
	        latlng: latlng,
	        feature: selected.feature
	      });
	      this.blur();
	    },
	
	    resetInput: function () {
	      this._input.value = '';
	      L.DomUtil.addClass(this._close, 'leaflet-pelias-hidden');
	      this.removeMarkers();
	      this._input.focus();
	      this.fire('reset');
	    },
	
	    // Removes focus from geocoder control
	    blur: function () {
	      this.clearResults();
	      if (this._input.value === '' && this._results.style.display !== 'none') {
	        L.DomUtil.addClass(this._close, 'leaflet-pelias-hidden');
	        if (!this.options.expanded) {
	          this.collapse();
	        }
	      }
	    },
	
	    clearResults: function () {
	      // Hide results from view
	      this._results.style.display = 'none';
	
	      // Destroy contents if input has also cleared
	      if (this._input.value === '') {
	        this._results.innerHTML = '';
	      }
	    },
	
	    expand: function () {
	      L.DomUtil.addClass(this._container, 'leaflet-pelias-expanded');
	      this.setFullWidth();
	      this.fire('expand');
	    },
	
	    collapse: function () {
	      // 'expanded' options check happens outside of this function now
	      // So it's now possible for a script to force-collapse a geocoder
	      // that otherwise defaults to the always-expanded state
	      L.DomUtil.removeClass(this._container, 'leaflet-pelias-expanded');
	      this._input.blur();
	      this.clearFullWidth();
	      this.clearResults();
	      this.fire('collapse');
	    },
	
	    // Set full width of expanded input, if enabled
	    setFullWidth: function () {
	      if (this.options.fullWidth) {
	        // If fullWidth setting is a number, only expand if map container
	        // is smaller than that breakpoint. Otherwise, clear width
	        // Always ask map to invalidate and recalculate size first
	        this._map.invalidateSize();
	        var mapWidth = this._map.getSize().x;
	        var touchAdjustment = L.Browser.touch ? FULL_WIDTH_TOUCH_ADJUSTED_MARGIN : 0;
	        var width = mapWidth - FULL_WIDTH_MARGIN - touchAdjustment;
	        if (typeof this.options.fullWidth === 'number' && mapWidth >= window.parseInt(this.options.fullWidth, 10)) {
	          this.clearFullWidth();
	          return;
	        }
	        this._container.style.width = width.toString() + 'px';
	      }
	    },
	
	    clearFullWidth: function () {
	      // Clear set width, if any
	      if (this.options.fullWidth) {
	        this._container.style.width = '';
	      }
	    },
	
	    onAdd: function (map) {
	      var container = L.DomUtil.create('div',
	          'leaflet-pelias-control leaflet-bar leaflet-control');
	
	      this._body = document.body || document.getElementsByTagName('body')[0];
	      this._container = container;
	      this._input = L.DomUtil.create('input', 'leaflet-pelias-input', this._container);
	      this._input.spellcheck = false;
	
	      // Only set if title option is not null or falsy
	      if (this.options.title) {
	        this._input.title = this.options.title;
	      }
	
	      // Only set if placeholder option is not null or falsy
	      if (this.options.placeholder) {
	        this._input.placeholder = this.options.placeholder;
	      }
	
	      this._search = L.DomUtil.create('a', 'leaflet-pelias-search-icon', this._container);
	      this._close = L.DomUtil.create('div', 'leaflet-pelias-close leaflet-pelias-hidden', this._container);
	      this._close.innerHTML = '×';
	      this._close.title = 'Close';
	
	      this._results = L.DomUtil.create('div', 'leaflet-pelias-results leaflet-bar', this._container);
	
	      if (this.options.expanded) {
	        this.expand();
	      }
	
	      L.DomEvent
	        .on(this._container, 'click', function (e) {
	          // Other listeners should call stopProgation() to
	          // prevent this from firing too greedily
	          this._input.focus();
	        }, this)
	        .on(this._input, 'focus', function (e) {
	          if (this._input.value) {
	            this._results.style.display = 'block';
	          }
	        }, this)
	        .on(this._map, 'click', function (e) {
	          // Does what you might expect a _input.blur() listener might do,
	          // but since that would fire for any reason (e.g. clicking a result)
	          // what you really want is to blur from the control by listening to clicks on the map
	          this.blur();
	        }, this)
	        .on(this._search, 'click', function (e) {
	          L.DomEvent.stopPropagation(e);
	
	          // Toggles expanded state of container on click of search icon
	          if (L.DomUtil.hasClass(this._container, 'leaflet-pelias-expanded')) {
	            // If expanded option is true, just focus the input
	            if (this.options.expanded === true) {
	              this._input.focus();
	              return;
	            } else {
	              // Otherwise, toggle to hidden state
	              L.DomUtil.addClass(this._close, 'leaflet-pelias-hidden');
	              this.collapse();
	            }
	          } else {
	            // If not currently expanded, clicking here always expands it
	            if (this._input.value.length > 0) {
	              L.DomUtil.removeClass(this._close, 'leaflet-pelias-hidden');
	            }
	            this.expand();
	            this._input.focus();
	          }
	        }, this)
	        .on(this._close, 'click', function (e) {
	          this.resetInput();
	          this.clearResults();
	          L.DomEvent.stopPropagation(e);
	        }, this)
	        .on(this._input, 'keydown', function (e) {
	          var list = this._results.querySelectorAll('.leaflet-pelias-result');
	          var selected = this._results.querySelectorAll('.leaflet-pelias-selected')[0];
	          var selectedPosition;
	          var self = this;
	          var panToPoint = function (shouldPan) {
	            var _selected = self._results.querySelectorAll('.leaflet-pelias-selected')[0];
	            if (_selected && shouldPan) {
	              self.showMarker(_selected.innerHTML, L.GeoJSON.coordsToLatLng(_selected.feature.geometry.coordinates));
	            }
	          };
	
	          var scrollSelectedResultIntoView = function () {
	            var _selected = self._results.querySelectorAll('.leaflet-pelias-selected')[0];
	            var _selectedRect = _selected.getBoundingClientRect();
	            var _resultsRect = self._results.getBoundingClientRect();
	            // Is the selected element not visible?
	            if (_selectedRect.bottom > _resultsRect.bottom) {
	              self._results.scrollTop = _selected.offsetTop + _selected.offsetHeight - self._results.offsetHeight;
	            } else if (_selectedRect.top < _resultsRect.top) {
	              self._results.scrollTop = _selected.offsetTop;
	            }
	          };
	
	          for (var i = 0; i < list.length; i++) {
	            if (list[i] === selected) {
	              selectedPosition = i;
	              break;
	            }
	          }
	
	          // TODO cleanup
	          switch (e.keyCode) {
	            // 13 = enter
	            case 13:
	              if (selected) {
	                this.setSelectedResult(selected, e);
	              } else {
	                // perform a full text search on enter
	                var text = (e.target || e.srcElement).value;
	                this.search(text);
	              }
	              L.DomEvent.preventDefault(e);
	              break;
	            // 38 = up arrow
	            case 38:
	              // Ignore key if there are no results or if list is not visible
	              if (list.length === 0 || this._results.style.display === 'none') {
	                return;
	              }
	
	              if (selected) {
	                L.DomUtil.removeClass(selected, 'leaflet-pelias-selected');
	              }
	
	              var previousItem = list[selectedPosition - 1];
	              var highlighted = (selected && previousItem) ? previousItem : list[list.length - 1]; // eslint-disable-line no-redeclare
	
	              L.DomUtil.addClass(highlighted, 'leaflet-pelias-selected');
	              scrollSelectedResultIntoView();
	              panToPoint(this.options.panToPoint);
	              this.fire('highlight', {
	                originalEvent: e,
	                latlng: L.GeoJSON.coordsToLatLng(highlighted.feature.geometry.coordinates),
	                feature: highlighted.feature
	              });
	
	              L.DomEvent.preventDefault(e);
	              break;
	            // 40 = down arrow
	            case 40:
	              // Ignore key if there are no results or if list is not visible
	              if (list.length === 0 || this._results.style.display === 'none') {
	                return;
	              }
	
	              if (selected) {
	                L.DomUtil.removeClass(selected, 'leaflet-pelias-selected');
	              }
	
	              var nextItem = list[selectedPosition + 1];
	              var highlighted = (selected && nextItem) ? nextItem : list[0]; // eslint-disable-line no-redeclare
	
	              L.DomUtil.addClass(highlighted, 'leaflet-pelias-selected');
	              scrollSelectedResultIntoView();
	              panToPoint(this.options.panToPoint);
	              this.fire('highlight', {
	                originalEvent: e,
	                latlng: L.GeoJSON.coordsToLatLng(highlighted.feature.geometry.coordinates),
	                feature: highlighted.feature
	              });
	
	              L.DomEvent.preventDefault(e);
	              break;
	            // all other keys
	            default:
	              break;
	          }
	        }, this)
	        .on(this._input, 'keyup', function (e) {
	          var key = e.which || e.keyCode;
	          var text = (e.target || e.srcElement).value;
	
	          if (this._input.value.length > 0) {
	            L.DomUtil.removeClass(this._close, 'leaflet-pelias-hidden');
	          } else {
	            L.DomUtil.addClass(this._close, 'leaflet-pelias-hidden');
	          }
	
	          // Ignore all further action if the keycode matches an arrow
	          // key (handled via keydown event)
	          if (key === 13 || key === 38 || key === 40) {
	            return;
	          }
	
	          // keyCode 27 = esc key (esc should clear results)
	          if (key === 27) {
	            // If input is blank or results have already been cleared
	            // (perhaps due to a previous 'esc') then pressing esc at
	            // this point will blur from input as well.
	            if (text.length === 0 || this._results.style.display === 'none') {
	              this._input.blur();
	
	              if (L.DomUtil.hasClass(this._container, 'leaflet-pelias-expanded')) {
	                if (!this.options.expanded) {
	                  this.collapse();
	                }
	                this.clearResults();
	              }
	            }
	            // Clears results
	            this._results.innerHTML = '';
	            this._results.style.display = 'none';
	            L.DomUtil.removeClass(this._search, 'leaflet-pelias-loading');
	            return;
	          }
	
	          if (this._input.value !== this._lastValue) {
	            this._lastValue = this._input.value;
	
	            if (text.length >= MINIMUM_INPUT_LENGTH_FOR_AUTOCOMPLETE && this.options.autocomplete === true) {
	              this.autocomplete(text);
	            } else {
	              this.clearResults();
	            }
	          }
	        }, this)
	        .on(this._results, 'click', function (e) {
	          L.DomEvent.preventDefault(e);
	          L.DomEvent.stopPropagation(e);
	
	          var _selected = this._results.querySelectorAll('.leaflet-pelias-selected')[0];
	          if (_selected) {
	            L.DomUtil.removeClass(_selected, 'leaflet-pelias-selected');
	          }
	
	          var selected = e.target || e.srcElement; /* IE8 */
	          var findParent = function () {
	            if (!L.DomUtil.hasClass(selected, 'leaflet-pelias-result')) {
	              selected = selected.parentElement;
	              if (selected) {
	                findParent();
	              }
	            }
	            return selected;
	          };
	
	          // click event can be registered on the child nodes
	          // that does not have the required coords prop
	          // so its important to find the parent.
	          findParent();
	
	          // If nothing is selected, (e.g. it's a message, not a result),
	          // do nothing.
	          if (selected) {
	            L.DomUtil.addClass(selected, 'leaflet-pelias-selected');
	            this.setSelectedResult(selected, e);
	          }
	        }, this)
	        .on(this._results, 'mouseover', function (e) {
	          // Prevent scrolling over results list from zooming the map, if enabled
	          this._scrollWheelZoomEnabled = map.scrollWheelZoom.enabled();
	          if (this._scrollWheelZoomEnabled) {
	            map.scrollWheelZoom.disable();
	          }
	        }, this)
	        .on(this._results, 'mouseout', function (e) {
	          // Re-enable scroll wheel zoom (if previously enabled) after
	          // leaving the results box
	          if (this._scrollWheelZoomEnabled) {
	            map.scrollWheelZoom.enable();
	          }
	        }, this);
	
	      // Recalculate width of the input bar when window resizes
	      if (this.options.fullWidth) {
	        L.DomEvent.on(window, 'resize', function (e) {
	          if (L.DomUtil.hasClass(this._container, 'leaflet-pelias-expanded')) {
	            this.setFullWidth();
	          }
	        }, this);
	      }
	
	      // Collapse an empty input bar when user interacts with the map
	      // Disabled if expanded is set to true
	      if (!this.options.expanded) {
	        L.DomEvent.on(this._map, 'mousedown', this._onMapInteraction, this);
	        L.DomEvent.on(this._map, 'touchstart', this._onMapInteraction, this);
	      }
	
	      L.DomEvent.disableClickPropagation(this._container);
	      if (map.attributionControl) {
	        map.attributionControl.addAttribution(this.options.attribution);
	      }
	      return container;
	    },
	
	    _onMapInteraction: function (event) {
	      // Only collapse if the input is clear, and is currently expanded.
	      if (!this._input.value && L.DomUtil.hasClass(this._container, 'leaflet-pelias-expanded')) {
	        this.collapse();
	      }
	    },
	
	    onRemove: function (map) {
	      map.attributionControl.removeAttribution(this.options.attribution);
	    }
	  });
	
	  L.control.geocoder = function (apiKey, options) {
	    return new L.Control.Geocoder(apiKey, options);
	  };
	
	  /*
	   * AJAX Utility function (implements basic HTTP get)
	   */
	  var AJAX = {
	    serialize: function (params) {
	      var data = '';
	
	      for (var key in params) {
	        if (params.hasOwnProperty(key)) {
	          var param = params[key];
	          var type = param.toString();
	          var value;
	
	          if (data.length) {
	            data += '&';
	          }
	
	          switch (type) {
	            case '[object Array]':
	              value = (param[0].toString() === '[object Object]') ? JSON.stringify(param) : param.join(',');
	              break;
	            case '[object Object]':
	              value = JSON.stringify(param);
	              break;
	            case '[object Date]':
	              value = param.valueOf();
	              break;
	            default:
	              value = param;
	              break;
	          }
	
	          data += encodeURIComponent(key) + '=' + encodeURIComponent(value);
	        }
	      }
	
	      return data;
	    },
	    http_request: function (callback, context) {
	      if (window.XDomainRequest) {
	        return this.xdr(callback, context);
	      } else {
	        return this.xhr(callback, context);
	      }
	    },
	    xhr: function (callback, context) {
	      var xhr = new XMLHttpRequest();
	
	      xhr.onerror = function (e) {
	        xhr.onreadystatechange = L.Util.falseFn;
	        var error = {
	          code: xhr.status,
	          message: xhr.statusText
	        };
	
	        callback.call(context, error, null);
	      };
	
	      xhr.onreadystatechange = function () {
	        var response;
	        var error;
	
	        if (xhr.readyState === 4) {
	          // Handle all non-200 responses first
	          if (xhr.status !== 200) {
	            error = {
	              code: xhr.status,
	              message: xhr.statusText
	            };
	            callback.call(context, error, null);
	          } else {
	            try {
	              response = JSON.parse(xhr.responseText);
	            } catch (e) {
	              response = null;
	              error = {
	                code: 500,
	                message: 'Parse Error'
	              };
	            }
	
	            if (!error && response.error) {
	              error = response.error;
	              response = null;
	            }
	
	            xhr.onerror = L.Util.falseFn;
	
	            callback.call(context, error, response);
	          }
	        }
	      };
	
	      return xhr;
	    },
	    xdr: function (callback, context) {
	      var xdr = new window.XDomainRequest();
	
	      xdr.onerror = function (e) {
	        xdr.onload = L.Util.falseFn;
	
	        // XDRs have no access to actual status codes
	        var error = {
	          code: 500,
	          message: 'XMLHttpRequest Error'
	        };
	        callback.call(context, error, null);
	      };
	
	      // XDRs have .onload instead of .onreadystatechange
	      xdr.onload = function () {
	        var response;
	        var error;
	
	        try {
	          response = JSON.parse(xdr.responseText);
	        } catch (e) {
	          response = null;
	          error = {
	            code: 500,
	            message: 'Parse Error'
	          };
	        }
	
	        if (!error && response.error) {
	          error = response.error;
	          response = null;
	        }
	
	        xdr.onerror = L.Util.falseFn;
	        callback.call(context, error, response);
	      };
	
	      return xdr;
	    },
	    request: function (url, params, callback, context) {
	      var paramString = this.serialize(params);
	      var httpRequest = this.http_request(callback, context);
	
	      httpRequest.open('GET', url + '?' + paramString);
	      if (httpRequest.constructor.name === 'XMLHttpRequest') {
	        httpRequest.setRequestHeader('Accept', 'application/json');
	      }
	
	      setTimeout(function () {
	        httpRequest.send(null);
	      }, 0);
	    }
	  };
	
	  /*
	   * throttle Utility function (borrowed from underscore)
	   */
	  function throttle (func, wait, options) {
	    var context, args, result;
	    var timeout = null;
	    var previous = 0;
	    if (!options) options = {};
	    var later = function () {
	      previous = options.leading === false ? 0 : new Date().getTime();
	      timeout = null;
	      result = func.apply(context, args);
	      if (!timeout) context = args = null;
	    };
	    return function () {
	      var now = new Date().getTime();
	      if (!previous && options.leading === false) previous = now;
	      var remaining = wait - (now - previous);
	      context = this;
	      args = arguments;
	      if (remaining <= 0 || remaining > wait) {
	        if (timeout) {
	          clearTimeout(timeout);
	          timeout = null;
	        }
	        previous = now;
	        result = func.apply(context, args);
	        if (!timeout) context = args = null;
	      } else if (!timeout && options.trailing !== false) {
	        timeout = setTimeout(later, remaining);
	      }
	      return result;
	    };
	  }
	
	  /*
	   * escaping a string for regex Utility function
	   * from https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
	   */
	  function escapeRegExp (str) {
	    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
	  }
	}));


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
		Leaflet.contextmenu, a context menu for Leaflet.
		(c) 2015, Adam Ratcliffe, GeoSmart Maps Limited
	       
	        @preserve
	*/
	
	(function(factory) {
		// Packaging/modules magic dance
		var L;
		if (true) {
			// AMD
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(9)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else if (typeof module !== 'undefined') {
			// Node/CommonJS
			L = require('leaflet');
			module.exports = factory(L);
		} else {
			// Browser globals
			if (typeof window.L === 'undefined') {
				throw new Error('Leaflet must be loaded first');
			}
			factory(window.L);
		}
	})(function(L) {
	L.Map.mergeOptions({
		contextmenuItems: []
	});
	
	L.Map.ContextMenu = L.Handler.extend({
	
		_touchstart: L.Browser.msPointer ? 'MSPointerDown' : L.Browser.pointer ? 'pointerdown' : 'touchstart',
	
		statics: {
			BASE_CLS: 'leaflet-contextmenu'
		},
	
		initialize: function (map) {
			L.Handler.prototype.initialize.call(this, map);
	
			this._items = [];
			this._visible = false;
	
			var container = this._container = L.DomUtil.create('div', L.Map.ContextMenu.BASE_CLS, map._container);
			container.style.zIndex = 10000;
			container.style.position = 'absolute';
	
			if (map.options.contextmenuWidth) {
				container.style.width = map.options.contextmenuWidth + 'px';
			}
			
			this._createItems();
	
			L.DomEvent
				.on(container, 'click', L.DomEvent.stop)
				.on(container, 'mousedown', L.DomEvent.stop)
				.on(container, 'dblclick', L.DomEvent.stop)
				.on(container, 'contextmenu', L.DomEvent.stop);
		},
	
		addHooks: function () {
	        var container = this._map.getContainer();
	        
			L.DomEvent
	            .on(container, 'mouseleave', this._hide, this)
				.on(document, 'keydown', this._onKeyDown, this);
	
	        if (L.Browser.touch) {
	            L.DomEvent.on(document, this._touchstart, this._hide, this);
	        }
	        
			this._map.on({
				contextmenu: this._show,
				mousedown: this._hide,
				movestart: this._hide,
				zoomstart: this._hide
			}, this);
		},
	
		removeHooks: function () {
	        var container = this._map.getContainer();
	        
			L.DomEvent
	            .off(container, 'mouseleave', this._hide, this)			
				.off(document, 'keydown', this._onKeyDown, this);
	
	        if (L.Browser.touch) {
	            L.DomEvent.off(document, this._touchstart, this._hide, this);
	        }        
	
			this._map.off({
				contextmenu: this._show,
				mousedown: this._hide,
				movestart: this._hide,
				zoomstart: this._hide
			}, this);
		},
	
		showAt: function (point, data) {
			if (point instanceof L.LatLng) {
				point = this._map.latLngToContainerPoint(point);
			}
			this._showAtPoint(point, data);
		},
	
		hide: function () {
			this._hide();
		},
	
		addItem: function (options) {
			return this.insertItem(options);
		},
	
		insertItem: function (options, index) {
			index = index !== undefined ? index: this._items.length; 
	
			var item = this._createItem(this._container, options, index);
			
			this._items.push(item);
	
			this._sizeChanged = true;
	
			this._map.fire('contextmenu.additem', {
				contextmenu: this,
				el: item.el,
				index: index
			});
	
			return item.el;
		},
	
		removeItem: function (item) {
			var container = this._container;
	
			if (!isNaN(item)) {
				item = container.children[item];
			}
	
			if (item) {
				this._removeItem(L.Util.stamp(item));
	
				this._sizeChanged = true;
	
				this._map.fire('contextmenu.removeitem', {
					contextmenu: this,
					el: item
				});
			}		
		},
	
		removeAllItems: function () {
			var item;
	
			while (this._container.children.length) {
				item = this._container.children[0];
				this._removeItem(L.Util.stamp(item));
			}
		},
	
		hideAllItems: function () {
			var item, i, l;
	
			for (i = 0, l = this._items.length; i < l; i++) {
				item = this._items[i];
				item.el.style.display = 'none';
			}
		},
	
		showAllItems: function () {
			var item, i, l;
	
			for (i = 0, l = this._items.length; i < l; i++) {
				item = this._items[i];
				item.el.style.display = '';
			}		
		},
	
		setDisabled: function (item, disabled) {
			var container = this._container,
			itemCls = L.Map.ContextMenu.BASE_CLS + '-item';
	
			if (!isNaN(item)) {
				item = container.children[item];
			}
	
			if (item && L.DomUtil.hasClass(item, itemCls)) {
				if (disabled) {
					L.DomUtil.addClass(item, itemCls + '-disabled');
					this._map.fire('contextmenu.disableitem', {
						contextmenu: this,
						el: item
					});
				} else {
					L.DomUtil.removeClass(item, itemCls + '-disabled');
					this._map.fire('contextmenu.enableitem', {
						contextmenu: this,
						el: item
					});
				}			
			}
		},
	
		isVisible: function () {
			return this._visible;
		},
	
		_createItems: function () {
			var itemOptions = this._map.options.contextmenuItems,
			    item,
			    i, l;
	
			for (i = 0, l = itemOptions.length; i < l; i++) {
				this._items.push(this._createItem(this._container, itemOptions[i]));
			}
		},
	
		_createItem: function (container, options, index) {
			if (options.separator || options === '-') {
				return this._createSeparator(container, index);
			}
	
			var itemCls = L.Map.ContextMenu.BASE_CLS + '-item', 
			    cls = options.disabled ? (itemCls + ' ' + itemCls + '-disabled') : itemCls,
			    el = this._insertElementAt('a', cls, container, index),
			    callback = this._createEventHandler(el, options.callback, options.context, options.hideOnSelect),
			    html = '';
			
			if (options.icon) {
				html = '<img class="' + L.Map.ContextMenu.BASE_CLS + '-icon" src="' + options.icon + '"/>';
			} else if (options.iconCls) {
				html = '<span class="' + L.Map.ContextMenu.BASE_CLS + '-icon ' + options.iconCls + '"></span>';
			}
	
			el.innerHTML = html + options.text;		
			el.href = '#';
	
			L.DomEvent
				.on(el, 'mouseover', this._onItemMouseOver, this)
				.on(el, 'mouseout', this._onItemMouseOut, this)
				.on(el, 'mousedown', L.DomEvent.stopPropagation)
				.on(el, 'click', callback);
	
	        if (L.Browser.touch) {
	            L.DomEvent.on(el, this._touchstart, L.DomEvent.stopPropagation);
	        }
	
			return {
				id: L.Util.stamp(el),
				el: el,
				callback: callback
			};
		},
	
		_removeItem: function (id) {
			var item,
			    el,
			    i, l, callback;
	
			for (i = 0, l = this._items.length; i < l; i++) {
				item = this._items[i];
	
				if (item.id === id) {
					el = item.el;
					callback = item.callback;
	
					if (callback) {
						L.DomEvent
							.off(el, 'mouseover', this._onItemMouseOver, this)
							.off(el, 'mouseover', this._onItemMouseOut, this)
							.off(el, 'mousedown', L.DomEvent.stopPropagation)
							.off(el, 'click', callback);
	
	                    if (L.Browser.touch) {
	                        L.DomEvent.off(el, this._touchstart, L.DomEvent.stopPropagation);
	                    }
					}
					
					this._container.removeChild(el);
					this._items.splice(i, 1);
	
					return item;
				}
			}
			return null;
		},
	
		_createSeparator: function (container, index) {
			var el = this._insertElementAt('div', L.Map.ContextMenu.BASE_CLS + '-separator', container, index);
			
			return {
				id: L.Util.stamp(el),
				el: el
			};
		},
	
		_createEventHandler: function (el, func, context, hideOnSelect) {
			var me = this,
			    map = this._map,
			    disabledCls = L.Map.ContextMenu.BASE_CLS + '-item-disabled',
			    hideOnSelect = (hideOnSelect !== undefined) ? hideOnSelect : true;
			
			return function (e) {
				if (L.DomUtil.hasClass(el, disabledCls)) {
					return;
				}
				
				if (hideOnSelect) {
					me._hide();			
				}
	
				if (func) {
					func.call(context || map, me._showLocation);			
				}
	
				me._map.fire('contextmenu:select', {
					contextmenu: me,
					el: el
				});
			};
		},
	
		_insertElementAt: function (tagName, className, container, index) {
			var refEl,
			    el = document.createElement(tagName);
	
			el.className = className;
	
			if (index !== undefined) {
				refEl = container.children[index];
			}
	
			if (refEl) {
				container.insertBefore(el, refEl);
			} else {
				container.appendChild(el);
			}
	
			return el;
		},
	
		_show: function (e) {
			this._showAtPoint(e.containerPoint, e);
		},
	
		_showAtPoint: function (pt, data) {
			if (this._items.length) {
				var map = this._map,
				layerPoint = map.containerPointToLayerPoint(pt),
				latlng = map.layerPointToLatLng(layerPoint),
				event = L.extend(data || {}, {contextmenu: this});
				
				this._showLocation = {
					latlng: latlng,
					layerPoint: layerPoint,
					containerPoint: pt
				};
	
				if(data && data.relatedTarget){
					this._showLocation.relatedTarget = data.relatedTarget;
				}
	
				this._setPosition(pt);			
	
				if (!this._visible) {
					this._container.style.display = 'block';							
					this._visible = true;							
				} else {
					this._setPosition(pt);			
				}
	
				this._map.fire('contextmenu.show', event);
			}
		},
	
		_hide: function () {        
			if (this._visible) {
				this._visible = false;
				this._container.style.display = 'none';
				this._map.fire('contextmenu.hide', {contextmenu: this});
			}
		},
	
		_setPosition: function (pt) {
			var mapSize = this._map.getSize(),
			    container = this._container,
			    containerSize = this._getElementSize(container),
			    anchor;
	
			if (this._map.options.contextmenuAnchor) {
				anchor = L.point(this._map.options.contextmenuAnchor);
				pt = pt.add(anchor);
			}
	
			container._leaflet_pos = pt;
	
			if (pt.x + containerSize.x > mapSize.x) {
				container.style.left = 'auto';
				container.style.right = Math.max(mapSize.x - pt.x, 0) + 'px';
			} else {
				container.style.left = Math.max(pt.x, 0) + 'px';
				container.style.right = 'auto';
			}
			
			if (pt.y + containerSize.y > mapSize.y) {
				container.style.top = 'auto';
				container.style.bottom = Math.max(mapSize.y - pt.y, 0) + 'px';
			} else {
				container.style.top = Math.max(pt.y, 0) + 'px';
				container.style.bottom = 'auto';
			}
		},
	
		_getElementSize: function (el) {		
			var size = this._size,
			    initialDisplay = el.style.display;
	
			if (!size || this._sizeChanged) {
				size = {};
	
				el.style.left = '-999999px';
				el.style.right = 'auto';
				el.style.display = 'block';
				
				size.x = el.offsetWidth;
				size.y = el.offsetHeight;
				
				el.style.left = 'auto';
				el.style.display = initialDisplay;
				
				this._sizeChanged = false;
			}
	
			return size;
		},
	
		_onKeyDown: function (e) {
			var key = e.keyCode;
	
			// If ESC pressed and context menu is visible hide it 
			if (key === 27) {
				this._hide();
			}
		},
	
		_onItemMouseOver: function (e) {
			L.DomUtil.addClass(e.target || e.srcElement, 'over');
		},
	
		_onItemMouseOut: function (e) {
			L.DomUtil.removeClass(e.target || e.srcElement, 'over');
		}
	});
	
	L.Map.addInitHook('addHandler', 'contextmenu', L.Map.ContextMenu);
	L.Mixin.ContextMenu = {
	
		bindContextMenu: function (options) {
			L.setOptions(this, options);
			this._initContextMenu();
	
			return this;
		},
	
		unbindContextMenu: function (){
			this.off('contextmenu', this._showContextMenu, this);
	
			return this;
		},
	
		addContextMenuItem: function (item) {
				this.options.contextmenuItems.push(item);
		},
	
		removeContextMenuItemWithIndex: function (index) {
			  var items = [];
				for (var i = 0; i < this.options.contextmenuItems.length; i++) {
						if(this.options.contextmenuItems[i].index == index){
								items.push(i);
						}
				}
				var elem = items.pop();
				while (elem !== undefined) {
					  this.options.contextmenuItems.splice(elem,1);
						elem = items.pop();
			  }
		},
	
		replaceConextMenuItem: function (item) {
			  this.removeContextMenuItemWithIndex(item.index);
			  this.addContextMenuItem(item);
		},
	
		_initContextMenu: function () {
			this._items = [];
		
			this.on('contextmenu', this._showContextMenu, this);
		},
	
		_showContextMenu: function (e) {
			var itemOptions,
			    data, pt, i, l;
	
			if (this._map.contextmenu) {
	            data = L.extend({relatedTarget: this}, e)
	            
				pt = this._map.mouseEventToContainerPoint(e.originalEvent);
	
				if (!this.options.contextmenuInheritItems) {
					this._map.contextmenu.hideAllItems();
				}
	
				for (i = 0, l = this.options.contextmenuItems.length; i < l; i++) {
					itemOptions = this.options.contextmenuItems[i];
					this._items.push(this._map.contextmenu.insertItem(itemOptions, itemOptions.index));
				}
	
				this._map.once('contextmenu.hide', this._hideContextMenu, this);
			
				this._map.contextmenu.showAt(pt, data);
			}
		},
	
		_hideContextMenu: function () {
			var i, l;
	
			for (i = 0, l = this._items.length; i < l; i++) {
				this._map.contextmenu.removeItem(this._items[i]);
			}
			this._items.length = 0;		
	
			if (!this.options.contextmenuInheritItems) {
				this._map.contextmenu.showAllItems();
			}
		}	
	};
	
	var classes = [L.Marker, L.Path],
	    defaultOptions = {
			contextmenu: false,
			contextmenuItems: [],
		    contextmenuInheritItems: true
		},
	    cls, i, l;
	
	for (i = 0, l = classes.length; i < l; i++) {
		cls = classes[i];
	
		// L.Class should probably provide an empty options hash, as it does not test
		// for it here and add if needed
		if (!cls.prototype.options) {
			cls.prototype.options = defaultOptions;
		} else {
			cls.mergeOptions(defaultOptions);
		}
	
		cls.addInitHook(function () {
			if (this.options.contextmenu) {
				this._initContextMenu();
			}
		});
	
		cls.include(L.Mixin.ContextMenu);
	}
		return L.Map.ContextMenu;
		});


/***/ },
/* 12 */
/***/ function(module, exports) {

	/*
	 * Google layer using Google Maps API
	 */
	
	/* global google: true */
	
	L.Google = L.Class.extend({
		includes: L.Mixin.Events,
	
		options: {
			minZoom: 0,
			maxZoom: 18,
			tileSize: 256,
			subdomains: 'abc',
			errorTileUrl: '',
			attribution: '',
			opacity: 1,
			continuousWorld: false,
			noWrap: false,
			mapOptions: {
				backgroundColor: '#dddddd'
			}
		},
	
		// Possible types: SATELLITE, ROADMAP, HYBRID, TERRAIN
		initialize: function(type, options) {
			L.Util.setOptions(this, options);
	
			this._ready = google.maps.Map !== undefined;
			if (!this._ready) L.Google.asyncWait.push(this);
	
			this._type = type || 'SATELLITE';
		},
	
		onAdd: function(map, insertAtTheBottom) {
			this._map = map;
			this._insertAtTheBottom = insertAtTheBottom;
	
			// create a container div for tiles
			this._initContainer();
			this._initMapObject();
	
			// set up events
			map.on('viewreset', this._resetCallback, this);
	
			this._limitedUpdate = L.Util.limitExecByInterval(this._update, 150, this);
			map.on('move', this._update, this);
	
			map.on('zoomanim', this._handleZoomAnim, this);
	
			//20px instead of 1em to avoid a slight overlap with google's attribution
			map._controlCorners.bottomright.style.marginBottom = '20px';
	
			this._reset();
			this._update();
		},
	
		onRemove: function(map) {
			map._container.removeChild(this._container);
	
			map.off('viewreset', this._resetCallback, this);
	
			map.off('move', this._update, this);
	
			map.off('zoomanim', this._handleZoomAnim, this);
	
			map._controlCorners.bottomright.style.marginBottom = '0em';
		},
	
		getAttribution: function() {
			return this.options.attribution;
		},
	
		setOpacity: function(opacity) {
			this.options.opacity = opacity;
			if (opacity < 1) {
				L.DomUtil.setOpacity(this._container, opacity);
			}
		},
	
		setElementSize: function(e, size) {
			e.style.width = size.x + 'px';
			e.style.height = size.y + 'px';
		},
	
		_initContainer: function() {
			var tilePane = this._map._container,
				first = tilePane.firstChild;
	
			if (!this._container) {
				this._container = L.DomUtil.create('div', 'leaflet-google-layer leaflet-top leaflet-left');
				this._container.id = '_GMapContainer_' + L.Util.stamp(this);
				this._container.style.zIndex = 'auto';
			}
	
			tilePane.insertBefore(this._container, first);
	
			this.setOpacity(this.options.opacity);
			this.setElementSize(this._container, this._map.getSize());
		},
	
		_initMapObject: function() {
			if (!this._ready) return;
			this._google_center = new google.maps.LatLng(0, 0);
			var map = new google.maps.Map(this._container, {
				center: this._google_center,
				zoom: 0,
				tilt: 0,
				mapTypeId: google.maps.MapTypeId[this._type],
				disableDefaultUI: true,
				keyboardShortcuts: false,
				draggable: false,
				disableDoubleClickZoom: true,
				scrollwheel: false,
				streetViewControl: false,
				styles: this.options.mapOptions.styles,
				backgroundColor: this.options.mapOptions.backgroundColor
			});
	
			var _this = this;
			this._reposition = google.maps.event.addListenerOnce(map, 'center_changed',
				function() { _this.onReposition(); });
			this._google = map;
	
			google.maps.event.addListenerOnce(map, 'idle',
				function() { _this._checkZoomLevels(); });
			google.maps.event.addListenerOnce(map, 'tilesloaded',
				function() { _this.fire('load'); });
			//Reporting that map-object was initialized.
			this.fire('MapObjectInitialized', { mapObject: map });
		},
	
		_checkZoomLevels: function() {
			//setting the zoom level on the Google map may result in a different zoom level than the one requested
			//(it won't go beyond the level for which they have data).
			// verify and make sure the zoom levels on both Leaflet and Google maps are consistent
			if (this._google.getZoom() !== this._map.getZoom()) {
				//zoom levels are out of sync. Set the leaflet zoom level to match the google one
				this._map.setZoom( this._google.getZoom() );
			}
		},
	
		_resetCallback: function(e) {
			this._reset(e.hard);
		},
	
		_reset: function(clearOldContainer) {
			this._initContainer();
		},
	
		_update: function(e) {
			if (!this._google) return;
			this._resize();
	
			var center = this._map.getCenter();
			var _center = new google.maps.LatLng(center.lat, center.lng);
	
			this._google.setCenter(_center);
			this._google.setZoom(Math.round(this._map.getZoom()));
	
			this._checkZoomLevels();
		},
	
		_resize: function() {
			var size = this._map.getSize();
			if (this._container.style.width === size.x &&
					this._container.style.height === size.y)
				return;
			this.setElementSize(this._container, size);
			this.onReposition();
		},
	
	
		_handleZoomAnim: function (e) {
			var center = e.center;
			var _center = new google.maps.LatLng(center.lat, center.lng);
	
			this._google.setCenter(_center);
			this._google.setZoom(Math.round(e.zoom));
		},
	
	
		onReposition: function() {
			if (!this._google) return;
			google.maps.event.trigger(this._google, 'resize');
		}
	});
	
	L.Google.asyncWait = [];
	L.Google.asyncInitialize = function() {
		var i;
		for (i = 0; i < L.Google.asyncWait.length; i++) {
			var o = L.Google.asyncWait[i];
			o._ready = true;
			if (o._container) {
				o._initMapObject();
				o._update();
			}
		}
		L.Google.asyncWait = [];
	};

/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';
	
	/* Services */
	var eventCaptureServices = angular.module('eventCaptureServices', ['ngResource']).factory('ECStorageService', function () {
	    var store = new dhis2.storage.Store({
	        name: 'dhis2ec',
	        adapters: [dhis2.storage.IndexedDBAdapter, dhis2.storage.DomSessionStorageAdapter, dhis2.storage.InMemoryAdapter],
	        objectStores: ['programs', 'optionSets', 'events', 'programValidations', 'programRules', 'programRuleVariables', 'programIndicators', 'ouLevels', 'constants', 'dataElements']
	    });
	    return {
	        currentStore: store
	    };
	}).factory('OfflineECStorageService', ["$http", "$q", "$rootScope", "$translate", "ECStorageService", "ModalService", "NotificationService", function ($http, $q, $rootScope, $translate, ECStorageService, ModalService, NotificationService) {
	    return {
	        hasLocalData: function hasLocalData() {
	            var def = $q.defer();
	            ECStorageService.currentStore.open().done(function () {
	                ECStorageService.currentStore.getKeys('events').done(function (events) {
	                    $rootScope.$apply(function () {
	                        def.resolve(events.length > 0);
	                    });
	                });
	            });
	            return def.promise;
	        },
	        getLocalData: function getLocalData() {
	            var def = $q.defer();
	            ECStorageService.currentStore.open().done(function () {
	                ECStorageService.currentStore.getAll('events').done(function (events) {
	                    $rootScope.$apply(function () {
	                        def.resolve({ events: events });
	                    });
	                });
	            });
	            return def.promise;
	        },
	        uploadLocalData: function uploadLocalData() {
	            var def = $q.defer();
	            this.getLocalData().then(function (localData) {
	                var evs = { events: [] };
	                angular.forEach(localData.events, function (ev) {
	                    ev.event = ev.id;
	                    delete ev.id;
	                    evs.events.push(ev);
	                });
	
	                $http.post(DHIS2URL + '/events', evs).then(function (evResponse) {
	                    dhis2.ec.store.removeAll('events');
	                    NotificationService.displayDelayedHeaderMessage($translate.instant('upload_success'));
	                    log('Successfully uploaded local events');
	                    def.resolve();
	                }, function (error) {
	                    var serverLog = '';
	                    if (error && error.data && error.data.response && error.data.response.importSummaries) {
	                        angular.forEach(error.data.response.importSummaries, function (is) {
	                            if (is.description) {
	                                serverLog += is.description + ';  ';
	                            }
	                        });
	                    }
	
	                    var modalOptions = {
	                        closeButtonText: 'keep_offline_data',
	                        actionButtonText: 'delete_offline_data',
	                        headerText: 'error',
	                        bodyText: $translate.instant('data_upload_to_server_failed:') + '  ' + serverLog
	                    };
	
	                    var modalDefaults = {
	                        backdrop: true,
	                        keyboard: true,
	                        modalFade: true,
	                        templateUrl: 'views/modal-offline.html'
	                    };
	
	                    ModalService.showModal(modalDefaults, modalOptions).then(function (result) {
	                        dhis2.ec.store.removeAll('events');
	                        NotificationService.displayDelayedHeaderMessage($translate.instant('offline_data_deleted'));
	                        def.resolve();
	                    }, function () {
	                        NotificationService.displayDelayedHeaderMessage($translate.instant('upload_failed_try_again'));
	                        def.resolve();
	                    });
	                });
	            });
	            return def.promise;
	        }
	    };
	}])
	
	/* Factory to fetch optionSets */
	.factory('OptionSetService', function () {
	    return {
	        getCode: function getCode(options, key) {
	            if (options) {
	                for (var i = 0; i < options.length; i++) {
	                    if (key === options[i].displayName) {
	                        return options[i].code;
	                    }
	                }
	            }
	            return key;
	        },
	        getName: function getName(options, key) {
	            if (options) {
	                for (var i = 0; i < options.length; i++) {
	                    if (key === options[i].code) {
	                        return options[i].displayName;
	                    }
	                }
	            }
	            return key;
	        }
	    };
	})
	
	/* Factory to fetch programs */
	.factory('ProgramFactory', ["$q", "$rootScope", "SessionStorageService", "ECStorageService", "CommonUtils", function ($q, $rootScope, SessionStorageService, ECStorageService, CommonUtils) {
	
	    return {
	        getProgramsByOu: function getProgramsByOu(ou, selectedProgram) {
	            var roles = SessionStorageService.get('USER_PROFILE');
	            var userRoles = roles && roles.userCredentials && roles.userCredentials.userRoles ? roles.userCredentials.userRoles : [];
	            var def = $q.defer();
	
	            ECStorageService.currentStore.open().done(function () {
	                ECStorageService.currentStore.getAll('programs').done(function (prs) {
	                    var programs = [];
	                    angular.forEach(prs, function (pr) {
	                        if (pr.organisationUnits.hasOwnProperty(ou.id) && CommonUtils.userHasValidRole(pr, 'programs', userRoles)) {
	                            programs.push(pr);
	                        }
	                    });
	
	                    if (programs.length === 0) {
	                        selectedProgram = null;
	                    } else if (programs.length === 1) {
	                        selectedProgram = programs[0];
	                    } else {
	                        if (selectedProgram) {
	                            var continueLoop = true;
	                            for (var i = 0; i < programs.length && continueLoop; i++) {
	                                if (programs[i].id === selectedProgram.id) {
	                                    selectedProgram = programs[i];
	                                    continueLoop = false;
	                                }
	                            }
	                            if (continueLoop) {
	                                selectedProgram = null;
	                            }
	                        }
	                    }
	
	                    $rootScope.$apply(function () {
	                        def.resolve({ programs: programs, selectedProgram: selectedProgram });
	                    });
	                });
	            });
	
	            return def.promise;
	        }
	    };
	}])
	
	/* factory for handling program related meta-data */
	.factory('MetaDataFactory', ["$q", "$rootScope", "ECStorageService", function ($q, $rootScope, ECStorageService) {
	
	    return {
	        get: function get(store, uid) {
	
	            var def = $q.defer();
	
	            ECStorageService.currentStore.open().done(function () {
	                ECStorageService.currentStore.get(store, uid).done(function (pv) {
	                    $rootScope.$apply(function () {
	                        def.resolve(pv);
	                    });
	                });
	            });
	            return def.promise;
	        },
	        getByProgram: function getByProgram(store, program) {
	            var def = $q.defer();
	            var objs = [];
	
	            ECStorageService.currentStore.open().done(function () {
	                ECStorageService.currentStore.getAll(store).done(function (data) {
	                    angular.forEach(data, function (o) {
	                        if (o.program.id === program) {
	                            objs.push(o);
	                        }
	                    });
	                    $rootScope.$apply(function () {
	                        def.resolve(objs);
	                    });
	                });
	            });
	            return def.promise;
	        },
	        getByIds: function getByIds(store, ids) {
	            var def = $q.defer();
	            var objs = [];
	
	            ECStorageService.currentStore.open().done(function () {
	                ECStorageService.currentStore.getAll(store).done(function (data) {
	                    angular.forEach(data, function (o) {
	                        if (ids.indexOf(o.id) !== -1) {
	                            objs.push(o);
	                        }
	                    });
	                    $rootScope.$apply(function () {
	                        def.resolve(objs);
	                    });
	                });
	            });
	            return def.promise;
	        },
	        getAll: function getAll(store) {
	            var def = $q.defer();
	            ECStorageService.currentStore.open().done(function () {
	                ECStorageService.currentStore.getAll(store).done(function (objs) {
	                    $rootScope.$apply(function () {
	                        def.resolve(objs);
	                    });
	                });
	            });
	            return def.promise;
	        }
	    };
	}])
	
	/* factory for handling events */
	.factory('DHIS2EventFactory', ["$http", "$q", "ECStorageService", "$rootScope", function ($http, $q, ECStorageService, $rootScope) {
	    var internalGetByFilters = function internalGetByFilters(orgUnit, attributeCategoryUrl, pager, paging, ordering, filterings, format, filterParam, sortParam) {
	        var url;
	        if (format === "csv") {
	            url = DHIS2URL + '/events.csv?' + 'orgUnit=' + orgUnit;
	        } else {
	            url = DHIS2URL + '/events/query.json?' + 'orgUnit=' + orgUnit;
	        }
	
	        if (filterings) {
	            angular.forEach(filterings, function (filtering) {
	                url += '&' + filtering.field + '=' + filtering.value;
	            });
	        }
	
	        if (attributeCategoryUrl && !attributeCategoryUrl.default) {
	            url = url + '&attributeCc=' + attributeCategoryUrl.cc + '&attributeCos=' + attributeCategoryUrl.cp;
	        }
	
	        if (filterParam) {
	            url += filterParam;
	        }
	
	        if (sortParam && sortParam.id && sortParam.direction) {
	            url += '&order=' + sortParam.id + ':' + sortParam.direction;
	        }
	
	        if (paging) {
	            var pgSize = pager.pageSize ? pager.pageSize : 50;
	            var pg = pager.page ? pager.page : 1;
	            pgSize = pgSize > 1 ? pgSize : 1;
	            pg = pg > 1 ? pg : 1;
	            url = url + '&pageSize=' + pgSize + '&page=' + pg + '&totalPages=true';
	        } else {
	            url = url + '&skipPaging=true';
	        }
	
	        if (ordering && ordering.field) {
	            url = url + '&order=' + ordering.field;
	            if (ordering.direction) {
	                url = url + ':' + ordering.direction;
	            }
	        }
	
	        var promise = $http.get(url).then(function (response) {
	            return response.data;
	        }, function () {
	            var def = $q.defer();
	            ECStorageService.currentStore.open().done(function () {
	                ECStorageService.currentStore.getAll('events').done(function (evs) {
	                    var result = { events: [], pager: { pageSize: '', page: 1, toolBarDisplay: 5, pageCount: 1 } };
	                    angular.forEach(evs, function (ev) {
	                        if (ev.programStage === programStage && ev.orgUnit === orgUnit) {
	                            ev.event = ev.id;
	                            result.events.push(ev);
	                        }
	                    });
	                    $rootScope.$apply(function () {
	                        def.resolve(result);
	                    });
	                });
	            });
	            return def.promise;
	        });
	        return promise;
	    };
	
	    return {
	        getByStage: function getByStage(orgUnit, programStage, attributeCategoryUrl, pager, paging, format, filterUrl, sortParam) {
	            var url;
	            if (format === "csv") {
	                url = DHIS2URL + '/events.csv?' + 'orgUnit=' + orgUnit;
	            } else {
	                url = DHIS2URL + '/events/query.json?' + 'orgUnit=' + orgUnit;
	            }
	
	            if (programStage) {
	                url += '&programStage=' + programStage;
	            }
	
	            if (attributeCategoryUrl && !attributeCategoryUrl.default) {
	                url = url + '&attributeCc=' + attributeCategoryUrl.cc + '&attributeCos=' + attributeCategoryUrl.cp;
	            }
	
	            if (filterUrl) {
	                url += filterUrl;
	            }
	
	            if (sortParam && sortParam.id && sortParam.direction) {
	                url += '&order=' + sortParam.id + ':' + sortParam.direction;
	            }
	
	            if (paging) {
	                var pgSize = pager.pageSize ? pager.pageSize : 50;
	                var pg = pager.page ? pager.page : 1;
	                pgSize = pgSize > 1 ? pgSize : 1;
	                pg = pg > 1 ? pg : 1;
	                url = url + '&pageSize=' + pgSize + '&page=' + pg + '&totalPages=true';
	            } else {
	                url = url + '&skipPaging=true';
	            }
	
	            var promise = $http.get(url).then(function (response) {
	                return response.data;
	            }, function () {
	                var def = $q.defer();
	                ECStorageService.currentStore.open().done(function () {
	                    ECStorageService.currentStore.getAll('events').done(function (evs) {
	                        var result = { events: [], metaData: { pager: { pageSize: '', page: 1, toolBarDisplay: 5, pageCount: 1 } } };
	                        angular.forEach(evs, function (ev) {
	                            if (ev.programStage === programStage && ev.orgUnit === orgUnit) {
	                                ev.event = ev.id;
	                                result.events.push(ev);
	                            }
	                        });
	                        $rootScope.$apply(function () {
	                            def.resolve(result);
	                        });
	                    });
	                });
	                return def.promise;
	            });
	            return promise;
	        },
	        get: function get(eventUid, event) {
	            if (event && event.state && event.state === 'FULL') {
	                var def = $q.defer();
	                def.resolve(event);
	                return def.promise;
	            } else {
	                var promise = $http.get(DHIS2URL + '/events/' + eventUid + '.json').then(function (response) {
	                    return response.data;
	                }, function () {
	                    var p = dhis2.ec.store.get('events', eventUid).then(function (ev) {
	                        ev.event = eventUid;
	                        return ev;
	                    });
	                    return p;
	                });
	                return promise;
	            }
	        },
	        create: function create(dhis2Event) {
	            var promise = $http.post(DHIS2URL + '/events.json', dhis2Event).then(function (response) {
	                return response.data;
	            }, function () {
	                dhis2Event.id = dhis2.util.uid();
	                dhis2Event.event = dhis2Event.id;
	                dhis2.ec.store.set('events', dhis2Event);
	                return { response: { importSummaries: [{ status: 'SUCCESS', reference: dhis2Event.id }] } };
	            });
	            return promise;
	        },
	        delete: function _delete(dhis2Event) {
	            var promise = $http.delete(DHIS2URL + '/events/' + dhis2Event.event).then(function (response) {
	                return response.data;
	            }, function (response) {
	                dhis2.ec.store.remove('events', dhis2Event.event);
	                return response.data;
	            });
	            return promise;
	        },
	        update: function update(dhis2Event) {
	            var promise = $http.put(DHIS2URL + '/events/' + dhis2Event.event, dhis2Event).then(function (response) {
	                return response.data;
	            }, function () {
	                dhis2.ec.store.remove('events', dhis2Event.event);
	                dhis2Event.id = dhis2Event.event;
	                dhis2.ec.store.set('events', dhis2Event);
	            });
	            return promise;
	        },
	        updateForSingleValue: function updateForSingleValue(singleValue, fullValue) {
	            var promise = $http.put(DHIS2URL + '/events/' + singleValue.event + '/' + singleValue.dataValues[0].dataElement, singleValue).then(function (response) {
	                return response.data;
	            }, function () {
	                dhis2.ec.store.remove('events', fullValue.event);
	                fullValue.id = fullValue.event;
	                dhis2.ec.store.set('events', fullValue);
	            });
	            return promise;
	        },
	        updateForEventDate: function updateForEventDate(dhis2Event, fullEvent) {
	            var promise = $http.put(DHIS2URL + '/events/' + dhis2Event.event + '/eventDate', dhis2Event).then(function (response) {
	                return response.data;
	            }, function () {
	                dhis2.ec.store.remove('events', fullEvent.event);
	                fullEvent.id = fullEvent.event;
	                dhis2.ec.store.set('events', fullEvent);
	            });
	            return promise;
	        }
	    };
	}]);

/***/ },
/* 14 */
/***/ function(module, exports) {

	'use strict';
	
	/* Filters */
	var eventCaptureFilters = angular.module('eventCaptureFilters', []);

/***/ },
/* 15 */
/***/ function(module, exports) {

	'use strict';
	
	/* Directives */
	var eventCaptureDirectives = angular.module('eventCaptureDirectives', []).directive('modalBody', function () {
	    return {
	        restrict: 'E',
	        templateUrl: 'views/modal-body.html',
	        scope: {
	            body: '='
	        },
	        controller: ['$scope', '$translate', function ($scope, $translate) {}]
	    };
	});

/***/ },
/* 16 */
/***/ function(module, exports) {

	'use strict';
	
	var eventCapture = angular.module('eventCapture');
	
	/* Controllers */
	//var eventCaptureControllers = angular.module('eventCaptureControllers', ['ngCsv'])
	
	//Controller for settings page
	eventCapture.controller('MainController', ["$rootScope", "$scope", "$route", "$modal", "$translate", "$anchorScroll", "$window", "$q", "$filter", "$location", "orderByFilter", "SessionStorageService", "Paginator", "MetaDataFactory", "ProgramFactory", "DHIS2EventFactory", "DHIS2EventService", "ContextMenuSelectedItem", "DateUtils", "CalendarService", "GridColumnService", "CustomFormService", "ECStorageService", "CurrentSelection", "ModalService", "DialogService", "CommonUtils", "AuthorityService", "TrackerRulesExecutionService", "OrgUnitFactory", "OptionSetService", function ($rootScope, $scope, $route, $modal, $translate, $anchorScroll, $window, $q, $filter, $location, orderByFilter, SessionStorageService, Paginator, MetaDataFactory, ProgramFactory, DHIS2EventFactory, DHIS2EventService, ContextMenuSelectedItem, DateUtils, CalendarService, GridColumnService, CustomFormService, ECStorageService, CurrentSelection, ModalService, DialogService, CommonUtils, AuthorityService, TrackerRulesExecutionService, OrgUnitFactory, OptionSetService) {
	
	    $scope.maxOptionSize = 30;
	    $scope.treeLoaded = false;
	    $scope.selectedSection = { id: 'ALL' };
	    $rootScope.ruleeffects = {};
	    $scope.hiddenFields = [];
	    $scope.assignedFields = [];
	
	    $scope.calendarSetting = CalendarService.getSetting();
	
	    //Paging
	    $scope.pager = { pageSize: 50, page: 1, toolBarDisplay: 5 };
	
	    function resetView() {
	        $scope.eventRegistration = false;
	        $scope.editingEventInFull = false;
	        $scope.editingEventInGrid = false;
	    }
	
	    resetView();
	
	    $scope.editGridColumns = false;
	    $scope.updateSuccess = false;
	    $scope.currentGridColumnId = '';
	    $scope.dhis2Events = [];
	    $scope.currentEvent = {};
	    $scope.currentEventOriginialValue = {};
	    $scope.displayCustomForm = false;
	    $scope.currentElement = { id: '', update: false };
	    $scope.optionSets = [];
	    $scope.proceedSelection = true;
	    $scope.formUnsaved = false;
	    $scope.fileNames = {};
	    $scope.currentFileNames = {};
	    $scope.gridColumnsInUserStore = null;
	    $scope.model = { exportFormats: ["XML", "JSON", "CSV"], savingRegistration: false };
	
	    //notes
	    $scope.note = {};
	    $scope.displayTextEffects = [];
	    $scope.today = DateUtils.getToday();
	
	    var storedBy = CommonUtils.getUsername();
	
	    $scope.noteExists = false;
	
	    var orgUnitFromUrl = $location.search().ou;
	
	    var eventIdFromUrl = $location.search().event;
	
	    //watch for selection of org unit from tree
	    $scope.$watch('selectedOrgUnit', function () {
	        if (angular.isObject($scope.selectedOrgUnit)) {
	            OrgUnitFactory.getFromStoreOrServer($scope.selectedOrgUnit.id).then(function (orgUnitFromStore) {
	                if (orgUnitFromStore) {
	                    $scope.model.ouDates = { startDate: orgUnitFromStore.odate, endDate: orgUnitFromStore.cdate };
	                    if (orgUnitFromStore.reportDateRange) {
	                        $scope.model.maxDate = orgUnitFromStore.reportDateRange.maxDate;
	                        $scope.model.minDate = orgUnitFromStore.reportDateRange.minDate;
	                    }
	                    $scope.model.editingDisabled = orgUnitFromStore.closedStatus;
	                }
	            });
	
	            $scope.pleaseSelectLabel = $translate.instant('please_select');
	            $scope.registeringUnitLabel = $translate.instant('registering_unit');
	            $scope.eventCaptureLabel = $translate.instant('event_capture');
	            $scope.programLabel = $translate.instant('program');
	            $scope.searchLabel = $translate.instant('search');
	            $scope.findLabel = $translate.instant('find');
	            $scope.searchOusLabel = $translate.instant('locate_organisation_unit_by_name');
	            $scope.yesLabel = $translate.instant('yes');
	            $scope.noLabel = $translate.instant('no');
	
	            SessionStorageService.set('SELECTED_OU', $scope.selectedOrgUnit);
	
	            $scope.userAuthority = AuthorityService.getUserAuthorities(SessionStorageService.get('USER_PROFILE'));
	            GridColumnService.get("eventCaptureGridColumns").then(function (gridColumns) {
	                if (gridColumns && gridColumns.status !== "ERROR") {
	                    $scope.gridColumnsInUserStore = gridColumns;
	                }
	                //get ouLevels
	                ECStorageService.currentStore.open().done(function () {
	                    ECStorageService.currentStore.getAll('ouLevels').done(function (response) {
	                        var ouLevels = angular.isObject(response) ? orderByFilter(response, '-level').reverse() : [];
	                        CurrentSelection.setOuLevels(orderByFilter(ouLevels, '-level').reverse());
	                    });
	                });
	
	                if ($scope.optionSets.length < 1) {
	                    $scope.optionSets = [];
	                    MetaDataFactory.getAll('optionSets').then(function (optionSets) {
	                        angular.forEach(optionSets, function (optionSet) {
	                            $scope.optionSets[optionSet.id] = optionSet;
	                        });
	                        $scope.loadPrograms();
	                    });
	                } else {
	                    $scope.loadPrograms();
	                }
	            });
	        }
	    });
	
	    $scope.verifyExpiryDate = function () {
	        if (!DateUtils.verifyExpiryDate($scope.currentEvent.eventDate, $scope.selectedProgram.expiryPeriodType, $scope.selectedProgram.expiryDays)) {
	            $scope.currentEvent.eventDate = null;
	        }
	    };
	
	    $scope.completeEnrollment = function () {
	        $scope.currentEvent.status = !$scope.currentEvent.status;
	    };
	
	    //load programs associated with the selected org unit.
	
	    $scope.loadPrograms = function () {
	
	        $scope.resetOu = false;
	        $scope.selectedProgramStage = null;
	        $scope.currentStage = null;
	        $scope.allProgramRules = [];
	        $scope.dhis2Events = [];
	        $scope.currentEvent = {};
	        $scope.currentEventOriginialValue = {};
	        $scope.fileNames = {};
	        $scope.currentFileNames = {};
	        $scope.orgUnitNames = {};
	
	        resetView();
	        $scope.editGridColumns = false;
	        $scope.updateSuccess = false;
	        $scope.currentGridColumnId = '';
	        $scope.displayCustomForm = false;
	
	        if (angular.isObject($scope.selectedOrgUnit)) {
	            ProgramFactory.getProgramsByOu($scope.selectedOrgUnit, $scope.selectedProgram).then(function (response) {
	                $scope.programs = response.programs;
	                if (eventIdFromUrl) {
	                    $scope.showEventForEditing(eventIdFromUrl);
	                } else {
	                    $scope.selectedProgram = response.selectedProgram;
	                    $scope.getProgramDetails();
	                }
	            });
	        }
	    };
	
	    $scope.showEventForEditing = function (eventId) {
	        DHIS2EventFactory.get(eventId).then(function (event) {
	            if (event) {
	                ContextMenuSelectedItem.setSelectedItem(event);
	                if (!event.coordinate) {
	                    event.coordinate = {};
	                }
	                for (var i = 0; i < $scope.programs.length; i++) {
	                    if ($scope.programs[i].id === event.program) {
	                        $scope.selectedProgram = $scope.programs[i];
	                        $scope.getProgramDetails();
	                        if ($scope.selectedProgram.programStages[0].id === event.programStage) {
	                            $scope.formatEvent(event);
	                            $scope.currentEvent = angular.copy(event);
	                            $scope.editingEventInFull = false;
	                            $scope.showEditEventInFull();
	                        }
	                        break;
	                    }
	                }
	            }
	        });
	    };
	
	    function setCommonEventProps(event) {
	        event.uid = event.event;
	        event.eventDate = DateUtils.formatFromApiToUser(event.eventDate);
	        event.lastUpdated = DateUtils.formatFromApiToUser(event.lastUpdated);
	        if (event.completedDate) {
	            event.completedDate = DateUtils.formatFromApiToUser(event.completedDate);
	        }
	        if (event.status === "ACTIVE") {
	            event.status = false;
	        } else if (event.status === "COMPLETED") {
	            event.status = true;
	        }
	    }
	
	    $scope.formatEvent = function (event) {
	        if (event.notes && event.notes.length > 0 && !$scope.noteExists) {
	            $scope.noteExists = true;
	        }
	
	        angular.forEach(event.dataValues, function (dataValue) {
	            if ($scope.prStDes && $scope.prStDes[dataValue.dataElement] && dataValue.value) {
	
	                if (angular.isObject($scope.prStDes[dataValue.dataElement].dataElement)) {
	                    dataValue.value = CommonUtils.formatDataValue(null, dataValue.value, $scope.prStDes[dataValue.dataElement].dataElement, $scope.optionSets, 'USER');
	                }
	
	                event[dataValue.dataElement] = dataValue.value;
	
	                switch ($scope.prStDes[dataValue.dataElement].dataElement.valueType) {
	                    case "FILE_RESOURCE":
	                        CommonUtils.checkAndSetFileName(event, dataValue.value, dataValue.dataElement);
	                        break;
	                    case "ORGANISATION_UNIT":
	                        CommonUtils.checkAndSetOrgUnitName(dataValue.value);
	                        break;
	                }
	            }
	        });
	
	        $scope.fileNames = CurrentSelection.getFileNames();
	        $scope.orgUnitNames = CurrentSelection.getOrgUnitNames();
	
	        setCommonEventProps(event);
	
	        if ($scope.selectedProgramStage && $scope.selectedProgramStage.captureCoordinates && !event.coordinate) {
	            event.coordinate = {};
	        }
	
	        event.state = 'FULL';
	        delete event.dataValues;
	    };
	
	    $scope.formatEventFromGrid = function (event) {
	        if (event.notes && event.notes.length > 0 && !$scope.noteExists) {
	            $scope.noteExists = true;
	        }
	
	        angular.forEach($scope.selectedProgramStage.programStageDataElements, function (prStDe) {
	            var de = prStDe.dataElement;
	            if (event[de.id]) {
	                event[de.id] = CommonUtils.formatDataValue(null, event[de.id], de, $scope.optionSets, 'USER');
	
	                switch (de.valueType) {
	                    case "FILE_RESOURCE":
	                        CommonUtils.checkAndSetFileName(event, event[de.id], de.id);
	                        break;
	                    case "ORGANISATION_UNIT":
	                        CommonUtils.checkAndSetOrgUnitName(event[de.id]);
	                        break;
	                }
	            }
	        });
	
	        setCommonEventProps(event);
	
	        if (event.latitude) {
	            var lat = $scope.formatNumberResult(event.latitude);
	            if (event.coordinate) {
	                event.coordinate.latitude = lat;
	            } else {
	                event.coordinate = { latitude: lat };
	            }
	        }
	
	        if (event.longitude) {
	            var lng = $scope.formatNumberResult(event.longitude);
	            if (event.coordinate) {
	                event.coordinate.longitude = lng;
	            } else {
	                event.coordinate = { longitude: lng };
	            }
	        }
	
	        event.state = 'PARTIAL';
	    };
	
	    /* If gridCoulumns for a program is stored in user data store then it is restored when
	     * the program is selected. If the grid columns are not stored then the grid columns are set
	     * as the default one for that program (in $scope.search() function)
	     * */
	    $scope.restoreGridColumnsFromUserStore = function () {
	        $scope.eventGridColumnsRestored = false;
	        if ($scope.gridColumnsInUserStore && $scope.selectedProgram && $scope.selectedProgram.id) {
	            if ($scope.gridColumnsInUserStore[$scope.selectedProgram.id]) {
	                $scope.eventGridColumns = angular.copy($scope.gridColumnsInUserStore[$scope.selectedProgram.id]);
	                $scope.eventGridColumnsRestored = true;
	            }
	        }
	        if (!$scope.eventGridColumnsRestored) {
	            $scope.eventGridColumns = [];
	        }
	    };
	
	    $scope.getProgramDetails = function () {
	
	        $scope.selectedOptions = [];
	        $scope.selectedProgramStage = null;
	        $scope.eventFetched = false;
	        $scope.optionsReady = false;
	
	        //Filtering
	        $scope.reverse = true;
	        $scope.sortHeader = { id: 'lastUpdated', direction: 'desc' };
	        $scope.filterText = {};
	        $scope.filterParam = '';
	
	        if ($scope.userAuthority && $scope.userAuthority.canAddOrUpdateEvent && $scope.selectedProgram && $scope.selectedProgram.programStages && $scope.selectedProgram.programStages[0] && $scope.selectedProgram.programStages[0].id) {
	
	            //because this is single event, take the first program stage
	
	            $scope.selectedProgramStage = $scope.selectedProgram.programStages[0];
	            $scope.currentStage = $scope.selectedProgramStage;
	
	            angular.forEach($scope.selectedProgramStage.programStageSections, function (section) {
	                section.open = true;
	            });
	
	            $scope.prStDes = [];
	            $scope.restoreGridColumnsFromUserStore();
	            $scope.filterTypes = {};
	            $scope.newDhis2Event = {};
	            $scope.filterTypes['uid'] = 'TEXT';
	
	            if (!$scope.eventGridColumnsRestored) {
	                $scope.eventGridColumns.push({
	                    displayName: 'event_uid',
	                    id: 'uid',
	                    valueType: 'TEXT',
	                    compulsory: false,
	                    filterWithRange: false,
	                    showFilter: false,
	                    show: false,
	                    group: 'FIXED'
	                });
	
	                $scope.eventGridColumns.push({
	                    displayName: $scope.selectedProgramStage.reportDateDescription ? $scope.selectedProgramStage.reportDateDescription : $translate.instant('incident_date'),
	                    id: 'eventDate',
	                    valueType: 'DATE',
	                    filterWithRange: true,
	                    compulsory: false,
	                    showFilter: false,
	                    show: true,
	                    group: 'FIXED'
	                });
	
	                $scope.eventGridColumns.push({
	                    displayName: $translate.instant('last_updated'),
	                    id: 'lastUpdated',
	                    valueType: 'DATE',
	                    filterWithRange: true,
	                    compulsory: false,
	                    showFilter: false,
	                    show: true,
	                    group: 'FIXED'
	                });
	            }
	
	            $scope.filterTypes['eventDate'] = 'DATE';
	            $scope.filterText['eventDate'] = {};
	
	            angular.forEach($scope.selectedProgramStage.programStageDataElements, function (prStDe) {
	
	                $scope.prStDes[prStDe.dataElement.id] = prStDe;
	                $scope.newDhis2Event[prStDe.dataElement.id] = '';
	
	                if (!$scope.eventGridColumnsRestored) {
	                    //generate grid headers using program stage data elements
	                    //create a template for new event
	                    //for date type dataelements, filtering is based on start and end dates
	                    $scope.eventGridColumns.push({ displayName: prStDe.dataElement.displayFormName,
	                        id: prStDe.dataElement.id,
	                        valueType: prStDe.dataElement.valueType,
	                        compulsory: prStDe.compulsory,
	                        filterWithRange: prStDe.dataElement.valueType === 'DATE' || prStDe.dataElement.valueType === 'NUMBER' || prStDe.dataElement.valueType === 'INTEGER' || prStDe.dataElement.valueType === 'INTEGER_POSITIVE' || prStDe.dataElement.valueType === 'INTEGER_NEGATIVE' || prStDe.dataElement.valueType === 'INTEGER_ZERO_OR_POSITIVE' ? true : false,
	                        showFilter: false,
	                        show: prStDe.displayInReports,
	                        group: 'DYNAMIC' });
	                }
	
	                $scope.filterTypes[prStDe.dataElement.id] = prStDe.dataElement.valueType;
	
	                if (prStDe.dataElement.valueType === 'DATE' || prStDe.dataElement.valueType === 'NUMBER' || prStDe.dataElement.valueType === 'INTEGER' || prStDe.dataElement.valueType === 'INTEGER_POSITIVE' || prStDe.dataElement.valueType === 'INTEGER_NEGATIVE' || prStDe.dataElement.valueType === 'INTEGER_ZERO_OR_POSITIVE') {
	                    $scope.filterText[prStDe.dataElement.id] = {};
	                }
	            });
	
	            $scope.emptyFilterText = angular.copy($scope.filterText);
	
	            $scope.customDataEntryForm = CustomFormService.getForProgramStage($scope.selectedProgramStage, $scope.prStDes);
	
	            if ($scope.selectedProgramStage.captureCoordinates) {
	                $scope.newDhis2Event.coordinate = {};
	            }
	
	            $scope.newDhis2Event.eventDate = '';
	            $scope.newDhis2Event.event = 'SINGLE_EVENT';
	
	            $scope.selectedCategories = [];
	            if ($scope.selectedProgram.categoryCombo && !$scope.selectedProgram.categoryCombo.isDefault && $scope.selectedProgram.categoryCombo.categories) {
	                $scope.selectedCategories = $scope.selectedProgram.categoryCombo.categories;
	            } else {
	                $scope.loadEvents();
	            }
	            $scope.optionsReady = true;
	        }
	    };
	
	    function loadOptions() {
	        $scope.selectedOptions = [];
	        var categoryOptions = null;
	
	        if ($scope.currentEvent.attributeCategoryOptions) {
	            $scope.selectedOptions = $scope.currentEvent.attributeCategoryOptions.split(";");
	            for (var index1 = 0; index1 < $scope.selectedCategories.length; index1++) {
	                categoryOptions = $scope.selectedCategories[index1].categoryOptions;
	                for (var index2 = 0; index2 < categoryOptions.length; index2++) {
	                    if (categoryOptions[index2].id === $scope.selectedOptions[index1]) {
	                        $scope.selectedCategories[index1].selectedOption = categoryOptions[index2];
	                        break;
	                    }
	                }
	            }
	            $scope.optionsReady = true;
	        }
	    }
	
	    $scope.getCategoryOptions = function () {
	        $scope.eventFetched = false;
	        $scope.optionsReady = false;
	        $scope.selectedOptions = [];
	
	        for (var i = 0; i < $scope.selectedCategories.length; i++) {
	            if ($scope.selectedCategories[i].selectedOption && $scope.selectedCategories[i].selectedOption.id) {
	                $scope.optionsReady = true;
	                $scope.selectedOptions.push($scope.selectedCategories[i].selectedOption.id);
	            } else {
	                $scope.optionsReady = false;
	                break;
	            }
	        }
	
	        if ($scope.optionsReady && !$scope.eventRegistration && !$scope.editingEventInFull) {
	            $scope.loadEvents();
	        }
	    };
	
	    //get events for the selected program (and org unit)
	    $scope.loadEvents = function () {
	        resetView();
	        $scope.noteExists = false;
	        $scope.eventFetched = true;
	
	        $scope.attributeCategoryUrl = { cc: $scope.selectedProgram.categoryCombo.id, default: $scope.selectedProgram.categoryCombo.isDefault, cp: "" };
	        if (!$scope.selectedProgram.categoryCombo.isDefault) {
	            if ($scope.selectedOptions.length !== $scope.selectedCategories.length) {
	                var dialogOptions = {
	                    headerText: 'error',
	                    bodyText: 'fill_all_category_options'
	                };
	
	                DialogService.showDialog({}, dialogOptions);
	                return;
	            }
	            $scope.attributeCategoryUrl.cp = $scope.selectedOptions.join(';');
	        }
	
	        if ($scope.selectedProgram && $scope.selectedProgramStage && $scope.selectedProgramStage.id) {
	
	            //Load events for the selected program stage and orgunit
	
	            var dataElementUrl = $filter('filter')($scope.eventGridColumns, { group: 'DYNAMIC', show: true }).map(function (c) {
	                return c.id;
	            });
	
	            if (dataElementUrl && dataElementUrl.length > 0) {
	                dataElementUrl = '&dataElement=' + dataElementUrl.join(',');
	            } else {
	                dataElementUrl = '';
	            }
	
	            DHIS2EventFactory.getByStage($scope.selectedOrgUnit.id, $scope.selectedProgramStage.id, $scope.attributeCategoryUrl, $scope.pager, true, null, $scope.filterParam + dataElementUrl, $scope.sortHeader).then(function (data) {
	                var _dhis2Events = [];
	                if (dhis2.ec.isOffline) {
	                    angular.forEach(data.events, function (ev) {
	                        $scope.formatEvent(ev);
	                        _dhis2Events.push(ev);
	                    });
	                } else {
	                    if (data && data.headers && data.rows) {
	                        _dhis2Events = [];
	                        angular.forEach(data.rows, function (r) {
	                            var ev = {};
	                            for (var i = 0; i < data.headers.length; i++) {
	                                ev[data.headers[i].name] = r[i];
	                            }
	                            $scope.formatEventFromGrid(ev);
	                            _dhis2Events.push(ev);
	                        });
	
	                        $scope.fileNames = CurrentSelection.getFileNames();
	                        $scope.orgUnitNames = CurrentSelection.getOrgUnitNames();
	                    }
	                }
	
	                if (data.metaData && data.metaData.pager) {
	
	                    data.metaData.pager.pageSize = data.metaData.pager.pageSize ? data.metaData.pager.pageSize : $scope.pager.pageSize;
	                    $scope.pager = data.metaData.pager;
	                    $scope.pager.toolBarDisplay = 5;
	
	                    Paginator.setPage($scope.pager.page);
	                    Paginator.setPageCount($scope.pager.pageCount);
	                    Paginator.setPageSize($scope.pager.pageSize);
	                    Paginator.setItemCount($scope.pager.total);
	                }
	
	                if ($scope.noteExists && !GridColumnService.columnExists($scope.eventGridColumns, 'comment')) {
	                    $scope.eventGridColumns.push({ displayName: 'comment', id: 'comment', type: 'TEXT', filterWithRange: false, compulsory: false, showFilter: false, show: true });
	                }
	
	                $scope.eventFetched = true;
	                $scope.dhis2Events = _dhis2Events;
	            });
	        }
	    };
	
	    $scope.jumpToPage = function () {
	
	        if ($scope.pager && $scope.pager.page && $scope.pager.pageCount && $scope.pager.page > $scope.pager.pageCount) {
	            $scope.pager.page = $scope.pager.pageCount;
	        }
	        $scope.loadEvents();
	    };
	
	    $scope.resetPageSize = function () {
	        $scope.pager.page = 1;
	        $scope.loadEvents();
	    };
	
	    $scope.getPage = function (page) {
	        $scope.pager.page = page;
	        $scope.loadEvents();
	    };
	
	    $scope.sortEventGrid = function (gridHeader) {
	        if ($scope.sortHeader && $scope.sortHeader.id === gridHeader.id) {
	            $scope.reverse = !$scope.reverse;
	        }
	        $scope.sortHeader = { id: gridHeader.id, direction: $scope.reverse ? 'desc' : 'asc' };
	        $scope.loadEvents();
	    };
	
	    $scope.showHideColumns = function () {
	        var oldCols = $filter('filter')(angular.copy($scope.eventGridColumns), { group: 'DYNAMIC', show: true }).length;
	        $scope.gridColumnsInUserStore = $scope.gridColumnsInUserStore ? $scope.gridColumnsInUserStore : {};
	        $scope.gridColumnsInUserStore[$scope.selectedProgram.id] = angular.copy($scope.eventGridColumns);
	
	        var modalInstance = $modal.open({
	            templateUrl: 'views/column-modal.html',
	            controller: 'ColumnDisplayController',
	            resolve: {
	                gridColumns: function gridColumns() {
	                    return $scope.eventGridColumns;
	                },
	                hiddenGridColumns: function hiddenGridColumns() {
	                    return $filter('filter')($scope.eventGridColumns, { show: false }).length;
	                },
	                gridColumnsInUserStore: function gridColumnsInUserStore() {
	                    return $scope.gridColumnsInUserStore;
	                },
	                gridColumnDomainKey: function gridColumnDomainKey() {
	                    return "eventCaptureGridColumns";
	                },
	                gridColumnKey: function gridColumnKey() {
	                    return $scope.selectedProgram.id;
	                }
	            }
	        });
	
	        modalInstance.result.then(function (gridColumns) {
	            $scope.eventGridColumns = gridColumns;
	            var newCols = $filter('filter')($scope.eventGridColumns, { group: 'DYNAMIC', show: true }).length;
	            if (newCols > oldCols) {
	                $scope.loadEvents();
	            }
	        });
	    };
	
	    $scope.filterEvents = function (gridColumn, applyFilter) {
	        $scope.filterParam = '';
	
	        angular.forEach($scope.eventGridColumns, function (col) {
	            if (gridColumn) {
	                if (col.id === gridColumn.id) {
	                    col.showFilter = !col.showFilter;
	                } else {
	                    col.showFilter = false;
	                }
	            }
	
	            if (applyFilter && $scope.filterText[col.id]) {
	                if (col.group === "STATIC") {
	                    switch (col.id) {
	                        case "eventDate":
	                            if ($scope.filterText[col.id].start || $scope.filterText[col.id].end) {
	                                if ($scope.filterText[col.id].start) {
	                                    $scope.filterParam += '&startDate=' + $scope.filterText[col.id].start;
	                                }
	                                if ($scope.filterText[col.id].end) {
	                                    $scope.filterParam += '&endDate=' + $scope.filterText[col.id].end;
	                                }
	                            }
	                            break;
	                        case "lastUpdated":
	                            if ($scope.filterText[col.id].start || $scope.filterText[col.id].end) {
	                                if ($scope.filterText[col.id].start) {
	                                    $scope.filterParam += '&lastUpdatedStartDate=' + $scope.filterText[col.id].start;
	                                }
	                                if ($scope.filterText[col.id].end) {
	                                    $scope.filterParam += '&lastUpdatedEndDate=' + $scope.filterText[col.id].end;
	                                }
	                            }
	                            break;
	                        case "status":
	                            $scope.filterParam += '&status=' + $scope.filterText[col.id];
	                            break;
	                    }
	                } else {
	                    if ($scope.prStDes[col.id] && $scope.prStDes[col.id].dataElement && $scope.prStDes[col.id].dataElement.optionSetValue) {
	
	                        if ($scope.filterText[col.id].length > 0) {
	                            var filters = $scope.filterText[col.id].map(function (filt) {
	                                return filt.code;
	                            });
	                            if (filters.length > 0) {
	                                $scope.filterParam += '&filter=' + col.id + ':IN:' + filters.join(';');
	                            }
	                        }
	                    } else {
	                        if (col.filterWithRange) {
	                            if ($scope.filterText[col.id].start && $scope.filterText[col.id].start !== "" || $scope.filterText[col.id].end && $scope.filterText[col.id].end !== "") {
	                                $scope.filterParam += '&filter=' + col.id;
	                                if ($scope.filterText[col.id].start) {
	                                    $scope.filterParam += ':GT:' + $scope.filterText[col.id].start;
	                                }
	                                if ($scope.filterText[col.id].end) {
	                                    $scope.filterParam += ':LT:' + $scope.filterText[col.id].end;
	                                }
	                            }
	                        } else {
	                            $scope.filterParam += '&filter=' + col.id + ':like:' + $scope.filterText[col.id];
	                        }
	                    }
	                }
	            }
	        });
	
	        if (applyFilter) {
	            $scope.loadEvents();
	        }
	    };
	
	    $scope.removeStartFilterText = function (gridColumnId) {
	        $scope.filterText[gridColumnId].start = undefined;
	    };
	
	    $scope.removeEndFilterText = function (gridColumnId) {
	        $scope.filterText[gridColumnId].end = undefined;
	    };
	
	    $scope.resetFilter = function () {
	        $scope.filterText = angular.copy($scope.emptyFilterText);
	        $scope.filterEvents(null, true);
	    };
	
	    $scope.cancel = function () {
	
	        resetUrl();
	        if ($scope.formIsChanged()) {
	            var modalOptions = {
	                closeButtonText: 'no',
	                actionButtonText: 'yes',
	                headerText: 'warning',
	                bodyText: 'unsaved_data_exists_proceed'
	            };
	
	            ModalService.showModal({}, modalOptions).then(function (result) {
	                for (var i = 0; i < $scope.dhis2Events.length; i++) {
	                    if ($scope.dhis2Events[i].event === $scope.currentEvent.event) {
	                        $scope.dhis2Events[i] = $scope.currentEventOriginialValue;
	                        break;
	                    }
	                }
	
	                resetView();
	                $scope.currentEvent = {};
	                if (!angular.equals($scope.selectedOptionsOriginal, $scope.selectedOptions)) {
	
	                    $scope.loadEvents();
	                } else {
	                    $scope.showEventList();
	                }
	            });
	        } else {
	            resetView();
	            $scope.currentEvent = {};
	            if (!angular.equals($scope.selectedOptionsOriginal, $scope.selectedOptions)) {
	                $scope.loadEvents();
	            } else {
	                $scope.showEventList();
	            }
	        }
	    };
	
	    $scope.showEventList = function (dhis2Event) {
	
	        ContextMenuSelectedItem.setSelectedItem(dhis2Event);
	        resetView();
	        $scope.currentElement.updated = false;
	        $scope.currentEvent = {};
	        $scope.fileNames['SINGLE_EVENT'] = {};
	        $scope.currentElement = {};
	        $scope.currentEventOriginialValue = angular.copy($scope.currentEvent);
	    };
	
	    $scope.showEventRegistration = function () {
	        $scope.displayCustomForm = $scope.customDataEntryForm ? true : false;
	        $scope.currentEvent = {};
	        $scope.fileNames['SINGLE_EVENT'] = {};
	        $scope.currentFileNames = {};
	        $scope.eventRegistration = !$scope.eventRegistration;
	        $scope.currentEvent = angular.copy($scope.newDhis2Event);
	        $scope.outerForm.submitted = false;
	        $scope.note = {};
	        $scope.displayTextEffects = [];
	
	        if ($scope.selectedProgramStage.preGenerateUID) {
	            $scope.eventUID = dhis2.util.uid();
	            $scope.currentEvent['uid'] = $scope.eventUID;
	        }
	        $scope.currentEventOriginialValue = angular.copy($scope.currentEvent);
	
	        if ($scope.eventRegistration) {
	            $scope.executeRules();
	        }
	    };
	
	    $scope.showEditEventInGrid = function () {
	        $scope.currentEvent = ContextMenuSelectedItem.getSelectedItem();
	        $scope.currentEventOriginialValue = angular.copy($scope.currentEvent);
	        $scope.editingEventInGrid = !$scope.editingEventInGrid;
	        $scope.outerForm.$valid = true;
	        checkEventEditingStatus();
	    };
	
	    var lastRoute = $route.current;
	    $scope.$on('$locationChangeSuccess', function (event) {
	        /* prevents rerouting when eventId, orgunit and category options
	         * are added to the url.*/
	        if ($route && $route.current && $route.current.params) {
	            var newRouteParams = $route.current.params;
	            if (newRouteParams.event || newRouteParams.ou || newRouteParams.options) {
	                $route.current = lastRoute;
	            }
	        }
	    });
	
	    $scope.showEditEventInFull = function () {
	        $scope.note = {};
	        $scope.displayTextEffects = [];
	        $scope.displayCustomForm = $scope.customDataEntryForm ? true : false;
	        $scope.selectedOptionsOriginal = angular.copy($scope.selectedOptions);
	
	        //$scope.currentEvent = ContextMenuSelectedItem.getSelectedItem();
	
	        var event = ContextMenuSelectedItem.getSelectedItem();
	
	        DHIS2EventFactory.get(event.event, event).then(function (event) {
	            $scope.formatEvent(event);
	            $scope.currentEvent = event;
	            loadOptions();
	            /*
	              When the user goes directly to the event edit page for an event with category options,
	              the $scope.dhis2Events will not be initialised since the selected category option for the event
	              was not available. So we initialize it here so that the event list is visibile when the user
	              clicks 'Cancel'/'Update button.
	            */
	            if ($scope.dhis2Events || $scope.dhis2Events.length && $scope.dhis2Events.length === 0) {
	                $scope.loadEvents();
	            }
	            $scope.dhis2Events = DHIS2EventService.refreshList($scope.dhis2Events, $scope.currentEvent);
	            $scope.editingEventInFull = !$scope.editingEventInFull;
	            $scope.eventRegistration = false;
	
	            angular.forEach($scope.selectedProgramStage.programStageDataElements, function (prStDe) {
	                if (!$scope.currentEvent.hasOwnProperty(prStDe.dataElement.id)) {
	                    $scope.currentEvent[prStDe.dataElement.id] = '';
	                }
	            });
	            $scope.currentEventOriginialValue = angular.copy($scope.currentEvent);
	
	            if ($scope.editingEventInFull) {
	                //Blank out rule effects, as there is no rules in effect before the first
	                //time the rules is run on a new page.
	                $rootScope.ruleeffects[$scope.currentEvent.event] = {};
	                $scope.executeRules();
	            }
	
	            if (!$location.search().ou) {
	                $location.search("ou", $scope.selectedOrgUnit.id);
	            }
	            if (!$location.search().event) {
	                $location.search("event", $scope.currentEvent.event);
	            }
	            checkEventEditingStatus();
	        });
	    };
	
	    function checkEventEditingStatus() {
	        if (!$scope.model.editingDisabled) {
	            $scope.model.editingDisabled = DHIS2EventService.getEventExpiryStatus($scope.currentEvent, $scope.selectedProgram, $scope.selectedOrgUnit.id);
	
	            if ($scope.model.editingDisabled) {
	                var dialogOptions = {
	                    headerText: $translate.instant('event_expired'),
	                    bodyText: $translate.instant('editing_disabled')
	                };
	                DialogService.showDialog({}, dialogOptions).then(function (response) {});
	            }
	        }
	    }
	
	    $scope.switchDataEntryForm = function () {
	        $scope.displayCustomForm = !$scope.displayCustomForm;
	    };
	
	    $scope.checkAndShowProgramRuleFeedback = function () {
	        //preparing a warnings section in case it is needed by one of the other dialogs.
	        var warningSection = false;
	        if ($scope.warningMessagesOnComplete && $scope.warningMessagesOnComplete.length > 0) {
	            warningSection = {
	                bodyText: 'be_aware_of_validation_warnings',
	                bodyList: $scope.warningMessagesOnComplete,
	                itemType: 'warning'
	            };
	        }
	
	        //Prepare an error section if any errors exist:
	        var errorSection = false;
	        if ($scope.errorMessagesOnComplete && $scope.errorMessagesOnComplete.length > 0) {
	            errorSection = {
	                bodyList: $scope.errorMessagesOnComplete,
	                itemType: 'danger'
	            };
	        }
	
	        var def = $q.defer();
	
	        if (errorSection) {
	            var sections = [errorSection];
	            if (warningSection) {
	                sections.push(warningSection);
	            }
	
	            var dialogOptions = {
	                headerText: 'validation_error',
	                bodyText: 'please_fix_errors_before_saving',
	                sections: sections
	            };
	
	            DialogService.showDialog({}, dialogOptions).then(function (response) {
	                def.reject(response);
	            });
	        } else if (warningSection) {
	            var modalOptions = warningSection;
	            modalOptions.bodyText = 'save_despite_warnings';
	            modalOptions.headerText = 'validation_warnings';
	
	            ModalService.showModal({}, modalOptions).then(function () {
	                def.resolve(true);
	            }, function () {
	                def.reject(false);
	            });
	        } else {
	            def.resolve(true);
	        }
	
	        return def.promise;
	    };
	
	    $scope.addEvent = function (addingAnotherEvent) {
	
	        //check for form validity
	        $scope.outerForm.submitted = true;
	        if ($scope.outerForm.$invalid) {
	            $scope.selectedSection.id = 'ALL';
	            angular.forEach($scope.selectedProgramStage.programStageSections, function (section) {
	                section.open = true;
	            });
	            return false;
	        }
	
	        $scope.checkAndShowProgramRuleFeedback().then(function () {
	            //the form is valid, get the values
	            //but there could be a case where all dataelements are non-mandatory and
	            //the event form comes empty, in this case enforce at least one value
	            var dataValues = [];
	            for (var dataElement in $scope.prStDes) {
	                var val = $scope.currentEvent[dataElement];
	                val = CommonUtils.formatDataValue(null, val, $scope.prStDes[dataElement].dataElement, $scope.optionSets, 'API');
	                dataValues.push({ dataElement: dataElement, value: val });
	            }
	
	            if (!dataValues.length || dataValues.length === 0) {
	                var dialogOptions = {
	                    headerText: 'empty_form',
	                    bodyText: 'please_fill_at_least_one_dataelement'
	                };
	
	                DialogService.showDialog({}, dialogOptions);
	                return;
	            }
	
	            $scope.model.savingRegistration = true;
	
	            var newEvent = angular.copy($scope.currentEvent);
	
	            //prepare the event to be created
	            var dhis2Event = {
	                program: $scope.selectedProgram.id,
	                programStage: $scope.selectedProgramStage.id,
	                orgUnit: $scope.selectedOrgUnit.id,
	                status: $scope.currentEvent.status ? 'COMPLETED' : 'ACTIVE',
	                eventDate: DateUtils.formatFromUserToApi(newEvent.eventDate),
	                dataValues: dataValues
	            };
	
	            if (dhis2Event.status === 'COMPLETED') {
	                dhis2Event.completedDate = DateUtils.formatFromUserToApi($scope.today);
	            }
	
	            if ($scope.selectedProgramStage.preGenerateUID && !angular.isUndefined(newEvent['uid'])) {
	                dhis2Event.event = newEvent['uid'];
	            }
	
	            if (!angular.isUndefined($scope.note.value) && $scope.note.value !== '') {
	                dhis2Event.notes = [{ value: $scope.note.value }];
	
	                newEvent.notes = [{ value: $scope.note.value, storedDate: $scope.today, storedBy: storedBy }];
	
	                $scope.noteExists = true;
	            }
	
	            if ($scope.selectedProgramStage.captureCoordinates) {
	                dhis2Event.coordinate = { latitude: $scope.currentEvent.coordinate.latitude ? $scope.currentEvent.coordinate.latitude : '',
	                    longitude: $scope.currentEvent.coordinate.longitude ? $scope.currentEvent.coordinate.longitude : '' };
	            }
	
	            if (!$scope.selectedProgram.categoryCombo.isDefault) {
	                if ($scope.selectedOptions.length !== $scope.selectedCategories.length) {
	                    var dialogOptions = {
	                        headerText: 'error',
	                        bodyText: 'fill_all_category_options'
	                    };
	
	                    DialogService.showDialog({}, dialogOptions);
	                    return;
	                }
	
	                //dhis2Event.attributeCc = $scope.selectedProgram.categoryCombo.id;
	                dhis2Event.attributeCategoryOptions = $scope.selectedOptions.join(';');
	            }
	
	            //send the new event to server        
	            DHIS2EventFactory.create(dhis2Event).then(function (data) {
	                if (data.response.importSummaries[0].status === 'ERROR') {
	                    var dialogOptions = {
	                        headerText: 'event_registration_error',
	                        bodyText: data.message
	                    };
	
	                    DialogService.showDialog({}, dialogOptions);
	                } else {
	
	                    //add the new event to the grid                
	                    newEvent.event = data.response.importSummaries[0].reference;
	                    $scope.currentEvent.event = newEvent.event;
	
	                    $scope.updateFileNames();
	
	                    if (!$scope.dhis2Events) {
	                        $scope.dhis2Events = [];
	                    }
	                    newEvent['uid'] = newEvent.event;
	                    newEvent['eventDate'] = newEvent.eventDate;
	                    $scope.dhis2Events.splice(0, 0, newEvent);
	
	                    $scope.eventLength++;
	
	                    resetView();
	
	                    //reset form              
	                    $scope.currentEvent = {};
	                    $scope.currentEvent = angular.copy($scope.newDhis2Event);
	                    $scope.currentEventOriginialValue = angular.copy($scope.currentEvent);
	                    $scope.fileNames['SINGLE_EVENT'] = {};
	
	                    $scope.note = {};
	                    $scope.displayTextEffects = [];
	                    $scope.outerForm.submitted = false;
	                    $scope.outerForm.$setPristine();
	
	                    //decide whether to stay in the current screen or not.
	                    if (addingAnotherEvent) {
	                        $scope.showEventRegistration();
	                        $anchorScroll();
	                    }
	                }
	                $scope.model.savingRegistration = false;
	            });
	        });
	    };
	
	    function resetUrl() {
	        if ($location.search().ou) {
	            orgUnitFromUrl = null;
	            eventIdFromUrl = null;
	            //selectedOptionsFromUrl = null;
	            $location.search("event", null);
	            $location.search("ou", null);
	        }
	    }
	
	    $scope.updateEvent = function () {
	        resetUrl();
	        //check for form validity
	        $scope.outerForm.submitted = true;
	        if ($scope.outerForm.$invalid) {
	            $scope.selectedSection.id = 'ALL';
	            angular.forEach($scope.selectedProgramStage.programStageSections, function (section) {
	                section.open = true;
	            });
	            return false;
	        }
	
	        $scope.checkAndShowProgramRuleFeedback().then(function () {
	            //the form is valid, get the values
	            var dataValues = [];
	            for (var dataElement in $scope.prStDes) {
	                var val = $scope.currentEvent[dataElement];
	                val = CommonUtils.formatDataValue(null, val, $scope.prStDes[dataElement].dataElement, $scope.optionSets, 'API');
	                dataValues.push({ dataElement: dataElement, value: val });
	            }
	
	            var updatedEvent = {
	                program: $scope.currentEvent.program,
	                programStage: $scope.currentEvent.programStage,
	                orgUnit: $scope.currentEvent.orgUnit,
	                status: $scope.currentEvent.status ? 'COMPLETED' : 'ACTIVE',
	                eventDate: DateUtils.formatFromUserToApi($scope.currentEvent.eventDate),
	                event: $scope.currentEvent.event,
	                dataValues: dataValues
	            };
	
	            if ($scope.selectedProgramStage.captureCoordinates) {
	                updatedEvent.coordinate = { latitude: $scope.currentEvent.coordinate.latitude ? $scope.currentEvent.coordinate.latitude : '',
	                    longitude: $scope.currentEvent.coordinate.longitude ? $scope.currentEvent.coordinate.longitude : '' };
	            }
	
	            if (!angular.isUndefined($scope.note.value) && $scope.note.value !== '') {
	
	                updatedEvent.notes = [{ value: $scope.note.value }];
	
	                if ($scope.currentEvent.notes) {
	                    $scope.currentEvent.notes.splice(0, 0, { value: $scope.note.value, storedDate: $scope.today, storedBy: storedBy });
	                } else {
	                    $scope.currentEvent.notes = [{ value: $scope.note.value, storedDate: $scope.today, storedBy: storedBy }];
	                }
	
	                $scope.noteExists = true;
	            }
	
	            if (updatedEvent.status === 'COMPLETED' && $scope.currentEventOriginialValue.status !== 'COMPLETED') {
	                updatedEvent.completedDate = DateUtils.formatFromUserToApi($scope.today);
	            }
	
	            if (!angular.equals($scope.selectedOptionsOriginal, $scope.selectedOptions)) {
	                updatedEvent.attributeCategoryOptions = $scope.selectedOptions.join(';');
	            }
	
	            DHIS2EventFactory.update(updatedEvent).then(function (data) {
	                //reflect the change in the gird
	                $scope.outerForm.submitted = false;
	                $scope.editingEventInFull = false;
	                $scope.currentEvent = {};
	                $scope.currentEventOriginialValue = angular.copy($scope.currentEvent);
	                if (!angular.equals($scope.selectedOptionsOriginal, $scope.selectedOptions)) {
	                    $scope.loadEvents();
	                } else {
	                    $scope.dhis2Events = DHIS2EventService.refreshList($scope.dhis2Events, $scope.currentEvent);
	                    $scope.updateFileNames();
	                }
	            });
	        });
	    };
	
	    $scope.updateEventDate = function () {
	
	        $scope.updateSuccess = false;
	
	        $scope.currentElement = { id: 'eventDate' };
	
	        var rawDate = angular.copy($scope.currentEvent.eventDate);
	        var convertedDate = DateUtils.format($scope.currentEvent.eventDate);
	
	        if (!rawDate || !convertedDate || rawDate !== convertedDate) {
	            $scope.invalidDate = true;
	            $scope.currentEvent.eventDate = $scope.currentEventOriginialValue.eventDate;
	            $scope.dhis2Events = DHIS2EventService.refreshList($scope.dhis2Events, $scope.currentEvent);
	            $scope.currentElement.updated = false;
	            return;
	        }
	
	        //get new and old values
	        var newValue = $scope.currentEvent.eventDate;
	        var oldValue = $scope.currentEventOriginialValue.eventDate;
	
	        if ($scope.currentEvent.eventDate === '') {
	            $scope.currentEvent.eventDate = oldValue;
	            $scope.dhis2Events = DHIS2EventService.refreshList($scope.dhis2Events, $scope.currentEvent);
	            $scope.currentElement.updated = false;
	            return;
	        }
	
	        if (newValue !== oldValue) {
	            var e = { event: $scope.currentEvent.event,
	                orgUnit: $scope.currentEvent.orgUnit,
	                eventDate: DateUtils.formatFromUserToApi($scope.currentEvent.eventDate)
	            };
	
	            var updatedFullValueEvent = DHIS2EventService.reconstructEvent($scope.currentEvent, $scope.selectedProgramStage.programStageDataElements);
	
	            DHIS2EventFactory.updateForEventDate(e, updatedFullValueEvent).then(function () {
	                //reflect the new value in the grid
	                $scope.dhis2Events = DHIS2EventService.refreshList($scope.dhis2Events, $scope.currentEvent);
	
	                //update original value
	                $scope.currentEventOriginialValue = angular.copy($scope.currentEvent);
	
	                $scope.currentElement.updated = true;
	                $scope.updateSuccess = true;
	            });
	        }
	    };
	
	    $scope.updateEventDataValue = function (dataElement) {
	
	        $scope.updateSuccess = false;
	
	        //get current element
	        $scope.currentElement = { id: dataElement, pending: true, updated: false, failed: false };
	
	        //get new and old values
	        var newValue = $scope.currentEvent[dataElement];
	        var oldValue = $scope.currentEventOriginialValue[dataElement];
	
	        //check for form validity
	        if ($scope.isFormInvalid()) {
	            $scope.currentElement.updated = false;
	
	            //reset value back to original
	            $scope.currentEvent[dataElement] = oldValue;
	            $scope.dhis2Events = DHIS2EventService.refreshList($scope.dhis2Events, $scope.currentEvent);
	            return;
	        }
	
	        if ($scope.prStDes[dataElement].compulsory && !newValue) {
	            $scope.currentElement.updated = false;
	
	            //reset value back to original
	            $scope.currentEvent[dataElement] = oldValue;
	            $scope.dhis2Events = DHIS2EventService.refreshList($scope.dhis2Events, $scope.currentEvent);
	            return;
	        }
	
	        if (newValue !== oldValue) {
	            newValue = CommonUtils.formatDataValue(null, newValue, $scope.prStDes[dataElement].dataElement, $scope.optionSets, 'API');
	            var updatedSingleValueEvent = { event: $scope.currentEvent.event, dataValues: [{ value: newValue, dataElement: dataElement }] };
	            var updatedFullValueEvent = DHIS2EventService.reconstructEvent($scope.currentEvent, $scope.selectedProgramStage.programStageDataElements);
	
	            DHIS2EventFactory.updateForSingleValue(updatedSingleValueEvent, updatedFullValueEvent).then(function (data) {
	
	                //reflect the new value in the grid
	                $scope.dhis2Events = DHIS2EventService.refreshList($scope.dhis2Events, $scope.currentEvent);
	
	                //update original value
	                $scope.currentEventOriginialValue = angular.copy($scope.currentEvent);
	
	                $scope.currentElement.pending = false;
	                $scope.currentElement.updated = true;
	                $scope.updateSuccess = true;
	            }, function () {
	                $scope.currentElement.pending = false;
	                $scope.currentElement.updated = false;
	                $scope.currentElement.failed = true;
	            });
	        }
	    };
	
	    $scope.removeEvent = function () {
	
	        var dhis2Event = ContextMenuSelectedItem.getSelectedItem();
	
	        var modalOptions = {
	            closeButtonText: 'cancel',
	            actionButtonText: 'remove',
	            headerText: 'remove',
	            bodyText: 'are_you_sure_to_remove_with_audit'
	        };
	
	        ModalService.showModal({}, modalOptions).then(function (result) {
	
	            DHIS2EventFactory.delete(dhis2Event).then(function (data) {
	
	                $scope.currentFileNames = {};
	                delete $scope.fileNames[$scope.currentEvent.event];
	                var continueLoop = true,
	                    index = -1;
	                for (var i = 0; i < $scope.dhis2Events.length && continueLoop; i++) {
	                    if ($scope.dhis2Events[i].event === dhis2Event.event) {
	                        $scope.dhis2Events[i] = dhis2Event;
	                        continueLoop = false;
	                        index = i;
	                    }
	                }
	                $scope.dhis2Events.splice(index, 1);
	                $scope.currentEvent = {};
	                $scope.fileNames['SINGLE_EVENT'] = {};
	            }, function (error) {
	
	                //temporarily error message because of new audit functionality
	                var dialogOptions = {
	                    headerText: 'error',
	                    bodyText: 'delete_error_audit'
	                };
	                DialogService.showDialog({}, dialogOptions);
	            });
	        });
	    };
	
	    $scope.getExportList = function (format) {
	
	        var deferred = $q.defer();
	        var fieldsToExport = $filter('filter')($scope.eventGridColumns, { show: true });
	        var idList = ["programStage", "orgUnit", "program", "event", "status", "eventDate", "created"];
	        var eventsJSON = [];
	        var eventsJSONIndex = -1;
	        var dataValuesJSON;
	        var headers = [];
	        var row;
	        var rowXML;
	        var eventsCSV = [];
	        var eventsXML = '';
	        var nameToIdMap = {};
	        var emptyRow = [];
	        if (!format || $scope.model.exportFormats.indexOf(format) === -1) {
	            return;
	        }
	        format = format.toLowerCase();
	
	        eventsCSV[0] = angular.copy(idList);
	
	        for (var ind = 0; ind < fieldsToExport.length; ind++) {
	            emptyRow[ind] = null;
	            nameToIdMap[fieldsToExport[ind].id] = fieldsToExport[ind].displayName;
	        }
	
	        initExportList();
	
	        /*Get All the events list from the server*/
	        DHIS2EventFactory.getByStage($scope.selectedOrgUnit.id, $scope.selectedProgramStage.id, $scope.attributeCategoryUrl, true).then(function (data) {
	
	            if (angular.isObject(data.events)) {
	                angular.forEach(data.events, function (event) {
	                    ++eventsJSONIndex;
	                    eventsJSON[eventsJSONIndex] = {};
	                    row = angular.copy(emptyRow);
	                    rowXML = angular.copy(emptyRow);
	                    if (format === 'xml') {
	                        eventsXML += '<event>';
	                    }
	                    dataValuesJSON = [];
	                    angular.forEach(event.dataValues, function (dataValue) {
	                        if ($scope.prStDes[dataValue.dataElement]) {
	                            var val = dataValue.value;
	                            if (angular.isObject($scope.prStDes[dataValue.dataElement].dataElement)) {
	                                val = CommonUtils.formatDataValue(null, val, $scope.prStDes[dataValue.dataElement].dataElement, $scope.optionSets, 'USER');
	                            }
	                            event[dataValue.dataElement] = val;
	
	                            insertDataValueToRow(dataValue.dataElement, val);
	                        }
	                    });
	
	                    event.eventDate = DateUtils.formatFromApiToUser(event.eventDate);
	                    event['eventDate'] = event.eventDate;
	
	                    event.created = DateUtils.formatFromApiToUser(event.created);
	                    event['created'] = event.created;
	
	                    if (format === 'xml' || format === 'csv') {
	                        insertItemToRow(event, 'programStage');
	                        insertItemToRow(event, 'orgUnit');
	                        insertItemToRow(event, 'program');
	                        insertItemToRow(event, 'event');
	                        insertItemToRow(event, 'status');
	                        insertItemToRow(event, 'eventDate');
	                        insertItemToRow(event, 'created');
	                        insertRowToExportList();
	                    } else if (format === 'json') {
	                        if (event['programStage']) {
	                            eventsJSON[eventsJSONIndex]['programStage'] = event['programStage'];
	                        }
	                        if (event['orgUnit']) {
	                            eventsJSON[eventsJSONIndex]['orgUnit'] = event['orgUnit'];
	                        }
	                        if (event['program']) {
	                            eventsJSON[eventsJSONIndex]['program'] = event['program'];
	                        }
	                        if (event['event']) {
	                            eventsJSON[eventsJSONIndex]['event'] = event['event'];
	                        }
	                        if (event['status']) {
	                            eventsJSON[eventsJSONIndex]['status'] = event['status'];
	                        }
	                        if (event['eventDate']) {
	                            eventsJSON[eventsJSONIndex]['eventDate'] = event['eventDate'];
	                        }
	
	                        if (dataValuesJSON.length > 0) {
	                            eventsJSON[eventsJSONIndex]["dataValues"] = dataValuesJSON;
	                        }
	                    }
	                    delete event.dataValues;
	                });
	
	                if (format === 'xml') {
	                    eventsXML += '</events>';
	                }
	            }
	
	            if (format === 'json') {
	                saveFile(format, JSON.stringify({ "events": eventsJSON }));
	            } else if (format === 'xml') {
	                saveFile(format, eventsXML);
	            } else if (format === 'csv') {
	                deferred.resolve(eventsCSV);
	            }
	        });
	
	        function saveFile(format, data) {
	            var fileName = "eventList." + format; // any file name with any extension
	            var a = document.createElement('a');
	            var blob, url;
	            a.style = "display: none";
	            blob = new Blob(['' + data], { type: "octet/stream", endings: 'native' });
	            url = window.URL.createObjectURL(blob);
	            a.href = url;
	            a.download = fileName;
	            document.body.appendChild(a);
	            a.click();
	            setTimeout(function () {
	                document.body.removeChild(a);
	                window.URL.revokeObjectURL(url);
	            }, 300);
	        }
	
	        function initExportList() {
	            var item, id;
	            for (var index = 0; index < fieldsToExport.length; index++) {
	                item = fieldsToExport[index];
	                id = item.id === "uid" ? "event" : item.id;
	                if (idList.indexOf(id) === -1) {
	                    idList.push(id);
	                    eventsCSV[0].push(item.displayName);
	                }
	                if (format === 'json') {
	                    headers.push({
	                        "name": item.displayName
	                    });
	                }
	            }
	            if (format === 'xml') {
	                eventsXML += '<events>';
	            }
	        }
	
	        function insertDataValueToRow(dataElement, value) {
	            var index = idList.indexOf(dataElement);
	            if (index > -1) {
	                if (format === 'xml' || format === 'csv') {
	                    row[index] = { value: value, dataElement: dataElement, isDataValue: true };
	                } else if (format === 'json') {
	                    dataValuesJSON.push(value);
	                }
	            }
	        }
	
	        function insertItemToRow(item, name) {
	            var index = idList.indexOf(name);
	            if (index > -1) {
	                if (format === 'xml' || format === 'csv') {
	                    row[index] = { value: item[name], dataElement: name, isDataValue: false };
	                }
	            }
	        }
	
	        function insertRowToExportList() {
	            var dataValues = '';
	            var csvRow = [];
	            for (var index = 0; index < row.length; index++) {
	                if (row[index]) {
	                    if (format === 'xml') {
	                        if (row[index].isDataValue) {
	                            if (dataValues.length === 0) {
	                                dataValues += '<datavalues>';
	                            }
	                            dataValues += '<dataValue dataElementId="' + row[index].dataElement + '" ' + 'dataElementName="' + nameToIdMap[row[index].dataElement] + '" ' + 'value="' + row[index].value + '"/>';
	                        } else {
	                            eventsXML += '<' + row[index].dataElement + '>' + row[index].value + '</' + row[index].dataElement + '>';
	                        }
	                    } else if (format === 'csv') {
	                        csvRow.push(row[index].value);
	                    }
	                } else {
	                    if (format === 'csv') {
	                        csvRow.push(null);
	                    }
	                }
	            }
	            if (format === 'csv') {
	                eventsCSV.push(csvRow);
	            }
	
	            if (format === 'xml') {
	                if (dataValues.length > 0) {
	                    eventsXML += dataValues + '</datavalues>';
	                }
	                eventsXML += '</event>';
	            }
	        }
	
	        return deferred.promise;
	    };
	
	    $scope.showNotes = function (_dhis2Event) {
	
	        var modalInstance = $modal.open({
	            templateUrl: 'views/notes.html',
	            controller: 'NotesController',
	            resolve: {
	                dhis2Event: function dhis2Event() {
	                    return _dhis2Event;
	                }
	            }
	        });
	
	        modalInstance.result.then(function () {});
	    };
	
	    $scope.getHelpContent = function () {};
	
	    $scope.showAuditHistory = function () {
	
	        var dhis2Event = ContextMenuSelectedItem.getSelectedItem();
	
	        var modalInstance = $modal.open({
	            templateUrl: './templates/audit-history.html',
	            controller: 'AuditHistoryController',
	            resolve: {
	                eventId: function eventId() {
	                    return dhis2Event.event;
	                },
	                dataType: function dataType() {
	                    return 'dataElement';
	                },
	                nameIdMap: function nameIdMap() {
	                    return $scope.prStDes;
	                },
	                optionSets: function optionSets() {
	                    return $scope.optionSets;
	                }
	            }
	        });
	
	        modalInstance.result.then(function () {}, function () {});
	    };
	
	    $scope.formIsChanged = function () {
	        var isChanged = false;
	        var emptyForm = $scope.formIsEmpty();
	        for (var i = 0; i < $scope.selectedProgramStage.programStageDataElements.length && !isChanged; i++) {
	            var deId = $scope.selectedProgramStage.programStageDataElements[i].dataElement.id;
	            if ($scope.currentEventOriginialValue[deId] !== $scope.currentEvent[deId]) {
	                if ($scope.currentEvent[deId] || $scope.currentEventOriginialValue[deId] !== "" && !emptyForm) {
	                    isChanged = true;
	                }
	            }
	        }
	        if (!isChanged) {
	            if ($scope.currentEvent.eventDate !== $scope.currentEventOriginialValue.eventDate || $scope.currentEvent.status !== $scope.currentEventOriginialValue.status) {
	                isChanged = true;
	            }
	        }
	
	        return isChanged;
	    };
	
	    $scope.isFormInvalid = function () {
	
	        if ($scope.outerForm.submitted) {
	            return $scope.outerForm.$invalid;
	        }
	
	        if ($scope.model.invalidDate) {
	            return true;
	        }
	
	        if (!$scope.outerForm.$dirty) {
	            return false;
	        }
	
	        var formIsInvalid = false;
	        for (var k in $scope.outerForm.$error) {
	            if (angular.isObject($scope.outerForm.$error[k])) {
	
	                for (var i = 0; i < $scope.outerForm.$error[k].length && !formIsInvalid; i++) {
	                    if ($scope.outerForm.$error[k][i].$dirty && $scope.outerForm.$error[k][i].$invalid) {
	                        formIsInvalid = true;
	                    }
	                }
	            }
	
	            if (formIsInvalid) {
	                break;
	            }
	        }
	
	        return formIsInvalid;
	    };
	
	    $scope.formIsEmpty = function () {
	        for (var dataElement in $scope.prStDes) {
	            if ($scope.currentEvent[dataElement]) {
	                return false;
	            }
	        }
	        return true;
	    };
	
	    //watch for event editing
	    $scope.$watchCollection('[editingEventInFull, eventRegistration]', function () {
	        if ($scope.editingEventInFull || $scope.eventRegistration) {
	            //Disable ou selection while in editing mode
	            $("#orgUnitTree").addClass("disable-clicks");
	        } else {
	            //enable ou selection if not in editing mode
	            $("#orgUnitTree").removeClass("disable-clicks");
	        }
	    });
	
	    $scope.interacted = function (field) {
	        var status = false;
	        if (field) {
	            status = $scope.outerForm.submitted || field.$dirty;
	        }
	        return status;
	    };
	
	    //listen for rule effect changes    
	    $scope.$on('ruleeffectsupdated', function (event, args) {
	        $scope.warningMessages = [];
	        $scope.warningMessagesOnComplete = [];
	        $scope.errorMessagesOnComplete = [];
	        $scope.hiddenSections = [];
	        $scope.hiddenFields = [];
	        $scope.assignedFields = [];
	        $scope.displayTextEffects = [];
	
	        if ($rootScope.ruleeffects[args.event]) {
	            //Establish which event was affected:
	            var affectedEvent = $scope.currentEvent;
	            //In most cases the updated effects apply to the current event. In case the affected event is not the current event, fetch the correct event to affect:
	            if (args.event !== affectedEvent.event) {
	                angular.forEach($scope.currentStageEvents, function (searchedEvent) {
	                    if (searchedEvent.event === args.event) {
	                        affectedEvent = searchedEvent;
	                    }
	                });
	            }
	            angular.forEach($rootScope.ruleeffects[args.event], function (effect) {
	
	                if (effect.ineffect) {
	                    //in the data entry controller we only care about the "hidefield" actions
	                    if (effect.action === "HIDEFIELD") {
	                        if (effect.dataElement) {
	                            if (affectedEvent[effect.dataElement.id]) {
	                                //If a field is going to be hidden, but contains a value, we need to take action;
	                                if (effect.content) {
	                                    //TODO: Alerts is going to be replaced with a proper display mecanism.
	                                    alert(effect.content);
	                                } else {
	                                    //TODO: Alerts is going to be replaced with a proper display mecanism.
	                                    alert($scope.prStDes[effect.dataElement.id].dataElement.displayFormName + " was blanked out and hidden by your last action");
	                                }
	
	                                //Blank out the value:
	                                affectedEvent[effect.dataElement.id] = "";
	                            }
	
	                            $scope.hiddenFields[effect.dataElement.id] = effect.ineffect;
	                        } else {
	                            $log.warn("ProgramRuleAction " + effect.id + " is of type HIDEFIELD, bot does not have a dataelement defined");
	                        }
	                    } else if (effect.action === "HIDESECTION") {
	                        if (effect.programStageSection) {
	                            $scope.hiddenSections[effect.programStageSection] = effect.programStageSection;
	                        }
	                    } else if (effect.action === "SHOWERROR" || effect.action === "ERRORONCOMPLETE") {
	
	                        var message = effect.content + (effect.data ? effect.data : "");
	
	                        if (effect.dataElement && effect.dataElement.id && effect.action === "SHOWERROR") {
	                            message = $scope.prStDes[effect.dataElement.id].dataElement.displayFormName + ": " + message;
	                            $scope.currentEvent[effect.dataElement.id] = $scope.currentEventOriginialValue[effect.dataElement.id];
	                            var dialogOptions = {
	                                headerText: 'validation_error',
	                                bodyText: message
	                            };
	                            DialogService.showDialog({}, dialogOptions);
	                        }
	
	                        $scope.errorMessagesOnComplete.push(message);
	                    } else if (effect.action === "SHOWWARNING" || effect.action === "WARNINGONCOMPLETE") {
	                        if (effect.action === "SHOWWARNING") {
	                            $scope.warningMessages.push(effect.content + (effect.data ? effect.data : ""));
	                        }
	                        $scope.warningMessagesOnComplete.push(effect.content + (effect.data ? effect.data : ""));
	                    } else if (effect.action === "ASSIGN") {
	                        var processedValue = effect.data;
	
	                        //For "ASSIGN" actions where we have a dataelement, we save the calculated value to the dataelement:
	                        if ($scope.prStDes[effect.dataElement.id].dataElement.optionSet) {
	                            processedValue = OptionSetService.getName($scope.optionSets[$scope.prStDes[effect.dataElement.id].dataElement.optionSet.id].options, processedValue);
	                        }
	                        processedValue = processedValue === "true" ? true : processedValue;
	                        processedValue = processedValue === "false" ? false : processedValue;
	
	                        affectedEvent[effect.dataElement.id] = processedValue;
	                        $scope.assignedFields[effect.dataElement.id] = true;
	                    } else if (effect.action === "DISPLAYKEYVALUEPAIR") {
	                        $scope.displayTextEffects.push({ name: effect.content, text: effect.data });
	                    } else if (effect.action === "DISPLAYTEXT") {
	                        $scope.displayTextEffects.push({ text: effect.data + effect.content });
	                    }
	                }
	            });
	        }
	    });
	
	    $scope.executeRules = function () {
	        $scope.currentEvent.event = !$scope.currentEvent.event ? 'SINGLE_EVENT' : $scope.currentEvent.event;
	        var flags = { debug: true, verbose: false };
	        TrackerRulesExecutionService.loadAndExecuteRulesScope($scope.currentEvent, $scope.selectedProgram.id, $scope.selectedProgramStage.id, $scope.prStDes, $scope.optionSets, $scope.selectedOrgUnit.id, flags);
	    };
	
	    $scope.formatNumberResult = function (val) {
	        return dhis2.validation.isNumber(val) ? new Number(val) : '';
	    };
	
	    $scope.toTwoDecimals = function (val) {
	        //Round data to two decimals if it is a number:
	        if (dhis2.validation.isNumber(val)) {
	            val = Math.round(val * 100) / 100;
	        }
	
	        return val;
	    };
	
	    //check if field is hidden
	    $scope.isHidden = function (id) {
	        //In case the field contains a value, we cant hide it. 
	        //If we hid a field with a value, it would falsely seem the user was aware that the value was entered in the UI.
	        if ($scope.currentEvent[id]) {
	            return false;
	        } else {
	            return $scope.hiddenFields[id];
	        }
	    };
	
	    $scope.saveDatavalue = function () {
	        $scope.executeRules();
	    };
	
	    $scope.saveDatavalueRadio = function (prStDe, event, value) {
	        var id = prStDe.dataElement ? prStDe.dataElement.id : prStDe.id;
	        event[id] = value;
	        $scope.executeRules();
	    };
	
	    $scope.saveCurrentEventStatus = function (status) {
	        $scope.currentEvent.status = status;
	    };
	
	    $scope.getInputNotifcationClass = function (id, custom) {
	        if ($scope.currentElement.id && $scope.currentElement.id === id) {
	            if ($scope.currentElement.pending) {
	                if (custom) {
	                    return 'input-pending';
	                }
	                return 'form-control input-pending';
	            }
	            if ($scope.currentElement.updated) {
	                if (custom) {
	                    return 'input-success';
	                }
	                return 'form-control input-success';
	            }
	            if ($scope.currentElement.failed) {
	                if (custom) {
	                    return 'input-error';
	                }
	                return 'form-control input-error';
	            }
	        }
	        if (custom) {
	            return '';
	        }
	        return 'form-control';
	    };
	
	    $scope.getClickFunction = function (dhis2Event, column) {
	
	        if (column.id === 'comment') {
	            return "showNotes(" + dhis2Event + ")";
	        } else {
	            if (dhis2Event.event === $scope.currentEvent.event) {
	                return '';
	            } else {
	                return "showEventList(" + dhis2Event + ")";
	            }
	        }
	        return '';
	    };
	
	    $scope.downloadFile = function (eventUid, dataElementUid, e) {
	        eventUid = eventUid ? eventUid : $scope.currentEvent.event ? $scope.currentEvent.event : null;
	        if (!eventUid || !dataElementUid) {
	
	            var dialogOptions = {
	                headerText: 'error',
	                bodyText: 'missing_file_identifier'
	            };
	
	            DialogService.showDialog({}, dialogOptions);
	            return;
	        }
	
	        $window.open(DHIS2URL + '/events/files?eventUid=' + eventUid + '&dataElementUid=' + dataElementUid, '_blank', '');
	        if (e) {
	            e.stopPropagation();
	            e.preventDefault();
	        }
	    };
	
	    $scope.deleteFile = function (dataElement) {
	
	        if (!dataElement) {
	            var dialogOptions = {
	                headerText: 'error',
	                bodyText: 'missing_file_identifier'
	            };
	            DialogService.showDialog({}, dialogOptions);
	            return;
	        }
	
	        var modalOptions = {
	            closeButtonText: 'cancel',
	            actionButtonText: 'remove',
	            headerText: 'remove',
	            bodyText: 'are_you_sure_to_remove'
	        };
	
	        ModalService.showModal({}, modalOptions).then(function (result) {
	            delete $scope.fileNames[$scope.currentEvent.event][dataElement];
	            $scope.currentEvent[dataElement] = null;
	            $scope.updateEventDataValue(dataElement);
	        });
	    };
	
	    $scope.updateFileNames = function () {
	        for (var dataElement in $scope.currentFileNames) {
	            if ($scope.currentFileNames[dataElement]) {
	                if (!$scope.fileNames[$scope.currentEvent.event]) {
	                    $scope.fileNames[$scope.currentEvent.event] = {};
	                }
	                $scope.fileNames[$scope.currentEvent.event][dataElement] = $scope.currentFileNames[dataElement];
	            }
	        }
	    };
	
	    $scope.filterTextExist = function () {
	        return angular.equals($scope.filterText, $scope.emptyFilterText);
	    };
	}]);
	
	eventCapture.controller('NotesController', ["$scope", "$modalInstance", "dhis2Event", function ($scope, $modalInstance, dhis2Event) {
	
	    $scope.dhis2Event = dhis2Event;
	
	    $scope.close = function () {
	        $modalInstance.close();
	    };
	}]);

/***/ },
/* 17 */
/***/ function(module, exports) {

	'use strict';
	
	(function (window, document) {
	
	  // Create all modules and define dependencies to make sure they exist
	  // and are loaded in the correct order to satisfy dependency injection
	  // before all nested files are concatenated by Grunt
	
	  // Config
	  angular.module('ngCsv.config', []).value('ngCsv.config', {
	    debug: true
	  }).config(['$compileProvider', function ($compileProvider) {
	    if (angular.isDefined($compileProvider.urlSanitizationWhitelist)) {
	      $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|data):/);
	    } else {
	      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|data):/);
	    }
	  }]);
	
	  // Modules
	  angular.module('ngCsv.directives', ['ngCsv.services']);
	  angular.module('ngCsv.services', []);
	  angular.module('ngCsv', ['ngCsv.config', 'ngCsv.services', 'ngCsv.directives', 'ngSanitize']);
	
	  // Common.js package manager support (e.g. ComponentJS, WebPack)
	  if (typeof module !== 'undefined' && typeof exports !== 'undefined' && module.exports === exports) {
	    module.exports = 'ngCsv';
	  }
	  /**
	   * Created by asafdav on 15/05/14.
	   */
	  angular.module('ngCsv.services').service('CSV', ['$q', function ($q) {
	
	    var EOL = '\r\n';
	    var BOM = '\uFEFF';
	
	    var specialChars = {
	      '\\t': '\t',
	      '\\b': '\b',
	      '\\v': '\v',
	      '\\f': '\f',
	      '\\r': '\r'
	    };
	
	    /**
	     * Stringify one field
	     * @param data
	     * @param options
	     * @returns {*}
	     */
	    this.stringifyField = function (data, options) {
	      if (options.decimalSep === 'locale' && this.isFloat(data)) {
	        return data.toLocaleString();
	      }
	
	      if (options.decimalSep !== '.' && this.isFloat(data)) {
	        return data.toString().replace('.', options.decimalSep);
	      }
	
	      if (typeof data === 'string') {
	        data = data.replace(/"/g, '""'); // Escape double qoutes
	
	        if (options.quoteStrings || data.indexOf(',') > -1 || data.indexOf('\n') > -1 || data.indexOf('\r') > -1) {
	          data = options.txtDelim + data + options.txtDelim;
	        }
	
	        return data;
	      }
	
	      if (typeof data === 'boolean') {
	        return data ? 'TRUE' : 'FALSE';
	      }
	
	      return data;
	    };
	
	    /**
	     * Helper function to check if input is float
	     * @param input
	     * @returns {boolean}
	     */
	    this.isFloat = function (input) {
	      return +input === input && (!isFinite(input) || Boolean(input % 1));
	    };
	
	    /**
	     * Creates a csv from a data array
	     * @param data
	     * @param options
	     *  * header - Provide the first row (optional)
	     *  * fieldSep - Field separator, default: ',',
	     *  * addByteOrderMarker - Add Byte order mark, default(false)
	     * @param callback
	     */
	    this.stringify = function (data, options) {
	      var def = $q.defer();
	
	      var that = this;
	      var csv = "";
	      var csvContent = "";
	
	      var dataPromise = $q.when(data).then(function (responseData) {
	        //responseData = angular.copy(responseData);//moved to row creation
	        // Check if there's a provided header array
	        if (angular.isDefined(options.header) && options.header) {
	          var encodingArray, headerString;
	
	          encodingArray = [];
	          angular.forEach(options.header, function (title, key) {
	            this.push(that.stringifyField(title, options));
	          }, encodingArray);
	
	          headerString = encodingArray.join(options.fieldSep ? options.fieldSep : ",");
	          csvContent += headerString + EOL;
	        }
	
	        var arrData = [];
	
	        if (angular.isArray(responseData)) {
	          arrData = responseData;
	        } else if (angular.isFunction(responseData)) {
	          arrData = responseData();
	        }
	
	        // Check if using keys as labels
	        if (angular.isDefined(options.label) && options.label && typeof options.label === 'boolean') {
	          var labelArray, labelString;
	
	          labelArray = [];
	          angular.forEach(arrData[0], function (value, label) {
	            this.push(that.stringifyField(label, options));
	          }, labelArray);
	          labelString = labelArray.join(options.fieldSep ? options.fieldSep : ",");
	          csvContent += labelString + EOL;
	        }
	
	        angular.forEach(arrData, function (oldRow, index) {
	          var row = angular.copy(arrData[index]);
	          var dataString, infoArray;
	
	          infoArray = [];
	
	          var iterator = !!options.columnOrder ? options.columnOrder : row;
	          angular.forEach(iterator, function (field, key) {
	            var val = !!options.columnOrder ? row[field] : field;
	            this.push(that.stringifyField(val, options));
	          }, infoArray);
	
	          dataString = infoArray.join(options.fieldSep ? options.fieldSep : ",");
	          csvContent += index < arrData.length ? dataString + EOL : dataString;
	        });
	
	        // Add BOM if needed
	        if (options.addByteOrderMarker) {
	          csv += BOM;
	        }
	
	        // Append the content and resolve.
	        csv += csvContent;
	        def.resolve(csv);
	      });
	
	      if (typeof dataPromise['catch'] === 'function') {
	        dataPromise['catch'](function (err) {
	          def.reject(err);
	        });
	      }
	
	      return def.promise;
	    };
	
	    /**
	     * Helper function to check if input is really a special character
	     * @param input
	     * @returns {boolean}
	     */
	    this.isSpecialChar = function (input) {
	      return specialChars[input] !== undefined;
	    };
	
	    /**
	     * Helper function to get what the special character was supposed to be
	     * since Angular escapes the first backslash
	     * @param input
	     * @returns {special character string}
	     */
	    this.getSpecialChar = function (input) {
	      return specialChars[input];
	    };
	  }]);
	  /**
	   * ng-csv module
	   * Export Javascript's arrays to csv files from the browser
	   *
	   * Author: asafdav - https://github.com/asafdav
	   */
	  angular.module('ngCsv.directives').directive('ngCsv', ['$parse', '$q', 'CSV', '$document', '$timeout', function ($parse, $q, CSV, $document, $timeout) {
	    return {
	      restrict: 'AC',
	      scope: {
	        data: '&ngCsv',
	        filename: '@filename',
	        header: '&csvHeader',
	        columnOrder: '&csvColumnOrder',
	        txtDelim: '@textDelimiter',
	        decimalSep: '@decimalSeparator',
	        quoteStrings: '@quoteStrings',
	        fieldSep: '@fieldSeparator',
	        lazyLoad: '@lazyLoad',
	        addByteOrderMarker: "@addBom",
	        ngClick: '&',
	        charset: '@charset',
	        label: '&csvLabel'
	      },
	      controller: ['$scope', '$element', '$attrs', '$transclude', function ($scope, $element, $attrs, $transclude) {
	        $scope.csv = '';
	
	        if (!angular.isDefined($scope.lazyLoad) || $scope.lazyLoad != "true") {
	          if (angular.isArray($scope.data)) {
	            $scope.$watch("data", function (newValue) {
	              $scope.buildCSV();
	            }, true);
	          }
	        }
	
	        $scope.getFilename = function () {
	          return $scope.filename || 'download.csv';
	        };
	
	        function getBuildCsvOptions() {
	          var options = {
	            txtDelim: $scope.txtDelim ? $scope.txtDelim : '"',
	            decimalSep: $scope.decimalSep ? $scope.decimalSep : '.',
	            quoteStrings: $scope.quoteStrings,
	            addByteOrderMarker: $scope.addByteOrderMarker
	          };
	          if (angular.isDefined($attrs.csvHeader)) options.header = $scope.$eval($scope.header);
	          if (angular.isDefined($attrs.csvColumnOrder)) options.columnOrder = $scope.$eval($scope.columnOrder);
	          if (angular.isDefined($attrs.csvLabel)) options.label = $scope.$eval($scope.label);
	
	          options.fieldSep = $scope.fieldSep ? $scope.fieldSep : ",";
	
	          // Replaces any badly formatted special character string with correct special character
	          options.fieldSep = CSV.isSpecialChar(options.fieldSep) ? CSV.getSpecialChar(options.fieldSep) : options.fieldSep;
	
	          return options;
	        }
	
	        /**
	         * Creates the CSV and updates the scope
	         * @returns {*}
	         */
	        $scope.buildCSV = function () {
	          var deferred = $q.defer();
	
	          $element.addClass($attrs.ngCsvLoadingClass || 'ng-csv-loading');
	
	          CSV.stringify($scope.data(), getBuildCsvOptions()).then(function (csv) {
	            $scope.csv = csv;
	            $element.removeClass($attrs.ngCsvLoadingClass || 'ng-csv-loading');
	            deferred.resolve(csv);
	          });
	          $scope.$apply(); // Old angular support
	
	          return deferred.promise;
	        };
	      }],
	      link: function link(scope, element, attrs) {
	        function doClick() {
	          var charset = scope.charset || "utf-8";
	          var blob = new Blob([scope.csv], {
	            type: "text/csv;charset=" + charset + ";"
	          });
	
	          if (window.navigator.msSaveOrOpenBlob) {
	            navigator.msSaveBlob(blob, scope.getFilename());
	          } else {
	
	            var downloadContainer = angular.element('<div data-tap-disabled="true"><a></a></div>');
	            var downloadLink = angular.element(downloadContainer.children()[0]);
	            downloadLink.attr('href', window.URL.createObjectURL(blob));
	            downloadLink.attr('download', scope.getFilename());
	            downloadLink.attr('target', '_blank');
	
	            $document.find('body').append(downloadContainer);
	            $timeout(function () {
	              downloadLink[0].click();
	              downloadLink.remove();
	            }, null);
	          }
	        }
	
	        element.bind('click', function (e) {
	          scope.buildCSV().then(function (csv) {
	            doClick();
	          });
	          scope.$apply();
	        });
	      }
	    };
	  }]);
	})(window, document);

/***/ }
/******/ ]);
//# sourceMappingURL=app-79e629c341447de1dd88.js.map