
//TODO use namespace K for all global helpers!

Template.registerHelper('absoluteUrl', function(url) {
	return Meteor.absoluteUrl(url)
});

Template.registerHelper('settings', function(prop) {
	return K.Util.getPath(K.settings.public, prop);
});

Template.registerHelper('userById', function(id) {
	return K.userById(id);
});

Template.registerHelper('placeById', function(id) {
	return K.placeById(id);
});

Template.registerHelper('ifRoute', function(name, classTrue, classFalse) {
	var cur = Router.current();
	return cur.route && cur.route.getName()===name ? classTrue : classFalse;
});

Template.registerHelper('routeTitle', function() {
	var cur = Router.current();
	return cur.route && i18n('title_'+ cur.route.getName() );
});

Template.registerHelper('connectionStatus', function() {
	return Meteor.status();
});

Template.registerHelper('stringify', function(prop) {
	return JSON.stringify(prop,null,4);
});

Template.registerHelper('or', function() {
	return _.some(_.initial(arguments));
});

Template.registerHelper('arrayify',function(obj){
    var result = [];
    for(var k in obj)
    	result.push({key: k, val: obj[k] });
    return result;
});

Template.registerHelper('humanAzimut', function(ang) {
	return K.Util.humanize.azimut(ang);
});

Template.registerHelper('humanTime', function(sec, ago) {
	return K.Util.humanize.time(sec, parseInt(ago));
});

Template.registerHelper('numericDate', function(date) {
	if(!date) return '';
	date = new Date(date);
	return [date.getDate(), date.getMonth()+1, date.getFullYear()].join('/');
});

Template.registerHelper('humanDate', function(date, short) {
	return K.Util.humanize.date(date, short);
});

Template.registerHelper('humanDistance', function(dis, sign) {
	return K.Util.humanize.distance(dis, parseInt(sign));
});

Template.registerHelper('humanLoc', function(loc, pre) {
	return K.Util.humanize.loc(loc, parseInt(pre));
});
