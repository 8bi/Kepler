
Template.converInput.onRendered(function() {
	autosize( this.find('textarea') );
});

Template.converInput.events({
	'keydown textarea': function(e,tmpl) {
		if(e.keyCode===13)//enter
		{
			e.preventDefault();
			var text$ = tmpl.$('textarea');			
			
			K.conver.addMsgToConver(this._id, text$.val() );

			text$.val('').height('auto');
		}
	}
});

Template.converMsgs.helpers({
	msgsMore: function() {
		return [];
	},
	msgsLast: function() {

			//TODO refactoring with new API

			var tmpl = Template.instance(),
				list$ = $(tmpl.firstNode).parents('.panel-body');
			
			list$.scrollTop( list$.prop('scrollHeight') );

			return getMsgsByConver( Template.currentData()._id );
	}
});

Template.converMsgs.events({
	'click .conver-btn-more': function(e,tmpl) {
		e.preventDefault();
		$(e.target).prev().slideToggle();
	}
});
