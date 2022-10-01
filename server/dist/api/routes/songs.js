"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../../db");
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    res.send('Hello Songs!');
});
router.get('/some/:count', async (req, res) => {
    const count = parseInt(req.params.count);
    const songs = await db_1.db.songs.getRandom(count);
    res.send(songs);
});
exports.default = router;
//# sourceMappingURL=songs.js.map