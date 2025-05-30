"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BtuidGenerator = void 0;
const crypto_1 = require("crypto");
const fs_1 = __importDefault(require("fs"));
class BtuidGenerator {
    constructor({ degreeConfig = {
        pageSize: 8192,
        keySize: 16,
        TIDSize: 6,
        indexTupleDataSize: 4,
        linePointerSize: 4,
        addingPaddingSize: 2,
        degree: 0,
    }, startValue = 0n, displacementRate = 10, restConfigData = null, path = "", saveTime = 86400 }) {
        this.HEX_LENGTH = 16;
        this.EXTRALENGTH = 16;
        this.degree = 0;
        this.usedIdCount = 0n;
        this.depth = 1; // for split first array
        this.length = 16n ** BigInt(this.HEX_LENGTH);
        this.indexInCurrentDepth = 0n;
        this.chunkCount = 0n;
        this.restConfigData = {
            depth: 0,
            degree: 0,
            chunkLength: 0n,
            indexInCurrentDepth: 0n,
            startValue: 0n,
            usedIdCount: 0n,
        };
        this.ExtraKeys = [
            "g",
            "h",
            "i",
            "j",
            "k",
            "l",
            "m",
            "n",
            "o",
            "p",
            "q",
            "r",
            "s",
            "t",
            "u",
            "v",
            "w",
            "x",
            "y",
            "A",
            "B",
            "C",
            "D",
            "E",
            "F",
            "G",
            "H",
            "I",
            "J",
            "K",
            "L",
            "M",
            "N",
            "O",
            "P",
            "Q",
            "R",
            "S",
            "T",
            "U",
            "V",
            "W",
            "X",
            "Y",
            "^",
            "_",
            "€",
            "ƒ",
            "£",
            "¥",
            "Ø",
            "ø",
        ];
        this.ExtraKeysForExtraUUID = [
            "g",
            "h",
            "i",
            "j",
            "k",
            "l",
            "m",
            "n",
            "o",
            "p",
            "q",
            "r",
            "s",
            "t",
            "u",
            "v",
            "w",
            "x",
            "y",
            "A",
            "B",
            "C",
            "D",
            "E",
            "F",
            "G",
            "H",
            "I",
            "J",
            "K",
            "L",
            "M",
            "N",
            "O",
            "P",
            "Q",
            "R",
            "S",
            "T",
            "U",
            "V",
            "W",
            "X",
            "Y",
            "^",
            "_",
            "€",
            "ƒ",
            "£",
            "¥",
            "Ø",
            "ø",
        ];
        this.extraKeysMap = {
            "0": "0",
            "1": "1",
            "2": "2",
            "3": "3",
            "4": "4",
            "5": "5",
            "6": "6",
            "7": "7",
            "8": "8",
            "9": "9",
            a: "a",
            b: "b",
            c: "c",
            d: "d",
            e: "e",
            f: "f",
            g: "1",
            h: "1",
            i: "1",
            j: "1",
            k: "1",
            l: "1",
            m: "1",
            n: "1",
            o: "1",
            p: "1",
            q: "1",
            r: "1",
            s: "1",
            t: "1",
            u: "1",
            v: "1",
            w: "1",
            x: "1",
            y: "1",
            A: "1",
            B: "1",
            C: "1",
            D: "1",
            E: "1",
            F: "1",
            G: "1",
            H: "1",
            I: "1",
            J: "1",
            K: "1",
            L: "1",
            M: "1",
            N: "1",
            O: "1",
            P: "1",
            Q: "1",
            R: "1",
            S: "1",
            T: "1",
            U: "1",
            V: "1",
            W: "1",
            X: "1",
            Y: "1",
            "^": "1",
            _: "1",
            "€": "1",
            ƒ: "1",
            "£": "1",
            "¥": "1",
            Ø: "1",
            ø: "1",
        };
        this.primeryKey = [
            "0",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "a",
            "b",
            "c",
            "d",
            "e",
            "f",
        ];
        this.equalKeys = {
            "0": ["0"],
            "1": ["1"],
            "2": ["2"],
            "3": ["3"],
            "4": ["4"],
            "5": ["5"],
            "6": ["6"],
            "7": ["7"],
            "8": ["8"],
            "9": ["9"],
            a: ["a"],
            b: ["b"],
            c: ["c"],
            d: ["d"],
            e: ["e"],
            f: ["f"],
        };
        this.data = {
            depth: 0,
            degree: 0,
            chunkLength: BigInt(0),
            indexInCurrentDepth: BigInt(0),
            startValue: BigInt(0),
            usedIdCount: BigInt(0),
        };
        this.saveTime = saveTime;
        this.intiEqualKeys();
        // this.printEqualKeys()
        //todo other if smallestShift and sort
        console.log("path : ", path);
        this.syncSaveObject(`${path}`, this.restConfigData);
        this.startValue = startValue;
        this.length =
            this.length - (this.length * BigInt(displacementRate)) / 1000n;
        this.startValue =
            startValue + (this.length * BigInt(displacementRate)) / 1000n;
        this.degreeConfig = degreeConfig;
        this.overhead = this.sumOverhead();
        this.entryOverhead = this.degreeConfig.pageSize / this.overhead;
        //this.degree = degreeConfig.degree;
        if (degreeConfig.degree == 0)
            this.degree = Math.floor((this.degreeConfig.pageSize - this.overhead) /
                (this.degreeConfig.keySize +
                    this.degreeConfig.TIDSize +
                    this.entryOverhead));
        else
            this.degree = degreeConfig.degree;
        this.chunkCount = BigInt(this.degree * 2) ** BigInt(this.depth);
        this.chunkLength = this.length / this.chunkCount;
        this.data.degree = this.degree;
        if (restConfigData) {
            this.depth = restConfigData.depth;
            this.degree = restConfigData.degree;
            this.chunkLength = restConfigData.chunkLength;
            this.indexInCurrentDepth = restConfigData.indexInCurrentDepth;
            this.startValue = restConfigData.startValue;
            this.usedIdCount = restConfigData.usedIdCount;
        }
        else {
            this.restConfigData = this.readObject(path);
            if (restConfigData) {
                this.depth = this.restConfigData.depth;
                this.degree = this.restConfigData.degree;
                this.chunkLength = this.restConfigData.chunkLength;
                this.indexInCurrentDepth = this.restConfigData.indexInCurrentDepth;
                this.startValue = this.restConfigData.startValue;
                this.usedIdCount = this.restConfigData.usedIdCount;
            }
        }
        setInterval(() => {
            console.log("path : ", path);
            this.saveObject(`${path}`, this.restConfigData);
        }, this.saveTime);
    }
    sumOverhead() {
        const d = this.degreeConfig;
        return (d.keySize +
            d.TIDSize +
            d.indexTupleDataSize +
            d.linePointerSize +
            d.addingPaddingSize);
    }
    getExtraBtuid() {
        let extra = "-";
        extra += (0, crypto_1.randomBytes)(Math.ceil(this.EXTRALENGTH / 2)).toString('hex').slice(0, this.EXTRALENGTH);
        return this.bigIntToHex(this.getId()) + extra;
    }
    getEncodeBtuid() {
        return this.encode(this.getBtuid());
    }
    getBtuid() {
        return this.bigIntToHex(this.getId());
    }
    getId() {
        let start = 0n;
        // console.log("chunkCount", this.chunkCount);
        //  console.log("indexInCurrentDepth", this.indexInCurrentDepth);
        start = this.getNextInDepthAndIndex(this.depth, this.degree, this.chunkLength, this.indexInCurrentDepth + 1n, this.startValue, this.usedIdCount);
        this.indexInCurrentDepth++;
        this.restConfigData.indexInCurrentDepth = this.indexInCurrentDepth;
        if (this.indexInCurrentDepth >= this.chunkCount) {
            this.indexInCurrentDepth = 0n;
            this.usedIdCount++;
            this.restConfigData.usedIdCount = this.usedIdCount;
            if (this.usedIdCount >= 1) {
                this.usedIdCount = 0n;
                this.indexInCurrentDepth++;
                this.restConfigData.indexInCurrentDepth = this.indexInCurrentDepth;
                this.restConfigData.usedIdCount = this.usedIdCount;
                this.depth++;
                this.restConfigData.depth = this.depth;
                this.chunkCount = BigInt(this.degree * 2 - 1) ** BigInt(this.depth);
                let pwrPart = BigInt(this.degree * 2) ** BigInt(this.depth);
                this.chunkLength = this.length / pwrPart;
                this.restConfigData.chunkLength = this.chunkLength;
            }
        }
        return start;
    }
    padHex(hex) {
        let hexText = hex.padStart(this.HEX_LENGTH, "0");
        return hexText;
    }
    bigIntToHex(value) {
        return this.padHex(value.toString(16));
    }
    getNextInDepthAndIndex(depth, degree, chunkLength, index, startValue, usedIdCount) {
        // console.log("depth ", depth);
        // console.log("degree ", degree);
        // console.log("chunkLength ", chunkLength);
        // console.log("index ", index);
        // console.log("startValue ", startValue);
        // console.log("usedIdCount ", usedIdCount);
        const usedItemInlastLevel = BigInt((2 * degree - 1) * (depth - 1));
        const multiPart = chunkLength * index;
        const start = startValue + usedItemInlastLevel + multiPart;
        //  console.log("start ", start);
        return start;
    }
    encode(hex) {
        //TODO Raise performance all function ;
        let editHexText;
        let chars = [];
        for (let i = 0; i < this.HEX_LENGTH; i++) {
            chars.push(this.encodeOneChar(hex.charAt(i)));
        }
        editHexText = chars.join("");
        return editHexText; // The maximum is exclusive and the minimum is inclusive
    }
    decodeToBigint(encodeHex) {
        //TODO Raise performance all function ;
        let editHexText;
        let chars = [];
        for (let i = 0; i < this.HEX_LENGTH; i++) {
            chars.push(this.decodeOneChar(encodeHex.charAt(i)));
        }
        editHexText = chars.join("");
        return BigInt("0x" + editHexText);
    }
    decodeToBtuid(encodeHex) {
        //TODO Raise performance all function ;
        let editHexText;
        let chars = [];
        for (let i = 0; i < this.HEX_LENGTH; i++) {
            chars.push(this.decodeOneChar(encodeHex.charAt(i)));
        }
        editHexText = chars.join("");
        return editHexText;
    }
    encodeOneChar(char) {
        //TODO Raise performance this.equalKeys[`${char}`] ;
        let equalIndex = this.equalKeys[`${char}`];
        let index = this.getRandomInt(0, equalIndex.length);
        return this.equalKeys[`${char}`][index];
    }
    decodeOneChar(char) {
        //TODO Raise performance this.equalKeys[`${char}`] ;
        this.extraKeysMap[`${char}`];
        return this.extraKeysMap[`${char}`];
    }
    getRandomInt(min, max) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
    }
    intiEqualKeys() {
        let primeryKeyCount = this.primeryKey.length;
        for (let i = 0; i < primeryKeyCount; i++) {
            let index = this.getRandomInt(0, this.primeryKey.length);
            let primeryKeyMapKey = this.primeryKey[index];
            let extraKeyForPrimeryKeyCount = this.getRandomInt(2, 4);
            for (let j = 0; j < extraKeyForPrimeryKeyCount; j++) {
                let extraKeyIndex = this.getRandomInt(0, this.ExtraKeys.length);
                //console.log("primeryKeyMapKey : ",primeryKeyMapKey)
                // console.log("this.equalKeys[primeryKeyMapKey] : ",this.equalKeys[primeryKeyMapKey])
                this.extraKeysMap[this.ExtraKeys[extraKeyIndex]] = primeryKeyMapKey;
                this.equalKeys[primeryKeyMapKey].push(this.ExtraKeys[extraKeyIndex]);
                this.ExtraKeys.splice(extraKeyIndex, 1);
            }
            if (this.ExtraKeys.length == 0) {
                break;
            }
        }
    }
    syncSaveObject(path, obj) {
        const jsonString = JSON.stringify(obj, (key, value) => typeof value === 'bigint' ? value.toString() : value, 2);
        fs_1.default.writeFileSync(`${path}`, jsonString, "utf8");
        console.log("✅ Object saved to", path);
    }
    saveObject(path, obj) {
        const jsonString = JSON.stringify(obj, (key, value) => typeof value === 'bigint' ? value.toString() : value, 2);
        fs_1.default.writeFile(`${path}`, jsonString, "utf8", () => { });
        console.log("✅ Object saved to", path);
    }
    readObject(path) {
        if (!fs_1.default.existsSync(`${path}`)) {
            console.log("File does not exist.");
            return null;
        }
        const fileData = fs_1.default.readFileSync(`${path}`, "utf8");
        const parsedObject = JSON.parse(fileData, (key, value) => {
            if (typeof value === 'string' && /^\d+n$/.test(value)) {
                return BigInt(value.slice(0, -1));
            }
            return value;
        });
        console.log("Object read from file:", parsedObject);
        return parsedObject;
    }
}
exports.BtuidGenerator = BtuidGenerator;
