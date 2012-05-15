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

    {"from": "/stations/:id/annual", "to": "_view/measurement_by_station_and_date",
        query : {
            "reduce" : "true",
            "group": "true",
            "group_level" : "3",

            "startkey" : [":id"],
            "endkey" : [":id", {}]

        }
    },

    {from: '/', to: 'index.html'},
    {from: '/loader.html', to: '/loader.html'},
    {from: '/images/*', to: 'static/images/*'},
];