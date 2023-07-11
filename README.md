1. Fork the repository.

2. Clone the forked repository.

 git clone https://github.com/<your_user_name>/marketplace.git
3. Navigate to the cloned repository.
cd marketplace
4. Install the package dependencies.
npm install
5. Then add .env.local file in root with following content:
NEXT_PUBLIC_RPC_PROVIDER="https://rpc-mumbai.maticvigil.com/v1/6b26aad1d887708c0004394c103f8b27c1141540"
NEXT_PUBLIC_MARKETPLACE_ADDRESS="0xc2d4d1E0103cfe42c35398Edce983f4c8999F429"
NEXT_PUBLIC_STOREFRONT_ADDRESS="0xe5c5FDBde18F94a50C47BC7b7f8dBe484A476B78"
NEXT_PUBLIC_MARKETPLACE_API=https://api.thegraph.com/subgraphs/name/myriadflow/marketplacev1
NEXT_PUBLIC_STOREFRONT_API=https://api.thegraph.com/subgraphs/name/myriadflow/storefront-v1
NEXT_PUBLIC_BASE_URL=https://testnet.gateway.myriadflow.com
NEXT_PUBLIC_RPC_PROVIDER=https://rpc-mumbai.maticvigil.com/v1/f336dfba703440ee198bf937d5c065b8fe04891c
NEXT_PUBLIC_IPFS_GATEWAY=https://cloudflare-ipfs.com/ipfs/

6. Lastly, run the development server:
npm run dev
# or
yarn dev
Open http://localhost:3000 with your browser to see the result.

Contributions Best Practices
Commits
Write clear meaningful git commit messages.
Make sure your PR's description contains GitHub's special keyword references that automatically close the related issue when the PR is merged.
Feature Requests and Bug Reports
When you file a feature request or when you are submitting a bug report to the issue tracker, make sure you add steps to reproduce it.
If you would like to work on an issue, drop in a comment at the issue. If it is already assigned to someone, but there is no sign of any work being done, please feel free to drop in a comment so that the issue can be assigned to you if the previous assignee has dropped it entirely.
# Myriad Flow Marketplace

<img alt="img" src="http://ipfs.infura.io/ipfs/QmScxeDu6CXSaXpbqmtLhff5Ru1QV6YWo6kFwpERW4vJYB" width="800" height="400" />

## Getting Started

### Gitpod
[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/MyriadFlow/StoreFront_webapp)

### Local

1. Fork the repository.
 
2. Clone the forked repository.
```bash
git clone https://github.com/<your_user_name>/marketplace.git
```

3. Navigate to the cloned repository.
```bash
cd marketplace
```

4. Install the package dependencies.
```bash
npm install
```

5. Then add .env.local file in root with following content:

```
NEXT_PUBLIC_RPC_PROVIDER="https://rpc-mumbai.maticvigil.com/v1/6b26aad1d887708c0004394c103f8b27c1141540"
NEXT_PUBLIC_MARKETPLACE_ADDRESS="0xc2d4d1E0103cfe42c35398Edce983f4c8999F429"
NEXT_PUBLIC_STOREFRONT_ADDRESS="0xe5c5FDBde18F94a50C47BC7b7f8dBe484A476B78"
NEXT_PUBLIC_MARKETPLACE_API=https://api.thegraph.com/subgraphs/name/myriadflow/marketplacev1
NEXT_PUBLIC_STOREFRONT_API=https://api.thegraph.com/subgraphs/name/myriadflow/storefront-v1
NEXT_PUBLIC_BASE_URL=https://testnet.gateway.myriadflow.com
NEXT_PUBLIC_RPC_PROVIDER=https://rpc-mumbai.maticvigil.com/v1/f336dfba703440ee198bf937d5c065b8fe04891c
NEXT_PUBLIC_IPFS_GATEWAY=https://cloudflare-ipfs.com/ipfs/

```

6. Lastly, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Contributions Best Practices

### Commits

- Write clear meaningful git commit messages.
- Make sure your PR's description contains GitHub's special keyword references that automatically close the related issue when the PR is merged.

### Feature Requests and Bug Reports

- When you file a feature request or when you are submitting a bug report to the issue tracker, make sure you add steps to reproduce it. 
- If you would like to work on an issue, drop in a comment at the issue. If it is already assigned to someone, but there is no sign of any work being done, please feel free to drop in a comment so that the issue can be assigned to you if the previous assignee has dropped it entirely.

## Contributors

- [Shachindra](https://github.com/Shachindra)
- [Alka Rashinkar](https://github.com/alkadips)
## License

The project is currently under MIT licensed.

Contributors
Shachindra
Alka Rashinkar
License

The project is currently under MIT licensed.