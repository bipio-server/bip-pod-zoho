/**
 *
 * The Bipio Zoho Pod.  Zoho Actions and Content Emitters
 *
 * Copyright (c) 2017 InterDigital, Inc. All Rights Reserved
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
