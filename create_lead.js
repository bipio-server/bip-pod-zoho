/**
 *
 * The Bipio Zoho Pod.  create_call action definition
 * ---------------------------------------------------------------
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