
import { randomBytes } from "crypto";
import fs from "fs";
import path from "path";

export interface DegreeConfig {
  pageSize: number;
  keySize: number;
  TIDSize: number;
  indexTupleDataSize: number;
  linePointerSize: number;
  addingPaddingSize: number;
  degree: number;
}
interface RestConfigData {
  depth: number;
  degree: number;
  chunkLength: bigint;
  indexInCurrentDepth: bigint;
  startValue: bigint;
  usedIdCount: bigint;
}
type ConstructorParams = {
  degreeConfig?: DegreeConfig;
  startValue?: bigint;
  displacementRate?: number;
  restConfigData?: RestConfigData | null;
  path?: string;
  saveTime? : number;
};
export class BtuidGenerator {
  private  readonly HEX_LENGTH = 16;
  private  readonly EXTRALENGTH = 16;

  private saveTime: number;
  private degreeConfig: DegreeConfig;
  private overhead: number;
  private entryOverhead: number;
  private degree: number = 0;
  private usedIdCount: bigint = 0n;
  private depth: number = 1; // for split first array
  private startValue: bigint;
  private length: bigint = 16n ** BigInt(this.HEX_LENGTH);
  private chunkLength: bigint;
  private indexInCurrentDepth: bigint = 0n;
  private chunkCount: bigint = 0n;
  private restConfigData: RestConfigData = {
    depth: 0,
    degree: 0,
    chunkLength: 0n,
    indexInCurrentDepth: 0n,
    startValue: 0n,
    usedIdCount: 0n,
  };
  private ExtraKeys :string[]= [
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
  private ExtraKeysForExtraUUID: string []= [
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
  private extraKeysMap : { [key: string]: string }= {
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
  private primeryKey :string[]= [
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
  private equalKeys: { [key: string]: string[] } = {
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
  data = {
    depth: 0,
    degree: 0,
    chunkLength: BigInt(0),
    indexInCurrentDepth: BigInt(0),
    startValue: BigInt(0),
    usedIdCount: BigInt(0),
  };
  constructor({
    degreeConfig = {
      pageSize: 8192,
      keySize: 16,
      TIDSize: 6,
      indexTupleDataSize: 4,
      linePointerSize: 4,
      addingPaddingSize: 2,
      degree: 0,
    },
    startValue = 0n,
    displacementRate = 10,
    restConfigData = null,
    path = "",
    saveTime = 86400 
  }: ConstructorParams) {
    this.saveTime=saveTime;
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
      this.degree = Math.floor(
        (this.degreeConfig.pageSize - this.overhead) /
          (this.degreeConfig.keySize +
            this.degreeConfig.TIDSize +
            this.entryOverhead)
      );
    else this.degree = degreeConfig.degree;

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
    } else {
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
  private sumOverhead() {
    const d = this.degreeConfig;
    return (
      d.keySize +
      d.TIDSize +
      d.indexTupleDataSize +
      d.linePointerSize +
      d.addingPaddingSize
    );
  }
  public getExtraBtuid(): string {
    let extra = "-";
    extra += randomBytes(Math.ceil(this.EXTRALENGTH / 2)).toString('hex').slice(0, this.EXTRALENGTH); 
    return this.bigIntToHex(this.getId()) + extra;
  }

  
  public getEncodeBtuid(): string {
    return this.encode(this.getBtuid());
  }
  public getBtuid(): string {
    return this.bigIntToHex(this.getId());
  }
  public getId(): bigint {
    let start: bigint = 0n;
    // console.log("chunkCount", this.chunkCount);
    //  console.log("indexInCurrentDepth", this.indexInCurrentDepth);

    start = this.getNextInDepthAndIndex(
      this.depth,
      this.degree,
      this.chunkLength,
      this.indexInCurrentDepth + 1n,
      this.startValue,
      this.usedIdCount
    );
    
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

  private padHex(hex: string): string {
    let hexText = hex.padStart(this.HEX_LENGTH, "0");

    return hexText;
  }
  private bigIntToHex(value: bigint): string {
    return this.padHex(value.toString(16));
  }
  private getNextInDepthAndIndex(
    depth: number,
    degree: number,
    chunkLength: bigint,
    index: bigint,
    startValue: bigint,
    usedIdCount: bigint
  ): bigint {
    // console.log("depth ", depth);
    // console.log("degree ", degree);
    // console.log("chunkLength ", chunkLength);
    // console.log("index ", index);
    // console.log("startValue ", startValue);
    // console.log("usedIdCount ", usedIdCount);

    const usedItemInlastLevel = BigInt((2 * degree - 1) * (depth - 1));
    const multiPart = chunkLength * index;
    const start: bigint = startValue + usedItemInlastLevel + multiPart;
    //  console.log("start ", start);

    return start;
  }
  public encode(hex: string) {
    //TODO Raise performance all function ;

    let editHexText;
    let chars: any = [];
    for (let i = 0; i < this.HEX_LENGTH; i++) {
      chars.push(this.encodeOneChar(hex.charAt(i)));
    }
    editHexText = chars.join("");

    return editHexText; // The maximum is exclusive and the minimum is inclusive
  }
  public decodeToBigint(encodeHex: string): bigint {
    //TODO Raise performance all function ;

    let editHexText;
    let chars: any = [];
    for (let i = 0; i < this.HEX_LENGTH; i++) {
      chars.push(this.decodeOneChar(encodeHex.charAt(i)));
    }
    editHexText = chars.join("");

    return BigInt("0x" + editHexText);
  }
  public decodeToBtuid(encodeHex: string): string {
    //TODO Raise performance all function ;

    let editHexText;
    let chars: any = [];
    for (let i = 0; i < this.HEX_LENGTH; i++) {
      chars.push(this.decodeOneChar(encodeHex.charAt(i)));
    }
    editHexText = chars.join("");

    return editHexText;
  }
  private encodeOneChar(char: string): string {
    //TODO Raise performance this.equalKeys[`${char}`] ;
    let equalIndex = this.equalKeys[`${char}`];

    let index = this.getRandomInt(0, equalIndex.length);

    return this.equalKeys[`${char}`][index];
  }
  private decodeOneChar(char: string): string {
    //TODO Raise performance this.equalKeys[`${char}`] ;
    this.extraKeysMap[`${char}`];

    return this.extraKeysMap[`${char}`];
  }
  private getRandomInt( min:number , max:number ) {
    
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
  }
  private intiEqualKeys() {
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

  syncSaveObject( path:string,obj:RestConfigData) {
    const jsonString = JSON.stringify(obj, (key, value) =>
  typeof value === 'bigint' ? value.toString() : value
, 2);
    fs.writeFileSync(`${path}`, jsonString, "utf8");
    console.log("✅ Object saved to", path);
  }

  saveObject( path:string,obj:RestConfigData) {
    const jsonString = JSON.stringify(obj, (key, value) =>
  typeof value === 'bigint' ? value.toString() : value
, 2);
    fs.writeFile(`${path}`, jsonString, "utf8", () => {});
    console.log("✅ Object saved to", path);
  }

  readObject(path:string) {
    if (!fs.existsSync(`${path}`)) {
      console.log("File does not exist.");
      return null;
    }

    const fileData = fs.readFileSync(`${path}`, "utf8");

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
