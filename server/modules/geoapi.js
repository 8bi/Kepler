/*
	modulo server per calcolo informazioni geografiche

	http://www.geonames.org/export/web-services.html
*/
var geonamesUser = Meteor.settings.accounts.geonamesUser,
	urls = {
		aspect: "http://localhost/maps/dem/aspect.php",
		elevation: "http://localhost/maps/dem/elevation.php"
	},
	getOpts = {
		timeout: 20000,	//timeout connessioni http remote
		httpHeaders: {
			//'Referer': Meteor.settings.website.domain
			'User-Agent': ''
		}
	};

Kepler.geoapi = (function() {

	function aspectAPILocal(ll) {

		var res, ret, src = {
				par: 'aspect',
				url: urls.aspect+'?lat='+ll[0]+'&lng='+ll[1]
			};

		try {
			res = HTTP.get(src.url, getOpts);
		} catch(e) {
			console.log('aspectAPILocal: error');
			return null;
		}

		if(res.statusCode == 200 && res.data && res.data[src.par])
			ret = res.data[src.par];
		else
			ret = null;

		console.log("aspectAPILocal()",ll,ret);
		return ret;
	}

	function elevationAPILocal(ll) {

		var res, ret, src = {
				par: 'ele',
				url: urls.elevation+'?lat='+ll[0]+'&lng='+ll[1]
			};

		try {
			res = HTTP.get(src.url, getOpts);
		} catch(e) {
			console.log('elevationAPILocal: error');
			return null;
		}
		
		if(res.statusCode == 200 && res.data && res.data[src.par])
			ret = res.data[src.par];
		else
			ret = null;

		console.log("elevationAPILocal()",ll,ret);
		return ret;
	}

	function elevationAPIGeonames(ll) {

		var res, ret, srcSRTM = {
				par: 'srtm3',
				url: 'http://api.geonames.org/srtm3JSON?'+
					 'lat='+ll[0]+'&lng='+ll[1]+'&username='+geonamesUser,
			},
			srcASTER = {
				par: 'astergdem',
				url: 'http://api.geonames.org/astergdemJSON?'+
					 'lat='+ll[0]+'&lng='+ll[1]+'&username='+geonamesUser,
			};

		try {
			res = HTTP.get(src.url, getOpts);
		} catch(e) {
			console.log('elevationAPIGeonames: error');
			return null;
		}
		
		if(res.statusCode == 200 && res.data && res.data.geonames && res.data.geonames[0] && res.data.geonames[0][srcASTER.par])
			ret = res.data.geonames[0][srcASTER.par].toLowerCase();
		else
			ret = null;

		console.log("elevationAPIGeonames() ",ll,ret);
		return ret;
	}

	function nearAPI(ll) {

		var res, ret, src = {
				par: 'name',
				url: 'http://api.geonames.org/findNearbyJSON?lang=IT&style=SHORT&'+
					 'lat='+ll[0]+'&lng='+ll[1]+'&username='+geonamesUser
			};
		
		try {
			res = HTTP.get(src.url, getOpts);
		} catch(e) {
			console.log('nearAPI: error');
			return null;
		}

		if(res.statusCode == 200 && res.data && res.data.geonames && res.data.geonames[0] && res.data.geonames[0][src.par])
			ret = res.data.geonames[0][src.par].toLowerCase();
		else
			ret = null;

		console.log("nearAPI() ",ll,ret);
		return ret;
	}

	function comuneAPI(ll) {

		var res, ret, src = {
				par: 'adminName3',
				url: 'http://api.geonames.org/countrySubdivisionJSON?lang=IT&level=3&'+
					 'lat='+ll[0]+'&lng='+ll[1]+'&username='+geonamesUser
			};

		try {
			res = HTTP.get(src.url, getOpts);
		} catch(e) {
			console.log('comuneAPI: error');
			return null;
		}
		
		if(res.statusCode == 200 && res.data && res.data[src.par])
			ret = res.data[src.par].toLowerCase();
		else
			ret = null;

		console.log("comuneAPI() ",ll,ret);
		return ret;
	}

	function provFromCode(code) {

		code = code.toUpperCase();
		var provs = JSON.parse(Assets.getText('province.json'));
		return provs[code] ? provs[code].toLowerCase() : null;
	}

	function provinciaAPI(ll) {

		var res, ret, src = {
				par: 'address',
				url: 'http://nominatim.openstreetmap.org/reverse?format=json&'+
				     'lat='+ll[0]+'&lon='+ll[1]+'&addressdetails=1'
			};

		try {
			res = HTTP.get(src.url, getOpts);
		} catch(e) {
			console.log('provinciaAPI: error');
			return null;
		}

		if(res.statusCode == 200 && res.data && res.data[src.par] && res.data[src.par]['county'])
			ret = provFromCode( res.data[src.par]['county'] );
		else
			ret = null;

		console.log("provinciaAPI() ",ll,ret);
		return ret;
	}

	function regioneAPI(ll) {

		var res, ret, src = {
				par: 'adminName1',
				url: 'http://api.geonames.org/countrySubdivisionJSON?lang=IT&level=3&'+
					 'lat='+ll[0]+'&lng='+ll[1]+'&username='+geonamesUser
			};

		try {
			res = HTTP.get(src.url, getOpts);
		} catch(e) {
			console.log('regioneAPI: error');
			return null;
		}
		
		if(res.statusCode == 200 && res.data && res.data[src.par])
			ret = res.data[src.par].toLowerCase();
		else
			ret = null;

		ret = ret.replace("trentino - alto adige","trentino alto adige");
		ret = ret.replace("valle d’aosta","valle d'aosta");
		ret = ret.replace("emilia-romagna","emilia romagna");

		console.log("regioneAPI() ",ll,ret);
		return ret;
	}

	function nazioneAPI(ll) {

		var res, ret, src = {
				par: 'countryName',
				url: 'http://api.geonames.org/countrySubdivisionJSON?lang=IT&'+
					 'lat='+ll[0]+'&lng='+ll[1]+'&username='+geonamesUser
			};

		try {
			res = HTTP.get(src.url, getOpts);
		} catch(e) {
			console.log('nazioneAPI: error');
			return null;
		}
		
		if(res.statusCode == 200 && res.data && res.data.geonames && res.data.geonames[0] && res.data.geonames[0][src.par])
			ret = res.data.geonames[0][src.par].toLowerCase();
		else
			ret = null;

		console.log("nazioneAPI() ",ll,ret);
		return ret;
	}

	function geoipAPI(ip) {
		//API: http://ipinfodb.com/ip_location_api.php
		/*{
			"statusCode" : "OK",
			"statusMessage" : "",
			"ipAddress" : "62.56.230.41",
			"countryCode" : "GB",
			"countryName" : "UNITED KINGDOM",
			"regionName" : "-",
			"cityName" : "-",
			"zipCode" : "-",
			"latitude" : "51.5085",
			"longitude" : "-0.12574",
			"timeZone" : "+00:00"
		}*/
		var ipinfodbKey = Meteor.settings.accounts.ipinfodbKey,
			res, ret, src = {
				url: 'http://api.ipinfodb.com/v3/ip-city/?key='+ipinfodbKey+
						'&format=json&ip='+ip
			};

		try {
			res = HTTP.get(src.url, getOpts);
		} catch(e) {
			console.log('geoipAPI: error');
			return null;
		}
		
		if(res.statusCode == 200 && res.data)
			ret = res.data;

		ret.loc = [parseFloat(ret.latitude), parseFloat(ret.longitude)];

		return ret;
	}

	return {
		geoip:  function(ip) {
			return ip ? geoipAPI(ip) : false;
		},
		elevation: function(ll) {

			ll = K.util.geo.roundLoc(ll, 8);

			var val = K.cache.get(ll, 'elevation');

			return val || K.cache.set(ll, elevationAPILocal(ll), 'elevation');
		},
		aspect: function(ll) {
			
			ll = K.util.geo.roundLoc(ll, 8);

			var val = K.cache.get(ll, 'aspect');

			return val || K.cache.set(ll, aspectAPILocal(ll), 'aspect');
		},
		near: function(ll) {

			ll = K.util.geo.roundLoc(ll, 4);

			var val = K.cache.get(ll, 'near');

			return val || K.cache.set(ll, nearAPI(ll), 'near');
		},
		comune: function(ll) {

			ll = K.util.geo.roundLoc(ll, 6);

			var val = K.cache.get(ll ,'comune');

			return val || K.cache.set(ll, comuneAPI(ll), 'comune');
		},
		provincia: function(ll) {

			ll = K.util.geo.roundLoc(ll, 6);

			var val = K.cache.get(ll ,'provincia');

			return val || K.cache.set(ll, provinciaAPI(ll), 'provincia');
		},		
		regione: function(ll) {

			ll = K.util.geo.roundLoc(ll, 2);

			var val = K.cache.get(ll ,'regione');

			return val || K.cache.set(ll, regioneAPI(ll), 'regione');
		},
		nazione: function(ll) {

			ll = K.util.geo.roundLoc(ll, 1);

			var val = K.cache.get(ll ,'nazione');

			return val || K.cache.set(ll, nazioneAPI(ll), 'nazione');
		}
	};
}());

	// function cityAPILocal(initial)
	// {
	// 	Citta = new Mongo.Collection('citta');
	//	initial = K.util.sanitizeRegExp(initial);
	// 	return Citta.find({name: {$regex: new RegExp('^'+initial,'i')}},
	// 					{
	// 						fields:{name:1, loc:1, prov:1, _id:0},
	// 						sort: {name:1}
	// 					}).fetch();
	// }

	// TODO testare! su varie posizioni
	// function cityAPI(initial)
	// {
	// 	if(initial==='')
	// 		return null;	//non togliere MAI xke se initial e' vuoto ritorna tutto
	// 	var ret = {},
	// 		src = {
	// 			par: 'name',
	// 			url: 'http://api.geonames.org/searchJSON?'+
	// 				'name_startsWith='+initial+'&featureClass=P&country=IT&username='+geonamesUser
	// 		};
	// 	//TODO provare
	// 	//http://open.mapquestapi.com/nominatim/v1/search.php?json_callback=L.Control.Search.callJsonp&q=ter&format=json&osm_type=N&limit=100&addressdetails=1
	// 	//http://nominatim.openstreetmap.org/search
	//
	// 	var res = HTTP.get(src.url, getOpts);
	// 	if(res.statusCode == 200 && res.data && res.data.geonames)
	// 		_.each(res.data.geonames, function(val) {
	// 			if(val[src.par])
	// 				ret[ val[src.par] ]= _.map(parseFloat, [val.lat,val.lng]);
	// 		});
	// 	else
	// 		ret = null;
	// 	return ret;
	// }
