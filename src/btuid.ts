// Copyright 2025 Omar Alhaj Ali
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { randomBytes } from "crypto";

import fs from "fs";

export interface DegreeConfig {
  pageSize: number;
  keySize: number;
  TIDSize: number;
  indexTupleDataSize: number;
  linePointerSize: number;
  addingPaddingSize: number;
  degree: number;
}
export interface RestConfigData {
  depth: number;
  degree: number;
  chunkLength: bigint;
  indexInCurrentDepth: bigint;
  startValue: bigint;
  usedIdCount: bigint;
}
export type ConstructorParams = {
  degreeConfig?: DegreeConfig;
  startValue?: bigint;
  displacementRate?: number;
  restConfigData?: RestConfigData | null;
  DegreeComplications? :number ,
  path?: string;
  saveTime?: number;
};
export class BtuidGenerator {
  private readonly HEX_LENGTH = 16;
  private readonly EXTRALENGTH = 16;

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
    DegreeComplications = 1,
    path = "",
    saveTime = 86400,
  }: ConstructorParams) {
    this.saveTime = saveTime;

    this.startValue = startValue;

    this.length =
      this.length - (this.length * BigInt(displacementRate)) / 1000n;
    this.startValue =
      startValue + (this.length * BigInt(displacementRate)) / 1000n;

    this.degreeConfig = degreeConfig;
    this.overhead = this.sumOverhead();
    this.entryOverhead = this.degreeConfig.pageSize / this.overhead;

    if (degreeConfig.degree == 0)
      this.degree = Math.floor(
        (this.degreeConfig.pageSize - this.overhead) /
          (this.degreeConfig.keySize +
            this.degreeConfig.TIDSize +
            this.entryOverhead)
      );
    else this.degree = degreeConfig.degree;
    this.degree = DegreeComplications*this.degree    
    this.chunkCount = BigInt(this.degree * 2) ** BigInt(this.depth);
    this.chunkLength = this.length / this.chunkCount;
    this.data.degree = this.degree;
    this.restConfigData.chunkLength = this.chunkLength;
    this.restConfigData.degree = this.degree;
    this.restConfigData.startValue = this.startValue;
    this.restConfigData.degree = this.degree;

    if (!fs.existsSync(path)) {
      this.syncSaveObject(`${path}`, this.restConfigData);
    }
    if (restConfigData) {
      this.depth = restConfigData.depth;
      this.degree = restConfigData.degree;
      this.chunkLength = BigInt(restConfigData.chunkLength);
      this.indexInCurrentDepth = BigInt(restConfigData.indexInCurrentDepth);
      this.startValue = BigInt(restConfigData.startValue);
      this.usedIdCount = BigInt(restConfigData.usedIdCount);
    } else {
      this.restConfigData = this.readObject(path);
      if (this.restConfigData) {
        this.depth = this.restConfigData.depth;
        this.degree = this.restConfigData.degree;
        this.chunkLength = BigInt(this.restConfigData.chunkLength);
        this.indexInCurrentDepth = BigInt(
          this.restConfigData.indexInCurrentDepth
        );
        this.startValue = BigInt(this.restConfigData.startValue);
        this.usedIdCount = BigInt(this.restConfigData.usedIdCount);
      }
    }


    setInterval(() => {
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
    extra += randomBytes(Math.ceil(this.EXTRALENGTH / 2))
      .toString("hex")
      .slice(0, this.EXTRALENGTH);
    return this.bigIntToHex(this.getId()) + extra;
  }




  public getBtuid(): string {
    return this.bigIntToHex(this.getId());
  }
  private getId(): bigint {
    let start: bigint = 0n;

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
      this.restConfigData.indexInCurrentDepth = this.indexInCurrentDepth;

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
    const usedItemInlastLevel = BigInt((2 * degree - 1) * (depth - 1));
    const multiPart = chunkLength * index;
    const start: bigint = startValue + usedItemInlastLevel + multiPart;

    return start;
  }

  syncSaveObject(path: string, obj: RestConfigData) {
    const jsonString = JSON.stringify(
      obj,
      (key, value) => (typeof value === "bigint" ? value.toString() : value),
      2
    );
    fs.writeFileSync(`${path}`, jsonString, "utf8");
  }

  saveObject(path: string, obj: RestConfigData) {
    const jsonString = JSON.stringify(
      obj,
      (key, value) => (typeof value === "bigint" ? value.toString() : value),
      2
    );
    fs.writeFile(`${path}`, jsonString, "utf8", () => {});
  }

  readObject(path: string) {
    if (!fs.existsSync(`${path}`)) {
      return null;
    }

    const fileData = fs.readFileSync(`${path}`, "utf8");

    const parsedObject = JSON.parse(fileData, (key, value) => {
      if (typeof value === "string" && /^\d+n$/.test(value)) {
        return BigInt(value.slice(0, -1));
      }
      return value;
    });
    return parsedObject;
  }
}
