
//http://stackoverflow.com/questions/27542120/whats-the-difference-between-writing-routes-in-meteor-startup-and-not

Kepler.router = {
	go: function() {
		Router.go.apply(Router, arguments);
	},
	routeName: function() {
		var route = Router.current().route;
		return route ? route.getName() : 'page404';
	}
};

//Router.setTemplateNameConverter(function (str) { return str; });

Router.configure({
	layoutTemplate: 'layoutMap',
	loadingTemplate: 'panelLoading',
	notFoundTemplate: 'page404'
});

Router.subscriptions(function() {
	this.subscribe('currentUser').wait();
});

Router.waitOn(function() {
	var self = this;

	if(Meteor.user())
	{
		K.profile.initProfile(function() {
			self.next();
		});
	}
	else
	{
		if(Meteor.loggingIn())
			this.render('panelLoading');
		else
			Router.go('intro');
	}
	  
}, {except: ['intro'] });

Router.onBeforeAction(function() {

	var self = this;
	
	if(this.ready())
	{
		K.map.initMap({
				center: K.profile.data.locmap,
				layer: K.profile.data.settings.layer
			}, function() {
				this.enableBBox();
			});
	}
	else
		this.render('pageLoading');
	
	self.next();

}, {except: ['intro','settings','settingsBlocked','about','logout'] });//*/

Router.onAfterAction(function() {
	document.title = i18n('titles.'+this.route.getName()) || _.str.capitalize(this.route.getName());	
});

