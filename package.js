Package.describe({
    name: 'jalik:alerts',
    version: '0.1.0',
    author: 'karl.stein.pro@gmail.com',
    summary: 'Simple alert helper',
    homepage: 'https://github.com/jalik/jalik-alerts',
    git: 'https://github.com/jalik/jalik-alerts.git',
    documentation: 'README.md'
});

Package.onUse(function (api) {
    api.versionsFrom('1.3.2.4');
    api.use('ecmascript');
    api.use('mongo');
    api.use('underscore');
    api.mainModule('alerts.js');
});

