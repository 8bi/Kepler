
var poisToGeojson = function(pois, place, type) {

	/* decorate Poi markers with place circle and lines from place to pois */
	
	if(type) {
		pois = _.filter(pois, function(feature) {
			return feature.properties.type === type;
		});
	}

	var gloc = [place.loc[1], place.loc[0]],
		placeCircle = K.util.geo.createFeature('Point', gloc, {type:'placeCircle'});
		coordLines = _.map(pois, function(poi) {
			return [gloc, poi.geometry.coordinates];
		}),
		poiLines = K.util.geo.createFeature('MultiLineString', coordLines, {type:'poiLine'}),
		features = _.union(placeCircle, pois, poiLines);

	return K.util.geo.createFeatureColl(features);
}

Kepler.Place.include({

	poisList: null,
	
	loadPois: function() {

		var self = this;

		if(!self.poisList)
			Meteor.subscribe('poisByPlace', self.id, function() {
				self.poisList = getPoisByLoc(self.loc).fetch();
				self._dep.changed();
			});
	},
	showPois: function(poiType) {
		this.loadPois();
		//TODO if(poiType) show each track separately
		K.map.loadGeojson( poisToGeojson(this.poisList, this, poiType) );
	},	
	getPoisList: function() {

		if(!this.loc) return [];

		var pois = getPoisByLoc(this.loc).fetch(),
			types = _.countBy(pois, function(feature) {
				return feature.properties.type;
			});

		return _.map(types, function(val, type) {
			return {
				type: type,
				count: val,
				title: i18n('pois.'+type)
			};
		});
	}
});