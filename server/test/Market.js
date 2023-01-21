const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require("ethers");

describe("SyntheticAssetMarket", () => {
  let syntheticAssetMarket;
  let owner;

beforeEach(async () => {
  accounts = await ethers.provider.listAccounts();
  const syntheticAssetMarketFactory = await ethers.getContractFactory("SyntheticAssetMarket");
  syntheticAssetMarket = await syntheticAssetMarketFactory.deploy();
  await syntheticAssetMarket.deployed();

  const ERC20MintFactory = await ethers.getContractFactory("ERC20Mint");
  erc20Mint = await ERC20MintFactory.deploy();
  await erc20Mint.deployed();

  const signers = await ethers.getSigners();
  owner = await signers[0].getAddress();
});

it("should allow to create a synthetic asset", async () => {
  await syntheticAssetMarket.createSyntheticAsset(
    "Test Synthetic Asset",
    "TSA",
    18,
    100,
    10,
    2
    );
  const syntheticAssets = await syntheticAssetMarket.getSyntheticAssets();
  expect(syntheticAssets.length).to.equal(1);
  expect(await syntheticAssetMarket.balanceOf(owner)).to.equal(100);
  expect(await syntheticAssetMarket.name()).to.equal("Test Synthetic Asset");
  expect(await syntheticAssetMarket.symbol()).to.equal("TSA");
  expect(await syntheticAssetMarket.decimals()).to.equal(18);
  const [price, weight] = await syntheticAssetMarket.getSyntheticAssetDetail(syntheticAssets[0]);
  expect(price).to.equal(10);
  expect(weight).to.equal(2);
  });

  it("should allow to trade synthetic asset", async () => {
    await syntheticAssetMarket.createSyntheticAsset(
      "Test Synthetic Asset",
      "TSA",
      18,
      100,
      10,
      2
      );
    const recipient = accounts[1];
    await syntheticAssetMarket.trade(owner, recipient, 50);
    expect(await syntheticAssetMarket.balanceOf(owner)).to.equal(50);
    expect(await syntheticAssetMarket.balanceOf(recipient)).to.equal(50);
    const [price, weight] = await syntheticAssetMarket.getSyntheticAssetDetail(owner);
    expect(price).to.equal(10);
    expect(weight).to.equal(2);
    });
  
  


  it("should mint ERC20Mint", async () => {
    const tx = await erc20Mint.mint(owner, BigNumber.from(1000000));
    const balance = await erc20Mint.balanceOf(owner);
    expect(balance).to.equal(BigNumber.from(1000000));
  });

});
  
  



     

