var mongoose = require('mongoose');


module.exports = mongoose.model('pokemon', {
	no_national: {type : Number, unique : true},
	no_johto: {type : Number},
	no_hoenn: {type : Number},
	no_sinnoh: {type : Number},
	no_unys: {type : Number},
	no_unys2: {type : Number},
	no_coastal_kalos: {type : Number},
	no_central_kalos: {type : Number},
	no_mountain_kalos: {type : Number},

	name_fr: {type : String},
	name_en: {type : String},
	name_jp: {type : String},

	type1: {type : Number, ref: 'type'},
	type2: {type : Number, ref: 'type'},
	
	weight: {type : Number},
	height: {type : Number},

	category_fr: {type : String},
	category_en: {type : String},

	previous_evolution: {type : Number, ref: 'pokemon'},
	evolution_type: {type : Number},//Monté de niveau. Utilisation d'objet, Echange
	//Jour/Nuit
	//Avec un certain objet -> objets évolutif
	//Niveau minimal
	//Si utilisation : d'objet lequel ? (pierres)
	//Bonheur
	//Lieu : Pierre Mousse / Pierre glacée / Mont Couronné - Grotte Électrolithe
	//MaleOnly/FemaleOnly
	//Avec une certaine attaque : Copie / Pouv.Antique / Coup Double / Roulade
	//Spécial : 2 coeurs poké récré + une attaque de type fée / Attaque > Défense / Attaque < Défense / Attaque et Défense identiques / valeur interne personnelle / avec un emplacement libre dans l'équipe et une Poké Ball dans le sac / avec Rémoraid dans l'équipe / en retournant la console / contre Escargaume / contre Carabing
	tmp_evolution_type: {type : String},
	egg_group: {type : Number, ref: 'egg_group'},

	hp: {type : Number},
	attack: {type : Number},
	defense: {type : Number},
	special_attack: {type : Number},
	special_defense: {type : Number},
	speed: {type : Number},

	description_x_fr: {type : String},
	description_y_fr: {type : String},
	description_x_en: {type : String},
	description_y_en: {type : String},

	tmp_abilities: {type : String},
	ability1: {type : Number, ref: 'ability'},
	ability2: {type : Number, ref: 'ability'},
	hidden_ability: {type : Number, ref: 'ability'},

	ev_hp: {type : Number},
	ev_attack: {type : Number},
	ev_defense: {type : Number},
	ev_special_attack: {type : Number},
	ev_special_defense: {type : Number},
	ev_speed: {type : Number},

	gender_ratio: {type : Number, ref: 'gender_ratio'},
	capture_rate: {type : Number},
	base_egg_steps: {type : Number},
	base_happiness: {type : Number},
	sky_battle_compatible: {type : Boolean}

	//localisation
	//

	

	
});

// Les TMP sont à mettre en undefined une fois qu'on les aura de façon propre !
