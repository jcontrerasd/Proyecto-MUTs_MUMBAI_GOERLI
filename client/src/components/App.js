// Import React package
import React from "react";
import web3 from 'web3';
import "./App.css";
import getWeb3 from "../helpers/getWeb3";
import Imagenppl from './Imagenes/img-ppl.jpg';
import axios from 'axios';

      
const NETWORKGOERLI = 5;
const NETWORKPOLYGON = 80001;


export default class App extends React.Component {

  state = {
    web3Provider: null,
    accounts: null,
    networkId: null,
    contract_token: null,
    contract_mkp: null,
    tokenURI: "ipfs://bafkreicodhvqnmypday22qadf7ol4fw3yeto77uv5e4jrph4hlbmtc5ikm/",
    newItemId: null,
    imageUrl: null,
    name: null,
    description: null,    
    salePriceEth: '',
    messages: [],
    loading: false,
    tokenident: '',
    valueTokenEth: '',
    newvalueTokenWei: null,
    storageValue: null,
    RUNNETWORK: null,
  };




  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();

      // const blockNumber = web3.eth.getBlockNumber({
      //   fromBlock: 0,
      // });

      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const networkIdNumber = Number(networkId);
    
      this.state.RUNNETWORK = networkIdNumber;
      
         
      const CONTRACT_ADDRESS_TOKEN = require("../contracts/MemoriaUrbanaToken.json").networks[this.state.RUNNETWORK].address
      const CONTRACT_ABI_TOKEN = require("../contracts/MemoriaUrbanaToken.json").abi;

      const CONTRACT_ADDRESS_MKP = require("../contracts/Market_Place.json").networks[this.state.RUNNETWORK].address
      const CONTRACT_ABI_MKP = require("../contracts/Market_Place.json").abi;

      // Initialize contract instances
      let contract_token;
      let contract_mkp;

      // Variables to track initialization
      let isContractTokenInitialized = false;
      let isContractMkpInitialized = false;

      // Keep trying to initialize contracts until both are successful
      while (!isContractTokenInitialized || !isContractMkpInitialized) {
        try {
          // Attempt to initialize contract_token
          contract_token = new web3.eth.Contract(CONTRACT_ABI_TOKEN, CONTRACT_ADDRESS_TOKEN);
          if (contract_token.options.address) {
            isContractTokenInitialized = true;
          }

          // Attempt to initialize contract_mkp
          contract_mkp = new web3.eth.Contract(CONTRACT_ABI_MKP, CONTRACT_ADDRESS_MKP);
          if (contract_mkp.options.address) {
            isContractMkpInitialized = true;
          }

          // If both contracts are successfully initialized, exit the loop
          if (isContractTokenInitialized && isContractMkpInitialized) {
            break;
          }
        } catch (error) {
          console.error('Error al inicializar contratos:', error);
          // Wait for a moment before trying again
          await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
        }
      }
      // Set web3, accounts, and contract instances to the state
      this.setState({
        web3Provider: web3,
        accounts: accounts,
        networkId: networkId,
        networkIdNumber,
        contract_token: contract_token,
        contract_mkp: contract_mkp
      });

