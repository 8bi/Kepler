
var geostats = Npm.require('geostats');

Kepler.Stats = {

	findPlaces: function(noClassify) {

		var data = Places.find({}, {
			fields: { createdAt:1, loc:1, rank:1, checkins:1, hist:1, convers:1, name:1 },
			sort: { createdAt: -1},
			//TODO limit
		}).fetch();

		//Clean data and calculate factors
		var data = _.map(data, function(d) {

			var l = K.Util.geo.roundLoc(d.loc, 1),
				f = (1+d.rank) * 
					(1+_.size(d.checkins)) * 
					(1+_.size(d.convers)) *
					(1+_.size(d.hist));
			return {
				loc: l,
				factor: f
			}
		});


		//raw cluster
/*		data = _.map(_.groupBy(data,'loc'), function(d) {
			var f = _.pluck(d,'factor').reduce(function(a,b){return a+b;}, 0);
			return {
				loc: d[0].loc,
				factor: f
			}
		});*/


		if(!noClassify) {
			var factors = _.pluck(data, 'factor');
			var series = new geostats(factors);
			var classy = series.getClassQuantile(10);
			//var classy = series.getClassEqInterval(10);
			//var classy = series.getClassJenks(10);
		}

		return K.Util.geo.createFeatureColl(_.map(data, function(d) {
			return K.Util.geo.createFeature('Point', d.loc.reverse(), {
				rank: noClassify ? d.factor : series.getClass(d.factor)
			});
		}));
	},

	findUsers: function(noClassify) {
			
		var data = Users.find({isAdmin: false}, {
			fields: { createdAt:1, loc:1, loclast:1, places:1, friends:1, convers:1, hist:1, favorites:1 },
			sort: { createdAt: -1},
			//TODO limit
		}).fetch();

		//Clean data and calculate factors
		var data = _.map(data, function(d) {

			var f = (1+_.size(d.favorites)) * 
					(1+_.size(d.friends)) * 
					(1+_.size(d.convers)) *
					(1+_.size(d.places)) * 
					(1+_.size(d.hist));

			return {
				loc: K.Util.geo.roundLoc(d.loc || d.loclast, 2) || [],
				factor: f
			}
		});

		if(!noClassify) {
			var factors = _.pluck(data, 'factor');
			var series = new geostats(factors);
			var classy = series.getClassQuantile(10);
			//var classy = series.getClassEqInterval(10);
			//var classy = series.getClassJenks(10);
		}

		return K.Util.geo.createFeatureColl(_.map(data, function(d) {
			return K.Util.geo.createFeature('Point', d.loc.reverse(), {
				rank: noClassify ? d.factor : series.getClass(d.factor)
			});
		}));
	}
};