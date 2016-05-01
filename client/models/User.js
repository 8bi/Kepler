/*
	Classe User
*/
//TODO Climbo.destroyUser = function(userId) {};//eliminare anche marker popup e icon
//TODO nuovo campo near by geonames, se loc attivo senza checkin

Climbo.User = Climbo.Class.extend({

	id: null,
	data: {},					//dati orignali dal db
	type: 'user',
	tmpl: Template.item_user,	//template for items list	

	init: function(userId) {

		var self = this;

		self.id = userId;		//mongoid
		self._dep = new Tracker.Dependency();
		self.rData = function() {	//Data Reactive Source
			self._dep.depend();
			return self;
		};

		self.update = function(comp) {	//sincronizza istanza con dati nel db
			
			self.data = Users.findOne(self.id);

			_.extend(self, self.data);

			if(self.isMe()) {
				if(self.loc)
					self.showMarker();
				else
					self.hideMarker();
			}
			else {
				if(self.online && self.loc && !self.checkin)
					self.showMarker();
				else
					self.hideMarker();
			}

			self._dep.changed();
		};
		Tracker.autorun( self.update );	//TODO aggiornare solo se amico
	},

	//PUBLIC METHODS:
	loadLoc: function() {
		var self = this;
		Climbo.map
			.loadItem(self)
			.loadLoc(self.loc, function() {
				self.icon.animate();
			});
	},

	showMarker: function() {

		var self = this;

		if(!self.marker)
		{
			self.icon = new L.NodeIcon({className: 'marker-'+(self.isMe()?'profile':'friend') });
			self.marker = new L.Marker(self.loc, {icon: self.icon});
			self.marker.item = self;
			self.marker.on('click mousedown', function(e) {
				if(!this._popup) {
					self.popup$ = L.DomUtil.create('div','popup-user');
					Blaze.renderWithData(Template.item_user, self, self.popup$);
					this.bindPopup(self.popup$, { closeButton:false });
				}
			});
		}

		self.marker.setLatLng(self.loc);
		
		Climbo.map.loadItem(self);
	},

	hideMarker: function() {
		if(this.marker && this.marker._map)
			this.marker._map.removeLayer(this.marker);
	},

	isFriend: function() {
		return Climbo.profile.hasFriend(this.id);
	},
	isPending: function() {
		return Climbo.profile.hasPending(this.id);
	},
	isReceive: function() {
		return Climbo.profile.hasReceive(this.id);
	},	

	isMe: function() {
		return Climbo.profile.id === this.id;
	},

	isOnline: function() {
		this._dep.depend();
//TODO aggiuni this.isMe()
		if(Climbo.profile.getOnline() && this.isFriend())
			return this.online;
	},

	getLoc: function() {
		this._dep.depend();
//TODO aggiuni this.isMe()		
		if(Climbo.profile.getOnline() && this.isFriend() && this.online)
			return this.loc;
	},

	checkinPlace: function() {
		this._dep.depend();
//TODO aggiuni this.isMe()		
		if(Climbo.profile.getOnline() && this.isFriend() && this.online)
			return this.checkin ? Climbo.newPlace(this.checkin).rData() : null;
	}
});

//TODO move to Climbo.Class.newItem()
Climbo.newUser = function(id)
{
	if(!id) return null;
	if(!Climbo.usersById[id])
		Climbo.usersById[id] = new Climbo.User(id);

	//for debugging
	var iname = Climbo.util.sanitizeFilename(Climbo.usersById[id].username);
	Climbo.usersByName[iname || id] = Climbo.usersById[id];

	return Climbo.usersById[id];
};