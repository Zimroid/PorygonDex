var Pokemon = require('./models/pokemon');
var Type = require('./models/type');

module.exports = function(app) {
	// get all pokemon
	app.get('/api/v1/pokemon', function(req, res) {
		Pokemon.find({}, 'name_en name_fr type1 type2', {sort : '_id'}).exec(function(err, pokemon){
		    
		    if(err) {
	        	res.send(err);
	        }

	        res.charset = 'utf-8';
	   		res.contentType('text');

			res.json(pokemon); // return all pokemon in JSON format
	    });
	});

	// get a pokemon by no_national
	app.get('/api/v1/pokemon/:no', function(req, res) {
		Pokemon.findOne({"_id": req.params.no}, '-__v', {sort : '_id'}).populate("previous_evolution", "name_en name_fr type1 type2").exec(function(err, pokemon){
		    
		    if(err) {
	        	res.send(err);
	        }

	        res.charset = 'utf-8';
	   		res.contentType('text');

			res.json(pokemon); // return one pokemon in JSON format
	    });
	});

	// get a pokemon(s) by previous  evolution
	app.get('/api/v1/pokemon/pre_evo/:no', function(req, res) {
		Pokemon.find({"previous_evolution": req.params.no}, 'type1 type2 name_fr', {sort : '_id'}).exec(function(err, pokemon){
		    
		    if(err) {
	        	res.send(err);
	        }

	        res.charset = 'utf-8';
	   		res.contentType('text');

			res.json(pokemon); // return one pokemon in JSON format
	    });
	});

	app.get('/', function(req, res) {
		res.sendfile('./public/html/index.html');
	});


	/*app.get('/img/xy/:n', function(req, res) {
		//simulation latence server
		//setTimeout(function() {res.sendfile('./public/img/xy/' + req.params.n);}, 1000);
		res.sendfile('./public/img/xy/' + req.params.n);
	});*/

	/*
	// create a pokemon
	app.post('/api/v1/pokemon', function(req, res) {
		var pkm = new Pokemon();
		pkm.nom = req.body.nom;
		pkm.nom2 = req.body.nom2;
		pkm.save(function(err, pkm) {
			res.send(pkm.nom + ' a bien été crée.');
		});
	});

	// update a pokemon
	app.put('/api/v1/pokemon/:nom', function(req, res) {
		Pokemon.findOne({'nom':req.params.nom}, 'nom', function(err, pokemon) {
			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if(err) {
				res.send(err);
			}

			pokemon.nom = req.body.nom;
			pokemon.save(function(err, pokemon) {
				res.send(pokemon.nom + ' a bien été mis à jour.');
			});
		});

	});

	// delete a pokemon
	app.delete('/api/v1/:nom', function(req, res) {
		Pokemon.findOne({'nom':req.params.nom}, 'nom', function(err, pokemon) {
			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err) {
				res.send(err);
			}

			if(pokemon != null) {
				pokemon.remove();
				res.send(pokemon.nom + ' a bien été supprimé.');
			}
			else {
				res.send(req.params.nom + " n'existe pas");
			}

		});

	});
	*/


	
}