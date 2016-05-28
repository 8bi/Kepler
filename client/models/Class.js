
//TODO K.Class.newItem = function(id) {...}

/*
 * K.Class powers the OOP facilities of the library.
 * Thanks to John Resig and Dean Edwards for inspiration!
 */
K.Class = function(){};
K.Class.extend = function (props) {

	// extended class with the new prototype
	var NewClass = function () {

		// call the constructor
		if (this.init) {
			this.init.apply(this, arguments);
		}
	};

	// instantiate class without calling constructor
	var F = function(){};
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
	
	// mix given properties into the prototype
	_.extend(proto, props);

	var parent = this;
	// jshint camelcase: false
	NewClass.__super__ = parent.prototype;

	return NewClass;
};

K.Class.include = function (props) {
	_.extend(this.prototype, props);
};