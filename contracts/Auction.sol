// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// Informacion del Smart Contract
// Nombre: Subasta
// Logica: Implementa subasta de productos entre varios participantes

// Declaracion del Smart Contract - Auction
contract Auction {

    // ----------- Variables (datos) -----------
    // Información de la subasta
    string private description;
    string private imageURI;
    uint private basePrice;
    uint256 private secondsToEnd;
    uint256 private createdTime;

    // Antiguo/nuevo dueño de subasta
    address payable public originalOwner;
    address public newOwner;

    // Puja mas alta
    address payable public highestBidder;
    uint public highestPrice;
    
    // Estado de la subasta
    bool private activeContract;
    
    // ----------- Eventos (pueden ser emitidos por el Smart Contract) -----------
    event Status(string _message);
    event Result(string _message, address winner);

    // ----------- Constructor -----------
    // Uso: Inicializa el Smart Contract - Auction con: description, precio y tiempo
    constructor() {
            
        // Inicializo el valor a las variables (datos)
        description = "En esta subasta se ofrece un coche. Se trata de un Ford Focus de ...";
        imageURI = "https://bafybeifzm6xqduwgl6lwjyabj2v5qwduwqgotr6hjj5cu632ldtu6zbw4a.ipfs.nftstorage.link/";
        basePrice = 0.01 ether;
        secondsToEnd = 900;    // 86400 = 24h | 3600 = 1h | 900 = 15 min | 600 = 10 min
        activeContract = true;
        createdTime = block.timestamp;
        originalOwner = payable(msg.sender);
        
        // Se emite un Evento
        emit Status("Subasta creada");
    }

    modifier auctionActive() {
        require(activeContract, "La subasta no esta activa.");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == originalOwner, "You must be the original OWNER");
        _;
    }
    // ------------ Funciones que modifican datos (set) ------------

    // Funcion
    // Nombre: bid
    // Uso:    Permite a cualquier postor hacer una oferta de dinero para la subata
    //         El dinero es almacenado en el contrato, junto con el nombre del postor
    //         El postor cuya oferta ha sido superada recibe de vuelta el dinero pujado
    function bid() public payable auctionActive {
        // require(msg.sender != owner, "El dueño no puede pujar.");
        require(block.timestamp <= (createdTime + secondsToEnd), "La subasta ha terminado.");
        require(msg.value > highestPrice && msg.value >= basePrice, "La puja no es lo suficientemente alta.");

        if (highestBidder != address(0)) {
            highestBidder.transfer(highestPrice);
        }

        highestBidder = payable(msg.sender);
        highestPrice = msg.value;

        emit Status("Nueva puja mas alta, el ultimo postor tiene su dinero de vuelta.");
    }

    // Funcion
    // Nombre: checkIfAuctionEnded
    // Uso:    Comprueba si la puja ha terminado, y en ese caso, 
    //         transfiere el balance del contrato al propietario de la subasta 
    function checkIfAuctionEnded() public auctionActive {
        require(block.timestamp > (createdTime + secondsToEnd), "La subasta aun esta activa.");
        // Finaliza la subasta
        activeContract = false;

        // Transfiere el dinero (maxima puja) al propietario original de la subasta
        newOwner = highestBidder;
        originalOwner.transfer(highestPrice);

        // Se emite el evento de resultado
        emit Result("El ganador de la subasta ha sido:", highestBidder);
    }

    // ------------ Funciones de panico/emergencia ------------

    // Funcion
    // Nombre: stopAuction
    // Uso:    Para la subasta y devuelve el dinero al maximo postor
    function stopAuction() public onlyOwner {
                // Finaliza la subasta
        activeContract = false;
        // Devuelve el dinero al maximo postor
        if (highestBidder != address(0)) {
            highestBidder.transfer(highestPrice);
        }
        // Se emite un evento
        emit Result("La subasta se ha parado", msg.sender);
    }

    
 // ------------ Funciones que consultan datos (get) ------------

    // Funcion
    // Nombre: getAuctionInfo
    // Logica: Consulta la description, la fecha de creacion y el tiempo de la subasta
    function getAuctionInfo() public view returns (string memory, uint, uint){
        return (description, createdTime, secondsToEnd);
    }
    
    // Funcion
    // Nombre: getHighestPrice
    // Logica: Consulta el precio de la maxima puja
    function getHighestPrice() public view returns (uint){
        return (highestPrice);
    }

    // Funcion
    // Nombre: getHighestBidder
    // Logica: Consulta el maximo pujador de la subasta
    function getHighestBidder() public view returns (address){
        return (highestBidder);
    }

    // Funcion
    // Nombre: getDescription
    // Logica: Consulta la descripcion de la subasta
    function getDescription() public view returns (string memory){
        return (description);
    }

    // Funcion
    // Nombre: getImageURI
    // Logica: Consulta la imagen del activo subastado
    function getImageURI() public view returns (string memory){
        return (imageURI);
    }

    // Funcion
    // Nombre: getBasePrice
    // Logica: Consulta el precio inicial de la subasta
    function getBasePrice() public view returns (uint256){
        return (basePrice);
    }

    // Funcion
    // Nombre: getActiveContract
    // Logica: Consulta si la subasta esta activa o no
    function isActive() public view returns (bool){
        return (activeContract);
    }
    
}
