pragma solidity ^0.8.0;

import "./ERC20Mint.sol";

contract SyntheticAssetMarket {
    address public owner;
    mapping(address => uint256) public balanceOf;
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;
    address[] public syntheticAssets;
    mapping(address => SyntheticAssetDetail) public syntheticAssetDetail;

    struct SyntheticAssetDetail {
        uint256 price;
        uint256 weight;
    }

    event Transfer(address indexed from, address indexed to, uint256 value);

    constructor() {
        owner = msg.sender;
    }

    function createSyntheticAsset(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        uint256 _totalSupply,
        uint256 _price,
        uint256 _weight
    ) public {
        require(msg.sender == owner, "Only owner can create synthetic asset");
        SyntheticAssetDetail memory syntheticAsset = SyntheticAssetDetail(
            _price,
            _weight
        );
        syntheticAssetDetail[msg.sender] = syntheticAsset;
        syntheticAssets.push(msg.sender);
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        totalSupply = _totalSupply;
        balanceOf[msg.sender] = _totalSupply;
        emit Transfer(address(0), msg.sender, _totalSupply);
    }

    function trade(
        address _from,
        address _to,
        uint256 _value
    ) public {
        require(msg.sender == owner, "Only owner can trade synthetic asset");
        require(
            balanceOf[_from] >= _value && _value > 0,
            "Insufficient balance or invalid transfer amount"
        );
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(_from, _to, _value);
    }


    function getSyntheticAssets() public view returns (address[] memory) {
        return syntheticAssets;
    }

    function getSyntheticAssetDetail(address _address)
        public
        view
        returns (uint256, uint256)
    {
        return (
            syntheticAssetDetail[_address].price,
            syntheticAssetDetail[_address].weight
        );
    }

}

