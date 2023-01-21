const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require("ethers");
const { deployments } = require("hardhat");

describe("SyntheticAssetMarket", () => {
    let syntheticAssetMarket;
    let underlyingAssets;
    let weights;
    let owner;
    let erc20Mint;

    beforeEach(async () => {
        const syntheticAssetMarketFactory = await ethers.getContractFactory("SyntheticAssetMarket");
        syntheticAssetMarket = await syntheticAssetMarketFactory.deploy();
        await syntheticAssetMarket.deployed();

        const ERC20MintFactory = await ethers.getContractFactory("ERC20Mint");
        erc20Mint = await ERC20MintFactory.deploy();
        await erc20Mint.deployed();

        const signers = await ethers.getSigners();
        owner = await signers[0].getAddress();
        underlyingAssets = [erc20Mint.address, erc20Mint.address];
        weights = [BigNumber.from(1), BigNumber.from(2)];

        await syntheticAssetMarket.addAsset(erc20Mint.address, BigNumber.from(1));
    });


    it("should create a synthetic asset", async () => {
        const tx = await syntheticAssetMarket.createSyntheticAsset(underlyingAssets, weights);
        const syntheticAssetAddress = tx.events[0].args[1];
        expect(syntheticAssetAddress).to.not.be.null;

        const syntheticAssetInfo = await syntheticAssetMarket.getSyntheticAsset(syntheticAssetAddress);
        expect(syntheticAssetInfo.underlyingAssets).to.deep.equal(underlyingAssets);
        expect(syntheticAssetInfo.weights).to.deep.equal(weights);
    });

    it("should trade synthetic assets", async () => {
        const tx = await syntheticAssetMarket.createSyntheticAsset(underlyingAssets, weights);
        const syntheticAssetAddress = tx.events[0].args[1];
        expect(syntheticAssetAddress).to.not.be.null; 

        const newOwner = await ethers.getSigners()[1].getAddress();
        const tx2 = await syntheticAssetMarket.tradeSyntheticAsset(syntheticAssetAddress, newOwner, bigNumberify(1));
        const syntheticAssetInfo = await syntheticAssetMarket.getSyntheticAsset(syntheticAssetAddress);
        expect(syntheticAssetInfo.owner).to.equal(newOwner);
    });
});


