
Users = Meteor.users;

Users.allow({
	update: function (userId, doc, fieldNames, modifier) {
		return userId && doc._id === userId;
	}
});

getCurrentUser = function(userId) {
	return Users.find(userId, { fields: K.fields.currentUser });
};

getUsersByName = function(initial) {
	initial = K.util.sanitizeRegExp(initial);

	if(initial.length < Meteor.settings.public.searchMinLen)
		return null;

	var reg = new RegExp('^'+ initial, 'i'),
		curUser = Users.find({
			//$or: [{	//in futuro cerca per username
				name: reg
				//},{username: reg}
		//	]
		}, { fields: K.fields.userItem });

	return curUser;	
};

getUsersByIds = function(usersIds) {

	usersIds = _.isArray(usersIds) ? {$in: usersIds} : usersIds;

	return Users.find({_id: usersIds }, { fields: K.fields.userItem });
};

getUserById = function(userId) {

	return Users.find(userId, { fields: K.fields.userPanel });
};

getFriendsByIds = function(usersIds) {

	usersIds = _.isArray(usersIds) ? {$in: usersIds} : usersIds;

	//TODO show friend location only if me is online

	return Users.find({_id: usersIds }, { fields: K.fields.friendItem });
};

getFriendById = function(userId) {
	return Users.find(userId, { fields: K.fields.friendPanel });
};
