
# APLICACIÓN DAPP WEB3
█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓
█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓
█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓
█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓

█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█ RELEASE PROYECTO FINAL █▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓

█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓
█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓
█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓
█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓
## ESCALABILIDAD e INCREMENTOS De PRODUCTO

Se incluye dentro de esta versión la automátización de la Compilacion,  Despliegue y Verificación, de los Smart Contract tanto en Goerli como Polygon Mumbai.

## [Compilación/Despliegue/Verificación](https://github.com//jcontrerasd/Proyecto-MUTS/raw/main/0.-Compilación+Despliegue+Verificación[Goerli+Polygon_Mumbai].mp4)


## _Se debe tener presente que los Smart Contract estan vinculados, por lo que se debe realizar una configuración especifica para la migración, donde la Address de MemoriaUrbanaToken, se utiliza para el Deploy de Market_Place._

<details>
<summary>1_deploy_contracts.js SMART CONTRACT ⚙️</summary>

```js
var MemoriaUrbanaToken = artifacts.require("./MemoriaUrbanaToken.sol");
var Market_Place = artifacts.require("./Market_Place.sol");

// El deploy debe ser anidado, dado que el contrato Marketplace requiere el contrato con el que
// estará vinculado

module.exports = function (deployer) {

  deployer.deploy(MemoriaUrbanaToken).then(function () {      
      return deployer.deploy(Market_Place, MemoriaUrbanaToken.address);
  });
};
```
</details>



* ## 1.- Switch entre redes Goerli y Polygon Mumbai (Layer 2).
     * ## Beneficio : Busca escalar en rendimiento y costo.
     * ## [Video Demostrativo Switch ](https://github.com//jcontrerasd/Proyecto-MUTS/raw/main/1.-Switch_entre_redes_Goerli_y_Polygon_Mumbai_(Layer_2).mp4)

* ## 2.- Manejo de eventos (Event/Emit).
    * ## Beneficio : Tener un control de cada acción de los contratos.
    * ## [Video Demostrativo Lectura de Eventos ](https://github.com//jcontrerasd/Proyecto-MUTS/raw/main/2.-Manejo_de_eventos(Event_Emit).mp4)

        ### _EVENT SMART CONTRACT MEMORIAURBANATOKEN.SOL_ 
        <img width="700" margin=200 alt="image" src="https://github.com/jcontrerasd/Proyecto-MUTS/assets/27821228/a6be5e86-8adf-4608-846a-86528c05d775">
          
        ### _EVENT SMART CONTRACT MARKET_PLACE.SOL_
        <img width="700" margin=200 alt="image"  src="https://github.com/jcontrerasd/Proyecto-MUTS/assets/27821228/edba78d1-c4e9-4327-866c-c0c386e010c7">

* ## 3.- Inclusión de uso IPFS NFT.Storage y Metadatos del NFT.
    * ## Beneficio : Persistir los activos (NFT) que se vayan generando en el tiempo.
    * ## [Viedo Demostrativo Uso NFT.Storage](https://github.com//jcontrerasd/Proyecto-MUTS/raw/main/3.-Inclusión_de_uso_IPFS_NFT.Storage_y_Metadatos_del_NFT.mp4)

* ## 4.- Despliegue de Dapps en IPFS usando NFT.Storage
    * ## Beneficio : Aumentar la tolerancia a fallos y la resiliencia en general.
    * ## [Viedo Demostrativo Despliegue Dapps Nfts.Storage](https://github.com//jcontrerasd/Proyecto-MUTS/raw/main/1.-Compilación+Despliegue+Verificación[Goerli+Polygon_Mumbai].mp4)

█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓
█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓
█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓
█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓

█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█ REQUISITOS SPRINT 2 █▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓▓

█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓
█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓
█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓
█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓

En este Sprint, desarrollaremos una primera versión básica de DApp para el caso de uso planteado en el sprint anterior, o una versión simplificada del mismo. Al menos, se realizará:

Una primera versión de Smart Contract (capa lógica). El Smart Contract será compilado y desplegado en una red de desarrollo (Truffle network) o testnet pública (ej. Goerli). 


## [Descargar un video con un Demo](https://github.com//jcontrerasd/Proyecto-MUTS/raw/main/Demo_Proyecto_MUT.mp4)


Una versión sencilla de Interfaz visual (capa cliente), que mostrará información de contexto del usuario 
* **Network connected : 5**
* **Wallet Address : 0x043D27C4e210b8DCd4F324Bff24bbCf89fc9C946**

<img width="300" alt="image" src="https://github.com/jcontrerasd/Proyecto-MUTS/assets/27821228/a4a65ac5-2919-4103-8f2d-4753abe9de65">

###

Contendrá un botón para obtener información del Smart Contract

 <img width="400" alt="image" src="https://github.com/jcontrerasd/Proyecto-MUTS/assets/27821228/0578d2bb-cc30-4d76-82df-317aec2ba593">

###
Otro botón para realizar una escritura en el Smart Contract.

<img width="600" alt="image" src="https://github.com/jcontrerasd/Proyecto-MUTS/assets/27821228/cf71d218-ecc7-4579-b526-25253be3986d">

###
Configuración de proveedor Web3 (capa de conexión) a través de MetaMask, que permitirá la comunicación de la interfaz visual con el Smart Contract / red seleccionada.

 <img width="600" alt="image" src="https://github.com/jcontrerasd/Proyecto-MUTS/assets/27821228/e08a1b3f-a890-4c24-b031-1b2140fcdeb1">

##
##

## ¿Cuál es la finalidad / propósito de la DApp? ##

