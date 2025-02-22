
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract AGTToken is ERC20, ReentrancyGuard, AccessControl {
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");
    
    uint256 public constant SILVER_GRAMS_PER_TOKEN = 1e15; // 0.001g of silver per AGT
    uint256 public silverPriceUSD; // Price per gram in USD (6 decimals)
    uint256 public lastPriceUpdate;
    uint256 public constant PRICE_UPDATE_INTERVAL = 1 hours;
    uint256 public constant MIN_PRICE_CHANGE = 1e4; // 1% minimum change

    event SilverPriceUpdated(uint256 oldPrice, uint256 newPrice);
    event TokensMinted(address indexed to, uint256 amount, uint256 silverGrams);
    event TokensBurned(address indexed from, uint256 amount, uint256 silverGrams);

    constructor() ERC20("Art Generator Token", "AGT") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ORACLE_ROLE, msg.sender);
    }

    function updateSilverPrice(uint256 _newPrice) external onlyRole(ORACLE_ROLE) {
        require(
            block.timestamp >= lastPriceUpdate + PRICE_UPDATE_INTERVAL,
            "Too soon to update price"
        );
        require(_newPrice > 0, "Invalid silver price");

        // Check for minimum price change
        if (silverPriceUSD > 0) {
            uint256 priceChange = _newPrice > silverPriceUSD ? 
                _newPrice - silverPriceUSD : silverPriceUSD - _newPrice;
            uint256 changePercentage = (priceChange * 1e6) / silverPriceUSD;
            require(changePercentage >= MIN_PRICE_CHANGE, "Price change too small");
        }

        emit SilverPriceUpdated(silverPriceUSD, _newPrice);
        silverPriceUSD = _newPrice;
        lastPriceUpdate = block.timestamp;
    }

    function mint(address to, uint256 amount) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(silverPriceUSD > 0, "Silver price not set");
        _mint(to, amount);
        emit TokensMinted(to, amount, amount * SILVER_GRAMS_PER_TOKEN);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount, amount * SILVER_GRAMS_PER_TOKEN);
    }

    function getSilverEquivalent(uint256 amount) public pure returns (uint256) {
        return amount * SILVER_GRAMS_PER_TOKEN;
    }

    function getTokenValue(uint256 amount) public view returns (uint256) {
        return (amount * SILVER_GRAMS_PER_TOKEN * silverPriceUSD) / 1e6;
    }
}
