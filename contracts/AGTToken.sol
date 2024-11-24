// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract AGTToken is ERC20, Ownable, Pausable {
    uint256 public constant INITIAL_SUPPLY = 1000000 * 10**18; // 1 million tokens
    uint256 public constant LOCK_PERIOD = 365 days;
    
    mapping(address => uint256) public lockTime;

    constructor() ERC20("Art Generator Token", "AGT") Ownable(msg.sender) {
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
        lockTime[to] = block.timestamp + LOCK_PERIOD;
    }

    function transfer(address to, uint256 amount) public override whenNotPaused returns (bool) {
        require(block.timestamp >= lockTime[msg.sender], "Tokens are locked");
        return super.transfer(to, amount);
    }

    function transferFrom(address from, address to, uint256 amount) public override whenNotPaused returns (bool) {
        require(block.timestamp >= lockTime[from], "Tokens are locked");
        return super.transferFrom(from, to, amount);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }
}