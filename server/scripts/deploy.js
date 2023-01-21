const main = async() => {
  const signer = await ethers.getSigner();

  const contractFactory = await ethers.getContractFactory('SyntheticAssetMarket');
  const contract = await contractFactory.deploy();
  await contract.deployed();

  const ERC20MintFactory = await ethers.getContractFactory('ERC20Mint');
  const erc20Mint = await ERC20MintFactory.deploy();
  await erc20Mint.deployed();
  await erc20Mint.connect(signer).mint(contract.address, ethers.utils.parseEther('1000000'));
  
  console.log("SyntheticAssetMarket deployed to: ", contract.address);
  console.log("ERC20Mint deployed to: ", erc20Mint.address);
}

const runMain = async() => {
  try {
    await main();
    process.exit(0);
  } catch(error) {
    console.log(error);
    process.exit(1);
  }
}

runMain();
