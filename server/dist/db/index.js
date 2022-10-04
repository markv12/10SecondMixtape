"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetDbToBackup = exports.getBackups = exports.backUpDb = exports.runOnReady = exports.init = exports.isReady = exports.db = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const c = __importStar(require("../common"));
const songs = __importStar(require("./models/songs"));
const parts = __importStar(require("./models/parts"));
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const minBackupInterval = 1000 * 60 * 60 * 3; // hours
const maxBackups = 20;
exports.db = {
    songs,
    parts,
};
let ready = false;
let databaseName = `ld51`;
const defaultMongoOptions = {
    hostname: `localhost`,
    port: 27017,
    dbName: databaseName,
};
let toRun = [];
const isReady = () => ready;
exports.isReady = isReady;
const init = ({ hostname = `0.0.0.0`, port = 27017, dbName = databaseName, }) => {
    return new Promise(async (resolve) => {
        if (ready)
            resolve();
        const onReady = async () => {
            c.log(`green`, `Connection to db established.`);
            ready = true;
            const promises = toRun.map(async (f) => {
                await f();
            });
            toRun = [];
            await Promise.all(promises);
            startDbBackupInterval();
            resolve();
        };
        if (mongoose_1.default.connection.readyState === 0) {
            const uri = `mongodb://${hostname}:${port}/${dbName}?writeConcern=majority&connectTimeoutMS=5000`;
            // c.log(uri)
            c.log(`gray`, `No existing db connection, creating...`);
            mongoose_1.default.connect(uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }).catch(() => { });
            mongoose_1.default.connection.on(`error`, (error) => c.log(`red`, error.message));
            mongoose_1.default.connection.once(`open`, () => {
                onReady();
            });
        }
        else {
            onReady();
        }
    });
};
exports.init = init;
const runOnReady = (f) => {
    if (ready)
        f();
    else
        toRun.push(f);
};
exports.runOnReady = runOnReady;
function startDbBackupInterval() {
    backUpDb();
    setInterval(backUpDb, minBackupInterval);
}
const backupsFolderPath = path_1.default.resolve(__dirname, `../../dbBackups/`);
function backUpDb(force) {
    return new Promise(async (resolve) => {
        try {
            if (!fs.existsSync(backupsFolderPath))
                fs.mkdirSync(backupsFolderPath);
        }
        catch (e) {
            c.log(`red`, `Could not create backups folder:`, backupsFolderPath, e);
            resolve();
            return;
        }
        fs.readdir(backupsFolderPath, (err, backups) => {
            if (err) {
                resolve();
                return;
            }
            const sortedBackups = backups
                .filter((p) => p.indexOf(`.`) !== 0)
                .sort((a, b) => {
                const aDate = new Date(parseInt(a));
                const bDate = new Date(parseInt(b));
                return bDate.getTime() - aDate.getTime();
            });
            const mostRecentBackup = sortedBackups[0];
            while (sortedBackups.length > maxBackups) {
                const oldestBackup = sortedBackups[sortedBackups.length - 1];
                sortedBackups.splice(sortedBackups.length - 1, 1);
                fs.rmSync(path_1.default.resolve(backupsFolderPath, oldestBackup), {
                    recursive: true,
                });
            }
            if (force ||
                !mostRecentBackup ||
                new Date(parseInt(mostRecentBackup)).getTime() <
                    Date.now() - minBackupInterval) {
                c.log(`gray`, `Backing up db...`);
                const backupName = Date.now();
                let cmd = `mongodump --host ` +
                    defaultMongoOptions.hostname +
                    ` --port ` +
                    defaultMongoOptions.port +
                    ` --db ` +
                    defaultMongoOptions.dbName +
                    ` --out ` +
                    path_1.default.resolve(backupsFolderPath, `${backupName}`);
                (0, child_process_1.exec)(cmd, undefined, (error, stdout, stderr) => {
                    if (error) {
                        c.log({ error });
                        resolve();
                    }
                    else
                        resolve(true);
                    c.log(`gray`, `Backup complete.`);
                });
            }
        });
    });
}
exports.backUpDb = backUpDb;
function getBackups() {
    try {
        return fs
            .readdirSync(backupsFolderPath)
            .filter((p) => p.indexOf(`.`) !== 0);
    }
    catch (e) {
        c.log(`red`, `Could not find backups folder:`, backupsFolderPath);
        return [];
    }
}
exports.getBackups = getBackups;
function resetDbToBackup(backupId) {
    return new Promise(async (resolve) => {
        try {
            if (!fs.existsSync(backupsFolderPath) ||
                !fs.existsSync(path_1.default.resolve(backupsFolderPath, backupId))) {
                resolve(`Attempted to reset db to nonexistent backup`);
                return;
            }
        }
        catch (e) {
            resolve(`Unable to find db backups folder`);
            return;
        }
        c.log(`yellow`, `Resetting db to backup`, backupId);
        let cmd = `mongorestore --drop --verbose --host="` +
            defaultMongoOptions.hostname +
            `" --port ` +
            defaultMongoOptions.port +
            ` ` +
            path_1.default.resolve(backupsFolderPath, backupId);
        (0, child_process_1.exec)(cmd, undefined, (error, stdout, stderr) => {
            if (error) {
                resolve(error.message);
            }
            c.log(stdout);
            c.log({ stderr });
            resolve(true);
        });
    });
}
exports.resetDbToBackup = resetDbToBackup;
// * to manually reset the db
// resetDbToBackup(getBackups()[getBackups().length - 1])
//# sourceMappingURL=index.js.map