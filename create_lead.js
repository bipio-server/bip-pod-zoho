/**
 *
 * The Bipio Zoho Pod.  create_call action definition
 * ---------------------------------------------------------------
 *
 * @author Michael Pearson <michael@cloudspark.com.au>
 * Copyright (c) 2010-2013 CloudSpark pty ltd http://www.cloudspark.com.au
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
var request    = require('request'),
xml2json = require('xml2json');

function CreateLead(podConfig) {
    this.name = 'create_lead';
    this.description = 'Create a Zoho Lead',
    this.trigger = false;
    this.singleton = false;
    this.podConfig = podConfig;
}

CreateLead.prototype = {};

CreateLead.prototype._getEndpoint = function(path, token) {
    return 'https://crm.zoho.com/crm/private/xml/' + path + '?newFormat=1&authtoken=' + token + '&scope=crmapi';
};

CreateLead.prototype.getSchema = function() {
    return {
        'config' : { // config schema
            properties : {
                name_tokenizer : {
                    description : "Name Tokenize Order",
                    type : "string",
                    oneOf : [{
                        "$ref" : "#/definitions/tokenize_order"
                    }]
                }
            },
            definitions : {
                "tokenize_order" : {
                    "description" : "For full names mapped to the `first_name` import, describes if the name should be tokenized by first_name last_name or last_name first_name",
                    "enum" : [ "natural" , "reverse" ],
                    "enum_label" : [ "natural" , "reverse" ],
                    "default" : "natural",
                    "required" : false
                }
            }
        },
        'exports' : {
            properties : {
                'id' : {
                    type : 'string',
                    description : 'Lead ID'
                },
                'created_time' : {
                    type : 'string',
                    description : 'Created Time'
                },
                'modified_time' : {
                    type : 'string',
                    description : 'Modified Time'
                },
                'created_by' : {
                    type : 'string',
                    description : 'Created By UserID'
                },
                'modified_by' : {
                    type : 'string',
                    description : 'Modified By UserID'
                }
            }
        },
        "imports": {
            properties : {
                'lead_source' : {
                    type : 'string',
                    description : 'Lead Source'
                },
                'company' : {
                    type : 'string',
                    description : 'Company Name'
                },
                'first_name' : {
                    type : 'string',
                    description : 'First Name'
                },
                'last_name' : {
                    type : 'string',
                    description : 'Last Name'
                },
                'email' : {
                    type : 'string',
                    description : 'Email Address'
                },
                'title' : {
                    type : 'string',
                    description : 'Title'
                },
                'phone' : {
                    type : 'string',
                    description : 'Phone'
                },
                'home_phone' : {
                    type : 'string',
                    description : 'Home Phone'
                },
                'other_phone' : {
                    type : 'string',
                    description : 'Other Phone'
                },
                'fax' : {
                    type : 'string',
                    description : 'Fax #'
                },
                'mobile' : {
                    type : 'string',
                    description : 'Mobile Phone'
                }
            }
        }
    }
}

/**
 * Invokes (runs) the action.
 */
CreateLead.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
    var exports = {},
    firstName = imports.first_name,
    lastName = imports.last_name,
    nameTokens,
    log = this.$resource.log;

    // try to tokenize names
    if (!imports.last_name && imports.first_name) {
        nameTokens = imports.first_name.split(' ');
        if (Zoho._testConfig(channel, 'name_tokenizer', 'reverse')) {
            lastName = nameTokens.shift();
            firstName = nameTokens.shift();
        } else {
            firstName = nameTokens.shift();
            lastName = nameTokens.shift();
        }
    }

    // lead creation struct
    var struct = '<Leads>\n\
<row no="1">\n\
<FL val="Lead Source">' + imports.lead_source + '</FL>\n\
<FL val="Company">' + imports.company + '</FL>\n\
<FL val="First Name">' + firstName + '</FL>\n\
<FL val="Last Name">' + lastName + '</FL>\n\
<FL val="Email">' + imports.email + '</FL>\n\
<FL val="Title">' + imports.title + '</FL>\n\
<FL val="Phone">' + imports.phone + '</FL>\n\
<FL val="Home Phone">' + imports.home_phone + '</FL>\n\
<FL val="Other Phone">' + imports.other_phone + '</FL>\n\
<FL val="Fax">' + imports.fax + '</FL>\n\
<FL val="Mobile">' + imports.mobile + '</FL>\n\
</row>\n\
</Leads>';

    var uri = this._getEndpoint('Leads/insertRecords', sysImports.auth.issuer_token.password) + '&xmlData=' + encodeURIComponent(struct);

    request.post(
    {
        url : uri
    },
    function(error, response, body) {
        if (!error && response.statusCode == 200) {
            // extract response data
            var jsonBody = xml2json.toJson(body, {
                object : true
            });
            if (jsonBody.response.error) {
                var errNorm = this._description + ' ' + jsonBody.response.error.message + ' code[' + jsonBody.response.error.code + ']';
                log(errNorm, channel, 'error');
            } else {
                exports = jsonBody.result.recorddetail;
            }

            next(error, exports);
        } else {
            log(response.body, channel, 'error');
        }
    });
}

// -----------------------------------------------------------------------------
module.exports = CreateLead;