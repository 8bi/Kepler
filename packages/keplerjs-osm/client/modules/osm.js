
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

Kepler.osm = {
	
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

		var bbox = K.map.getBBox();
		
		Meteor.call('getOsmByBBox', filter, bbox, function(err, geojson) {
			
			//console.log('getOsmByBBox',geojson.features.length);

			if(geojson.features.length)
				K.map.loadGeojson(geojson);
		});
	},

	loadTracks: function() {
		Meteor.call('getOsmByBBox', 'highway=track', K.map.getBBox(), 'way', function(err, geojson) {
			
			console.log(geojson);

			if(geojson.features.length>0)
				K.map.loadGeojson(geojson);
		});
	}	
};