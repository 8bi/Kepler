
/*Accounts.onLogin(function(login) {

	var ip = login.connection.httpHeaders['x-real-ip'] || login.connection.clientAddress,
		sets = {
			online: 1,
			isAdmin: K.admin.isMe(login.user)
		};

	if(Meteor.settings.geoipLocation && 
		!K.util.getPath(login.user,'settings.map.center') && 
		(geoip = K.geoinfo.geoip(ip)) )
		//TODO sets['settings.map.center'] = geoip.loc;

	Users.update(login.user._id, {$set: sets});
});*/
