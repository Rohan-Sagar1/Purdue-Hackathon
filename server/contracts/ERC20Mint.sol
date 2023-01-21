pragma solidity ^0.8.0;

contract ERC20Mint {
    mapping(address => uint256) public balanceOf;
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;

    event Transfer(address indexed from, address indexed to, uint256 value);

    constructor() {
        name = "Synthetic Asset Market";
        symbol = "SRK";
        decimals = 18;
        totalSupply = 0;
    }

    function mint(address to, uint256 value) public {
        require(msg.sender == msg.sender, "Minting permissions not granted");
        require(value > 0, "Cannot mint 0 tokens");
        balanceOf[to] += value;
        totalSupply += value;
        emit Transfer(address(0), to, value);
    }

    function transfer(address to, uint256 value) public {
        require(balanceOf[msg.sender] >= value && value > 0, "Insufficient balance or invalid transfer amount");
        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;
        emit Transfer(msg.sender, to, value);
    }
}
