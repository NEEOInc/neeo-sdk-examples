'use strict';

module.exports = Object.freeze({
    BEACON_TYPE_CC: "CC",
    BEACON_TYPE_IR: "IR",
    BEACON_TYPE_SR: "SR",

    BEACON_UUID: "UUID",
    BEACON_MODEL: "Model",
    BEACON_URL: "Config-URL",

    LINK_TYPE_3RELAY: "3 RELAY",
    LINK_TYPE_3IR: "3 IR",
    LINK_TYPE_1SERIAL: "1 SERIAL",
    LINK_TYPE_1IR: "1 IR",
    LINK_TYPE_1IRBLASTER: "1 IR_BLASTER",
    LINK_TYPE_1IRTRIPORT: "1 IRTRIPORT",
    LINK_TYPE_1IRTRIPORTBLASTER: "1 IRTRIPORT_BLASTER",

    COMMAND_GETDEVICES: "getdevices",
    COMMAND_GETSTATE: "getstate",
    COMMAND_SETSTATE: "setstate",
    COMMAND_SENDIR: "sendir",

    RESPONSE_SETSTATE: "setstate",
    RESPONSE_STATE: "state",
    RESPONSE_IR: "completeir",

    PORT_NUMBER: 4998
});