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
var cors = require("cors");
var MongoClient = require("mongodb").MongoClient;
require("dotenv").config();
var app = express_1.default();
var port = process.env.PORT || 5000;
//middleware
app.use(express_1.default.json());
app.use(cors());
// mongodb connectiorsn
var uri = "mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PASS + "@cluster0.39aol.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
var client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
// socket.io connection
var server = http_1.default.createServer(app);
var io = new socket_io_1.Server(server, { cors: { origin: "*" } });
io.on("connection", function (socket) {
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
    var users = {};
    socket.on('login', function (data) {
        var _a;
        // const uid = { userId: data?.userId };
        users[socket.id] = (_a = data.loginUser) === null || _a === void 0 ? void 0 : _a.uid;
        socket.broadcast.emit('user-connected', data.loginUser);
        // socket.broadcast.emit("activeusers", users);
    });
    socket.on('addedUser', function (data) {
        socket.emit('addedUser', data);
        console.log(data);
    });
    socket.on('disconnect', function () {
        socket.broadcast.emit('user-disconnected', users[socket.id]);
        delete users[socket.id];
        console.log("User disconnected " + socket.id);
    });
    // socket.on('checkActive', id => {
    //     socket.to(id).emit('isActive', id);
    // })
    // socket.on('activeUser', user => {
    //     socket.broadcast.emit('receive_activeUser', user)
    // })
});
// mongodb connection
// import router
var users = require('../src/routes/users');
var chat = require('../src/routes/chat');
var groups = require('../src/routes/groups');
function run() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                app.use('/users', users);
                app.use('/chat', chat);
                app.use('/group', groups);
            }
            catch (err) {
                console.log(err);
            }
            finally {
            }
            return [2 /*return*/];
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
    console.log("my server is runningin port 5000");
});
