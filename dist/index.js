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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const baileys_1 = __importStar(require("@whiskeysockets/baileys"));
function goWhatsApp(key) {
    return __awaiter(this, void 0, void 0, function* () {
        const { saveCreds, state } = yield (0, baileys_1.useMultiFileAuthState)(`./db_auth/${key}`);
        const sock = (0, baileys_1.default)({
            printQRInTerminal: true,
            auth: state
        });
        sock === null || sock === void 0 ? void 0 : sock.ev.on('connection.update', (update) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { connection, lastDisconnect, qr } = update;
            const shuldReconnect = ((_b = (_a = lastDisconnect === null || lastDisconnect === void 0 ? void 0 : lastDisconnect.error) === null || _a === void 0 ? void 0 : _a.output) === null || _b === void 0 ? void 0 : _b.statusCode) === baileys_1.DisconnectReason.loggedOut.toString();
            if (qr) {
                console.log(qr);
            }
            else if (connection === 'close' && shuldReconnect) {
                const keyRandom = Math.floor(Math.random() * 10);
                goWhatsApp(keyRandom);
            }
            else if (connection === 'close' && !shuldReconnect) {
                goWhatsApp(key);
            }
            else if (connection === 'open') {
                console.log(`CONECTADO A INSTANCIA ${key}`);
            }
        }));
        sock === null || sock === void 0 ? void 0 : sock.ev.on('creds.update', saveCreds);
        sock === null || sock === void 0 ? void 0 : sock.ev.on('messages.upsert', (m) => __awaiter(this, void 0, void 0, function* () {
            var _c;
            const remoteJid = m === null || m === void 0 ? void 0 : m.messages[0].key.remoteJid;
            const notify = m === null || m === void 0 ? void 0 : m.type;
            const fromMe = m === null || m === void 0 ? void 0 : m.messages[0].key.fromMe;
            const message = (_c = m === null || m === void 0 ? void 0 : m.messages[0].message) === null || _c === void 0 ? void 0 : _c.conversation;
            if (notify && !fromMe && typeof (remoteJid) === 'string') {
                yield (sock === null || sock === void 0 ? void 0 : sock.sendMessage(remoteJid, { text: "Olá, tudo bem?" }));
            }
        }));
    });
}
goWhatsApp(4515);
