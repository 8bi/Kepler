
tracksToGeojson = function(tracks, place) {

	var parkPoints = [],
		tracks = _.map(tracks, function(track) {

		track.properties.asc = track.properties.dis >= 0;

		if(track.properties.type==='access') {

			track.properties.name = i18n('tracks.'+track.properties.type);
			
			parkPoints.push( K.Util.geo.createFeature('Point', track.geometry.coordinates[0], {type:'parking'}) );
		}
		
		return track;
	});

	var gloc = [place.loc[1], place.loc[0]],
		placeCircle = K.Util.geo.createFeature('Point', gloc, {type:'placeCircle'});

	var features = _.union(placeCircle, tracks, parkPoints);

	return K.Util.geo.createFeatureColl(features);
}
