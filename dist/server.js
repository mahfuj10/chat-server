"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var http_1 = __importDefault(require("http"));
var socket_io_1 = require("socket.io");
var db_1 = require("./db");
var cors = require("cors");
var MongoClient = require("mongodb").MongoClient;
require("dotenv").config();
var app = express_1.default();
var port = 9000;
//middleware
app.use(express_1.default.json());
app.use(cors());
// mongodb connectiorsn
function connectDatabase() {
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, db_1.connectToDatabase()];
                case 1:
                    _a.sent();
                    console.log('object');
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('Error starting the application:', error_1);
                    process.exit(1); // Exit the application if unable to connect to the database
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// const uri = `mongodb+srv://mahfujurr042:IaoR5wxD07QYuycY@leaves.eaf0bsd.mongodb.net/`
// const client = new MongoClient(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });
// console.log(client);
// socket.io connection
var server = http_1.default.createServer(app);
var io = new socket_io_1.Server(server, { cors: { origin: "*" } });
var onlineUsers = [];
io.on("connection", function (socket) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            console.log("User connected with ", socket.id);
            socket.on("join_room", function (data) {
                socket.join(data);
            });
            socket.on("send_message", function (data) {
                socket.to(data.roomId).emit("recive_message", data);
            });
            socket.on('typing', function (data) {
                socket.broadcast.emit('typing', data);
            });
            socket.on('deleteMessage', function (data) {
                socket.to(data.roomId).emit("deleteMessage", data);
            });
            socket.on('addedUser', function (data) {
                socket.emit('addedUser', data);
                console.log(data);
            });
            socket.on('joinedgroup', function (data) {
                socket.emit('joinedgroup', data);
                console.log(data);
            });
            // add new user
            socket.on("new-user-add", function (newUserId) {
                if (!onlineUsers.some(function (user) { return user.userId === newUserId; })) {
                    // if user is not added before
                    onlineUsers.push({ userId: newUserId, socketId: socket.id });
                    console.log("new user is here!", onlineUsers);
                }
                // send all active users to new user
                io.emit("get-users", onlineUsers);
            });
            socket.on("disconnect", function () {
                onlineUsers = onlineUsers.filter(function (user) { return user.socketId !== socket.id; });
                console.log("user disconnected", onlineUsers);
                // send all online users to all users
                io.emit("get-users", onlineUsers);
            });
            socket.on("offline", function () {
                // remove user from active users
                onlineUsers = onlineUsers.filter(function (user) { return user.socketId !== socket.id; });
                console.log("user is offline", onlineUsers);
                // send all online users to all users
                io.emit("get-users", onlineUsers);
            });
        }
        catch (err) {
            console.log('socket connection error', err);
        }
        return [2 /*return*/];
    });
}); });
// import router
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    return [4 /*yield*/, connectDatabase()];
                case 1:
                    _a.sent();
                    app.use('/users', require('./routes/users'));
                    app.use('/chat', require('./routes/chat'));
                    app.use('/group', require('./routes/groups'));
                    return [3 /*break*/, 4];
                case 2:
                    err_1 = _a.sent();
                    console.log(err_1);
                    return [3 /*break*/, 4];
                case 3: return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    });
}
run().catch(function (e) { return console.log(e); }).finally();
app.get("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            res.send("Leaves server is running...");
        }
        catch (err) {
            res.json({ message: 'server error' });
        }
        return [2 /*return*/];
    });
}); });
server.listen(port, function () {
    console.log("my server is runningin port", port);
});
