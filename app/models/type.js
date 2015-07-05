var mongoose = require('mongoose');

module.exports = mongoose.model('type', {
	_id: {type : Number, unique : true},
	name_fr: {type : String},
	name_en: {type : String}
});
