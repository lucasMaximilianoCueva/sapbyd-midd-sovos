"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const monitorfel_routes_1 = __importDefault(require("./routes/monitorfel.routes"));
const app = (0, express_1.default)();
const xmlparser = require('express-xml-bodyparser');
app.set('port', process.env.PORT || '5008');
app.use((0, morgan_1.default)('dev'));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.raw());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(xmlparser({ trim: true, explicitArray: false }));
app.use(monitorfel_routes_1.default);
app.listen(app.get('port'), () => {
    console.log('Servidor en puerto ' + app.get('port'));
});
exports.default = app;
