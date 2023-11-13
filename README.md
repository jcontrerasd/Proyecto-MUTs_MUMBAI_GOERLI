
# APLICACIÓN DAPP
## DESPLOY DE CONTRATOS

### MemoriaUrbanaToken : 0x7d7BedAc49A2D22E178bF8e1f99fB604949c98aA
* El contrato crea un token ERC721 llamado MemT (MUT). El contrato puede ser utilizado para crear nuevos tokens, aprobar la custodia del NFT a un contrato que permita custodiar el NFT y comercializarlo.


### MarketPlace : 0x65115A00977998aF3f11373931A004bc5BC52fBB

* Corresponde a un MarketPlace que permite a los usuarios comprar y vender tokens ERC721. En resumen permite comprar y vender tokens ERC721.

```
truffle migrate --network ethereum_goerli_testnet
```


### Verificación de Contrato
truffle run verify  **NOMBRE_CONTRATO**@**ADDRESS_CONTRATO** --network ethereum_goerli_testnet
```
truffle run verify  MemoriaUrbanaToken@0x7d7BedAc49A2D22E178bF8e1f99fB604949c98aA  --network ethereum_goerli_testnet
truffle run verify  MarketPlace@0x65115A00977998aF3f11373931A004bc5BC52fBB   --network ethereum_goerli_testnet
```


### REQUISITOS
En este Sprint, desarrollaremos una primera versión básica de DApp para el caso de uso planteado en el sprint anterior, o una versión simplificada del mismo. Al menos, se realizará:

Una primera versión de Smart Contract (capa lógica). El Smart Contract será compilado y desplegado en una red de desarrollo (Truffle network) o testnet pública (ej. Goerli). 

* MemoriaUrbanaToken : 0x7d7BedAc49A2D22E178bF8e1f99fB604949c98aA

