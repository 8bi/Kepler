

//TODO creare numberHuman da usare in bagde chekins e stars 2000 -> 2K 

Climbo.util.human = {

	azimut: function(ang, shortnames) {
		shortnames = shortnames || false;
	
		//console.log(Math.round(ang/22.5));

		if(shortnames)
			return i18n('azimuth_short').split()[ Math.round(ang/22.5) ];
		else
			return i18n('azimuth.').split()[ Math.round(ang/22.5) ];
	},

	time: function(sec, ago) {
		//http://goo.gl/8DqYS
		if(ago)
			sec = Climbo.util.timeUnix() - sec;

		var y = Math.floor(sec / 31536000),
			m = Math.floor(sec / 2629744),
			d = Math.floor((sec % 31536000) / 86400),
			h = Math.floor(((sec % 31536000) % 86400) / 3600),
			i = Math.floor((((sec % 31536000) % 86400) % 3600) / 60),
			s = (((sec % 31536000) % 86400) % 3600) % 60,
			ret = '';

		if(y>0)
			ret+=' '+y+' '+i18n('times.y').split()[y>1?1:0];
		if(y<2 && m>0)
			ret+=' '+m+' '+i18n('times.m').split()[m>1?1:0];
		if(m<2 && d>0)
			ret+=' '+d+' '+i18n('times.d').split()[d>1?1:0];
		if(d<2 && h>0)
			ret+=' '+h+' '+i18n('times.h').split()[h>1?1:0];
		if(h<3 && i>0)
			ret+=' '+i+' '+i18n('times.i').split()[i>1?1:0];
		if(h<1 && i<3 && s>0)
			ret+=' '+s+' '+i18n('times.s').split()[s>1?1:0];

		return ret;
	},

	date: function(date, sep, shortnames, showyear) {
		// date: 12-04-2012
		sep = sep || ' ';
		shortnames = shortnames || false;
		showyear = showyear || false;
		
		return date.replace(
			/^(\d{1,2})-(\d{1,2})-(\d{4})$/,
			function(all, d,m,y) {
				var oggi = new Date(),
					giorno = oggi.getDate(),
					mese = oggi.getMonth()+1,
					anno = oggi.getFullYear(),
					monthnames = shortnames ? i18n('months_short').split() : i18n('months').split(),
					days = i18n('days').split(),
					//{'-1':'Ieri', '0':'Oggi', '1':'Domani'}
					ret = '',
					dweek = (new Date(y, m-1, d)).getDay();

				var fulldate = d +sep+ monthnames[parseInt(m)] + (showyear ? sep+y : '');	//full date
			
				if(m==mese && y==anno)
				{
					if( i18n('days_name.'+(d-giorno)) )
						ret = i18n('days_name.'+(d-giorno)) + sep;
					else
						ret = days[dweek] + sep + fulldate;
					//TODO togliere giorno della settiman se il giorno è piu di una settimana fa
				}
				else
					ret = fulldate;
			
				return ret;
			});
	},

	distance: function(d, sign) {
		sign = sign || false;
		var len='',unit='',s='';
		d= parseInt(d);
		if(d < 2000){
			d = d.toFixed(0);
			unit = 'm';
		}else{
			d = (d/1000).toFixed(1);
			unit = 'km';
		}
		if(sign)
			s = d>0 ? '+' : '';
		return s + d +unit;
	},
	
	filesize: function(bytes, decimal) {
		if (bytes === 0) return bytes;		
		decimal = decimal || 1;
		var sizes = ['Bytes','KB','MB','GB','TB'],
			i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
		return Math.round(bytes / Math.pow(1024, i), decimal) + ' ' + sizes[i];
	},

	latlng: function (ll, sep, pre) {
		sep = sep || ' ';
		pre = pre || 6;
		if(Climbo.util.valid.loc(ll))
			return ll[0].toFixed(pre)+ sep +ll[1].toFixed(pre);
		else
			return '';
	}
};
