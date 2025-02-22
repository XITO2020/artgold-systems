
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract TabAsCoin is ERC20, ReentrancyGuard, AccessControl {
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");
    
    uint256 public constant GOLD_GRAMS_PER_TOKEN = 1e14; // 0.0001g of gold per TABZ
    uint256 public goldPriceUSD; // Price per gram in USD (6 decimals)
    uint256 public lastPriceUpdate;
    uint256 public constant PRICE_UPDATE_INTERVAL = 1 hours;
    uint256 public constant MIN_PRICE_CHANGE = 1e4; // 1% minimum change

    event GoldPriceUpdated(uint256 oldPrice, uint256 newPrice);
    event TokensMinted(address indexed to, uint256 amount, uint256 goldGrams);
    event TokensBurned(address indexed from, uint256 amount, uint256 goldGrams);

    constructor() ERC20("TabAsCoin", "TABZ") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ORACLE_ROLE, msg.sender);
    }

    function updateGoldPrice(uint256 _newPrice) external onlyRole(ORACLE_ROLE) {
        require(
            block.timestamp >= lastPriceUpdate + PRICE_UPDATE_INTERVAL,
            "Too soon to update price"
        );
        require(_newPrice > 0, "Invalid gold price");

        // Check for minimum price change
        if (goldPriceUSD > 0) {
            uint256 priceChange = _newPrice > goldPriceUSD ? 
                _newPrice - goldPriceUSD : goldPriceUSD - _newPrice;
            uint256 changePercentage = (priceChange * 1e6) / goldPriceUSD;
            require(changePercentage >= MIN_PRICE_CHANGE, "Price change too small");
        }

        emit GoldPriceUpdated(goldPriceUSD, _newPrice);
        goldPriceUSD = _newPrice;
        lastPriceUpdate = block.timestamp;
    }

    function mint(address to, uint256 amount) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(goldPriceUSD > 0, "Gold price not set");
        _mint(to, amount);
        emit TokensMinted(to, amount, amount * GOLD_GRAMS_PER_TOKEN);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount, amount * GOLD_GRAMS_PER_TOKEN);
    }

    function getGoldEquivalent(uint256 amount) public pure returns (uint256) {
        return amount * GOLD_GRAMS_PER_TOKEN;
    }

    function getTokenValue(uint256 amount) public view returns (uint256) {
        return (amount * GOLD_GRAMS_PER_TOKEN * goldPriceUSD) / 1e6;
    }
}
