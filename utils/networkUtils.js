// Ref. http://stackoverflow.com/questions/3653065/get-local-ip-address-in-node-js
var os = require('os');
var ifaces = os.networkInterfaces();
var getLocalIP = function () {
    'use strict';
    var result = '';
    Object.keys(ifaces).forEach(function (ifname) {
        var alias = 0;

        ifaces[ifname].forEach(function (iface) {
            if (iface.family !== 'IPv4' || iface.internal !== false) {
                // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                return;
            }

            if (alias >= 1) {
                // this single interface has multiple ipv4 addresses
                result += ifname + ':' + alias + ' ' + iface.address + '\n';
            } else {
                // this interface has only one ipv4 adress
                result += ifname + ' ' + iface.address + '\n';
            }
            ++alias;
        });
    });

    return result;
};

module.exports = getLocalIP;