// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


contract MarketPlace is ERC1155 {
    mapping(uint256 => uint256) private prices;
   address private _NFT_Address;
    IERC721 items;
    uint256 public _itemsForSale;

    constructor(address NFT_Address) ERC1155("")  {
      _NFT_Address = NFT_Address;
        items = IERC721(_NFT_Address);
    }

   function setSale(uint256 _tokenId, uint256 _price) public {
        require( items.ownerOf(_tokenId) == _msgSender(), "Solo el Owner puede poner a la Venta.");
     
        prices[_tokenId] = _price;
       }

    function unsetSale(uint256 _tokenId) public {
        require( items.ownerOf(_tokenId) == _msgSender(), "Solo el Owner puede poner a la Venta.");
        prices[_tokenId] = 0;
    }

    function buyToken(uint256 _tokenId) public payable {
        uint256 price = prices[_tokenId];
        
        // Verificar si el token está en venta
        require(price > 0, "El token no esta la venta");
        
        // Verificar que el valor enviado es el correcto
        require(msg.value == price, "Fondos enviados insuficientes");
        
        // Obtener la dirección del dueño del token
        address tokenOwner = items.ownerOf(_tokenId);
        
        // Transferir el token al comprador
        items.transferFrom(tokenOwner, msg.sender, _tokenId);
        
        // Transferir el ether al vendedor
        payable(tokenOwner).transfer(msg.value);
        
        // Eliminar el token del mercado
        prices[_tokenId] = 0;
    }

    // Función para obtener el precio de un NFT en la unidad especificada
    function getPrice(uint256 _tokenId) public view returns (uint256) {
        return prices[_tokenId];
    }    

    function onERC721Received(address, address, uint256, bytes memory) public virtual returns (bytes4) {
        return this.onERC721Received.selector;
    }
}