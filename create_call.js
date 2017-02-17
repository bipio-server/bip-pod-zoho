/**
 *
 * The Bipio Zoho Pod.  create_call action definition
 * ---------------------------------------------------------------
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
function CreateCall(podConfig) {}

CreateCall.prototype = {};

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
<FL val="Description">' + (imports.description || imports.default_description) + '</FL>\n\
<FL val="Call Result">' + (imports.call_result || '') + '</FL>\n\
</row>\n\
</Calls>';

// <FL val="Billable">false<FL>\n\

    this.pod.post(channel, body, 'Calls/insertRecords', sysImports.auth.issuer_token.password, next);
}

// -----------------------------------------------------------------------------
module.exports = CreateCall;