
Package.describe({
  name: 'keplerjs:upload',
  summary: 'keplerjs plugin for files upload',
  version: "1.1.0",
  git: "https://github.com/Keplerjs/Kepler.git"
});

Package.onUse(function(api) {

  api.versionsFrom("METEOR@1.0");

  api.use([
    'mrt:imagemagick@0.1.2',
  ], 'server');

  api.use([
    'keplerjs:core@1.1.0',
  ]);

  api.addFiles([
    'plugin.js',
    'i18n/it.js',
    'i18n/en.js',
	'i18n/de.js'
  ]);

  api.addFiles([
    'client/Upload.js',
    'client/views/inputFileUpload.html',
    'client/views/inputFileUpload.js',
    'client/views/panels.html',
    'client/views/panels.js',
  ],'client');

  api.addFiles([
    'server/upload.js',
  ],'server');

});
