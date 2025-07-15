// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

/**
 * @title CustomNFT
 * @notice Simple activity-proof NFTs worth a fixed 5 points each for StuCredi platform.
 *         Sponsors with SPONSOR_ROLE can mint NFTs in batches to reward students 
 *         for participating in educational activities, conferences, and hackathons.
 * @dev This contract combines ERC721Enumerable and ERC721URIStorage for full functionality.
 *      Each NFT represents proof of participation and contributes 5 points to student funding calculations.
 */
contract CustomNFT is ERC721Enumerable, ERC721URIStorage, AccessControl {

    /* ------------------------------------------------------------------ */
    /*                             Constants                              */
    /* ------------------------------------------------------------------ */
    
    /// @notice Role identifier for sponsors who can mint NFTs
    bytes32 public constant SPONSOR_ROLE = keccak256("SPONSOR_ROLE");
    
    /// @notice Fixed point value for each NFT in the StuCredi system
    uint256 public constant POINTS_PER_NFT = 5;

    /* ------------------------------------------------------------------ */
    /*                              Storage                               */
    /* ------------------------------------------------------------------ */
    
    /// @dev Counter for generating unique token IDs
    uint256 private _tokenIds;

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
    /*                            Constructor                             */
    /* ------------------------------------------------------------------ */
    
    /**
     * @notice Initializes the CustomNFT contract
     * @dev Sets up the ERC721 with name "ActivityProof" and symbol "ACTPOAP"
     *      Grants DEFAULT_ADMIN_ROLE to the deployer
     */
    constructor() ERC721("ActivityProof", "ACTPOAP") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /* ------------------------------------------------------------------ */
    /*                         External Functions                         */
    /* ------------------------------------------------------------------ */
    
    /**
     * @notice Mint identical NFTs to multiple recipients in a single transaction
     * @dev Only addresses with SPONSOR_ROLE can call this function
     *      Each NFT will have the same metadata URI but unique token IDs
     * @param _uri The metadata URI for all NFTs in this batch (IPFS/HTTPS JSON)
     * @param _receivers Array of wallet addresses to receive the NFTs
     * @custom:requirements _receivers array must not be empty
     * @custom:requirements Caller must have SPONSOR_ROLE
     */
    function mintBatch(
        string calldata _uri, 
        address[] calldata _receivers
    ) external onlyRole(SPONSOR_ROLE) {
        require(_receivers.length > 0, "CustomNFT: No receivers provided");

        for (uint256 i = 0; i < _receivers.length; ++i) {
            _tokenIds++;
            uint256 newTokenId = _tokenIds;
            
            _safeMint(_receivers[i], newTokenId);
            _setTokenURI(newTokenId, _uri);
            
            emit ActivityNFTMinted(msg.sender, newTokenId, _receivers[i]);
        }
    }

    /**
     * @notice Get the total number of NFTs minted so far
     * @return The current token ID counter value
     */
    function totalMinted() external view returns (uint256) {
        return _tokenIds;
    }

    /**
     * @notice Get the point value for NFTs (always 5 for this contract)
     * @return The fixed point value per NFT
     */
    function getPointsPerNFT() external pure returns (uint256) {
        return POINTS_PER_NFT;
    }

    /* ------------------------------------------------------------------ */
    /*                         Override Functions                         */
    /* ------------------------------------------------------------------ */
    
    /**
     * @dev Override required by Solidity for contracts inheriting from both
     *      ERC721Enumerable and ERC721URIStorage
     */
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    /**
     * @dev Override required by Solidity for contracts inheriting from both
     *      ERC721Enumerable and ERC721URIStorage
     */
    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    /**
     * @dev Override required by Solidity for contracts inheriting from both
     *      ERC721 and ERC721URIStorage
     */
    function tokenURI(uint256 tokenId) 
        public 
        view 
        override(ERC721, ERC721URIStorage) 
        returns (string memory) 
    {
        return super.tokenURI(tokenId);
    }

    /**
     * @dev Override required by Solidity for contracts inheriting from
     *      ERC721Enumerable and AccessControl
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Enumerable, AccessControl, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
