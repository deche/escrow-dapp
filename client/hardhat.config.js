require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.4",
  paths: {
    sources: "./src/contracts",
    artifacts: "./src/artifacts",
  },
  networks: {
    hardhat: {
      chainId: 1337
    }
  }
};
