// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract TabAsCoin is ERC20, ReentrancyGuard, AccessControl, Pausable {
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");
    bytes32 public constant FEE_MANAGER_ROLE = keccak256("FEE_MANAGER_ROLE");
    
    uint256 public constant GOLD_GRAMS_PER_TOKEN = 1e14; // 0.0001g of gold per TABZ
    uint256 public goldPriceUSD; // Price per gram in USD (6 decimals)
    uint256 public lastPriceUpdate;
    uint256 public constant PRICE_UPDATE_INTERVAL = 1 hours;
    uint256 public constant MIN_PRICE_CHANGE = 1e4; // 1% minimum change

    // Fee system
    uint256 public transferFeeRate = 50; // 0.5% fee by default
    uint256 public constant MAX_FEE_RATE = 200; // Maximum 2% fee
    address public feeCollector;
    mapping(address => bool) public isExemptFromFee;

    // Category-based pricing
    mapping(string => uint256) public categoryBasePrice;
    
    // Slot management
    mapping(address => uint256) public userSlots;
    uint256 public constant MAX_SLOTS = 12;

    event GoldPriceUpdated(uint256 oldPrice, uint256 newPrice);
    event TokensMinted(address indexed to, uint256 amount, uint256 goldGrams);
    event TokensBurned(address indexed from, uint256 amount, uint256 goldGrams);
    event ArtworkMinted(address indexed artist, string artworkId, uint256 price);
    event SlotUsed(address indexed user, uint256 remainingSlots);
    event FeeRateUpdated(uint256 oldRate, uint256 newRate);
    event FeeCollectorUpdated(address oldCollector, address newCollector);
    event FeeExemptionUpdated(address account, bool isExempt);
    event FeeCollected(address indexed from, address indexed to, uint256 feeAmount);

    constructor() ERC20("TabAsCoin", "TABZ") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ORACLE_ROLE, msg.sender);
        _grantRole(FEE_MANAGER_ROLE, msg.sender);
        
        feeCollector = msg.sender;
        isExemptFromFee[msg.sender] = true;
        
        // Initialize category base prices (in TABZ)
        categoryBasePrice["african"] = 250;
        categoryBasePrice["pacifikian"] = 250;
        categoryBasePrice["oriental"] = 250;
        categoryBasePrice["indian"] = 250;
        categoryBasePrice["amerindian"] = 250;
        categoryBasePrice["slavic"] = 250;
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

    function mintArtwork(
        address artist,
        string memory artworkId,
        string memory category,
        bool isFirst
    ) external onlyRole(DEFAULT_ADMIN_ROLE) whenNotPaused {
        require(userSlots[artist] < MAX_SLOTS, "Maximum slots reached");
        
        uint256 basePrice = categoryBasePrice[category];
        require(basePrice > 0, "Invalid category");
        
        // Apply first-time bonus
        uint256 finalPrice = isFirst ? basePrice * 125 / 100 : basePrice;
        
        // Mint tokens to artist
        _mint(artist, finalPrice);
        
        // Update slots
        userSlots[artist]++;
        
        emit ArtworkMinted(artist, artworkId, finalPrice);
        emit SlotUsed(artist, MAX_SLOTS - userSlots[artist]);
    }

    function updateGoldPrice(uint256 _newPrice) external onlyRole(ORACLE_ROLE) whenNotPaused {
        require(
            block.timestamp >= lastPriceUpdate + PRICE_UPDATE_INTERVAL,
            "Too soon to update price"
        );
        require(_newPrice > 0, "Invalid gold price");

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

    function burn(uint256 amount) external whenNotPaused {
        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount, amount * GOLD_GRAMS_PER_TOKEN);
    }

    function getGoldEquivalent(uint256 amount) public view returns (uint256) {
        return amount * GOLD_GRAMS_PER_TOKEN;
    }

    function getTokenValue(uint256 amount) public view returns (uint256) {
        return (amount * GOLD_GRAMS_PER_TOKEN * goldPriceUSD) / 1e6;
    }

    function getRemainingSlots(address user) public view returns (uint256) {
        return MAX_SLOTS - userSlots[user];
    }
}