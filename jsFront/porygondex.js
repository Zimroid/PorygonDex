var porygondex = angular.module('porygondex', ['ui.router']);

// configure les routes
porygondex.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/");

    $stateProvider
    .state('pokedex', {
        url: "/pokedex",
        views: {
            'body': {
                templateUrl: "html/pokedex.html",
                controller: 'pokedexController'
            }
        }
    })
    .state('home', {
        url: "/",
        views : {
            'body' : {
                // pas besoin de controller
                templateUrl: "html/home.html"
            }
        }
    })
});


//On sauvegarde les parametres de recherche
porygondex.factory('pokedexSave', [function(){

    var pokedexSave = false;
    var searchParam = {nameFr:"",nameEn:"",types:[], gQuery:[true, true, true, true, true, true]};

    return {

        set: function(value) {
            pokedexSave = value;
        },

        get: function() {
            return pokedexSave;
        },

        setSearchParam: function(search) {
            searchParam = search;
        },

        getSearchParam: function() {
            return searchParam;
        }
    };


}]);

//Pour controller le pokedex
porygondex.controller('pokedexController', function($scope, $timeout, $stateParams, $http, pokedexSave) {
    $scope.lang = $stateParams.lang;
    $scope.pokemons = [];
    $scope.searchopen = false;
    $scope.loading = true;

    if(!pokedexSave.get()){
        $http.get('/api/v1/pokemon')
            .success(function(data) {
                pokedexSave.set(data);
                $scope.pokemons = data;
            })
            .error(function(data) {
                //console.log('Error: ' + data);
            });
    }
    else{
        $scope.pokemons = pokedexSave.get();
    }

    //Permet de "déplier" le service de recherche
    $scope.switchSearch = function(s) {
        $scope.searchopen = !s;
        $scope.loading = false;
    }

    //Le mega filtre de recherche, permet de savoir si le pokemon mis en parametre correspond aux criteres de recherche
    $scope.search = function (pokemon) {
        //Les noms
        var nameEn = (pokemon.name_en.toUpperCase().indexOf($scope.nameEnQuery ? $scope.nameEnQuery.toUpperCase() : '') !== -1);// && !$scope.nameFrQuery;
        var nameFr = (pokemon.name_fr.toUpperCase().indexOf($scope.nameFrQuery ? $scope.nameFrQuery.toUpperCase() : '') !== -1);// && !$scope.nameEnQuery;
        var name = nameEn && nameFr;

        //Les types
        var resType = true;

        angular.forEach($scope.typesSelected, function(value, key) {
            var type = true;
            var doubleType = true;
            //console.log(key);
            if(key == 0){
                resType = false;
                type = (value.type1 == pokemon.type1._id || (pokemon.type2 && value.type1 == pokemon.type2._id)) || !value.type1;
                doubleType = ((value.type2 == pokemon.type1._id || (pokemon.type2 && value.type2 == pokemon.type2._id)) || !value.type2) || (value.type2 == -1 && !pokemon.type2);
            }
            else{
                if(value.type1 == "" && value.type2 ==""){
                    type = false;
                }
                else{
                    type = (value.type1 == pokemon.type1._id || (pokemon.type2 && value.type1 == pokemon.type2._id)) || !value.type1;
                    doubleType = ((value.type2 == pokemon.type1._id || (pokemon.type2 && value.type2 == pokemon.type2._id)) || !value.type2) || (value.type2 == -1 && !pokemon.type2);
                }
            }
            resType = resType || (type && doubleType);
        });

        //Les génération
        var g = true;

        if(!$scope.g1Query && pokemon.no_national < 152){
            g = false;
        }
        if(!$scope.g2Query && pokemon.no_national > 151 && pokemon.no_national < 252){
            g = false;
        }
        if(!$scope.g3Query && pokemon.no_national > 251 && pokemon.no_national < 387){
            g = false;
        }
        if(!$scope.g4Query && pokemon.no_national > 386 && pokemon.no_national < 494){
            g = false;
        }
        if(!$scope.g5Query && pokemon.no_national > 493 && pokemon.no_national < 650){
            g = false;
        }
        if(!$scope.g6Query && pokemon.no_national > 649){
            g = false;
        }

        //On prend le tout et on sort le résultat
        return name && resType && g;
    };

    //Permet d'avoir une page plus grande que l'écran dans la cas d'une recherche avec peu de résultat
    $scope.isPokedexPage = function()
    {
        return true;
    };
    
});

