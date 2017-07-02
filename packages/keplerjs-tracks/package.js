
Package.describe({
  name: 'keplerjs:tracks',
  summary: 'keplerjs plugin tracks',
  version: '0.0.1',
  git: ''
});

Package.onUse(function(api) {

  api.versionsFrom("METEOR@1.0");
  
  api.use([
    'keplerjs:core',
    'keplerjs:geoinfo'
  ]);

  api.addFiles([
    'collections/tracks.js',
    'startup.js'
  ],['client','server']);

  api.addFiles([
    'client/models/Place_tracks.js',
    'client/views/popups.html',    
    'client/views/panels.html',
    'client/views/panels.js',
  ],'client');

  api.addFiles([
    'server/admin/tracks.js',    
    'server/pubs.js',
  ],'server');
  
});
