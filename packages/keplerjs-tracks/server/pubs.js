
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
			loc = placeData.loc;

		var tracksCur = findTracksByLoc(loc);

		if(true || tracksCur.count()===0) {


			var geojson = K.Osm.findOsmByLoc(loc, {
				type: 'way',
				filter: 'highway~".*"',//_.keys(K.settings.public.tracks.typesByTags),
				radius: 2000,//K.settings.public.tracks.maxDistance,
				limit: '',//10,//K.settings.public.tracks.limit,
				meta: false
			});
			
			if(geojson && geojson.features) {

				for(var i in geojson.features) {

					var feature = geojson.features[i];

					feature.properties.end = K.Util.geo.createPoint([loc[1], loc[0]]);
					//used by findTracksByLoc

					if(feature.properties.type==='way') {
						Tracks.upsert({id: feature.id}, feature);
						console.log('Pub: tracksByPlace insert from osm ',feature.id, feature.geometry.type);
					}
				}
			}
			
			tracksCur = findTracksByLoc(placeData.loc);
		}

		console.log('Pub: tracksByPlace', placeData.name, tracksCur.count());

		return [
			placeCur,
			tracksCur
		];	
	}
	else
		this.ready();	
});