
WebApp.connectHandlers.use('/export/places',function(req, res, next) {

	console.log('Export: ', req.url)

	res.writeHead(200, {
		'Content-type': 'application/json'
	});
	
	var data = Places.find({}, K.filters.placeItem).fetch();

	var features = _.map(data, function(d) {
		return K.Util.geo.createFeature('Point',
			K.Util.geo.roundLoc(d.loc, 2).reverse(), {
				rank: (d.rank+1) * (d.checkins.length+1) * (d.convers.length+1)
			});
	});

	data = K.Util.geo.createFeatureColl(features);
	
	var jsonp = (req.query && req.query.jsonp) || 'jsonpcall';

	res.end(jsonp+'('+JSON.stringify(data)+');');
});
