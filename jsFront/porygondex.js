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
                controller: "pokedexController"
            }
        }
    })
    .state('pokemon', {
        url: "/pokemon/{no_national}",
        views: {
            'body': {
                templateUrl: "html/pokemon.html",
                controller: "pokemonController"
            }
        }
    })
    .state('home', {
        url: "/",
        views : {
            'body' : {
                templateUrl: "html/home.html",
                controller: "homeController"
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

porygondex.controller("homeController", function($scope) {
    $scope.$emit("headerClicked", "home");
});

//Pour controller le pokedex
porygondex.controller('pokedexController', function($scope, $timeout, $http, pokedexSave) {
    $scope.$emit("headerClicked", "pokedex");

    $scope.pokemons = [];
    $scope.searchopen = false;
    $scope.loading = true;
    $scope.types = ["Normal", "Feu", "Eau", "Plante", "Electrique", "Glace", "Combat", "Poison", "Sol", "Vol", "Psy", "Insecte", "Roche", "Spectre", "Dragon", "Ténèbres", "Acier", "Fée"];

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
                type = (value.type1 == pokemon.type1 || (pokemon.type2 != null && value.type1 == pokemon.type2)) || !value.type1;
                doubleType = ((value.type2 == pokemon.type1 || (pokemon.type2 != null && value.type2 == pokemon.type2)) || !value.type2) || (value.type2 == -1 && !pokemon.type2);
            }
            else{
                if(value.type1 == "" && value.type2 == ""){
                    type = false;
                }
                else{
                    type = (value.type1 == pokemon.type1 || (pokemon.type2 != null && value.type1 == pokemon.type2)) || !value.type1;
                    doubleType = ((value.type2 == pokemon.type1 || (pokemon.type2 != null && value.type2 == pokemon.type2)) || !value.type2) || (value.type2 == -1 && !pokemon.type2);
                }
            }
            resType = resType || (type && doubleType);
        });

        //Les génération
        var g = true;

        if(!$scope.g1Query && pokemon._id < 152){
            g = false;
        }
        if(!$scope.g2Query && pokemon._id > 151 && pokemon._id < 252){
            g = false;
        }
        if(!$scope.g3Query && pokemon._id > 251 && pokemon._id < 387){
            g = false;
        }
        if(!$scope.g4Query && pokemon._id > 386 && pokemon._id < 494){
            g = false;
        }
        if(!$scope.g5Query && pokemon._id > 493 && pokemon._id < 650){
            g = false;
        }
        if(!$scope.g6Query && pokemon._id > 649){
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

    $scope.titre = {
        name: 'PorygonDex',
        url: 'home',
        isClicked: false
    };

    $scope.menus = [{
        name: 'Pokédex',
        url: 'pokedex',
        isClicked: false
    }];

    $scope.$on('headerClicked', function (event, data) {
        if(data == 'home'){
            $scope.titre.isClicked = true;
            angular.forEach($scope.menus, function(menu, key){
                menu.isClicked = false;
            });
        }
        else{
            $scope.titre.isClicked = false;
            angular.forEach($scope.menus, function(menu, key){
                if(menu.url == data){
                    menu.isClicked = true;
                }
                else{
                    menu.isClicked = true;
                }
            });
        }
    });

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

//Pour controller le pokedex
porygondex.controller('pokemonController', function($scope, $stateParams, $http) {
    $scope.$emit("headerClicked", "pokedex");
    $scope.no_national = $stateParams.no_national;

    $http.get('/api/v1/pokemon/'+$scope.no_national)
        .success(function(data) {
            $scope.pokemon = data;

            $http.get('/api/v1/pokemon/pre_evo/'+$scope.no_national)
                .success(function(data) {
                    $scope.pokemon.evolutions = data;

                    angular.forEach(data, function(evolution, key){
                        console.log(evolution);
                        $http.get('/api/v1/pokemon/pre_evo/'+evolution._id)
                            .success(function(data){
                                evolution.evolutions = data;
                            })
                            .error(function(data){

                            });
                    });

                    
                })
                .error(function(data) {
                    //console.log('Error: ' + data);
                });

        })
        .error(function(data) {
            //console.log('Error: ' + data);
        });
    
});