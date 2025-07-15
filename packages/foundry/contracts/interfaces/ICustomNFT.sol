// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/IAccessControl.sol";

/**
 * @title ICustomNFT
 * @notice Interface for the CustomNFT contract in the StuCredi system
 * @dev Extends IERC721 and IAccessControl for full functionality
 */
interface ICustomNFT is IERC721, IAccessControl {
    /* ------------------------------------------------------------------ */
    /*                               Events                               */
    /* ------------------------------------------------------------------ */
    
    /**
     * @notice Emitted when a sponsor mints an activity NFT to a recipient
     * @param sponsor The address of the sponsor who minted the NFT
     * @param tokenId The unique identifier of the minted NFT
     * @param recipient The address that received the NFT
     */
    event ActivityNFTMinted(
        address indexed sponsor, 
        uint256 indexed tokenId, 
        address indexed recipient
    );

    /* ------------------------------------------------------------------ */
    /*                             Constants                              */
    /* ------------------------------------------------------------------ */
    
    /**
     * @notice Role identifier for sponsors who can mint NFTs
     * @return The keccak256 hash of "SPONSOR_ROLE"
     */
    function SPONSOR_ROLE() external view returns (bytes32);
    
    /**
     * @notice Fixed point value for each NFT in the StuCredi system
     * @return The number of points each NFT is worth (always 5)
     */
    function POINTS_PER_NFT() external view returns (uint256);

    /* ------------------------------------------------------------------ */
    /*                         External Functions                         */
    /* ------------------------------------------------------------------ */
    
    /**
     * @notice Mint identical NFTs to multiple recipients in a single transaction
     * @param _uri The metadata URI for all NFTs in this batch (IPFS/HTTPS JSON)
     * @param _receivers Array of wallet addresses to receive the NFTs
     */
    function mintBatch(string calldata _uri, address[] calldata _receivers) external;

    /**
     * @notice Get the total number of NFTs minted so far
     * @return The current token ID counter value
     */
    function totalMinted() external view returns (uint256);

    /**
     * @notice Get the point value for NFTs (always 5 for this contract)
     * @return The fixed point value per NFT
     */
    function getPointsPerNFT() external pure returns (uint256);
} 