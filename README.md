# Myriad Flow Marketplace

<img alt="img" src="http://ipfs.infura.io/ipfs/QmScxeDu6CXSaXpbqmtLhff5Ru1QV6YWo6kFwpERW4vJYB" width="800" height="400" />

## Getting Started

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
NEXT_PUBLIC_MARKETPLACE_ADDRESS="0x899dEf33857C491Ce61346f6e95b3a5Ee4acd24a"
NEXT_PUBLIC_CREATIFY_ADDRESS="0xA5024E93fbc9015fa60F0b72F531aD5f0e6d7e16"
NEXT_PUBLIC_GRAPHQL_API="https://query.graph.lazarus.network/subgraphs/name/MyriadFlow"
NEXT_PUBLIC_BASE_URL=https://marketplace-engine.lazarus.network
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
- [Devsi Singh](https://github.com/emily876)
- [Manish Kushwaha](https://github.com/manishgtx)
- [Om More](https://github.com/thisisommore)
- [Shruti Bansal](https://github.com/shrutibansal1802)

## License

The project is currently under MIT licensed.
