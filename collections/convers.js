
Convers = new Mongo.Collection('convers');

K.queries({
	findConverById: function(convId) {
		//TODO ritornare solo ultimi 10 messaggi!!
		//TODO scaricare messaggi un po alla volta
		return Convers.find(convId, K.filter.converPanel);
	},
	findConversByIds: function(convIds) {
		
		convIds = _.isArray(convIds) ? {$in: convIds} : convIds;

		return Convers.find({_id: convIds }, K.filter.converItem);
	},
	findConversByTarget: function(targetId) {
		return Convers.find({targetId: targetId }, K.filter.converItem);
	}
});

//TODO
Convers.allow({
	insert: function(userId, doc) {
		return true;
	},
	update: function(userId, doc, fieldNames, modifier) {
		
		//if private conver update target user
		if(doc.targetType==='user')
			Users.update(doc.targetId, {
				$addToSet: {
					convers: doc._id
				}
			});
		//TODO FIXME ottimizzare... non eseguire sempre ad ogni messaggio

		return true;
	},
	remove: function(userId, doc) {
		return userId && doc.userId === userId;
	}
});