//Le service de recherche
porygondex.directive('silphPanel', function($parse){
    return {
        restrict: 'A',
        templateUrl: 'html/silph.html',
        controller: function($scope, pokedexSave) {

            var searchParam = pokedexSave.getSearchParam();
            $scope.nameEnQuery = searchParam.nameEn;
            $scope.nameFrQuery = searchParam.nameFr;
            $scope.g1Query = searchParam.gQuery[0];
            $scope.g2Query = searchParam.gQuery[1];
            $scope.g3Query = searchParam.gQuery[2];
            $scope.g4Query = searchParam.gQuery[3];
            $scope.g5Query = searchParam.gQuery[4];
            $scope.g6Query = searchParam.gQuery[5];

            $scope.setNameEn = function(nameEn){
                searchParam.nameEn = nameEn;
                pokedexSave.setSearchParam(searchParam);
            }

            $scope.setNameFr = function(nameFr){
                searchParam.nameFr = nameFr;
                pokedexSave.setSearchParam(searchParam);
            }

            $scope.setG = function(index, value){
                searchParam.gQuery[index] = value;
                pokedexSave.setSearchParam(searchParam);
            }

        }
    };
});

//Ce qui permet de filtrer les types
porygondex.directive('typeSelector', function($parse){
    return {
        restrict: 'A',
        templateUrl: 'html/typeSelector.html',
        controller: function($scope, pokedexSave) {

            var searchParam = pokedexSave.getSearchParam();
            $scope.typesSelected = searchParam.types;

            $scope.addTypeFilter = function(){
                searchParam.types.push({type1:"",type2:""});
                pokedexSave.setSearchParam(searchParam);
                $scope.typesSelected = searchParam.types;
            }

            $scope.removeTypeFilter = function(index){
                searchParam.types.splice(index, 1);
                pokedexSave.setSearchParam(searchParam);
                $scope.typesSelected = searchParam.types;
            }


        }
    };
});

//Fixe la longueur des nombres à 3 (#1 devient #001)
porygondex.filter('numberFixedLen', function () {
    return function (n, len) {
        var num = parseInt(n, 10);
        len = parseInt(len, 10);
        if (isNaN(num) || isNaN(len)) {
            return n;
        }
        num = '' + num;
        while (num.length < len) {
            num = '0' + num;
        }
        return num;
    };
});

//Le menu
porygondex.directive('menuHeader', function($parse){
    return {
        restrict: 'A',
        templateUrl: 'html/header.html',
        controller: 'tabController'
    };
});


//Controle le menu
porygondex.controller('tabController', function($scope, $location) {

    var page = $location.url().split("/")[1] || '';

    $scope.titre = {
        name: 'PorygonDex',
        url: 'home',
        isClicked: page == ''
    };

    $scope.menus = [{
        name: 'Pokédex',
        url: 'pokedex',
        isClicked: page == 'pokedex'
    }];

    var oldSelected;
    
    if(page == "pokedex"){
        oldSelected = $scope.menus[0];
    }
    else if(page == "telechargement"){
        oldSelected = $scope.menus[1];
    }
    else{
        oldSelected = $scope.titre;
    }
  
    $scope.setTab = function(menu){
        if(oldSelected){
            oldSelected.isClicked = false;
        }
        
        menu.isClicked = true;
        oldSelected = menu;
    }
});

//Empeche le click souris de fonctionner comme un click gauche
porygondex.directive('leftClick', function($parse){
    return {
        restrict: 'A',
        link: function(scope, element, attrs){
            var parsedFn = $parse(attrs.leftClick);

            element.on('click', function(e){
                if(e.which === 1 ){
                    scope.$apply(function(){
                        parsedFn(scope, {$event: e});
                    });
                }
                /*else {
                    e.preventDefault();
                }*/
            });

        }
    };
});