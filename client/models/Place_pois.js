/*
	class Place with POIs support
*/
function placeWithPois(pois, loc, tipo) {

	//decorate Poi markers with place circle and lines from place to pois
	
	if(tipo) {
		pois = _.filter(pois, function(poi) {
			return poi.properties.tipo===tipo;
		});
	}

	var gloc = [loc[1], loc[0]],
		poiPlace = Climbo.util.geo.createFeature('Point', gloc, {tipo:'place'});
		coordLines = _.map(pois, function(poi) {
			return [gloc, poi.geometry.coordinates];
		}),
		poiLines = Climbo.util.geo.createFeature('MultiLineString', coordLines, {tipo:'poiline'}),
		features = _.union(pois, poiPlace, poiLines);

	return Climbo.util.geo.createFeatureColl(features);
}

Climbo.Place.include({
	hasPois: function(tipo) {
		//TODO
		return true;
	},
	loadPois: function(tipo) {

		var pois = getPoisByLoc(this.loc).fetch();

		Climbo.map.loadGeojson( placeWithPois(pois, this.loc, tipo) );
	},
	getPoisGroups: function(tipo) {

		var pois = getPoisByLoc(this.loc).fetch();

		var types = _.countBy(pois, function(poi) {
			return poi.properties.tipo;
		});

		return _.map(types, function(val, tipo) {
			return {
				tipo: tipo,
				count: val,
				titolo: i18n('ui.pois.'+tipo)
			};
		});
	}
});