# 🔐 Btuid

**A fast, indexable, secure, and unique UUID generator for Node.js and modern JavaScript environments.**

---

## ✅ Features

* ⚡️ **Ultra-fast generation** — optimized for high-throughput environments.
* 🔐 **Cryptographically secure** — uses secure random generation under the hood.
* 🧬 **Globally unique** — guarantees no collisions, even across distributed systems.
* 🧼 **Privacy-friendly** — no sensitive information (e.g., MAC, IP, PID) is encoded.
* 📈 **Highly indexable** — designed for optimal performance with B-tree and B+tree indexes.
* 🎯 **Unpredictable** — the next UUID cannot be guessed based on the previous one.

---

## ⚠️ Limitations

* 🎲 **Not fully random** — the ID is partially structured to ensure sortability and indexability.
* 💾 **Requires storage access** — to fully benefit from index performance Requires storage access.

---
| Feature            | `btuid` 🔥            | `uuid v4` 🎲             | `nanoid` ✨             |
| ------------------ | ------------------------- | ------------------------ | ----------------------  |
| **Speed**          | ⚡️ Very fast              | 🐢 Slower                | ⚡️ Fast                 |
| **Security**       | ✅ High                   | ✅ High                  | ✅ High                 |
| **Length**         | 🔴 Long (36 chars)        | 🔴 Long (36 chars)       | 🟡 Medium (\~21 chars)  |
| **Index-friendly** | ✅ B/B+Tree optimized     | ❌ No                    | ❌ No                   |
| **Predictability** | ✅ Unpredictable          | ✅ Unpredictable         | ✅ Unpredictable        |
| **DB Performance** | ✅ Excellent for indexing | ❌ Poor due to randomness| ❌ Poor for indexing    |
| **Dependencies**   | ❌ Zero                   | ✅ Requires uuid lib     | ✅ Requires nanoid lib  |


## 📦 Installation

```bash
npm install btuid
# or
yarn add btuid
🛠 Usage

import {BuidGenerator,} from 'btuid'
import path from 'path';
//create btuidFiles folder in your project root 
const filePath = path.join("your_project_root/btuidFiles", 'dataTableName.json');
const generator = new BuidGenerator( {path: filePath} );
const Btuid = generator.getExtraBuid(); //get btuid

🤝 Contributing

We welcome contributions, issues, and feature requests!
Please open an issue or submit a PR via GitHub.

## 🔖 Keywords

`uuid` &nbsp;&bull;&nbsp; `buid` &nbsp;&bull;&nbsp; `id generator` &nbsp;&bull;&nbsp; `secure id` &nbsp;&bull;&nbsp; `indexable uuid`  
`typescript` &nbsp;&bull;&nbsp; `javascript` &nbsp;&bull;&nbsp; `performance` &nbsp;&bull;&nbsp; `fast uuid` &nbsp;&bull;&nbsp; `crypto uuid`
