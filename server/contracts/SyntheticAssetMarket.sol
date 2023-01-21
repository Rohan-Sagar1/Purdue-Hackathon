pragma solidity ^0.8.0;
import "./ERC20Mint.sol";

contract SyntheticAssetMarket is ERC20Mint {
    struct Asset {
        address underlyingAsset;
        uint256 weight;
    }

    struct SyntheticAsset{
        address payable owner;
        Asset[] underlyingAssets;
        uint256 totalWeight;
    }

    mapping(address => SyntheticAsset) public synthAssets;
    mapping(address => bool) public assets;
    mapping(address => uint256) public weight;

    event SyntheticAssetCreated(address indexed owner, address indexed synthAsset);
    event SyntheticAssetTraded(address indexed from, address indexed to, address indexed syntheticAsset);

    function createSyntheticAsset(address[] memory underlyingAssets, uint256[] memory weights) public {
        require(underlyingAssets.length > 0, "At least one underlying asset is required");
        require(underlyingAssets.length == weights.length, "Invalid underlying assets");

        address assetTools = address(this);
        synthAssets[assetTools].owner = payable(msg.sender);
        synthAssets[assetTools].totalWeight = 0;

        for (uint256 i = 0; i < underlyingAssets.length; i++) {
            require(assets[underlyingAssets[i]], "Invalid underlying asset");
            synthAssets[assetTools].underlyingAssets.push(Asset(underlyingAssets[i], weights[i]));
            synthAssets[assetTools].totalWeight += weights[i];
        }

        emit SyntheticAssetCreated(msg.sender, assetTools);
    }

    function tradeSyntheticAsset(address syntheticAsset, address newOwner) public {
        require(synthAssets[syntheticAsset].owner == msg.sender, "Sender should be the owner of the synthetic asset");
        require(newOwner != address(0), "Invalid address for new owner");

        synthAssets[syntheticAsset].owner = payable(newOwner);

        emit SyntheticAssetTraded(msg.sender, newOwner, syntheticAsset);
    }

    function isValidAsset(address[] memory underlyingAssets) private view returns (bool) {
        for (uint256 i = 0; i < underlyingAssets.length; i++) {
            if (!assets[underlyingAssets[i]]) {
                return false;
            }
        }
        return true;
    }

    function addAsset(address asset, uint256 assetWeight) public {
        require(msg.sender == msg.sender, "Only the owner can add assets");
        require(asset != address(0), "Invalid asset address");
        require(assetWeight > 0, "Invalid weight");

        assets[asset] = true;
        weight[asset] = assetWeight;
    }

    function removeAsset(address asset) public {
        require(msg.sender == msg.sender, "Only the owner can remove assets");
        require(asset != address(0), "Invalid asset address");

        assets[asset] = false;
        weight[asset] = 0;
    }

    function getSyntheticAsset(address syntheticAsset) public view returns (address[] memory, uint256[] memory, uint256) {
        SyntheticAsset memory synthAsset = synthAssets[syntheticAsset];
        address[] memory underlyingAssets = new address[](synthAsset.underlyingAssets.length);
        uint256[] memory weights = new uint256[](synthAsset.underlyingAssets.length);

        for (uint256 i = 0; i < synthAsset.underlyingAssets.length; i++) {
            underlyingAssets[i] = synthAsset.underlyingAssets[i].underlyingAsset;
            weights[i] = synthAsset.underlyingAssets[i].weight;
        }

        return (underlyingAssets, weights, synthAsset.totalWeight);
    }
}

