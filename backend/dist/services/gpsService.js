"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startSession = void 0;
const gpsModel_1 = require("../models/gpsModel");
const startSession = async (category, notes) => {
    return await gpsModel_1.Session.create({
        category,
        notes,
        startTime: new Date()
    });
};
exports.startSession = startSession;
