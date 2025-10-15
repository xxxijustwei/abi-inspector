# ABI Inspector
 
A minimal web UI to explore and interact with smart contracts from a JSON ABI. Paste an ABI, provide a contract address, and the app generates forms to call read/write functions. Wallet connection supports test networks out of the box.
 
## Features
- Paste JSON ABI to auto-generate function UIs
- Read calls and write transactions with results/receipts
- Wallet connect via WalletConnect (RainbowKit)
 
## Quick Start
 
1) Install
- bun: `bun install`
 
2) Configure env
- Copy `.env.example` to `.env` and set:
  - `WALLET_CONNECT_PROJECT_ID` = your WalletConnect Project ID
 
3) Run dev
- `bun run dev` and open `http://localhost:3000`
 
## Usage
- Enter a contract address (0x…) on a supported chain.
- Paste the contract’s JSON ABI.
- Submit to list functions under Read/Write tabs.
- Read: call functions and view results.
- Write: connect a wallet, sign, and view the transaction receipt.
 
## Scripts
- `bun run dev` — Start the dev server
- `bun run build` — Format, lint, and build
- `bun run start` — Run the production server
- `bun run format` — Format with Biome
- `bun run lint` — Lint with Biome
 
## Docker
- Build: `docker build -t abi-inspector:latest .`
- Run: `docker run -d -p 3000:3000 --name abi-inspector abi-inspector:latest`
- See `deploy.sh` for a simple local deployment script.
 
## Tech Stack
- Next.js 15, React 19, TypeScript
- wagmi + viem, RainbowKit (WalletConnect)
- next-intl, Tailwind CSS
- Biome for formatting/linting
