/*
	Permissions definitions of fields in the queries for pubblications and methods
*/
K.filters({
//Profile
	'currentUser': {
		fields: {
			name:1, username:1, avatar:1, status:1, checkin:1, online:1, loc:1, mob:1, friends:1, createdAt:1, likeplaces:1, gender:1, city:1, lang:1, loclast:1, onlinelast:1, favorites:1, event:1, hist:1, notif:1, convers:1, usersPending:1, usersReceive:1, usersBlocked:1, emails:1, isAdmin:1, settings:1
		}
	},
//Users
	'friendPanel': {
		fields: {
			name:1, username:1, avatar:1, status:1, checkin:1, online:1, loc:1, mob:1, friends:1, createdAt:1, likeplaces:1, gender:1, city:1, lang:1, loclast:1, onlinelast:1, favorites:1, event:1, hist:1
		}
	},
	'friendItem': {
		fields: {
			name:1, username:1, avatar:1, status:1, checkin:1, online:1, loc:1, mob:1
		}
	},
	'userPanel': {
		fields: {
			name:1, username:1, avatar:1, status:1, /********************************/ friends:1, createdAt:1, likeplaces:1, gender:1, city:1, lang:1
		}
	},		
	'userItem': { 
		fields: {
			name:1, username:1, avatar:1, status:1
		}
	},

//Places
	'placePanel': {
		fields: {
			loc:1, name:1, type:1, near:1, rank:1, prov:1, reg:1, checkins:1, convers:1, com:1, desc:1, warn:1, ele:1, esp:1, naz:1, hist:1, event:1
		}
	},
	'placeItem': {
		fields: {
			loc:1, name:1, type:1, near:1, rank:1, prov:1, reg:1, checkins:1, convers:1
		}
	},
	'placeSearch': {
		fields: {
		       name:1, type:1, near:1, rank:1, prov:1, reg:1, checkins:1, convers:1
		},
		sort: { name:1, reg: 1},
		limit: Meteor.settings.public.searchMaxRes
	}
});

K.filters({
//Convers
	converPanel: {
		title:1, targetId:1, targetType:1, userId:1, usersIds:1, lastMsg:1
	},
	converItem: {
		title:1, targetId:1, targetType:1, userId:1, usersIds:1, lastMsg:1
	}
});
