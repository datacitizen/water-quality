/**
 * Rewrite settings to be exported from the design doc
 */

module.exports = [
    {from: '/static/*', to: 'static/*'},
    {from: '/modules.js', to: 'modules.js' },
    {"from": "/_db/*", "to": "../../*" },
    {"from": "/_db", "to": "../.." },
    {"from": "/data", "to": "_spatial/_list/geojson/points" },
    {"from": "/stations", "to": "_list/geojson/stations", query : {"include_docs": 'true'} },
    {"from": "/stations1", "to": "_view//stations", query : {"include_docs": 'true'} },
    {from: '/', to: 'index.html'},
    {from: '/loader.html', to: '/loader.html'},
    {from: '/images/*', to: 'static/images/*'},
];