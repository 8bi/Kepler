/*
	Permissions definitions of fields in pubblications
*/
Kepler.fields = {
//Profile
	currentUser: {
		name:1, username:1, avatar:1, status:1, checkin:1, online:1, loc:1, mob:1, friends:1, createdAt:1, likeplaces:1, gender:1, city:1, lang:1, loclast:1, onlinelast:1, favorites:1, event:1, hist:1, notif:1, convers:1, usersPending:1, usersReceive:1, usersBlocked:1, emails:1, isAdmin:1, settings:1
	},
//Users
	friendPanel: {
		name:1, username:1, avatar:1, status:1, checkin:1, online:1, loc:1, mob:1, friends:1, createdAt:1, likeplaces:1, gender:1, city:1, lang:1, loclast:1, onlinelast:1, favorites:1, event:1, hist:1
	},
	friendItem: {
		name:1, username:1, avatar:1, status:1, checkin:1, online:1, loc:1, mob:1
	},
	userPanel: {
		name:1, username:1, avatar:1, status:1, /********************************/ friends:1, createdAt:1, likeplaces:1, gender:1, city:1, lang:1
	},		
	userItem: {
		name:1, username:1, avatar:1, status:1
	},
//Places
	placePanel: {
		loc:1, name:1, type:1, near:1, rank:1, prov:1, reg:1, checkins:1, convers:1, tracks:1, pois:1, com:1, desc:1, warn:1, ele:1, esp:1, naz:1, hist:1, event:1, photos:1
	},
	placeItem: {
		loc:1, name:1, type:1, near:1, rank:1, prov:1, reg:1, checkins:1, convers:1, tracks:1, pois:1
	},
	placeSearch: {
		       name:1, type:1, near:1, rank:1, prov:1, reg:1, checkins:1, convers:1
	},
//Convers
	converPanel: {
		title:1, targetId:1, targetType:1, userId:1, usersIds:1, lastMsg:1
	},
	converItem: {
		title:1, targetId:1, targetType:1, userId:1, usersIds:1, lastMsg:1
	}
};
