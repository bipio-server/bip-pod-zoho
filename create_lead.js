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
function CreateLead(podConfig) {}

CreateLead.prototype = {};

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
    var body = '<Leads>\n\
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

    this.pod.post(channel, body, 'Leads/insertRecords', sysImports.auth.issuer_token.password, next);
}

// -----------------------------------------------------------------------------
module.exports = CreateLead;