Crear un Marketplace en una arquitectura Dapp que permita administrar NFTs con un enfoque especifico:
Memorias Urbanas Token (MUT) será una colección de NFTs que retrata la historia de ciudades a lo largo del tiempo. Estos NFTs serán creaciones únicas que representan momentos específicos de la evolución urbana. Creados por artistas y públicos en general, los MUT deberán fusionar arte y patrimonio cultural. 

## Casos de Uso ##
* **Colección de Arte Urbano :** *Un coleccionista apasionado por la historia de las ciudades adquiere varios Memorias Urbanas Tokens (MUT) que representan momentos icónicos de diferentes urbes a lo largo del tiempo. Estos NFTs incluyen  imágenes de antiguos edificios, calles, y cambios arquitectónicos a lo largo de los años. A medida que expande su colección, el coleccionista se sumerge en la narrativa visual de la evolución urbana, apreciando la fusión de arte y  patrimonio cultural.*

* **Exposición Digital :** *Un museo de arte urbano organiza una exposición digital titulada "Memorias Urbanas: Ciudades en Transformación". Utilizan MUT para mostrar cómo las ciudades han cambiado con el tiempo a través de obras de artistas  locales e internacionales. Los visitantes pueden explorar estas representaciones visuales de la historia urbana a través de NFTs en una plataforma en línea. La exposición ofrece una experiencia inmersiva que resalta la importancia de  preservar y apreciar el patrimonio urbano. Los MUT se convierten en una forma única de conectar a las personas con el pasado de las ciudades y su diversidad artística.*

##
##
## ¿Qué variables y funciones contiene el Smart Contract? ##

### Se crean dos contratos
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

### IMPORTANTE ###
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

##
##

### DEPLOY DE CONTRATOS

```
truffle migrate --network ethereum_goerli_testnet
```

### MemoriaUrbanaToken : 0x7d7BedAc49A2D22E178bF8e1f99fB604949c98aA
* El contrato crea un token ERC721 llamado MemT (MUT). El contrato puede ser utilizado para crear nuevos tokens, aprobar la custodia del NFT a un contrato que permita custodiar el NFT y comercializarlo.


### MarketPlace : 0x65115A00977998aF3f11373931A004bc5BC52fBB

* Corresponde a un MarketPlace que permite a los usuarios comprar y vender tokens ERC721. En resumen permite comprar y vender tokens ERC721.

##

### VERIFICACION DE CONTRATOS
truffle run verify  **NOMBRE_CONTRATO**@**ADDRESS_CONTRATO** --network ethereum_goerli_testnet
```
truffle run verify  MemoriaUrbanaToken@0x7d7BedAc49A2D22E178bF8e1f99fB604949c98aA  --network ethereum_goerli_testnet
truffle run verify  MarketPlace@0x65115A00977998aF3f11373931A004bc5BC52fBB   --network ethereum_goerli_testnet

```

### MemoriaUrbanaToken : 0x7d7BedAc49A2D22E178bF8e1f99fB604949c98aA

<img width="450" alt="image" src="https://github.com/jcontrerasd/Proyecto-MUTS/assets/27821228/c1a12900-a1b0-48d6-97c6-517b5d1f5e0c">
<img width="500" alt="image" src="https://github.com/jcontrerasd/Proyecto-MUTS/assets/27821228/defa8a87-06a6-443c-ad02-b03fd5f9981f">


### MarketPlace : 0x65115A00977998aF3f11373931A004bc5BC52fBB
<img width="430" alt="image" src="https://github.com/jcontrerasd/Proyecto-MUTS/assets/27821228/bafe9db5-9e95-4a6c-9ad7-ca5d280eedb9">
<img width="450" alt="image" src="https://github.com/jcontrerasd/Proyecto-MUTS/assets/27821228/87e75649-5eab-4d48-834d-7299f33193e8">

###
###


## ¿Qué librería has implementado para la capa de conexión: Web3.js o Ethers.js? ¿Por qué? ##

Se utilizo Web3.js, dado que había experiencia en sprint anteriores sobre el uso de  transformaciones, entendería que en manejos más complejos se usará una u otra, pero con investigación sobre el caso de uso.  

-----------------------BORRAR -----------------------
--- GOERLI ---
 truffle migrate --network ethereum_goerli_testnet

truffle run verify  MemoriaUrbanaToken@0x8aB32B5C49B4c38079c6E8cA595a635421e7D473  --network ethereum_goerli_testnet
truffle run verify  Market_Place@0x985e97161436791e97Bf629BC9598e43F13716aD   --network ethereum_goerli_testnet

--- POLYGON ---
truffle migrate --network polygon_mumbai_testnet

truffle run verify  MemoriaUrbanaToken@0x8Cf7C2057eF394CA2ceE7eb512d80B19d7a9BeBc  --network polygon_mumbai_testnet
truffle run verify  Market_Place@0xEeC6fBDAAd0f3Bd17Ad14D4aE5F9c68b108aF92d   --network polygon_mumbai_testnet


--- NFT.STORAGE --
npm run build

 truffle migrate --network ethereum_goerli_testnet

truffle run verify  MemoriaUrbanaToken@ADDRESS_MemoriaUrbanaToken_goerli  --network ethereum_goerli_testnet
truffle run verify  Market_Place@ADDRESS_Market_Place_goerli  --network ethereum_goerli_testnet

--- POLYGON ---
truffle migrate --network polygon_mumbai_testnet

truffle run verify  MemoriaUrbanaToken@ADDRESS_MemoriaUrbanaToken_mumbai  --network polygon_mumbai_testnet
truffle run verify  MemoriaUrbanaToken@ADDRESS_MemoriaUrbanaToken_mumbai   --network polygon_mumbai_testnet

Donde las ADDRESS* son las Address entregadas por el proceso "truffle migrate" tanto para goerli como para mumbai respectivamente
