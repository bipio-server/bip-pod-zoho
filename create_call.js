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
function CreateCall(podConfig) {
    this.name = 'create_call';
    this.description = 'Create a Zoho Call',
    this.trigger = false;
    this.singleton = false;
    this.podConfig = podConfig;
}

CreateCall.prototype = {};
CreateCall.prototype.getSchema = function() {
    return {
        'config' : { // config schema
            properties : {
                'default_description' : {
                    type : 'string',
                    description : 'Default Call Description'
                }
            }
        },
        'exports' : {
            properties : {
                'id' : {
                    type : 'string',
                    description : 'Call ID'
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
                    description : 'Created By'
                },
                'modified_by' : {
                    type : 'string',
                    description : 'Modified By'
                },
                'message' : {
                    type : 'string',
                    description : 'Zoho Create Call Result'
                }
            }
        },
        "imports": {
            properties : {
                'subject' : {
                    type : 'string',
                    description : 'Subject'
                },
                'call_type' : {
                    type : 'string',
                    description : 'Type'
                },
                'call_purpose' : {
                    type : 'string',
                    description : 'Purpose'
                },
                'lead_id' : {
                    type : 'string',
                    description : 'Lead ID'
                },
                'call_start_time' : {
                    type : 'string',
                    description : 'Start Time'
                },
                'call_duration' : {
                    type : 'string',
                    description : 'Duration'
                },
                'description' : {
                    type : 'string',
                    description : 'Description'
                }
            }
        }
    }
}

/**
 * Invokes (runs) the action.
 */
CreateCall.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
    // call creation struct
    var body = '<Calls>\n\
<row no="1">\n\
<FL val="SMOWNERID"></FL>\n\
<FL val="Subject">' + imports.subject + '</FL>\n\
<FL val="Call Type">' + imports.call_type + '</FL>\n\
<FL val="Call Purpose">' + imports.call_purpose + '</FL>\n\
<FL val="SEID">' + imports.lead_id + '</FL>\n\
<FL val="SEMODULE">Leads</FL>\n\
<FL val="Call Start Time">' + (imports.start_time || (new Date()).toString()) + '</FL>\n\
<FL val="Call Duration">' + imports.call_duration + '</FL>\n\
<FL val="Description">' + (imports.description || channel.config.default_description) + '</FL>\n\
<FL val="Call Result">' + (imports.call_result || '') + '</FL>\n\
</row>\n\
</Calls>';

// <FL val="Billable">false<FL>\n\

    this.pod.post(channel, body, 'Calls/insertRecords', sysImports.auth.issuer_token.password, next);
}

// -----------------------------------------------------------------------------
module.exports = CreateCall;