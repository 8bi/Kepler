/*
	query e metodi per recupero dei dati utenti
*/

//TODO creare funzione per verificare amicizia tra due user id

getUsersByIds = function(usersIds) {

	usersIds = _.isArray(usersIds) ? {$in: usersIds} : usersIds;

	return Meteor.users.find({_id: usersIds }, { fields: Climbo.perms.userItem });
};

getUserById = function(userId) {

	return Meteor.users.find(userId, { fields: Climbo.perms.userPanel });
};

getFriendsByIds = function(usersIds) {

	usersIds = _.isArray(usersIds) ? {$in: usersIds} : usersIds;

	return Meteor.users.find({_id: usersIds }, { fields: Climbo.perms.friendItem });
};

getFriendById = function(userId) {
	return Meteor.users.find(userId, { fields: Climbo.perms.friendPanel });
};