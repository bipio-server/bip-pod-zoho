/**
 *
 * The Bipio Zoho Pod.  Zoho Actions and Content Emitters
 *
 * @author Michael Pearson <github@m.bip.io>
 * Copyright (c) 2010-2013 Michael Pearson https://github.com/mjpearson
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
var Pod = require('bip-pod'),
    request = require('request'),
    xml2json = require('xml2json'),
    Zoho = new Pod();


/**
 * Returns host + endpoint path
 */
Zoho.getPath = function(path, password) {
    return '/crm/private/xml/' + path + '?newFormat=1&authtoken=' + password + '&scope=crmapi';
};

Zoho._parseResponse = function(channel, next) {
    var log = this.$resource.log;

    return function(error, response, body) {
        if (!error && response.statusCode == 200) {
            // extract response data
            var jsonBody = xml2json.toJson(body, { object : true }),
                exports = {};

            if (jsonBody.response.result.recorddetail.FL) {
                // no idea what 'FL' stands for.
                var fl = jsonBody.response.result.recorddetail.FL;
                exports.message = jsonBody.response.result.message;
                // normalize to export
                for (var i = 0; i < fl.length; i++) {
                    exports[ fl[i].val.toLowerCase().replace(/\s/g, '_') ] =  fl[i].$t
                }

                next(false, exports);
            } else {
                log(body, channel, 'error');
                next(true, {});
            }
        } else {
            log(body, channel, 'error');
        }
    }
}

Zoho.post = function(channel, body, path, password, next) {
    var l = body.split('\n'),
        xmlData = '';

    for (var i = 0; i < l.length; i++) {
        if (!/></.test(l[i]) ) {
            xmlData += l[i];
        }
    }

    var reqStruct = {
        url : 'https://crm.zoho.com' + this.getPath(path, password) + '&xmlData=' + xmlData,
        method : 'POST',
        headers : {
            'Content-Type' : 'text/xml',
            'Content-Length' : Buffer.byteLength(body)
        },
        body : body
    }

    request(reqStruct, this._parseResponse(channel, next) );
}

// -----------------------------------------------------------------------------
module.exports = Zoho;
