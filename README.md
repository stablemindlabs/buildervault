# BuilderVault

> Your on-chain identity, built one season at a time.

BuilderVault is an on-chain reputation platform for Web3 builders on OPN Chain. It tracks real builder activity — the more you deploy, the higher your score. Built across 6 seasons, each adding a new layer of identity and reputation.

🌐 **Live Demo:** https://buildervault-coral.vercel.app  
📄 **Contract:** `0x876d81a05900aa02Da17320cB521ce1FF19F720A` (OPN Chain Testnet)  
🔗 **Explorer:** https://testnet.iopn.tech/address/0x876d81a05900aa02Da17320cB521ce1FF19F720A

---

## The Problem

Anyone can claim to be a Web3 builder. But claims without proof mean nothing. There's no standard way to verify a builder's real contribution on-chain — no score, no history, no identity tied to actual work.

## The Solution

BuilderVault creates a **verifiable builder reputation** directly on OPN Chain:

- **Deploy Score** — automatically scans how many contracts you've deployed on OPN Chain
- **Lock Commitment** — deposit OPN tokens as proof you're serious about your project
- **On-chain Identity** — your wallet address becomes your verified builder profile

No fake credentials. No self-reported claims. Everything is verifiable on-chain.

---

## Season 1 — Builder Treasury (DeFi & Open Finance)

**Status: Live on OPN Chain Testnet**

### How it works

1. Connect your MetaMask wallet to OPN Chain
2. BuilderVault scans your wallet — counts contracts deployed on OPN Chain
3. Your **Builder Score** is calculated automatically
4. Optionally lock OPN tokens as commitment to your project
5. Your score and commitment are permanently recorded on-chain

### Scoring System

| Contracts Deployed | Score | Level |
|---|---|---|
| 0 | 0 | Newcomer |
| 1–2 | 10–20 | Newcomer |
| 3–5 | 30–50 | Builder |
| 6–10 | 60–100 | Senior Builder |
| 11+ | 100+ | Master Builder |

### Smart Contract

The `BuilderTreasury` contract handles all on-chain logic:

- `deposit(projectName)` — lock OPN tokens with your project name
- `withdraw()` — reclaim your deposited tokens anytime
- `getBuilderInfo(address)` — view any builder's deposit and project
- `getStats()` — view total builders and total funds locked

---

## 6-Season Roadmap

| Season | Theme | Feature |
|---|---|---|
| S1 ✅ | DeFi & Open Finance | Builder Treasury — deploy scoring + commitment vault |
| S2 | Identity & Reputation | Builder Profile — wallet as verified on-chain identity |
| S3 | Real World Assets | Portfolio NFT — CV that lives on blockchain |
| S4 | AI & Compute | AI Mentor — analyzes your profile, suggests next steps |
| S5 | Gaming & Ownership | Quest System — XP, levels, exclusive badges |
| S6 | Open Track | Full Platform — all layers merged into one product |

Each season builds on the previous one. By Season 6, BuilderVault becomes a complete on-chain resume and reputation system for every Web3 builder.

---

## Tech Stack

- **Smart Contract:** Solidity 0.8.19
- **Blockchain:** OPN Chain Testnet (Chain ID: 984)
- **Framework:** Hardhat 2.22.0
- **Frontend:** Vanilla HTML/CSS/JS + Ethers.js v6
- **Deploy Score:** OPN Chain Explorer API (Blockscout)
- **Hosting:** Vercel

---

## Local Setup

```bash
git clone https://github.com/stablemindlabs/buildervault.git
cd buildervault
npm install
cp .env.example .env
# Add your PRIVATE_KEY to .env
npx hardhat compile
npx hardhat run scripts/deploy.js --network opn_testnet
```

---

## Built By

**StableMind Labs** — building on OPN Chain, one season at a time.

Submitted to **OPN Builders Season 1** — DeFi & Open Finance track.