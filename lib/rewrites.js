/**
 * Rewrite settings to be exported from the design doc
 */

module.exports = [
    {from: '/static/*', to: 'static/*'},
    {from: '/modules.js', to: 'modules.js' },
    {"from": "/_db/*", "to": "../../*" },
    {"from": "/_db", "to": "../.." },
    {"from": "/data", "to": "_spatial/_list/geojson/points" },
    {from: '/', to: 'index.html'},
    {from: '/loader.html', to: '/loader.html'},
];