      this.getinfoMemoriaUrbanaToken(contract_token);
      this.handleMetamaskEvents();
      this.handleContractEvent();


    } catch (error) {
      this.showNetworkSelectionDialog();  
      let logmsg = `Falla de carga Web3, Cuentas o Contratos.Check la console para mas Detalles. ${error} `;
      this.printMessage("msg", logmsg);
      logmsg = '';
      console.error(error);
    }
  }



  /////////////// --------- SMART CONTRACT EVENTS ---------  ///////////////
    handleContractEvent = async () => {
      // Wait for the `contract_mkp` instance to be initialized
      while (!this.state.contract_mkp) {
        await new Promise((resolve) => setTimeout(resolve, 1000));  
      }

      while (!this.state.contract_token) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      // if (!this.state.contract_mkp.options.address) return;
      // if (!this.state.contract_token.options.address) return;

      try {
        let logmsg ='';
        
        
/////////// NFT ////////////
        const subscription_token = this.state.contract_token.events.allEvents();

        subscription_token.on('connected', function (subscriptionId)  {
          console.log("New subscription_token with ID: " + subscriptionId)
          // alert(subscriptionId);
        })

        let lastPrintedEventId = null;

        subscription_token.on("data", (event) => {
          if (event.event === "TokenAwarded" && event.transactionHash !== lastPrintedEventId) {
            logmsg = `[ ${this.getFormattedDateTime()} ] - Event - Nuevo NFT Creado: Owner - ${event.returnValues.owner} TokenID - ${event.returnValues.tokenId} Token URI - ${event.returnValues.tokenURI}`;
            lastPrintedEventId = event.transactionHash;
          }
          this.printMessage("msg", logmsg);
          logmsg = "";
        });



        subscription_token.on("error", (error) => {
          let logmsg = `Error al escuchar eventos: %o, ${error} `;
          this.printMessage("msg", logmsg);
          logmsg = '';
        })

/////////// MARKETPLACE ////////////
        const subscription_mkp = this.state.contract_mkp.events.allEvents();

        subscription_mkp.on('connected', (subscriptionId) => {
          console.log("New subscription_mkp with ID: " + subscriptionId)
        })

        subscription_mkp.on("data", (event) => {
          if (event.event === "TokenPurchased" && event.transactionHash !== lastPrintedEventId) {
            logmsg = `[ ${this.getFormattedDateTime()} ] - Event - NFT Comprado: Comprador ${event.returnValues.buyer} Vendedor ${event.returnValues.seller} TokenID ${event.returnValues.tokenId}  Precio ${event.returnValues.price} Wei `;
          }
          if (event.event === "TokenSetForSale" && event.transactionHash !== lastPrintedEventId) {
            logmsg = `[ ${this.getFormattedDateTime()} ] - Event - NFT en Venta: Owner -  ${event.returnValues.owner}  TokenID ${event.returnValues.tokenId} Precio ${event.returnValues.price}  Wei`;
          }
          if (event.event === "TokenUnsetForSale" && event.transactionHash !== lastPrintedEventId) {
            logmsg = `[ ${this.getFormattedDateTime()} ] - Event - NFT fuera de venta: Owner - ${event.returnValues.owner} TokenID - ${event.returnValues.tokenId}`;
          }
          lastPrintedEventId = event.transactionHash;
          this.printMessage("msg", logmsg);
          logmsg = '';
        })
        subscription_mkp.on("error", (error) => {
          let logmsg = `Error al escuchar eventos: %o, ${error} `;
          this.printMessage("msg", logmsg);
          logmsg = '';
        })
        // Print a separator line after each event log
        this.printMessage("ln");
      } catch (error) {
        let logmsg = `Error al configurar la escucha de eventos: %o, ${error} `;
        this.printMessage("msg", logmsg);
        logmsg = '';
      }
    }



  showNetworkSelectionDialog = () => {
    // Crear un div para el diálogo
    const dialogDiv = document.createElement("div");
    dialogDiv.id = "network-dialog";

    // Crear un párrafo con el texto general
    const generalText = document.createElement("h3");
    generalText.innerHTML = "PROBLEMA CON LA RED...!!!<br> <br>"+
                            "DApp solo funciona con GOERLI y POLYGON MUMBAI.<br> <br>"+
                            "¿A qué red te gustaría Cambiar?" 
    dialogDiv.appendChild(generalText);

    // Crear el botón para GOERLI
    const goerliButton = document.createElement("button");
    goerliButton.textContent = "GOERLI";
    goerliButton.addEventListener("click", () => {
      this.setState({ RUNNETWORK: NETWORKGOERLI }, () => {
        this.switchNetwork(NETWORKGOERLI);
        dialogDiv.remove(); // Cerrar el diálogo
      });
    });

    // Crear el botón para POLYGON MUMBAI
    const polygonButton = document.createElement("button");
    polygonButton.textContent = "MUMBAI";
    polygonButton.addEventListener("click", () => {
      this.setState({ RUNNETWORK: NETWORKPOLYGON }, () => {
        this.switchNetwork(NETWORKPOLYGON);
        dialogDiv.remove(); // Cerrar el diálogo
      });
    });

    // Agregar los botones al div del diálogo
    dialogDiv.appendChild(goerliButton);
    dialogDiv.appendChild(polygonButton);

    // Agregar el div del diálogo al cuerpo del documento
    document.body.appendChild(dialogDiv);

  };


  // ------------ METAMASK SWITCH NETWORK ------------
  switchNetwork = async (targetNetwork) => {
    let chainId, chainName, rpcUrls, blockExplorerUrls ;
    const nativeCurrency = {};

    try {
      switch (targetNetwork) {
        case NETWORKGOERLI:
          // chainId = '0x5'; // Chain ID for Goerli
          chainId = `0x${NETWORKGOERLI.toString(16)}`
          chainName = 'Red de prueba Goerli';
          rpcUrls = ['https://goerli.infura.io/v3/']; // RPC URL for Goerli
          nativeCurrency.name = 'ETH';
          nativeCurrency.symbol = 'ETH';
          nativeCurrency.decimals = 18;
          blockExplorerUrls = ['https://etherscan.io']; 
          break;
        case NETWORKPOLYGON:
          // chainId = `0x${NETWORKPOLYGON}`;
          chainId = `0x${NETWORKPOLYGON.toString(16)}`;
          chainName = 'Mumbai';
          // rpcUrls = ['https://rpc-mumbai.maticvigil.com/']; // RPC URL for Mumbai
          rpcUrls = ['https://polygon-mumbai.infura.io/v3/d571bed228404b8cb615e74b35ece409'];
          nativeCurrency.name = 'MATIC';
          nativeCurrency.symbol = 'MATIC';
          nativeCurrency.decimals = 18;
          blockExplorerUrls = ['https://mumbai.polygonscan.com/']; 
          break;
        default:
          throw new Error(`Invalid target network: ${targetNetwork}`);
      }

      // Switch to the selected network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [
          { chainId },
        ],
      });

      // Update the state with the selected network
      this.setState({ RUNNETWORK: chainId });


    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId,
                chainName,
                rpcUrls,
                nativeCurrency,
                blockExplorerUrls,
              },
            ],
          });
        } catch (addError) {
          console.log(addError)
        }
      }
    }
  }

    // --------- METAMASK EVENTS ---------

  handleMetamaskEvents = () => {
    window.ethereum.on('accountsChanged', (accounts) => {
      // Actualizar el estado con la nueva cuenta
      alert("Cambiano de cuenta   ⇢ 🦊 ⇠ !!!");

      this.setState({ accounts });
      this.setState({ web3Provider: web3 });
      window.location.reload();
      // Aquí deberías reconectar los servicios/componentes necesarios
    });

    window.ethereum.on('chainChanged', (chainId) => {
      // Actualizar el estado con la nueva cadena
      alert("Cambiando de Network  ⇢ 🦊 ⇠ !!!");
      this.handleChainChanged(chainId);
      this.setState({ web3Provider: web3 });
      window.location.reload();


    });
  }

    handleChainChanged = (chainId) => {
      // Convertir el chainId a un número (opcional, dependiendo de cómo desees usarlo)
      const numericChainId = parseInt(chainId, 16);
      this.setState({ networkId: numericChainId });
      this.setState({ web3Provider: web3 });

      window.location.reload();
      // Actualizar el estado con la nueva red
      this.setState({ RUNNETWORK: chainId });

      // Aquí deberías actualizar/reiniciar la instancia de web3 y otros componentes relacionados
    }


  // Función para agregar mensajes o separadores
  printMessage(type, message) {
    if (type === "msg") {
      this.setState(prevState => ({
        messages: [...prevState.messages, message]
      }));
    } else if (type === "ln") {
      this.setState(prevState => ({
        messages: [...prevState.messages, '[█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓]']
      }));
    } else {
      // Tipo no válido, puedes manejar el error de alguna manera aquí
      console.error("Tipo no válido: " + type);
    }
  }

  // Asegúrate de limpiar los listeners cuando el componente se desmonte
  componentWillUnmount() {
    if (window.ethereum.removeListener) {
      window.ethereum.removeListener('accountsChanged', this.handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', this.handleChainChanged);
    }
  }


  //TODO: get function to interact with Storage Smart Contract
  getMethod = async () => {
    const { contract } = this.state;

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();
    this.setState({ storageValue: response })
  }


  // ------------ GET MemoriaUrbanaToken INFORMATION FUNCTION ------------
  getinfoMemoriaUrbanaToken = async (contract) => {

    try {
      const nametoken = await contract.methods.name().call();
      const symboltoken = await contract.methods.symbol().call();

      // Save new states
      this.setState({ nametoken, symboltoken })

    } catch (error) {
      console.error(`Error al obtener Información :  ${error} `);
      // Manejar el error como sea apropiado para tu aplicación
      let logmsg = `Error al obtener Información : ${error} `;
      this.printMessage("msg", logmsg);
      logmsg = '';
    } finally {
      this.setState({ loading: false }); // Desactivar el indicador de carga
    }
  };


  // Función para obtener la fecha y hora formateada
  getFormattedDateTime() {
    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getFullYear().toString().slice(-2)} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    return formattedDate;
  }


  // ------------ FUNCION PARA CREAR NUEVO NFT ------------
  crearNFT = async () => {
    const { accounts, contract_token, tokenURI } = this.state;
    let logmsg;

    try {

      // Verifica si la URI comienza con "ipfs:" antes de realizar la solicitud
      // Construye la URL completa utilizando la URI IPFS almacenada en tokenURI
      const ipfsGatewayUrl = `https://ipfs.io/ipfs/${this.state.tokenURI.slice(7)}`;

      // Realiza una solicitud HTTP a través de la pasarela IPFS
      const pathURI = await axios.get(ipfsGatewayUrl);

      // Verifica si la respuesta es exitosa
      if (pathURI.status === 200) {
        // Parsea el JSON y obtén la URL de la imagen
        const tokenData = pathURI.data;
        const imageUrl = tokenData.image;
        const name = tokenData.name
        const description = tokenData.description

        // // Actualiza el estado con la URL de la imagen
        this.setState({ name, description, imageUrl: this.convertToHttpUrl(imageUrl) });

      } else {
        console.error('Error al obtener el contenido desde la URI IPFS');
        logmsg = `[ ${this.getFormattedDateTime()} ] - Error al obtener el contenido desde la URI IPFS`;
        this.printMessage("msg", logmsg);
      }
      this.setState({ loading: true }); // Activar el indicador de carga

      //////// SEPARADOR ////////
      this.printMessage("ln");

      //////// INICIANDO EL PROCESO DE MINTEO ////////
      logmsg = `[ ${this.getFormattedDateTime()} ] - Iniciando el proceso de minteo...`;
      this.printMessage("msg", logmsg);

      ///////// Llamada para crear el Nuevo NFT /////////
      const response = await contract_token.methods.awardItem(accounts[0], tokenURI).send({ from: accounts[0] });

      //////// MINTEO COMPLETADO ////////
      logmsg = `[ ${this.getFormattedDateTime()} ] - Minteo completado.`;
      this.printMessage("msg", logmsg);

      const newItemId = response.events.Transfer.returnValues.tokenId.toString();
      // this.setState({newItemId, imageUrl: this.convertToHttpUrl(tokenURI)})
      this.setState({ newItemId })

      //////// RECUPERA TOKEN ID ////////
      logmsg = `[${this.getFormattedDateTime()}] - TokenID ${newItemId} Recuperando`;
      this.printMessage("msg", logmsg);

      //////// SEPARADOR ////////
      this.printMessage("ln");

    } catch (error) {

      logmsg = `[ ${this.getFormattedDateTime()} ] - Error al mintear el NFT: ${error.message}`;
      this.printMessage("msg", logmsg);
    } finally {
      this.setState({ loading: false }); // Desactivar el indicador de carga
    }
  };

  // ------------ FUNCION PARA CONVERSION URI ------------
  convertToHttpUrl = (tokenURI) => {

    if (tokenURI.startsWith('ipfs://')) {
      return `https://ipfs.io/ipfs/${tokenURI.slice(7)}`;
    }
    return tokenURI;
  };

  // ------------ FUNCION PARA APROBAR NFT PARA MARKETPLACE ------------
  aprobarNFT = async (newItemId) => {
    const { accounts, contract_token } = this.state;

    this.setState({ loading: true }); // Activar el indicador de carga
    let logmsg;
    try {
      //////// SEPARADOR ////////
      this.printMessage("ln");

      ///////// INICIO DE PROCESO DE APROBACIÓN AL MARKETPLACE PARA QUE PUEDA TRANSAR EL NFT////////
      logmsg = `[ ${this.getFormattedDateTime()} ] - Inicio proceso de Aprobación al Marketplace `;
      this.printMessage("msg", logmsg);

      // Llamada para dar aprobación de venta del NFT mediante el contrato CONTRACT_ADDRESS_MKP
      await contract_token.methods.approveToMarketplace(this.state.contract_mkp.options.address, newItemId).send({ from: accounts[0] });

      //////// APROBACIÓN AL MARKETPLACE COMPLETADA ////////
      logmsg = `[ ${this.getFormattedDateTime()} ] - Aprobación para el marketplace ${this.state.contract_mkp.options.address} completada para el token ID: ${newItemId} `;
      this.printMessage("msg", logmsg);
      //////// SEPARADOR ////////
      this.printMessage("ln");

    } catch (error) {
      logmsg = `[ ${this.getFormattedDateTime()} ]- Error al Aprobar el NFT en el Marketplace: ${error.message} `;
      this.printMessage("msg", logmsg);
    } finally {
      this.setState({ loading: false }); // Desactivar el indicador de carga
    }
  };


  ponerVentaNFT = async (tokenId, priceEth) => {
    const { accounts, contract_mkp } = this.state;

    const priceWei = web3.utils.toWei(priceEth.toString(), 'ether');

    this.setState({ loading: true }); // Activar el indicador de carga
    let logmsg;

    try {
      //////// SEPARADOR ////////
      this.printMessage("ln");

      //////// INICIO PUESTA EN VENTA DE NFT ////////
      logmsg = `[ ${this.getFormattedDateTime()} ]- Inicio de Puesta en Venta  token ID: ${tokenId} mediante Contrato ${this.state.contract_mkp.options.address} a un precio de ${priceEth}  / ${priceWei} Wei `;
      this.printMessage("msg", logmsg);

      await contract_mkp.methods.setSale(tokenId, priceWei).send({ from: accounts[0] });


      //////// NFT PUESTO A LA VENTA ////////
      logmsg = `[ ${this.getFormattedDateTime()} ]- Puesto a la Venta  token ID: ${tokenId} mediante Contrato ${this.state.contract_mkp.options.address} a un Precio  ${priceEth}  / ${priceWei} Wei`;
      this.printMessage("msg", logmsg);

      //////// SEPARADOR ////////
      this.printMessage("ln");

    } catch (error) {
      logmsg = `[ ${this.getFormattedDateTime()} ]- Error al poner a la venta el NFT:' ${error.message}`;
      this.printMessage("msg", logmsg);
    } finally {
      this.setState({ loading: false }); // Desactivar el indicador de carga
    }
  };

  consultarPrecioNFT = async (tokenident) => {
    const { contract_mkp } = this.state;

    this.setState({ loading: true });
    let logmsg;

    try {
      //////// SEPARADOR ////////
      this.printMessage("ln");

      // Iniciando recuperación del precio del NFT
      logmsg = `[ ${this.getFormattedDateTime()} ]- Iniciando Proceso de Recuperación de Precio de NFT: ${tokenident}`;
      this.printMessage("msg", logmsg);

      const valueTokenWei = await contract_mkp.methods.getPrice(tokenident).call();
      const valueTokenString = valueTokenWei.toString();
      const valueTokenEth = web3.utils.fromWei(valueTokenString, 'ether');

      // Guardar el precio del NFT en el estado
      this.setState({ valueTokenEth });

      // Precio del NFT recuperado
      logmsg = `[ ${this.getFormattedDateTime()} ]- Precio Recuperado de NFT: ${tokenident}, tiene un Precio de ${valueTokenEth}   / ${valueTokenWei} Wei`;
      this.printMessage("msg", logmsg);

    } catch (error) {
      logmsg = `[ ${this.getFormattedDateTime()} ]- Error al Recuperar Precio del NFT: ${error.message}`;
      this.printMessage("msg", logmsg);
    } finally {
      this.setState({ loading: false });
    }
  };


  comprarNFT = async (tokenident, precioeth) => {
    const { accounts, contract_mkp } = this.state;

    this.setState({ loading: true });
    let logmsg;

    try {
      const valueTokenWei = web3.utils.toWei(precioeth, 'ether');

      //////// SEPARADOR ////////
      this.printMessage("ln");
      this.printMessage("ln");

      // Iniciando proceso de compra
      logmsg = `[ ${this.getFormattedDateTime()} ]- Iniciando Compra de Token ID: ${tokenident}, a un Precio de ${precioeth}  / ${valueTokenWei} Wei`;
      this.printMessage("msg", logmsg);

      await contract_mkp.methods.buyToken(tokenident).send({ from: accounts[0], value: valueTokenWei });

      // Proceso de compra finalizado
      logmsg = `[ ${this.getFormattedDateTime()} ]- Proceso de Compra Finalizado para Token ID: ${tokenident}, a un Precio de ${precioeth}  / ${valueTokenWei} Wei`;
      this.printMessage("msg", logmsg);
      this.setState({ salePriceEth: '' });
    } catch (error) {

      //////// SEPARADOR ////////
      this.printMessage("ln");

      logmsg = `[ ${this.getFormattedDateTime()} ]- Error al Comprar NFT: ${error.message}`;
      this.printMessage("msg", logmsg);
    } finally {
      this.setState({ loading: false });
    }
  };


  
  // ------------ SIGN WITH METAMASK ------------
  signMessage = async () => {
    const { accounts, web3Provider } = this.state;
    let logmsg;

    var signature = await web3Provider.eth.personal.sign("Esto es un mensaje que quiero firmar", accounts[0], "")
    this.setState({ signature: signature, signer: accounts[0] });

    this.printMessage("ln");
    logmsg = `[ ${this.getFormattedDateTime()} ]- Signer address: ${accounts[0]}`;
    this.printMessage("msg", logmsg);
    logmsg = `[ ${this.getFormattedDateTime()} ]- Signed message: ${signature}`;
    this.printMessage("msg", logmsg);
  }



  /////// R E N D E R //////

  render() {

    const messagesToShow = [...this.state.messages].reverse();

    const Spinner = () => (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );

    if (!this.state.web3Provider) {
      return <div className="App-no-web3">
        <h1>No estas conectado a Web3 !!!</h1>
      </div>;
    }
    return (
      <div className="App">
        <div className="main-container">
          <div className="left-section">
            <div className="card">

              <div className="Contract-header card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>INFORMACIÓN DE CONEXIÓN</h2>
                <button id="button" onClick={this.signMessage}>SIGN MESSAGE</button>
              </div>
              <p> <strong>💻 Network connected :</strong> {this.state.networkIdNumber}
                <span style={{ marginLeft: '50px' }}> <strong>🪙 Wallet Address :</strong> {this.state.accounts[0]}</span>
              </p>
            </div>

            {this.state.accounts && (
              <div className="card">
                <h2>DETALLES DE CONTRATO</h2>
                {this.state.nametoken && (
                  <p>
                    <strong><b>🌃 Nombre NFTs :</b></strong> {this.state.nametoken}
                    <span style={{ marginLeft: '50px' }}>
                      <strong><b>✴️ Simbolo NFTs :</b></strong> {this.state.symboltoken}
                    </span>
                  </p>
                )}
                <p><strong>📜 Contract MemoriaUrbanaToken : </strong>{this.state.contract_token.options.address}</p>
                <p><strong>📜 Contract MarketPlace : </strong>{this.state.contract_mkp.options.address}</p>
              </div>
            )}
          </div>
          <div className="right-section">
            <img src={Imagenppl} alt="Descripción del Proyecto..." />
          </div>
        </div>

        <hr className="separator-line" />
        {/* /////////////////////////// LOG DE PROCESO /////////////////////////// */}
        <div className="logContainer">
          <h2 id="margen-titulo">  LOG DEL PROCESO </h2>
          <div className="logBox">
            {messagesToShow.map((message, index) => (
              <p key={index} className="message">{message}</p>
            ))}
          </div>
        </div>

        {/* ---- CREAR NFT ---- */}
        <div className="appContainer">
          <div className="Component-body">
            <div className="main-Content">
              {/* /////////////////////////// CREAR NFT /////////////////////////// */}
              <h3 style={{ margin: 0, marginRight: 10 }}> CREAR NUEVO NFT</h3>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                <input
                  style={{ width: '500px', marginRight: '5px', marginTop: '0px', marginBottom: '0px' }} // Input con ancho fijo de 250px
                  placeholder="Inserte la URI del Token"
                  value={this.state.tokenURI}
                  onChange={(uri) => this.setState({ tokenURI: uri.target.value })}>
                </input>
                {/* Indicador de carga */}
                <button
                  id="button"
                  onClick={this.crearNFT} >
                  Crear nuevo NFT
                </button>
              </div>

              {/* /////////////////////////// APROBAR MARKETPLACE /////////////////////////// */}
              {/* Indicador de carga */}
              {this.state.loading && <Spinner />}

              {/* Contenedor para el botón y la imagen */}
              {this.state.newItemId &&
                (
                  <div className="item-container">
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', margin: 0, margintop: '0px', marginBottom: '10px' }}>
                        <p><strong>{this.state.name}</strong></p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', margin: 0, margintop: '0px', marginBottom: '10px' }}>
                        <div style={{ flex: 1, textAlign: 'left' }}>
                          <p><strong>{`ID NFT: ${this.state.newItemId}`}</strong></p>
                        </div>
                        <div style={{ flex: 1, marginLeft: '10px' }}>
                          <img src={this.state.imageUrl} alt="Imagen del NFT" className="small-image" />
                        </div>
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <p><strong>{this.state.description}</strong></p>
                      </div>
                    </div>

                    {/* Botón para aprobar el NFT */}
                    <button id="button" onClick={() => this.aprobarNFT(this.state.newItemId)}>
                      Aprobar NFT para Marketplace
                    </button>

                  </div>
                )}

              <hr className="separator-line" />

              {/* /////////////////////////// VENDER NFT /////////////////////////// */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ marginRight: '5px', flexGrow: 1 }}>
                  <h3> <p> VENDER NFT</p></h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', marginRight: '5px' }}>
                  <input
                    style={{ width: '110px', marginBottom: '0px' }}
                    placeholder="TokenID"
                    type="number"
                    onChange={(t1) => this.setState({ tokenident: t1.target.value })}
                  />
                  <input
                    style={{ width: '110px', marginBottom: '0px' }}
                    placeholder="Precio NFT"
                    type="number"
                    min="0"
                    step="0.01"
                    onChange={(p1) => this.setState({ salePriceEth: p1.target.value })}
                  />
                </div>
                {/* Indicador de carga */}
                {this.state.loading && <Spinner />}
                <div style={{ marginLeft: 'auto' }}>
                  <button
                    id="button"
                    onClick={() => this.ponerVentaNFT(this.state.tokenident, this.state.salePriceEth)}>
                    Poner NFT a la venta
                  </button>
                </div>
              </div>

              <hr className="separator-line" />

              {/* /////////////////////////// CONSULTA PRECIO NFT /////////////////////////// */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ marginRight: '5px', flexGrow: 1 }}>
                  <h3> <p> CONSULTA PRECIO NFT </p></h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', marginRight: '5px' }}>
                  <input
                    style={{ width: '110px', marginBottom: '0px' }} // Establece un ancho fijo y margen
                    placeholder="TokenID"
                    type="number"
                    onChange={(t2) => this.setState({ tokenident: t2.target.value })}>
                  </input>
                  <input
                    style={{ width: '110px', marginBottom: '0px' }} // Establece un ancho fijo y margen
                    placeholder="Precio NFT"
                    type="number"
                    min="0"
                    step="0.01"
                    value={this.state.valueTokenEth}
                    readOnly>
                  </input>
                </div>

                {this.state.loading && <Spinner />}
                <div style={{ marginLeft: 'auto' }}>
                  <button id="button"
                    onClick={() => this.consultarPrecioNFT(this.state.tokenident)}>
                    Consultar Precio NFT
                  </button>
                </div>
              </div>

              <hr className="separator-line" />

              {/* //////////////////////////// ----COMPRA NFT ---- ///////////////////////////  */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ marginRight: '5px', flexGrow: 1 }}>
                  <h3> <p> COMPRAR NFT </p></h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', marginRight: '5px' }}>
                  <input
                    style={{ width: '110px', marginBottom: '0px' }}
                    placeholder="TokenID"
                    type="number"
                    onChange={(t3) => this.setState({ tokenident: t3.target.value })}>
                  </input>
                  <input
                    style={{ width: '110px', marginBottom: '0px' }}
                    placeholder="Precio NFT"
                    type="number"
                    min="0"
                    step="0.01"
                    onChange={(p2) => this.setState({ salePriceEth: p2.target.value })}>
                  </input>
                </div>
                {this.state.loading && <Spinner />}
                <div style={{ marginLeft: 'auto' }}>
                  <button id="button"
                    onClick={() => this.comprarNFT(this.state.tokenident, this.state.salePriceEth)}>
                    Comprar NFT
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  }
}