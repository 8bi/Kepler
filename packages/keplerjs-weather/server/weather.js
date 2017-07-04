
var	getOpts = {
		timeout: 20000,	//timeout connessioni http remote
		httpHeaders: {
			//'Referer': Meteor.settings.website.domain
			'User-Agent': ''
		}
	};

var weatherAPI = function(ll) {

	var url = _.template("http://api.wunderground.com/api/{key}/forecast/q/{lat},{lon}.json", {
			key: Meteor.settings.accounts.wundergroundKey,
			lat: ll[0], lon: ll[1]
		});

	try {
		res = HTTP.get(url, getOpts);
	} catch(e) {
		console.log('weatherAPI: error');
		return null;
	}

	if(res.statusCode == 200 && res.data && res.data.forecast)
	{
		console.log("weatherAPI()", ll);	
		return _.map(res.data.forecast.simpleforecast.forecastday, function(day) {
			
			return {
				//today: day.period==1 || day.period==0,
				date:  day.date.day+'-'+day.date.month+'-'+day.date.year,
				//TODO EJSON Date
				temp:  {
					min: day.low.celsius,
					max: day.high.celsius
				},
				wind: {
					vel: parseFloat(day.avewind.kph),
					ang: parseFloat(day.avewind.degrees)
				},
				prob: parseFloat(day.pop),
				humid: parseFloat(day.avehumidity),
				icon: day.icon
			};
		});
	}
	else
		return null;
};

Meteor.methods({
	getWeatherByLoc: function(ll) {

		console.log("getWeatherByLoc()",ll);

		ll = K.Util.geo.roundLoc(ll, 2);

		var key = K.Util.hashGen('daily') +'_'+ ll.join('_'),
			val = K.Cache.get(key, 'weather');

		return val || K.Cache.set(key, weatherAPI(ll), 'weather');
	}
});
