
K.Admin.addMethods({
	createNotif: function(text, type) {
		
		if(!K.Admin.isMe()) return false;
		
		Users.update(this.userId, {
			$push: {
				notif: text
			}
   		});
	}
});