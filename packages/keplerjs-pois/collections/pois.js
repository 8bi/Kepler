
Pois = new Mongo.Collection('pois');

findPoisByLoc = function(ll) {

	var where;
	
	if(Meteor.isClient) {
		where = {
			'$near': ll,
			'$maxDistance': Meteor.settings.public.maxPoisDist
		};
	}
	else if(Meteor.isServer) {
		where = {
			'$near': {
				'$geometry': {
					'type': 'Point',
					'coordinates': [ll[1],ll[0]]
				},
				'$maxDistance': Meteor.settings.public.maxPoisDist
			}
		};
	}

	return Pois.find({
			'geometry.coordinates': where
		}, {limit: Meteor.settings.public.maxPois });
}