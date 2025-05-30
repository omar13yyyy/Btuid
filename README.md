# 🔐 Buid

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
| Feature            | `fast-uuid` 🔥            | `uuid v4` 🎲             | `nanoid` ✨             |
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
npm install Buid
# or
yarn add Buid

🤝 Contributing

We welcome contributions, issues, and feature requests!
Please open an issue or submit a PR via GitHub.