Router.map(function() {

	this.route('intro', {
		path: '/intro',
		template: 'pageIntro',
		layoutTemplate: 'layoutFull',
		loadingTemplate: 'pageLoading',
	});

	this.route('about', {
		path: '/about',
		template: 'pageAbout',
		layoutTemplate: 'layoutPage',
		loadingTemplate: 'pageLoading',
	});	

	this.route('settings', {
		path: '/settings',
		template: 'pageSettings',
		layoutTemplate: 'layoutPage',
		loadingTemplate: 'pageLoading'
	});

	this.route('settingsBlocked', {
		path: '/settings/blocked',
		template: 'pageSettingsBlocked',
		layoutTemplate: 'layoutPage',
		loadingTemplate: 'pageLoading',
		waitOn: function() {
			return Meteor.subscribe('usersByIds', K.profile.data.friends );
		}
	});	

	this.route('logout', {
		path: '/logout',
		template: 'pageIntro',
		layoutTemplate: 'layoutFull',
		loadingTemplate: 'pageLoading',
		onBeforeAction: function () {
			K.profile.logout();
			K.map.destroyMap();
			Router.go('intro');
		}
	});

	//MAP PAGES

	this.route('map', {
		path: '/',
		template: 'emptyTmpl',
		data: { hideSidebar: true }
	});

	this.route('profile', {
		path: '/profile',
		template: 'panelProfile',
		data: function() {
			return Meteor.user();
		}
	});

	this.route('friends', {
		path: '/friends',
		template: 'panelList',
		waitOn: function() {
			return Meteor.subscribe('friendsByIds', K.profile.data.friends);
		},
		data: function() {
			if(!this.ready()) return null;
			return {
				title: i18n('titles.friends'),
				className: 'friends',			
				header: {
					template: 'item_friend_search'
				},		
				itemsTemplate: 'item_friend',
				items: _.map(K.profile.data.friends, function(id) {
					
					var user = K.newUser(id);
					user.update();

					return user;
				})
			};
		}	
	});

	this.route('convers', {
		path: '/convers',
		template: 'panelList',
		waitOn: function() {
			return Meteor.subscribe('conversByIds', K.profile.data.convers);
		},
		data: function() {
			return {
				title: i18n('titles.convers'),
				className: 'convers',
				itemsTemplate: 'item_conver',
				items: getConversByIds(K.profile.data.convers).fetch(),
				sortDesc: true
			};
		}
	});
	

	this.route('favorites', {
		path: '/favorites',
		template: 'panelList',
		waitOn: function() {
			return Meteor.subscribe('placesByIds', K.profile.data.favorites);
		},
		data: function() {
			if(!this.ready()) return null;
			return {
				title: i18n('titles.favorites'),
				className: 'favorites',
				itemsTemplate: 'item_place_favorite',
				items: _.map(K.profile.data.favorites, function(id) {
					var place = K.newPlace(id);
					place.update();
					return place.rData();
				}),
				sortBy: 'name'
			};
		}
	});

	this.route('hist', {
		path: '/history',
		template: 'panelList',
		waitOn: function() {
			return Meteor.subscribe('placesByIds', K.profile.data.hist);
		},
		data: function() {
			if(!this.ready()) return null;
			return {
				title: i18n('titles.histplaces'),
				className: 'history',
				itemsTemplate: 'item_place_favorite',
				items: _.map(K.profile.data.hist, K.newPlace)
			};
		}
	});

	this.route('notif', {
		path: '/notifications',
		template: 'panelList',
		data: function() {
			if(!this.ready()) return null;
			return {
				title: i18n('titles.notifications'),
				className: 'notifications',
				header: {
					template: 'item_notif_clean'
				},				
				itemsTemplate: 'item_notif',
				items: _.map(K.profile.data.notif, function(text) {
					var type = _.shuffle(K.notif._types)[0];
					return {
						type: type,
						msg: type+': '+text
					}
				})
			};
		}
	});

	this.route('nearby', {
		path: '/nearby',		
		template: 'panelNearby',
		data: function() {
			if(!this.ready()) return null;

			var bbox = K.map.getBBox(),
				places = _.map(getPlacesByBBox(bbox).fetch(), function(place) {
					var p = K.newPlace(place._id._str);
					if($(p.marker._icon).is(':visible'))
						return p.rData();
				});

			if(bbox) {
				return {
					places: _.sortBy(_.compact(places), 'name')
				};
			}
		}
	});

	this.route('place', {
		path: '/place/:placeId',		
		template: 'panelPlace',
		waitOn: function() {
			return Meteor.subscribe('placeById', this.params.placeId);
		},
		data: function() {
			if(!this.ready()) return null;
			var place = K.newPlace( this.params.placeId );
			return place.rData();
		}
	});

	this.route('placeMap', {
		path: '/place/:placeId/map',
		template: 'emptyTmpl',
		waitOn: function() {
			return Meteor.subscribe('placesByIds', [this.params.placeId]);
		},
		onAfterAction: function() {
			if(!this.ready()) return null;

			var place = K.newPlace( this.params.placeId );

			if(place)
				place.loadLoc();
		},
		data: { hideSidebar: true }
	});

	this.route('placeCheckins', {
		path: '/place/:placeId/checkins',
		template: 'panelList',
		waitOn: function() {
			return Meteor.subscribe('usersByPlace', this.params.placeId);
		},
		data: function() {
			if(!this.ready()) return null;

			var place = K.newPlace(this.params.placeId);

			return place && {
				title: i18n('titles.checkins', place.name),
				className: 'checkins',
				itemsTemplate: 'item_user',
				items: _.map(place.checkins, function(id) {
					return K.newUser(id);
				})
			};
		}
	});

	this.route('placeConvers', {
		path: '/place/:placeId/convers',
		template: 'panelList',
		waitOn: function() {
			return Meteor.subscribe('conversByPlace', this.params.placeId);
		},
		data: function() {
			var place = K.newPlace(this.params.placeId);

			return place && {
				title: i18n('titles.placeConvers', place.name),
				className: 'placeConvers',
				header: {
					template: 'item_conver_new',
					data: place
				},				
				itemsTemplate: 'item_conver',
				items: getConversByPlace(this.params.placeId).fetch()
			};
		}
	});

	this.route('placePois', {
		path: '/place/:placeId/pois',
		template: 'emptyTmpl',
		waitOn: function() {
			return Meteor.subscribe('poisByPlace', this.params.placeId);
		},
		onAfterAction: function() {
			var place = K.newPlace( this.params.placeId );

			if(place)
				place.loadPois();
		},
		data: { hideSidebar: true }
	});

	this.route('placeTracks', {
		path: '/place/:placeId/tracks',
		template: 'emptyTmpl',
		waitOn: function() {
			return Meteor.subscribe('tracksByPlace', this.params.placeId);
		},
		onAfterAction: function() {
			var place = K.newPlace( this.params.placeId );

			if(place)
				place.loadTracks();
		},
		data: { hideSidebar: true }
	});
	
	this.route('user', {
		path: '/user/:userId',
		template: 'panelUser',
		waitOn: function() {
			if(this.params.userId===Meteor.userId())
				Router.go('profile');
			else
				return Meteor.subscribe('userById', this.params.userId);
		},
		data: function() {
			if(this.ready()) {
				var user = K.newUser(this.params.userId);
				user.update();
				return user.rData();
			}
			else
				this.render('panelLoading');
		}
	});

	this.route('userConver', {
		path: '/user/:userId/conver',
		template: 'emptyTmpl',
		waitOn: function() {
			if(this.params.userId===Meteor.userId())
				Router.go('convers');
			else
				K.conver.loadConverWithUser( this.params.userId );
		}
	});

	this.route('userMap', {
		path: '/user/:userId/map',
		template: 'emptyTmpl',
		waitOn: function() {
			return Meteor.subscribe('friendsByIds', [this.params.userId]);
		},
		onAfterAction: function() {
			var user = K.newUser( this.params.userId );

			if(user)
				user.loadLoc();
		},		
		data: { hideSidebar: true }
	});	

	this.route('conver', {
		path: '/conver/:convId',
		template: 'panelConver',
		waitOn: function() {
			return Meteor.subscribe('converById', this.params.convId);
		},
		data: function() {
			return getConverById(this.params.convId).fetch()[0];
		}
	});

	/*TODO
	this.route('userConver', {
		path: '/user/:userId/bid',
		//template: 'panelConver',
		onBeforeAction: function() {
			if(this.params.userId===Meteor.userId())
				Router.go('convers');
			
			//TODO send invitation to going in place
		}
	});*/	
});
