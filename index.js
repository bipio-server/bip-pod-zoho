/**
 * 
 * The Bipio Zoho Pod.  Zoho Actions and Content Emitters
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
var Pod = require('bip-pod'),
    Zoho = new Pod({
        name : 'zoho',
        description : 'Zoho',
        description_long : 'The Zoho Office Suite is a Web-based \n\
online office suite containing word processing, spreadsheets, presentations, \n\
databases, note-taking, wikis, customer relationship management (CRM), project \n\
management, invoicing, and other applications developed by ZOHO Corporation.',
        authType : 'issuer_token'        
    });

Zoho.add(require('./create_lead.js'));
Zoho.add(require('./create_call.js'));

// -----------------------------------------------------------------------------
module.exports = Zoho;
