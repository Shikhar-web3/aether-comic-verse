
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * @title RoyaltyDistributor
 * @dev Handles automatic royalty distribution for comic sales
 * Features:
 * - Multi-party revenue sharing
 * - Automatic distribution triggers
 * - Emergency withdrawal mechanisms
 * - Platform fee collection
 */
contract RoyaltyDistributor is Ownable, ReentrancyGuard, Pausable {
    using SafeMath for uint256;

    // Events
    event RoyaltyReceived(uint256 indexed comicId, uint256 amount, address indexed payer);
    event RoyaltyDistributed(uint256 indexed comicId, address indexed recipient, uint256 amount);
    event ShareUpdated(uint256 indexed comicId, address indexed recipient, uint256 newShare);
    event ComicRegistered(uint256 indexed comicId, address indexed creator);

    // Structs
    struct RoyaltyRecipient {
        address recipientAddress;
        uint256 sharePercentage; // Basis points (100 = 1%)
        string role;
        bool isActive;
    }

    struct ComicRoyalty {
        address creator;
        uint256 totalEarned;
        uint256 totalDistributed;
        bool isActive;
        mapping(address => RoyaltyRecipient) recipients;
        address[] recipientList;
    }

    // State variables
    mapping(uint256 => ComicRoyalty) public comicRoyalties;
    mapping(address => uint256[]) public creatorComics;
    mapping(address => uint256) public pendingWithdrawals;
    
    uint256 public platformFeePercentage = 250; // 2.5%
    address public platformWallet;
    uint256 public minimumDistributionAmount = 0.01 ether;

    // Modifiers
    modifier onlyComicCreator(uint256 comicId) {
        require(comicRoyalties[comicId].creator == msg.sender, "Not the comic creator");
        _;
    }

    modifier validComicId(uint256 comicId) {
        require(comicRoyalties[comicId].isActive, "Comic not registered");
        _;
    }

    constructor(address _platformWallet) {
        require(_platformWallet != address(0), "Invalid platform wallet");
        platformWallet = _platformWallet;
    }

    /**
     * @dev Register a new comic for royalty distribution
     * @param comicId Unique comic identifier
     * @param creator Address of the comic creator
     */
    function registerComic(uint256 comicId, address creator) public onlyOwner {
        require(creator != address(0), "Invalid creator address");
        require(!comicRoyalties[comicId].isActive, "Comic already registered");

        comicRoyalties[comicId].creator = creator;
        comicRoyalties[comicId].isActive = true;
        
        creatorComics[creator].push(comicId);

        emit ComicRegistered(comicId, creator);
    }

    /**
     * @dev Add a royalty recipient for a comic
     * @param comicId Comic identifier
     * @param recipient Address of the recipient
     * @param sharePercentage Share percentage in basis points
     * @param role Role of the recipient (e.g., "artist", "writer")
     */
    function addRoyaltyRecipient(
        uint256 comicId,
        address recipient,
        uint256 sharePercentage,
        string memory role
    ) public validComicId(comicId) onlyComicCreator(comicId) {
        require(recipient != address(0), "Invalid recipient address");
        require(sharePercentage > 0 && sharePercentage <= 10000, "Invalid share percentage");
        require(!comicRoyalties[comicId].recipients[recipient].isActive, "Recipient already exists");

        // Check total shares don't exceed 100%
        uint256 totalShares = getTotalShares(comicId);
        require(totalShares.add(sharePercentage) <= 10000, "Total shares exceed 100%");

        comicRoyalties[comicId].recipients[recipient] = RoyaltyRecipient({
            recipientAddress: recipient,
            sharePercentage: sharePercentage,
            role: role,
            isActive: true
        });

        comicRoyalties[comicId].recipientList.push(recipient);

        emit ShareUpdated(comicId, recipient, sharePercentage);
    }

    /**
     * @dev Update royalty share for a recipient
     * @param comicId Comic identifier
     * @param recipient Address of the recipient
     * @param newSharePercentage New share percentage
     */
    function updateRoyaltyShare(
        uint256 comicId,
        address recipient,
        uint256 newSharePercentage
    ) public validComicId(comicId) onlyComicCreator(comicId) {
        require(comicRoyalties[comicId].recipients[recipient].isActive, "Recipient not found");
        require(newSharePercentage > 0 && newSharePercentage <= 10000, "Invalid share percentage");

        // Calculate new total shares
        uint256 currentShare = comicRoyalties[comicId].recipients[recipient].sharePercentage;
        uint256 totalShares = getTotalShares(comicId);
        uint256 newTotalShares = totalShares.sub(currentShare).add(newSharePercentage);
        require(newTotalShares <= 10000, "Total shares exceed 100%");

        comicRoyalties[comicId].recipients[recipient].sharePercentage = newSharePercentage;

        emit ShareUpdated(comicId, recipient, newSharePercentage);
    }

    /**
     * @dev Remove a royalty recipient
     * @param comicId Comic identifier
     * @param recipient Address of the recipient to remove
     */
    function removeRoyaltyRecipient(
        uint256 comicId,
        address recipient
    ) public validComicId(comicId) onlyComicCreator(comicId) {
        require(comicRoyalties[comicId].recipients[recipient].isActive, "Recipient not found");

        comicRoyalties[comicId].recipients[recipient].isActive = false;

        // Remove from recipient list
        address[] storage recipientList = comicRoyalties[comicId].recipientList;
        for (uint256 i = 0; i < recipientList.length; i++) {
            if (recipientList[i] == recipient) {
                recipientList[i] = recipientList[recipientList.length - 1];
                recipientList.pop();
                break;
            }
        }

        emit ShareUpdated(comicId, recipient, 0);
    }

    /**
     * @dev Receive royalty payment for a comic
     * @param comicId Comic identifier
     */
    function receiveRoyalty(uint256 comicId) public payable validComicId(comicId) nonReentrant {
        require(msg.value > 0, "No payment received");

        comicRoyalties[comicId].totalEarned = comicRoyalties[comicId].totalEarned.add(msg.value);

        emit RoyaltyReceived(comicId, msg.value, msg.sender);

        // Auto-distribute if amount is above minimum
        if (msg.value >= minimumDistributionAmount) {
            _distributeRoyalty(comicId, msg.value);
        } else {
            // Add to pending for batch distribution
            pendingWithdrawals[comicRoyalties[comicId].creator] = 
                pendingWithdrawals[comicRoyalties[comicId].creator].add(msg.value);
        }
    }

    /**
     * @dev Manually distribute accumulated royalties for a comic
     * @param comicId Comic identifier
     */
    function distributeRoyalty(uint256 comicId) public validComicId(comicId) nonReentrant {
        uint256 pendingAmount = pendingWithdrawals[comicRoyalties[comicId].creator];
        require(pendingAmount > 0, "No pending royalties");

        pendingWithdrawals[comicRoyalties[comicId].creator] = 0;
        _distributeRoyalty(comicId, pendingAmount);
    }

    /**
     * @dev Internal function to distribute royalties
     * @param comicId Comic identifier
     * @param amount Amount to distribute
     */
    function _distributeRoyalty(uint256 comicId, uint256 amount) internal {
        // Calculate platform fee
        uint256 platformFee = amount.mul(platformFeePercentage).div(10000);
        uint256 distributionAmount = amount.sub(platformFee);

        // Send platform fee
        payable(platformWallet).transfer(platformFee);

        // Distribute to recipients
        address[] memory recipientList = comicRoyalties[comicId].recipientList;
        
        if (recipientList.length == 0) {
            // No recipients, send all to creator
            payable(comicRoyalties[comicId].creator).transfer(distributionAmount);
            emit RoyaltyDistributed(comicId, comicRoyalties[comicId].creator, distributionAmount);
        } else {
            uint256 distributedAmount = 0;
            
            // Distribute according to shares
            for (uint256 i = 0; i < recipientList.length; i++) {
                address recipient = recipientList[i];
                RoyaltyRecipient memory recipientData = comicRoyalties[comicId].recipients[recipient];
                
                if (recipientData.isActive) {
                    uint256 recipientShare = distributionAmount.mul(recipientData.sharePercentage).div(10000);
                    distributedAmount = distributedAmount.add(recipientShare);
                    
                    payable(recipient).transfer(recipientShare);
                    emit RoyaltyDistributed(comicId, recipient, recipientShare);
                }
            }

            // Send any remaining amount to creator (due to rounding)
            uint256 remainingAmount = distributionAmount.sub(distributedAmount);
            if (remainingAmount > 0) {
                payable(comicRoyalties[comicId].creator).transfer(remainingAmount);
                emit RoyaltyDistributed(comicId, comicRoyalties[comicId].creator, remainingAmount);
            }
        }

        comicRoyalties[comicId].totalDistributed = 
            comicRoyalties[comicId].totalDistributed.add(distributionAmount);
    }

    /**
     * @dev Get total shares allocated for a comic
     * @param comicId Comic identifier
     */
    function getTotalShares(uint256 comicId) public view validComicId(comicId) returns (uint256) {
        uint256 totalShares = 0;
        address[] memory recipientList = comicRoyalties[comicId].recipientList;
        
        for (uint256 i = 0; i < recipientList.length; i++) {
            address recipient = recipientList[i];
            if (comicRoyalties[comicId].recipients[recipient].isActive) {
                totalShares = totalShares.add(comicRoyalties[comicId].recipients[recipient].sharePercentage);
            }
        }
        
        return totalShares;
    }

    /**
     * @dev Get comic royalty information
     * @param comicId Comic identifier
     */
    function getComicRoyaltyInfo(uint256 comicId) public view validComicId(comicId) returns (
        address creator,
        uint256 totalEarned,
        uint256 totalDistributed,
        uint256 recipientCount
    ) {
        ComicRoyalty storage comic = comicRoyalties[comicId];
        return (
            comic.creator,
            comic.totalEarned,
            comic.totalDistributed,
            comic.recipientList.length
        );
    }

    /**
     * @dev Get recipient information for a comic
     * @param comicId Comic identifier
     * @param recipient Recipient address
     */
    function getRecipientInfo(uint256 comicId, address recipient) public view validComicId(comicId) returns (
        uint256 sharePercentage,
        string memory role,
        bool isActive
    ) {
        RoyaltyRecipient memory recipientData = comicRoyalties[comicId].recipients[recipient];
        return (recipientData.sharePercentage, recipientData.role, recipientData.isActive);
    }

    /**
     * @dev Get all recipients for a comic
     * @param comicId Comic identifier
     */
    function getRecipients(uint256 comicId) public view validComicId(comicId) returns (address[] memory) {
        return comicRoyalties[comicId].recipientList;
    }

    /**
     * @dev Get comics created by an address
     * @param creator Creator address
     */
    function getCreatorComics(address creator) public view returns (uint256[] memory) {
        return creatorComics[creator];
    }

    // Admin functions
    function setPlatformFee(uint256 _platformFeePercentage) public onlyOwner {
        require(_platformFeePercentage <= 1000, "Platform fee too high"); // Max 10%
        platformFeePercentage = _platformFeePercentage;
    }

    function setPlatformWallet(address _platformWallet) public onlyOwner {
        require(_platformWallet != address(0), "Invalid platform wallet");
        platformWallet = _platformWallet;
    }

    function setMinimumDistributionAmount(uint256 _minimumAmount) public onlyOwner {
        minimumDistributionAmount = _minimumAmount;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    // Emergency functions
    function emergencyWithdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    // Fallback function to receive Ether
    receive() external payable {
        // Reject direct payments without comic ID
        revert("Use receiveRoyalty function");
    }
}
