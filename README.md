bip-pod-zoho
=======

[Zoho](http://www.zoho.com) Pod for Bipio.  

## Installation

From bipio server install directory

    npm install bip-pod-zoho

Auto install script will register the pod with the bipio server and add sparse
configuration to your NODE_ENV environment config ('default.json', staging or production)
keyed to 'zoho'.

Manually restart the bipio server at your convenience.

## Actions

### create_lead

Create a Zoho Lead

Sample Channel Config :

```
"action" : "zoho.create_lead",
"config": {
  "name_tokenizer": "reverse"
}
```

### create_call

Create a Zoho Call and Leads Lookup

Sample Channel Config :

```
"action" : "zoho.create_call",
"config": {
  "default_description": "Default Call Description"
}
```

[Bipio Docs](https://bip.io/docs/pods/zoho)

## License

BipIO is free for non-commercial use - [GPLv3](http://www.gnu.org/copyleft/gpl.html)

Our open source license is the appropriate option if you are creating an open source application under a license compatible with the GNU GPL license v3. 

Bipio may not be used for Commercial purposes by an entity who has not secured a Bipio Commercial OEM License.  To secure a Commercial OEM License for Bipio,
please [reach us](mailto:enquiries@cloudspark.com.au)

![Cloud Spark](http://www.cloudspark.com.au/cdn/static/img/cs_logo.png "Cloud Spark - Rapid Web Stacks Built Beautifully")
Copyright (c) 2010-2013  [CloudSpark pty ltd](http://www.cloudspark.com.au)