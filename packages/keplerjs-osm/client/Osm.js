
//TODO Osms = new Mongo.Collection('osm');

var tags2poiClass = {
'amenity=drinking_water': 'water',
'amenity=parking': 'parking',
'amenity=restaurant': 'eat',
'tourism=camp_site': 'camp',
'amenity=hospital': 'bed',
'tourism=hotel': 'bed',
'amenity=bar': 'drink'
};

//'highway=path',

Kepler.Osm = {
	
	iconByTags: function(tags) {
		for(var tag in tags) {
			var tagval = tag+'='+tags[tag];

			if(tags2poiClass[tagval])
				return 'icon icon-'+tags2poiClass[tagval];
		}
		return '';
	},

	loadQuery: function(filter) {

		filter = filter || 'amenity=bar';

		var bbox = K.Map.getBBox();
		
		Meteor.call('findOsmByBBox', filter, bbox, function(err, geojson) {
			
			//console.log('getOsmByBBox',geojson.features.length);

			if(geojson.features.length)
				K.Map.addGeojson(geojson);
		});
	},

	loadTracks: function() {
		Meteor.call('findOsmByBBox', 'highway=track', K.Map.getBBox(), 'way', function(err, geojson) {
			
			console.log(geojson);

			if(geojson.features.length>0)
				K.Map.addGeojson(geojson);
		});
	}	
};
