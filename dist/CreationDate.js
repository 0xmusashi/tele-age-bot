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
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const math = __importStar(require("mathjs"));
class CreationDate {
    constructor(order = 3) {
        this.order = order;
        this.dataPath = path_1.default.join(process.cwd(), "src/dates.json");
        const { x, y } = this._unpackData();
        this.x = x;
        this.y = y;
        this._func = this._fitData();
    }
    _unpackData() {
        const stringData = fs.readFileSync(this.dataPath, "utf8");
        const data = JSON.parse(stringData);
        const xData = Object.keys(data).map(Number);
        const yData = Object.values(data);
        return { x: xData, y: yData };
    }
    _checkDataPoint(id) {
        const stringData = fs.readFileSync(this.dataPath, "utf8");
        const data = JSON.parse(stringData);
        if (data[id])
            return data[id];
    }
    _fitData() {
        const x = this.x;
        const y = this.y;
        const vandermonde = x.map((xi) => Array.from({ length: this.order + 1 }, (_, j) => Math.pow(xi, j)));
        const vandermondeT = math.transpose(vandermonde);
        const vtv = math.multiply(vandermondeT, vandermonde);
        const vty = math.multiply(vandermondeT, y);
        const coefficients = math.lusolve(vtv, vty).map(c => c[0]);
        return (x) => coefficients.reduce((acc, coef, i) => acc + coef * Math.pow(x, i), 0);
    }
    addDatapoint(pair) {
        pair[0] = String(pair[0]);
        const stringData = fs.readFileSync(this.dataPath, "utf8");
        const data = JSON.parse(stringData);
        data[pair[0]] = pair[1];
        fs.writeFileSync(this.dataPath, JSON.stringify(data), "utf8");
        const { x, y } = this._unpackData();
        this.x = x;
        this.y = y;
        this._func = this._fitData();
    }
    func(tg_id) {
        const check = this._checkDataPoint(tg_id.toString());
        if (check) {
            return check;
        }
        let value = this._func(tg_id);
        const current = Math.floor(Date.now() / 1000);
        if (value > current) {
            value = current;
        }
        return value;
    }
}
exports.default = CreationDate;
