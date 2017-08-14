
Meteor.publish('tracksByIds', function(trackIds) {

	if(this.userId) {

		console.log('Pub: tracksByIds', trackIds);

		return [
			K.getTracksByIds(trackIds)
		];	
	}
	else
		this.ready();	
});

Meteor.publish('tracksByPlace', function(placeId) {

	if(this.userId) {

		var placeCur = K.findPlaceById(placeId),
			placeData = placeCur.fetch()[0],
			loc = placeData.loc,
			imported = 0;

		var tracksCur = findTracksByLoc(loc);

		//TODO optimize this condition caching
		if(tracksCur.count()===0) {

			var geojson = K.Osm.findOsmByLoc(loc, {
				type: 'way',
				filter: _.keys(K.settings.public.tracks.typesByTags),
				dist: K.settings.public.tracks.maxDistance,
				limit: ' ',//is limit of nodes NOT ways
				meta: false
			});
			
			if(geojson && geojson.features) {

				for(var i in geojson.features) {

					var feature = geojson.features[i];

					if( feature.properties.type==='way' &&
						feature.geometry.type==='LineString' ) {

						imported = Tracks.upsert({id: feature.id}, feature);
					}
				}
			}
			
			console.log('Pub: tracksByPlace import from osm ',imported);

			tracksCur = findTracksByLoc(placeData.loc);
		}

		console.log('Pub: tracksByPlace', placeId, tracksCur.count());

		return [
			placeCur,
			tracksCur
		];	
	}
	else
		this.ready();	
});