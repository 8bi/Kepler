
K.extend({
	updatePlaceGeoinfo: function(place) {
	
		if(!K.Admin.isMe()) return null;
		
		console.log('Geoapi: updatePlaceGeoinfo...', place.name);

		var ret = K.Geoinfo.getFieldsByLoc(place.loc);

		Places.update(place._id, {
			$set: {geoinfo: ret}
		});
		console.log('Geoapi: updatePlaceGeoinfo', place.name, ret);
	}
});

//doc of before.insert in https://github.com/matb33/meteor-collection-hooks
Places.after.insert(function(userId, doc) {
	if(doc.loc)
		K.updatePlaceGeoinfo(doc);
});

Places.after.update(function(userId, doc, fieldNames, modifier, options) {
	if(_.contains(fieldNames,'loc'))
		K.updatePlaceGeoinfo(doc);
});

Meteor.methods({
	findGeoinfoByLoc: function(loc, fields) {

		if(!this.userId && !K.Util.valid.loc(loc)) return null;

		console.log('Geoapi: findGeoinfoByLoc...', loc);

		var ret = K.Geoinfo.getFieldsByLoc(loc, fields);

		//console.log('findGeoinfoByLoc', ret);

		return ret;
	}
});