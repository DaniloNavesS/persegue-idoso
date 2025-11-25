"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = void 0;
const list = async (_req, res) => {
    try {
        res.json({});
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.list = list;
