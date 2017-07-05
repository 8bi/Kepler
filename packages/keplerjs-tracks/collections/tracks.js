
Tracks = new Mongo.Collection('tracks');

K.queries({
	findTracksByIds: function(tracksIds) {
		return Tracks.find({_id: {$in: tracksIds}});
	},
	findTracksByLoc: function(ll) {
		var where;
		
		if(Meteor.isClient) {
			where = {
				'properties.end.coordinates': {
					'$near': ll,
					'$maxDistance': Meteor.settings.public.maxTracksDist
				}
			};
		}
		else if(Meteor.isServer) {
			where = {
				'properties.end': {
					'$near': {
						'$geometry': {
							'type': 'Point',
							'coordinates': [ll[1],ll[0]]
						},
						'$maxDistance': Meteor.settings.public.maxTracksDist
					}
				}
			};
		}

		return Tracks.find(where, {limit: Meteor.settings.public.maxTracks });
	}
});
