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
    saveTime?: number;
};
export declare class BuidGenerator {
    private readonly HEX_LENGTH;
    private readonly EXTRALENGTH;
    private saveTime;
    private degreeConfig;
    private overhead;
    private entryOverhead;
    private degree;
    private usedIdCount;
    private depth;
    private startValue;
    private length;
    private chunkLength;
    private indexInCurrentDepth;
    private chunkCount;
    private restConfigData;
    private ExtraKeys;
    private ExtraKeysForExtraUUID;
    private extraKeysMap;
    private primeryKey;
    private equalKeys;
    data: {
        depth: number;
        degree: number;
        chunkLength: bigint;
        indexInCurrentDepth: bigint;
        startValue: bigint;
        usedIdCount: bigint;
    };
    constructor({ degreeConfig, startValue, displacementRate, restConfigData, path, saveTime }: ConstructorParams);
    private sumOverhead;
    getExtraBuid(): string;
    getEncodeBuid(): string;
    getBuid(): string;
    getId(): bigint;
    private padHex;
    private bigIntToHex;
    private getNextInDepthAndIndex;
    encode(hex: string): any;
    decodeToBigint(encodeHex: string): bigint;
    decodeToBuid(encodeHex: string): string;
    private encodeOneChar;
    private decodeOneChar;
    private getRandomInt;
    private intiEqualKeys;
    syncSaveObject(path: string, obj: RestConfigData): void;
    saveObject(path: string, obj: RestConfigData): void;
    readObject(path: string): any;
}
export {};
