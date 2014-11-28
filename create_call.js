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
<FL val="Description">' + (imports.description || channel.config.default_description) + '</FL>\n\
<FL val="Call Result">' + (imports.call_result || '') + '</FL>\n\
</row>\n\
</Calls>';

// <FL val="Billable">false<FL>\n\

    this.pod.post(channel, body, 'Calls/insertRecords', sysImports.auth.issuer_token.password, next);
}

// -----------------------------------------------------------------------------
module.exports = CreateCall;