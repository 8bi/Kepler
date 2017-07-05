/*
	simple and smart caching system key/value for client and server
*/

//TODO expirable keys: parseInt(K.Util.timeUnix()/(60*60*24*1))
//TODO expirable prefix: parseInt(K.Util.timeUnix()/(60*60*24*1))
//TODO store collection in localstorage

Kepler.Cache = {

	sep: '_',
	prefix: 'cache',
	
	_collections: {},

	_getCollection: function(name) {

		name = _.isString(name) ? this.prefix + this.sep + name : this.prefix;

		var opts = {idGeneration: 'STRING'};

		if(Meteor.isClient)
			opts.connection = null;
		
		if(!this._collections[name]) {

			this._collections[name] = new Mongo.Collection(name, opts);
			
			//TODO
			//this._collections[name]._createCappedCollection(numBytes);

			//TODO
			//if(Meteor.isServer)
			//	this._collections[name]._ensureIndex({ loc : "2dsphere" });
		}

		return this._collections[name];
	},

	_keygen: function(key) {
		key = _.isArray(key) ? key.join(this.sep) : key;
		key = _.isObject(key) ? JSON.stringify(key) : key;
		return key;
	},

	_expireGen: function(expire) {
		
		expire = expire || 'daily';

		var expires = {
			'hourly':  60*60,
			'daily':   60*60*24*1,
			'weekly':  60*60*24*7,
			'monthly': 60*60*24*30
		};
		return parseInt( Math.round(new Date().getTime()/1000) / expires[expire] );
	},

	set: function(key, val, name) {

		key = this._keygen(key);
			
		this._getCollection(name).upsert(key, {$set: {val: val} });
		
		return val;
	},
	get: function(key, name, valFunc) {	//if value is not setted it's updated from valFunc

		key = this._keygen(key);

		valFunc = _.isFunction(name) ? name : valFunc;

		var doc = this._getCollection(name).findOne(key) || {val: undefined};
		
		if(_.isFunction(valFunc) && doc.val===undefined)
			doc.val = this.set(key, valFunc(key), name);

		return doc.val;
	},
	clean: function(name) {
		this._getCollection(name).remove({});
	}
};
