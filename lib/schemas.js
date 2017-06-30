/*
	default values for new model/document
*/
Kepler.schemas = {

	place: {
		name: '',	       //place title
		type: '',	       //rock	indoor	boulder	long
		active: 0,	       //place visible in map
		rank: 0,		   //sommati di tutti i preferiti degli utenti
		loc: [],		   //posizione lat,lng
		desc: '',		   //place description
		warn: '',          //place bans and dangers

//TODO move into geo property
		ele: 0,		       //elevazione
		esp: 0,		       //esposione	 azimut
		
		naz: '',		   //country
		near: '',	       //near locality
		com: '',		   //municipality
		prov: '',		   //province
		reg: '',		   //district
		//shadow:[],       

		checkins: [],	   //utenti in place	
		hist: [],		   //checkins recenti
		event: [],		   //places in calendar
		convers: [],	   //ids conversazioni in bacheca
		tracks: -1,		   //numero tracce
		pois: -1,		   //numero pois
		
		photos: [],	       //elenco id delle foto

		source: {
			name: '',
			osm_user: ''
			//... for specific source
		}
	},

	user: {
		name: '',		   //display name	
		username: '',	   //username used in urls
		emails: [], 
		avatar: '',
		status: '',        //status mood message, shown in profile
		gender: '',
		city: '',
		lang: 'it',
		likeplaces: [],	   //(TODO rename in types) tipologia climber i18n.places					
		loc: null,		   //current gps position
		loclast: null,	   //lat gps position
		checkin: null,	   //id Place where I am
		online: 0,		   //stato di visibilita rispetto ai miei friends
		onlinelast: null,  //last online status datetime
		mob: 0,			   //if my device is mobile
		notif: [],		   //notifiche, messaggi non letti, eventi in places preferite, nuovi friends	
		favorites: [],	   //id place preferiti		
		friends: [],	   //ids users friends
		usersPending: [],  //ids users that I send request
		usersReceive: [],  //ids users that I receive request
		usersBlocked: [],  //ids users that I blocked
		convers: [], 	   //ids conversations publics and privates
		hist: [],		   //last places visited
		event: [],		   //places in calendar
		settings: {
			map: {
				layer: null,
				center: null  //last center of map
			}
		}
	},

	conver: {
		title: '',         //Topic for the place wall or subject for the private convers
		targetId: '',      //if null is a private users convers		
		targetType: '',	   //type of target: user, place, event, pois		
		userId: '',        //owner/sender of conversation		
		usersIds: [],      //participants users
		lastMsg: null      //include last msg of conversation
	},

	converMsg: {
		updateAt: '',	
		convId: '',
		userId: '',
		body: ''
	}
};