![image](https://github.com/jcontrerasd/Proyecto-MUTS/assets/27821228/28a2a35c-6184-418f-928b-3e08084c300c)


* MarketPlace : 0x65115A00977998aF3f11373931A004bc5BC52fBB

![image](https://github.com/jcontrerasd/Proyecto-MUTS/assets/27821228/69ebd578-a108-4654-8660-12449a3c5510)


 

Una versión sencilla de Interfaz visual (capa cliente), que mostrará información de contexto del usuario 
    * **Network connected : 5 **
    * **Wallet Address : 0x043D27C4e210b8DCd4F324Bff24bbCf89fc9C946 **

![image](https://github.com/jcontrerasd/Proyecto-MUTS/assets/27821228/08d451ac-48c6-4f01-a03f-732a10bae5a3)


Contendrá un botón para obtener información del Smart Contract


![image](https://github.com/jcontrerasd/Proyecto-MUTS/assets/27821228/2c1dda9a-7515-4da4-9ba6-c202ea159ccd)



otro botón para realizar una escritura en el Smart Contract.

![image](https://github.com/jcontrerasd/Proyecto-MUTS/assets/27821228/0b354de7-3654-47ac-ab30-58012c006444)



Configuración de proveedor Web3 (capa de conexión) a través de MetaMask, que permitirá la comunicación de la interfaz visual con el Smart Contract / red seleccionada.

![image](https://github.com/jcontrerasd/Proyecto-MUTS/assets/27821228/cbb38a58-b717-4e5f-a1a5-afc1f333edbc)



# ¿Cuál es la finalidad / propósito de la DApp? #

Crear un Marketplace en una arquitectura Dapp que permita administrar NFTs con un enfoque especifico:
Memorias Urbanas Token (MUT) será una colección de NFTs que retrata la historia de ciudades a lo largo del tiempo. Estos NFTs serán creaciones únicas que representan momentos específicos de la evolución urbana. Creados por artistas y públicos en general, los MUT deberán fusionar arte y patrimonio cultural. 

## Casos de Uso ##
* **Colección de Arte Urbano :** *Un coleccionista apasionado por la historia de las ciudades adquiere varios Memorias Urbanas Tokens (MUT) que representan momentos icónicos de diferentes urbes a lo largo del tiempo. Estos NFTs incluyen                      imágenes de antiguos edificios, calles, y cambios arquitectónicos a lo largo de los años. A medida que expande su colección, el coleccionista se sumerge en la narrativa visual de la evolución urbana, apreciando la fusión de arte y                    patrimonio cultural.*

* **Exposición Digital :** *Un museo de arte urbano organiza una exposición digital titulada "Memorias Urbanas: Ciudades en Transformación". Utilizan MUT para mostrar cómo las ciudades han cambiado con el tiempo a través de obras de artistas                 locales e internacionales. Los visitantes pueden explorar estas representaciones visuales de la historia urbana a través de NFTs en una plataforma en línea. La exposición ofrece una experiencia inmersiva que resalta la importancia de                 preservar y apreciar el patrimonio urbano. Los MUT se convierten en una forma única de conectar a las personas con el pasado de las ciudades y su diversidad artística.*



# ¿Qué variables y funciones contiene el Smart Contract? #

# Se crean dos contratos
### 1.- MemoriaUrbanToken (Address [0x7d7BedAc49A2D22E178bF8e1f99fB604949c98aA](https://goerli.etherscan.io/address/0x7d7BedAc49A2D22E178bF8e1f99fB604949c98aA)) ###

El contrato crea un token ERC721 llamado MemT (MUT). El contrato puede ser utilizado para crear nuevos tokens, aprobar la custodia del NFT a un contrato que permita custodiar el NFT y comercializarlo.

### Read Contract ###

    **1.balanceOf :** Devuelve la cantidad de un token que posee una dirección.

    **2.getApproved :** Devuelve la dirección que está autorizada para transferir un token en nombre de otra dirección.

    **3.isApprovedForAll :** Devuelve si una dirección está autorizada para transferir todos los tokens en nombre de otra dirección.

    **4.name :** Devuelve el nombre del token.

    **5.ownerOf :** Devuelve la dirección del propietario de un token.

    **6.supportsInterface :** Devuelve si un contrato implementa una interfaz.

    **7.symbol :** Devuelve el símbolo del token.

    **8.tokenURI :** Devuelve la URI del token.


### Write Contract ###

 
    **1.approve :** Autoriza a una dirección para transferir un token en nombre de otra dirección.

    **2.approveToMarketplace :** Autoriza a un mercado para transferir un token en nombre de un usuario.

    **3.awardItem :** Crea un nuevo token y lo asigna a una dirección especificada.

    **4.safeTransferFrom :** Transfiere un token de una dirección a otra de forma segura, verificando que la transferencia es válida y que el receptor tiene suficiente saldo.
   
    **5.safeTransferFrom :** Transfiere un token de una dirección a otra de forma segura, verificando que la transferencia es válida y que el receptor tiene suficiente saldo.
   
    **6.setApprovalForAll :** Autoriza a una dirección para transferir todos los tokens en nombre de otra dirección.
   
    **7.transferFrom :** Transfiere un token de una dirección a otra

## IMPORTANTE ##
    **4.safeTransferFrom() (ERC721) :** Transfiere un token de una dirección a otra. No verifica que el receptor tenga suficiente saldo.
    **5.safeTransferFrom() (OpenZeppelin) :** Transfiere un token de una dirección a otra de forma segura. 
                                                 Verifica que el receptor tenga suficiente saldo y que el remitente esté autorizado para transferir el token.
    **safeTransferFrom() (MemoriaUrbanToken) :** Transfiere un token de una dirección a otra de forrma segura. 
                                                 Verifica que el remitente sea el propietario del token y que el destinatario sea el mercado especificado.

### 2.- MarketplaceContract (Address [0x65115A00977998aF3f11373931A004bc5BC52fBB](https://goerli.etherscan.io/address/0x65115A00977998aF3f11373931A004bc5BC52fBB)) ###
Corresponde a un MarketPlace que permite a los usuarios comprar y vender tokens ERC721. En resumen permite comprar y vender tokens ERC721.


### Read Contract ###

    **1._itemsForSale :** Variable de estado que cuenta el número de NFTs en venta.
    
    **2.balanceOf : ** Devuelve la cantidad de un token que posee una dirección.
    
    **3.balanceOfBatch :**Devuelve la cantidad de un token que poseen varias direcciones.
    
    **4.getPrice :** Devuelve el precio de un NFT en wei.
    
    **5.isApprovedForAll :** Devuelve si una dirección está aprobada para transferir tokens en nombre de otra dirección.
    
    **6.supportInterface :** Devuelve si un contrato implementa una interfaz ERC721.
    
    **7.uri :** Devuelve la URI de un NFT.

### Write Contract ###

    **1.buyToken :** Compra un NFT ERC721 del mercado, pagando el precio especificado por el vendedor.
    
    **2.onERC721Received :** Recibe un NFT ERC721 en el contrato, verificando que el remitente está autorizado para transferirlo.
    
    **3.safeBatchTransferFrom :** Transfiere un lote de tokens ERC1155 de una dirección a otra de forma segura, verificando que la transferencia es válida y que el receptor tiene suficiente saldo.
    
    **4.safeTransferFrom :** Transfiere un token ERC721 de una dirección a otra de forma segura, verificando que la transferencia es válida y que el receptor tiene suficiente saldo.
    
    **5.setApprovalForAll :** Aprueba a una dirección para transferir todos los tokens ERC721 en nombre de otra dirección, otorgando permiso a un mercado para vender los tokens ERC721 de un usuario.
    
    **6.setSale :** Pone un NFT ERC721 a la venta en el mercado, especificando el precio al que se quiere vender.
    
    **7.unsetSale :** Elimina un NFT ERC721 de la venta en el mercado, permitiendo al propietario eliminarlo en cualquier momento.


# ¿Qué librería has implementado para la capa de conexión: Web3.js o Ethers.js? ¿Por qué? #


