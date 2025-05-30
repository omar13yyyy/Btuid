
````markdown
# 🔐 Btuid

**A fast, indexable, secure, and unique UUID generator for Node.js and modern JavaScript environments.**

---

## ✅ Features

- ⚡️ **Ultra-fast generation** — optimized for high-throughput environments.
- 🔐 **Cryptographically secure** — uses secure random generation under the hood.
- 🧬 **Globally unique** — guarantees no collisions, even across distributed systems.
- 🧼 **Privacy-friendly** — no sensitive information (e.g., MAC, IP, PID) is encoded.
- 📈 **Highly indexable** — designed for optimal performance with B-tree and B+tree indexes.
- 🎯 **Unpredictable** — the next UUID cannot be guessed based on the previous one.

---

## ⚠️ Limitations

- 🎲 **Not fully random** — the ID is partially structured to ensure sortability and indexability.
- 💾 **Requires storage access** — to fully benefit from index performance Requires storage access.

---

| Feature            | `btuid` 🔥                | `uuid v4` 🎲              | `nanoid` ✨            |
| ------------------ | ------------------------- | ------------------------- | ---------------------- |
| **generate Speed** | ⚡️ Very fast             | 🐢 Slower                 | ⚡️ Fast               |
| **Security**       | ✅ High                   | ✅ High                   | ✅ High                |
| **Length**         | 🔴 Long (32 chars + '-')  | 🔴 Long (36 chars)        | 🟡 Medium (~21 chars) |
| **Index-friendly** | ✅ B/B+Tree optimized     | ❌ No                     | ❌ No                  |
| **Predictability** | ✅ Unpredictable          | ✅ Unpredictable          | ✅ Unpredictable       |
| **DB Performance** | ✅ Excellent for indexing | ❌ Poor due to randomness | ❌ Poor for indexing   |
| **Dependencies**   | ❌ Zero                   | ✅ Requires uuid lib      | ✅ Requires nanoid lib |

---

## 📦 Installation

```bash
npm install btuid
# or
yarn add btuid
````

---

## 📦 Usage

```js
import { BtuidGenerator } from 'btuid';
import path from 'path';

// create btuidFiles folder in your project root
const filePath = path.join("your_project_root/btuidFiles", 'dataTableName.json');

const generator = new BtuidGenerator({ path: filePath });

const extraBtuid = generator.getExtraBtuid(); // get hex btuid
console.log(extraBtuid); // 06e77028e74c0082-26c4838e4a1f408b

const BigIntbtuid = generator.getId(); // get bigint id
console.log(BigIntbtuid); // 812356443328774771

const encodeBtuid = generator.getEncodeBtuid(); // get encoded text id
console.log(encodeBtuid); // EIa4F39a3ISdt46G

const decodeBtuid = generator.decodeToBtuid(encodeBtuid); // convert encoded btuid text to hex
console.log(decodeBtuid); // 0fa4b39a3fed0464

const decodeBtuidBigint = generator.decodeToBigint(encodeBtuid); // convert encoded btuid text to bigint
console.log(decodeBtuidBigint); // 1127223281828299876n
```

---

## 📦 Advance Usage

### Postgres database (auto degree calculation)

```ts
let degreeConfig: DegreeConfig = {
  pageSize: yourTablePageSize,
  keySize: yourTableKeySize,
  TIDSize: yourTableTIDSize,
  indexTupleDataSize: yourTableIndexTupleDataSize,
  linePointerSize: yourTableLinePointerSize,
  addingPaddingSize: yourTableAddingPaddingSize,
  degree: 0 // auto-calculate B+Tree degree (compatible with Postgres)
};

const generator = new BtuidGenerator({
  degreeConfig,
  startValue: startValue,              // optional bigint offset
  displacementRate: displacementRate,  // 0 --> 200
  path: filePath,
  saveTime: saveTime                   // in seconds, default is one day
});
```

### Manual add B-Tree,B+Tree degree

```ts
let degreeConfig: DegreeConfig = {
  pageSize: 0,
  keySize: 0,
  TIDSize: 0,
  indexTupleDataSize: 0,
  linePointerSize: 0,
  addingPaddingSize: 0,
  degree: yourBtreeDegree // manually set degree
};

const generator = new BtuidGenerator({
  degreeConfig,
  startValue: startValue,
  displacementRate: displacementRate,
  path: filePath,
  saveTime: saveTime
});
```

---

## 🤝 Contributing

We welcome contributions, issues, and feature requests!
Please open an issue or submit a PR via GitHub.

---

## 🔖 Keywords

`uuid`  •  `btuid`  •  `id generator`  •  `secure id`  •  `indexable uuid`
`typescript`  •  `javascript`  •  `performance`  •  `fast uuid`  •  `crypto uuid`

---

## 🙏 Acknowledgments

Special thanks to [Laila](https://github.com/laila0010) for her valuable contribution to this project.

