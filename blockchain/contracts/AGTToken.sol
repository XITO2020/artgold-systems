// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract AGTToken is ERC20, ReentrancyGuard, AccessControl, Pausable {
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");
    bytes32 public constant BANK_ROLE = keccak256("BANK_ROLE");
    bytes32 public constant FEE_MANAGER_ROLE = keccak256("FEE_MANAGER_ROLE");
    
    uint256 public constant SILVER_GRAMS_PER_TOKEN = 1e15; // 0.001g of silver per AGT
    uint256 public silverPriceUSD; // Price per gram in USD (6 decimals)
    uint256 public lastPriceUpdate;
    uint256 public constant PRICE_UPDATE_INTERVAL = 1 hours;
    uint256 public constant MIN_PRICE_CHANGE = 1e4; // 1% minimum change

    // Fee system
    uint256 public transferFeeRate = 25; // 0.25% fee by default
    uint256 public constant MAX_FEE_RATE = 100; // Maximum 1% fee
    address public feeCollector;
    mapping(address => bool) public isExemptFromFee;

    // AGT-specific categories with higher rewards
    mapping(string => uint256) public categoryAGTBonus;
    
    // Bank reserves
    uint256 public constant MIN_BANK_RESERVE = 1000; // Minimum 1000 AGT
    uint256 public bankReserve;

    event SilverPriceUpdated(uint256 oldPrice, uint256 newPrice);
    event TokensMinted(address indexed to, uint256 amount, uint256 silverGrams);
    event TokensBurned(address indexed from, uint256 amount, uint256 silverGrams);
    event BankPurchase(address indexed seller, uint256 amount, string artworkId);
    event FeeRateUpdated(uint256 oldRate, uint256 newRate);
    event FeeCollectorUpdated(address oldCollector, address newCollector);
    event FeeExemptionUpdated(address account, bool isExempt);
    event FeeCollected(address indexed from, address indexed to, uint256 feeAmount);

    constructor() ERC20("Art Generator Token", "AGT") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ORACLE_ROLE, msg.sender);
        _grantRole(BANK_ROLE, msg.sender);
        _grantRole(FEE_MANAGER_ROLE, msg.sender);

        feeCollector = msg.sender;
        isExemptFromFee[msg.sender] = true;

        // Initialize bank reserve
        bankReserve = 27000;
        
        // Set AGT bonus for innovative categories
        categoryAGTBonus["invention"] = 500;
        categoryAGTBonus["architecture"] = 400;
        categoryAGTBonus["comics"] = 300;
        categoryAGTBonus["ecologicalplan"] = 450;
        categoryAGTBonus["characterdesign"] = 350;
        categoryAGTBonus["vehicles concept"] = 400;
        categoryAGTBonus["visual effect"] = 300;
        categoryAGTBonus["motion design"] = 250;
    }

    // Pause/Unpause functions
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    // Fee management functions
    function setTransferFeeRate(uint256 newRate) external onlyRole(FEE_MANAGER_ROLE) {
        require(newRate <= MAX_FEE_RATE, "Fee rate exceeds maximum");
        emit FeeRateUpdated(transferFeeRate, newRate);
        transferFeeRate = newRate;
    }

    function setFeeCollector(address newCollector) external onlyRole(FEE_MANAGER_ROLE) {
        require(newCollector != address(0), "Invalid fee collector");
        emit FeeCollectorUpdated(feeCollector, newCollector);
        feeCollector = newCollector;
    }

    function setFeeExemption(address account, bool isExempt) external onlyRole(FEE_MANAGER_ROLE) {
        isExemptFromFee[account] = isExempt;
        emit FeeExemptionUpdated(account, isExempt);
    }

    // Override transfer functions to include fees
    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override whenNotPaused {
        require(from != address(0), "Transfer from zero address");
        require(to != address(0), "Transfer to zero address");

        if (
            !isExemptFromFee[from] &&
            !isExemptFromFee[to] &&
            from != feeCollector &&
            to != feeCollector
        ) {
            uint256 feeAmount = (amount * transferFeeRate) / 10000;
            super._transfer(from, feeCollector, feeAmount);
            super._transfer(from, to, amount - feeAmount);
            emit FeeCollected(from, to, feeAmount);
        } else {
            super._transfer(from, to, amount);
        }
    }

    function bankPurchaseArtwork(
        address seller,
        uint256 amount,
        string memory artworkId
    ) external onlyRole(BANK_ROLE) whenNotPaused {
        require(bankReserve >= amount + MIN_BANK_RESERVE, "Insufficient bank reserve");
        require(amount <= 1000, "Amount exceeds maximum purchase");
        
        bankReserve -= amount;
        _transfer(address(this), seller, amount);
        
        emit BankPurchase(seller, amount, artworkId);
    }

    function mintForCategory(
        address artist,
        string memory category,
        bool isFirst
    ) external onlyRole(DEFAULT_ADMIN_ROLE) whenNotPaused {
        uint256 bonus = categoryAGTBonus[category];
        require(bonus > 0, "Category not eligible for AGT");
        
        // Apply first-time bonus (50% extra)
        uint256 finalAmount = isFirst ? bonus * 150 / 100 : bonus;
        
        _mint(artist, finalAmount);
        emit TokensMinted(artist, finalAmount, finalAmount * SILVER_GRAMS_PER_TOKEN);
    }

    function updateSilverPrice(uint256 _newPrice) external onlyRole(ORACLE_ROLE) whenNotPaused {
        require(
            block.timestamp >= lastPriceUpdate + PRICE_UPDATE_INTERVAL,
            "Too soon to update price"
        );
        require(_newPrice > 0, "Invalid silver price");

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

    function burn(uint256 amount) external whenNotPaused {
        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount, amount * SILVER_GRAMS_PER_TOKEN);
    }

    function getSilverEquivalent(uint256 amount) public pure returns (uint256) {
        return amount * SILVER_GRAMS_PER_TOKEN;
    }

    function getTokenValue(uint256 amount) public view returns (uint256) {
        return (amount * SILVER_GRAMS_PER_TOKEN * silverPriceUSD) / 1e6;
    }

    function getBankReserve() public view returns (uint256) {
        return bankReserve;
    }
}