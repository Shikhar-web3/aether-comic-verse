
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title ComicNFT
 * @dev NFT contract for comic creation and minting on ComicCosmos platform
 * Features:
 * - EIP-2981 royalty support
 * - Batch minting for series
 * - Collaboration support
 * - Revenue sharing
 * - Metadata management
 */
contract ComicNFT is ERC721, ERC721URIStorage, ERC721Royalty, Ownable, ReentrancyGuard, Pausable {
    using Counters for Counters.Counter;

    // Events
    event ComicMinted(uint256 indexed tokenId, address indexed creator, string metadataURI, uint256 royaltyPercentage);
    event CollaboratorAdded(uint256 indexed tokenId, address indexed collaborator, uint256 sharePercentage);
    event RoyaltyDistributed(uint256 indexed tokenId, address indexed recipient, uint256 amount);
    event ComicUpdated(uint256 indexed tokenId, string newMetadataURI);

    // Structs
    struct Comic {
        address creator;
        string title;
        string description;
        string genre;
        uint256 createdAt;
        uint256 collaboratorCount;
        bool isPublished;
    }

    struct Collaborator {
        address collaboratorAddress;
        uint256 sharePercentage; // Basis points (100 = 1%)
        string role; // "artist", "writer", "colorist", etc.
    }

    // State variables
    Counters.Counter private _tokenIdCounter;
    
    mapping(uint256 => Comic) public comics;
    mapping(uint256 => Collaborator[]) public collaborators;
    mapping(uint256 => mapping(address => bool)) public isCollaborator;
    mapping(address => uint256[]) public creatorComics;
    
    uint256 public constant MAX_ROYALTY_PERCENTAGE = 1000; // 10%
    uint256 public platformFeePercentage = 250; // 2.5%
    address public platformWallet;

    // Modifiers
    modifier onlyCreatorOrCollaborator(uint256 tokenId) {
        require(
            comics[tokenId].creator == msg.sender || isCollaborator[tokenId][msg.sender],
            "Not authorized"
        );
        _;
    }

    modifier validTokenId(uint256 tokenId) {
        require(_exists(tokenId), "Token does not exist");
        _;
    }

    constructor(
        string memory name,
        string memory symbol,
        address _platformWallet
    ) ERC721(name, symbol) {
        platformWallet = _platformWallet;
    }

    /**
     * @dev Mint a new comic NFT
     * @param to Address to mint the NFT to
     * @param metadataURI IPFS URI containing comic metadata
     * @param title Comic title
     * @param description Comic description
     * @param genre Comic genre
     * @param royaltyPercentage Royalty percentage in basis points (100 = 1%)
     */
    function mintComic(
        address to,
        string memory metadataURI,
        string memory title,
        string memory description,
        string memory genre,
        uint256 royaltyPercentage
    ) public whenNotPaused returns (uint256) {
        require(royaltyPercentage <= MAX_ROYALTY_PERCENTAGE, "Royalty too high");
        require(bytes(metadataURI).length > 0, "Metadata URI required");
        require(bytes(title).length > 0, "Title required");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, metadataURI);
        _setTokenRoyalty(tokenId, to, royaltyPercentage);

        comics[tokenId] = Comic({
            creator: to,
            title: title,
            description: description,
            genre: genre,
            createdAt: block.timestamp,
            collaboratorCount: 0,
            isPublished: false
        });

        creatorComics[to].push(tokenId);

        emit ComicMinted(tokenId, to, metadataURI, royaltyPercentage);
        return tokenId;
    }

    /**
     * @dev Batch mint multiple comics for a series
     * @param to Address to mint the NFTs to
     * @param metadataURIs Array of IPFS URIs
     * @param titles Array of comic titles
     * @param descriptions Array of comic descriptions
     * @param genre Series genre
     * @param royaltyPercentage Royalty percentage for all comics
     */
    function batchMintSeries(
        address to,
        string[] memory metadataURIs,
        string[] memory titles,
        string[] memory descriptions,
        string memory genre,
        uint256 royaltyPercentage
    ) public whenNotPaused returns (uint256[] memory) {
        require(metadataURIs.length == titles.length, "Array length mismatch");
        require(titles.length == descriptions.length, "Array length mismatch");
        require(metadataURIs.length > 0 && metadataURIs.length <= 50, "Invalid batch size");

        uint256[] memory tokenIds = new uint256[](metadataURIs.length);

        for (uint256 i = 0; i < metadataURIs.length; i++) {
            tokenIds[i] = mintComic(
                to,
                metadataURIs[i],
                titles[i],
                descriptions[i],
                genre,
                royaltyPercentage
            );
        }

        return tokenIds;
    }

    /**
     * @dev Add a collaborator to a comic
     * @param tokenId Comic token ID
     * @param collaboratorAddress Address of the collaborator
     * @param sharePercentage Share percentage in basis points
     * @param role Collaborator role
     */
    function addCollaborator(
        uint256 tokenId,
        address collaboratorAddress,
        uint256 sharePercentage,
        string memory role
    ) public validTokenId(tokenId) onlyCreatorOrCollaborator(tokenId) {
        require(collaboratorAddress != address(0), "Invalid collaborator address");
        require(!isCollaborator[tokenId][collaboratorAddress], "Already a collaborator");
        require(sharePercentage > 0 && sharePercentage <= 10000, "Invalid share percentage");

        collaborators[tokenId].push(Collaborator({
            collaboratorAddress: collaboratorAddress,
            sharePercentage: sharePercentage,
            role: role
        }));

        isCollaborator[tokenId][collaboratorAddress] = true;
        comics[tokenId].collaboratorCount++;

        emit CollaboratorAdded(tokenId, collaboratorAddress, sharePercentage);
    }

    /**
     * @dev Publish a comic (makes it available for sale)
     * @param tokenId Comic token ID
     */
    function publishComic(uint256 tokenId) public validTokenId(tokenId) onlyCreatorOrCollaborator(tokenId) {
        comics[tokenId].isPublished = true;
    }

    /**
     * @dev Update comic metadata
     * @param tokenId Comic token ID
     * @param newMetadataURI New IPFS URI
     */
    function updateMetadata(
        uint256 tokenId,
        string memory newMetadataURI
    ) public validTokenId(tokenId) onlyCreatorOrCollaborator(tokenId) {
        require(bytes(newMetadataURI).length > 0, "Metadata URI required");
        _setTokenURI(tokenId, newMetadataURI);
        
        emit ComicUpdated(tokenId, newMetadataURI);
    }

    /**
     * @dev Distribute royalties to collaborators
     * @param tokenId Comic token ID
     */
    function distributeRoyalties(uint256 tokenId) public payable validTokenId(tokenId) nonReentrant {
        require(msg.value > 0, "No payment received");

        uint256 platformFee = (msg.value * platformFeePercentage) / 10000;
        uint256 remainingAmount = msg.value - platformFee;

        // Send platform fee
        payable(platformWallet).transfer(platformFee);

        // Distribute to collaborators
        Collaborator[] memory comicCollaborators = collaborators[tokenId];
        
        if (comicCollaborators.length == 0) {
            // No collaborators, send all to creator
            payable(comics[tokenId].creator).transfer(remainingAmount);
            emit RoyaltyDistributed(tokenId, comics[tokenId].creator, remainingAmount);
        } else {
            // Distribute according to shares
            for (uint256 i = 0; i < comicCollaborators.length; i++) {
                uint256 collaboratorShare = (remainingAmount * comicCollaborators[i].sharePercentage) / 10000;
                payable(comicCollaborators[i].collaboratorAddress).transfer(collaboratorShare);
                emit RoyaltyDistributed(tokenId, comicCollaborators[i].collaboratorAddress, collaboratorShare);
            }
        }
    }

    /**
     * @dev Get comic details
     * @param tokenId Comic token ID
     */
    function getComic(uint256 tokenId) public view validTokenId(tokenId) returns (Comic memory) {
        return comics[tokenId];
    }

    /**
     * @dev Get collaborators for a comic
     * @param tokenId Comic token ID
     */
    function getCollaborators(uint256 tokenId) public view validTokenId(tokenId) returns (Collaborator[] memory) {
        return collaborators[tokenId];
    }

    /**
     * @dev Get comics created by an address
     * @param creator Creator address
     */
    function getCreatorComics(address creator) public view returns (uint256[] memory) {
        return creatorComics[creator];
    }

    /**
     * @dev Get total number of comics minted
     */
    function totalComics() public view returns (uint256) {
        return _tokenIdCounter.current();
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

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    // Emergency withdrawal function
    function emergencyWithdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    // Override functions
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage, ERC721Royalty) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Royalty) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // Fallback function to receive Ether
    receive() external payable {}
}
