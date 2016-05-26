/*
	generic caching system key/value
*/

//TODO expirable keys: parseInt(K.util.timeUnix()/(60*60*24*1))
//TODO expirable prefix: parseInt(K.util.timeUnix()/(60*60*24*1))
//TODO store colleciton in localstorage

Kepler.cache = {

	sep: '_',
	prefix: 'cache',
	
	_collections: {},

	_getCollection: function(name) {

		namespace = _.isString(name) ? this.prefix + this.sep + name : this.prefix;

		var opts = {idGeneration: 'STRING'};

		if(Meteor.isClient)
			opts.connection = null;
		
		if(!this._collections[ namespace ]) {

			this._collections[ namespace ] = new Mongo.Collection(namespace, opts);
			
			//TODO
			//if(Meteor.isServer)
			//	this._collections[ namespace ]._ensureIndex({ loc : "2dsphere" });
		}

		return this._collections[ namespace ];
	},
	set: function(key, val, name) {

		key = _.isArray(key) ? key.join(this.sep) : key;
			
		this._getCollection(name).upsert(key, {$set: {val: val} });
		
		return val;
	},
	get: function(key, name) {

		key = _.isArray(key) ? key.join(this.sep) : key;

		var cache = this._getCollection(name).findOne(key) || {val: null};

		return cache.val;
	}
};
