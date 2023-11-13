// SPDX-License-Identifier: MIT


// El contrato crea un token ERC721 llamado MemT (MUT). El contrato puede ser utilizado para crear nuevos tokens, 
// aprobar la custodia del NFT a un contrato que permita custodiar el NFT y comercializarlo.

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MemoriaUrbanaToken is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("MemoriaUrbanaToken", "MUT") {}

    function awardItem(address Owner, string memory tokenURI)
        public
        returns (uint256)
    {
        uint256 newItemId = _tokenIds.current();
         _safeMint(Owner, newItemId);
        _setTokenURI(newItemId, tokenURI);

        _tokenIds.increment();
        return newItemId;
    }
        function approveToMarketplace(address marketplaceAddress, uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Solo el Owner puede dar aprobacion");
        approve(marketplaceAddress, tokenId);
    }

}