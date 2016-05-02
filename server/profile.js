
getCurrentUser = function(userId) {
	return Users.find(userId, { fields: K.perms.currentUser });
};

confirmFriends = function(userId, addUserId) {
	//remove from pending
	Users.update(userId, {$pull: {usersReceive: addUserId} });
	Users.update(userId, {$addToSet: {friends: addUserId} });
	//add to friends list
	Users.update(addUserId, {$pull: {usersPending: userId} });
	Users.update(addUserId, {$addToSet: {friends: userId} });

	console.log('confirmFriends Added', userId, addUserId);
};

Meteor.methods({
	setUserLoc: function(loc) {

		if(!this.userId) return null;

		loc = loc || null;
		
		console.log('setUserLoc',loc);

		if(loc)
		{
			var userData = Meteor.user(),
				shift = K.util.geo.distance(userData.loclast, loc);

			if(userData.loclast===null || shift >= Meteor.settings.public.gpsMinShift)
			{
				var nearPlace = Places.findOne({
						loc: {
							'$near': loc,
							'$maxDistance': K.util.geo.meters2rad(Meteor.settings.public.checkinMaxDist)
						}
					});

				if(nearPlace)//automatic check-in
				{
					if(nearPlace._id._str != userData.checkin)
						Meteor.call('addCheckin', nearPlace._id._str);
				}
				else		//automatic check-out
					Meteor.call('removeCheckin', userData.checkin);
				
				Users.update(this.userId, {
					$set: {
						loc: loc,
						loclast: loc,
						locmap: loc
					}
				});
				console.log('setUserLoc'+K.util.timeUnix(), _.pick(userData,'loc','loclast','checkin'), loc);
			}
			else
				Users.update(this.userId, {$set: {loc: userData.loclast}});
		}
		else
			Users.update(this.userId, {$set: {loc: null}});
	},
	friendAdd: function(pendUserId) {
		
		if(!this.userId || this.userId===pendUserId) return null;

		Users.update(this.userId, {$addToSet: {usersPending: pendUserId} });
		Users.update(pendUserId, {$addToSet: {usersReceive: this.userId} });

		console.log('friendAdd Pending', this.userId, pendUserId);
	},
	friendConfirm: function(confirmUserId) {
		
		if(!this.userId || this.userId===confirmUserId) return null;

		confirmFriends(this.userId, confirmUserId);

		console.log('friendConfirm', this.userId, confirmUserId);
	},
	friendDel: function(delUserId) {

		if(!this.userId) return null;

		Users.update(this.userId, {$pull: {friends: delUserId} });
		Users.update(delUserId, {$pull: {friends: this.userId} });
		
		console.log('friendDel', this.userId, delUserId);
	},
	friendBlock: function(blockUserId) {

		if(!this.userId) return null;
		
		Users.update(this.userId, {$pull: {friends: blockUserId} });
		Users.update(blockUserId, {$pull: {friends: this.userId} });
		Users.update(this.userId, {$addToSet: {usersBlocked: blockUserId} });

		console.log('friendBlock', this.userId, blockUserId);
	},
	addCheckin: function(placeId) {

		//TODO spostare in /server/profile.js

		if(!this.userId || !placeId) return null;

		var placeData = Places.findOne(new Meteor.Collection.ObjectID(placeId)),
			userData = Meteor.user();

 		if(userData.checkin)
 			Places.update({_id: new Meteor.Collection.ObjectID(userData.checkin) }, {
 					$pull: {checkins: this.userId}
 				});

		Places.update({_id: new Meteor.Collection.ObjectID(placeId)}, {
				$addToSet: {
					checkins: this.userId, hist: this.userId
				}
				//TODO http://stackoverflow.com/questions/21466297/slice-array-in-mongodb-after-addtoset-update
				// $addToSet: {
				// 	checkins: this.userId,
				// 	hist: { $each: [this.userId], $slice: Meteor.settings.public.maxHist }
				// }
			});
		Users.update(this.userId, {
				$set: {
					checkin: placeId,
					//loc: null,
					//loclast: placeData.loc,
					locmap: placeData.loc
				},
				$addToSet: {
					hist: placeId
				}
				//TODO
				// $addToSet: {
				// 	hist: { $each: [placeId], $slice: Meteor.settings.public.maxHist }
				// }
			});
		
		console.log('addCheckin', userData.username, placeData.name);
	},
	removeCheckin: function(placeId) {

		if(!this.userId || !placeId) return null;

		Places.update({_id: new Meteor.Collection.ObjectID(placeId)}, {
				$pull: {
					checkins: this.userId
				}
			});
		Users.update(this.userId, {
				$set: {
					checkin: null
				}
			});
		
		console.log('removeCheckin', this.userId, placeId);
	},
	addFavorite: function(placeId) {

		if(!this.userId) return null;

		Places.update({_id: new Meteor.Collection.ObjectID(placeId)}, {$inc: {rank: 1} });
		Users.update(this.userId, {$addToSet: {favorites: placeId} });
		
		console.log('addFavorite', this.userId, placeId);
	},
	removeFavorite: function(placeId) {
		
		if(!this.userId) return null;

		Places.update({_id: new Meteor.Collection.ObjectID(placeId), rank: {$gt: 0} }, {$inc: {rank: -1} });
		Users.update(this.userId, {$pull: {favorites: placeId} });
		
		console.log('removeFavorite', this.userId, placeId);
	},
	uploadAvatar: function(fileObj) {

		if(!this.userId) return null;

		var fs = Npm.require('fs');

		var	filePath = Meteor.settings.dirs.avatars,
			fileUrl = Meteor.settings.public.urls.avatars,
			imgSize = Meteor.settings.public.avatarSize,
			fileUid = Meteor.user().username +'_'+ K.util.timeUnix(),
			fileName = K.util.sanitizeFilename( fileUid ),
			fileMin = fileName + _.template('_{width}x{height}.min.jpg', imgSize),
			fileBig = fileName + '.ori.jpg',
			imgOpts = _.extend(imgSize, {
				srcPath: filePath + fileBig,
				dstPath: filePath + fileMin,
				customArgs: ['-auto-orient']
			});

		if(!K.util.valid.image(fileObj)) {
			console.log('uploadAvatar: error ', _.omit(fileObj,'blob') );
			throw new Meteor.Error(500, i18n('errors.imageNotValid') + K.util.human.filesize(Meteor.settings.public.maxImageSize) );
		}

		console.log('uploadAvatar: wrinting...', fileBig);
		fs.writeFileSync(filePath + fileBig, fileObj.blob, 'binary');
		fs.chmodSync(filePath + fileBig, 0755);

		if(!Imagemagick)
			fileMin = fileBig;
		else
		{
			console.log('uploadAvatar: resizing...');
			try {

				Imagemagick.crop(imgOpts);

				fs.chmodSync(filePath + fileMin, 0755);
			}
			catch(e) {
				console.log('uploadAvatar: error ', e);
				return i18n('errors.imageNotValid');
			}
			console.log('uploadAvatar: resized', fileMin);
		}


		Users.update(this.userId, {
			$set: {
				avatar: fileUrl + fileMin
			}
		});
		console.log('uploadAvatar: url ', fileMin );
	}
});