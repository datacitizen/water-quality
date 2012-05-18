

/**
 * Create a redirect url that can be mapped by a dashboard admin to the proper place.
 *
 * @name guessCurrent([loc])
 * @param {String} category - A category like, wiki used to define the general place you want the url to go
 * @param {String} id - An identifier for the resource in the category, like 'London_Bridge'
 * @returns {String} - A url.
 * @api public
 */

exports.createRedirectUrl = function(category, id){
    return '/dashboard/_design/dashboard/_rewrite/redirect/' + category + '/' + id;
}


exports.addActivityEntry = function(user, actionText, actionUrl, kanso_db_instance, callback) {
    try {
        var entry = {
            date : new Date.getTime(),
            user : user,
            actionText : actionText,
            actionUrl : actionUrl,
            type : 'garden.app.activity'
        }
        kanso_db_instance.saveDoc(entry, callback);

    } catch(e){
        callback(e);
    }
}

