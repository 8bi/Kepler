/*
	Questo è il modulo di gestione dell' utente loggato
	e di tutti i dati reattivi collegati all'utente: favorites, friends, checkin 
*/

Climbo.profile = {

	initialized: false,

	id: null,
	data: {},
	user: null,		//my istance of Climbo.User
	placeCheckin: null,
	notifs: [],		//notifs of user
	//TODO rename fields in db notif to notifs

	_deps: {
		online: new Deps.Dependency(),
		checkin: new Deps.Dependency(),
		friends: new Deps.Dependency()
	},

	initProfile: function(callbackProfile) {

		if(Climbo.profile.initialized)
			return false;
		
		Climbo.profile.initialized = true;

		Deps.autorun(function(comp) {

			var userData = Meteor.user();
			
			if(!userData)	//userData not logget
				return false;	//unset profile.user, profile.id, Climbo.profile.data

			Climbo.profile.id = userData._id;
			Climbo.profile.data = userData;
			Climbo.profile.user = Climbo.newUser(userData._id);
			Climbo.profile.user.update();

			i18n.setLanguage(userData.lang);

			if(this.firstRun && Climbo.map.leafletMap && Climbo.profile.data.locmap)
				Climbo.map.leafletMap.setView(Climbo.profile.data.locmap, Meteor.settings.public.map.zoom);
			
			//TODO Meteor.settings.public.profile = _.defaults(Meteor.settings.public.profile, userData.settings);
			
			//TODO rifare le subscribe solo se cambia il valore dopo autorun
			Climbo.profile.loadCheckin();

			$('#friends #switch_online').bootstrapSwitch('state', Climbo.profile.data.online);
			//patch for sync online state after switch_online.rendered
		});

		if($.isFunction(callbackProfile))
			callbackProfile(Climbo.profile);
	},
	getData: function() {
		return Meteor.user();
	},
	getOnline: function() {
		Climbo.profile._deps.online.depend();
		return !!Climbo.profile.data.online;
	},
	getCheckin: function() {
		Climbo.profile._deps.checkin.depend();
		return Climbo.profile.placeCheckin;
	},
	hasFriend: function(userId) {
		Climbo.profile._deps.friends.depend();
		return _.contains(Climbo.profile.data.friends, userId);
	},

	setLoc: function(loc) {
		// loc = loc || null;
		// var shift = Climbo.util.geo.distance(Climbo.profile.data.loclast, loc);
		// if(loc===null || shift >= Meteor.settings.public.gpsMinShift)
		//problemi quando loclast==loc(appena si accende il gps)
			Meteor.call('setUserLoc', loc);
	},
	setOnline: function(online) {
		online = online ? 1 : 0;
		if(online !== Climbo.profile.data.online)
			Meteor.users.update(Meteor.userId(), {
				$set: {
					online: parseFloat(online),
					mob: parseFloat(Meteor.Device.isPhone() ? 1:0)
				}
			}, function(err) {
				Climbo.profile._deps.online.changed();
			});
	},
	addCheckin: function(placeId) {
		Meteor.call('addCheckin',placeId, function() {
			Climbo.profile.placeCheckin = Climbo.newPlace(placeId);
			Climbo.profile._deps.checkin.changed();
		});
	},
	removeCheckin: function(placeId) {
		Meteor.call('removeCheckin',placeId, function(err) {
			Climbo.profile.placeCheckin = null;
			Climbo.profile._deps.checkin.changed();			
		});
	},
	addFavorite: function(placeId) {
		Meteor.call('addFavorite', placeId);
	},
	removeFavorite: function(placeId) {
		Meteor.call('removeFavorite', placeId);
	},
	addFriend: function(userId) {
		Meteor.call('addFriend', userId);
	},
	removeFriend: function(userId) {
		Meteor.call('removeFriend', userId);
	},
	uploadAvatar: function(blob, callback) {
		var fileReader = new FileReader();
		fileReader.onload = function(file) {
			Meteor.call('uploadAvatar',file.target.result, callback);
		}
		fileReader.readAsBinaryString(blob);
	},

	loadCheckin: function() {
		if(Climbo.profile.data.checkin)
			Meteor.subscribe('placeById', Climbo.profile.data.checkin, function() {
				Climbo.profile.placeCheckin = Climbo.newPlace(Climbo.profile.data.checkin);
				Climbo.profile._deps.checkin.changed();
				//Climbo.alert.observePlaces([Climbo.profile.data.checkin]);
			});
		else
			Climbo.profile.placeCheckin = null;
	},
	loadNotifs: function() {
/*		TODO
		if(!_.isEmpty(Climbo.profile.data.notifs))
			return Meteor.subscribe('notifsByIds', Climbo.profile.data.convers, function() {
				Climbo.profile.notifs = getNotifsByIds(Climbo.profile.data.notif).fetch();
			});*/
	},
	logout: function() {
		Climbo.profile.setOnline(false);
		Meteor.logout(function(err) {
			//TODO esegui Climbo.map.destroyMap();
		});
	}
};
