import * as fs from 'fs';
import path from 'path';
import * as math from 'mathjs';

export default class CreationDate {
    private readonly order: number;
    private readonly dataPath: string;
    private _func: any;
    private x: any;
    private y: any;
    constructor(order = 3) {
        this.order = order;
        this.dataPath = path.join(process.cwd(), 'src/data/dates.json');

        const { x, y } = this._unpackData();
        this.x = x;
        this.y = y;
        this._func = this._fitData();
    }

    _unpackData() {
        const stringData = fs.readFileSync(this.dataPath, 'utf8');
        const data = JSON.parse(stringData);

        const xData = Object.keys(data).map(Number);
        const yData = Object.values(data);

        return { x: xData, y: yData };
    }

    _checkDataPoint(id: string) {
        const stringData = fs.readFileSync(this.dataPath, 'utf8');
        const data = JSON.parse(stringData);
        if (data[id]) return data[id];
    }

    _fitData() {
        const x = this.x;
        const y = this.y;

        const vandermonde: any = x.map((xi: any) => Array.from({ length: this.order + 1 }, (_, j) => Math.pow(xi, j)));

        const vandermondeT: any = math.transpose(vandermonde);

        const vtv: any = math.multiply(vandermondeT, vandermonde);
        const vty: any = math.multiply(vandermondeT, y);
        const coefficients: any = math.lusolve(vtv, vty).map((c) => c[0]);

        return (x: any) => coefficients.reduce((acc: any, coef: any, i: any) => acc + coef * Math.pow(x, i), 0);
    }

    addDatapoint(pair: any) {
        pair[0] = String(pair[0]);

        const stringData = fs.readFileSync(this.dataPath, 'utf8');
        const data = JSON.parse(stringData);

        data[pair[0]] = pair[1];

        fs.writeFileSync(this.dataPath, JSON.stringify(data), 'utf8');

        const { x, y } = this._unpackData();
        this.x = x;
        this.y = y;
        this._func = this._fitData();
    }

    func(tg_id: number) {
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
