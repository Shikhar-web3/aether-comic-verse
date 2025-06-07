
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/**
 * @title LicensingContract
 * @dev Manages IP licensing for comic creators
 * Features:
 * - Different license types
 * - Automatic royalty collection
 * - Territory restrictions
 * - Usage tracking
 */
contract LicensingContract is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    // Events
    event LicenseCreated(uint256 indexed licenseId, address indexed licensor, uint256 indexed comicId);
    event LicensePurchased(uint256 indexed licenseId, address indexed licensee, uint256 amount);
    event LicenseRevoked(uint256 indexed licenseId, string reason);
    event RoyaltyPaid(uint256 indexed licenseId, address indexed licensee, uint256 amount);

    // Enums
    enum LicenseType { Commercial, NonCommercial, Educational, Derivative, Exclusive }
    enum LicenseStatus { Active, Expired, Revoked, Suspended }

    // Structs
    struct License {
        uint256 comicId;
        address licensor;
        LicenseType licenseType;
        uint256 price; // One-time fee
        uint256 royaltyPercentage; // Ongoing royalty (basis points)
        uint256 duration; // Duration in seconds (0 = unlimited)
        string territory; // Geographic restrictions
        string allowedUses; // Specific use cases allowed
        LicenseStatus status;
        uint256 createdAt;
        uint256 maxLicensees; // Maximum number of licensees (0 = unlimited)
        uint256 currentLicensees;
        mapping(address => bool) isLicensee;
        address[] licenseeList;
    }

    struct LicenseAgreement {
        uint256 licenseId;
        address licensee;
        uint256 purchasedAt;
        uint256 expiresAt;
        uint256 totalRoyaltiesPaid;
        uint256 lastRoyaltyPayment;
        bool isActive;
    }

    struct UsageReport {
        address licensee;
        uint256 licenseId;
        string usageDescription;
        uint256 revenue;
        uint256 reportedAt;
        bool royaltyPaid;
    }

    // State variables
    Counters.Counter private _licenseIdCounter;
    Counters.Counter private _usageReportCounter;

    mapping(uint256 => License) public licenses;
    mapping(uint256 => mapping(address => LicenseAgreement)) public agreements;
    mapping(uint256 => UsageReport) public usageReports;
    mapping(address => uint256[]) public licensorLicenses;
    mapping(address => uint256[]) public licenseeLicenses;
    mapping(uint256 => uint256[]) public licenseUsageReports;

    uint256 public platformFeePercentage = 250; // 2.5%
    address public platformWallet;
    IERC721 public comicNFTContract;

    // Modifiers
    modifier onlyLicensor(uint256 licenseId) {
        require(licenses[licenseId].licensor == msg.sender, "Not the licensor");
        _;
    }

    modifier onlyLicensee(uint256 licenseId) {
        require(agreements[licenseId][msg.sender].isActive, "Not an active licensee");
        _;
    }

    modifier validLicense(uint256 licenseId) {
        require(licenseId < _licenseIdCounter.current(), "Invalid license ID");
        require(licenses[licenseId].status == LicenseStatus.Active, "License not active");
        _;
    }

    constructor(address _platformWallet, address _comicNFTContract) {
        require(_platformWallet != address(0), "Invalid platform wallet");
        platformWallet = _platformWallet;
        comicNFTContract = IERC721(_comicNFTContract);
    }

    /**
     * @dev Create a new license for a comic
     * @param comicId Comic NFT token ID
     * @param licenseType Type of license
     * @param price One-time license fee
     * @param royaltyPercentage Ongoing royalty percentage (basis points)
     * @param duration License duration in seconds (0 = unlimited)
     * @param territory Geographic territory
     * @param allowedUses Description of allowed uses
     * @param maxLicensees Maximum number of licensees
     */
    function createLicense(
        uint256 comicId,
        LicenseType licenseType,
        uint256 price,
        uint256 royaltyPercentage,
        uint256 duration,
        string memory territory,
        string memory allowedUses,
        uint256 maxLicensees
    ) public returns (uint256) {
        // Verify ownership of the comic NFT
        require(comicNFTContract.ownerOf(comicId) == msg.sender, "Not the comic owner");
        require(royaltyPercentage <= 5000, "Royalty too high"); // Max 50%

        uint256 licenseId = _licenseIdCounter.current();
        _licenseIdCounter.increment();

        licenses[licenseId].comicId = comicId;
        licenses[licenseId].licensor = msg.sender;
        licenses[licenseId].licenseType = licenseType;
        licenses[licenseId].price = price;
        licenses[licenseId].royaltyPercentage = royaltyPercentage;
        licenses[licenseId].duration = duration;
        licenses[licenseId].territory = territory;
        licenses[licenseId].allowedUses = allowedUses;
        licenses[licenseId].status = LicenseStatus.Active;
        licenses[licenseId].createdAt = block.timestamp;
        licenses[licenseId].maxLicensees = maxLicensees;
        licenses[licenseId].currentLicensees = 0;

        licensorLicenses[msg.sender].push(licenseId);

        emit LicenseCreated(licenseId, msg.sender, comicId);
        return licenseId;
    }

    /**
     * @dev Purchase a license
     * @param licenseId License identifier
     */
    function purchaseLicense(uint256 licenseId) public payable validLicense(licenseId) nonReentrant {
        License storage license = licenses[licenseId];
        require(msg.value >= license.price, "Insufficient payment");
        require(!license.isLicensee[msg.sender], "Already a licensee");
        
        if (license.maxLicensees > 0) {
            require(license.currentLicensees < license.maxLicensees, "License fully subscribed");
        }

        // Calculate platform fee
        uint256 platformFee = (msg.value * platformFeePercentage) / 10000;
        uint256 licensorPayment = msg.value - platformFee;

        // Transfer payments
        payable(platformWallet).transfer(platformFee);
        payable(license.licensor).transfer(licensorPayment);

        // Create license agreement
        uint256 expiresAt = license.duration > 0 ? block.timestamp + license.duration : 0;
        
        agreements[licenseId][msg.sender] = LicenseAgreement({
            licenseId: licenseId,
            licensee: msg.sender,
            purchasedAt: block.timestamp,
            expiresAt: expiresAt,
            totalRoyaltiesPaid: 0,
            lastRoyaltyPayment: 0,
            isActive: true
        });

        license.isLicensee[msg.sender] = true;
        license.licenseeList.push(msg.sender);
        license.currentLicensees++;

        licenseeLicenses[msg.sender].push(licenseId);

        emit LicensePurchased(licenseId, msg.sender, msg.value);
    }

    /**
     * @dev Report usage and pay royalties
     * @param licenseId License identifier
     * @param usageDescription Description of how the IP was used
     * @param revenue Revenue generated from the usage
     */
    function reportUsageAndPayRoyalty(
        uint256 licenseId,
        string memory usageDescription,
        uint256 revenue
    ) public payable validLicense(licenseId) onlyLicensee(licenseId) nonReentrant {
        License storage license = licenses[licenseId];
        LicenseAgreement storage agreement = agreements[licenseId][msg.sender];

        // Check if license is still valid
        if (agreement.expiresAt > 0) {
            require(block.timestamp <= agreement.expiresAt, "License expired");
        }

        // Calculate required royalty
        uint256 requiredRoyalty = (revenue * license.royaltyPercentage) / 10000;
        require(msg.value >= requiredRoyalty, "Insufficient royalty payment");

        // Process royalty payment
        if (msg.value > 0) {
            uint256 platformFee = (msg.value * platformFeePercentage) / 10000;
            uint256 licensorRoyalty = msg.value - platformFee;

            payable(platformWallet).transfer(platformFee);
            payable(license.licensor).transfer(licensorRoyalty);

            agreement.totalRoyaltiesPaid += msg.value;
            agreement.lastRoyaltyPayment = block.timestamp;

            emit RoyaltyPaid(licenseId, msg.sender, msg.value);
        }

        // Record usage report
        uint256 reportId = _usageReportCounter.current();
        _usageReportCounter.increment();

        usageReports[reportId] = UsageReport({
            licensee: msg.sender,
            licenseId: licenseId,
            usageDescription: usageDescription,
            revenue: revenue,
            reportedAt: block.timestamp,
            royaltyPaid: msg.value > 0
        });

        licenseUsageReports[licenseId].push(reportId);
    }

    /**
     * @dev Revoke a license
     * @param licenseId License identifier
     * @param reason Reason for revocation
     */
    function revokeLicense(uint256 licenseId, string memory reason) public validLicense(licenseId) onlyLicensor(licenseId) {
        licenses[licenseId].status = LicenseStatus.Revoked;
        
        // Deactivate all agreements
        address[] memory licensees = licenses[licenseId].licenseeList;
        for (uint256 i = 0; i < licensees.length; i++) {
            agreements[licenseId][licensees[i]].isActive = false;
        }

        emit LicenseRevoked(licenseId, reason);
    }

    /**
     * @dev Update license terms (only for future licensees)
     * @param licenseId License identifier
     * @param newPrice New license price
     * @param newRoyaltyPercentage New royalty percentage
     */
    function updateLicenseTerms(
        uint256 licenseId,
        uint256 newPrice,
        uint256 newRoyaltyPercentage
    ) public validLicense(licenseId) onlyLicensor(licenseId) {
        require(newRoyaltyPercentage <= 5000, "Royalty too high");

        licenses[licenseId].price = newPrice;
        licenses[licenseId].royaltyPercentage = newRoyaltyPercentage;
    }

    /**
     * @dev Check if a license is still valid for a licensee
     * @param licenseId License identifier
     * @param licensee Licensee address
     */
    function isLicenseValid(uint256 licenseId, address licensee) public view returns (bool) {
        if (licenseId >= _licenseIdCounter.current()) return false;
        if (licenses[licenseId].status != LicenseStatus.Active) return false;
        
        LicenseAgreement memory agreement = agreements[licenseId][licensee];
        if (!agreement.isActive) return false;
        
        if (agreement.expiresAt > 0 && block.timestamp > agreement.expiresAt) return false;
        
        return true;
    }

    /**
     * @dev Get license information
     * @param licenseId License identifier
     */
    function getLicense(uint256 licenseId) public view returns (
        uint256 comicId,
        address licensor,
        LicenseType licenseType,
        uint256 price,
        uint256 royaltyPercentage,
        uint256 duration,
        string memory territory,
        string memory allowedUses,
        LicenseStatus status,
        uint256 currentLicensees,
        uint256 maxLicensees
    ) {
        License storage license = licenses[licenseId];
        return (
            license.comicId,
            license.licensor,
            license.licenseType,
            license.price,
            license.royaltyPercentage,
            license.duration,
            license.territory,
            license.allowedUses,
            license.status,
            license.currentLicensees,
            license.maxLicensees
        );
    }

    /**
     * @dev Get license agreement details
     * @param licenseId License identifier
     * @param licensee Licensee address
     */
    function getLicenseAgreement(uint256 licenseId, address licensee) public view returns (
        uint256 purchasedAt,
        uint256 expiresAt,
        uint256 totalRoyaltiesPaid,
        uint256 lastRoyaltyPayment,
        bool isActive
    ) {
        LicenseAgreement memory agreement = agreements[licenseId][licensee];
        return (
            agreement.purchasedAt,
            agreement.expiresAt,
            agreement.totalRoyaltiesPaid,
            agreement.lastRoyaltyPayment,
            agreement.isActive
        );
    }

    /**
     * @dev Get all licensees for a license
     * @param licenseId License identifier
     */
    function getLicensees(uint256 licenseId) public view returns (address[] memory) {
        return licenses[licenseId].licenseeList;
    }

    /**
     * @dev Get licenses created by a licensor
     * @param licensor Licensor address
     */
    function getLicensorLicenses(address licensor) public view returns (uint256[] memory) {
        return licensorLicenses[licensor];
    }

    /**
     * @dev Get licenses purchased by a licensee
     * @param licensee Licensee address
     */
    function getLicenseeLicenses(address licensee) public view returns (uint256[] memory) {
        return licenseeLicenses[licensee];
    }

    /**
     * @dev Get usage reports for a license
     * @param licenseId License identifier
     */
    function getLicenseUsageReports(uint256 licenseId) public view returns (uint256[] memory) {
        return licenseUsageReports[licenseId];
    }

    /**
     * @dev Get usage report details
     * @param reportId Report identifier
     */
    function getUsageReport(uint256 reportId) public view returns (
        address licensee,
        uint256 licenseId,
        string memory usageDescription,
        uint256 revenue,
        uint256 reportedAt,
        bool royaltyPaid
    ) {
        UsageReport memory report = usageReports[reportId];
        return (
            report.licensee,
            report.licenseId,
            report.usageDescription,
            report.revenue,
            report.reportedAt,
            report.royaltyPaid
        );
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

    function setComicNFTContract(address _comicNFTContract) public onlyOwner {
        require(_comicNFTContract != address(0), "Invalid contract address");
        comicNFTContract = IERC721(_comicNFTContract);
    }

    // Emergency functions
    function emergencyWithdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    // Fallback function
    receive() external payable {
        revert("Use specific functions for payments");
    }
}
