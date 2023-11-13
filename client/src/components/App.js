// Import React package
import React from "react";
import web3 from 'web3';
import "./App.css";
import getWeb3 from "../helpers/getWeb3";
import Imagenppl from './Imagenes/img-ppl.jpg';

//////////////////////////////////////////////////////////////////////////////////|
//        CONTRACT ADDRESS           &          CONTRACT ABI                      |
//////////////////////////////////////////////////////////////////////////////////|           

const CONTRACT_ADDRESS_TOKEN = require("../contracts/MemoriaUrbanaToken.json").networks[5].address
const CONTRACT_ABI_TOKEN = require("../contracts/MemoriaUrbanaToken.json").abi;
 
const CONTRACT_ADDRESS_MKP = require("../contracts/MarketPlace.json").networks[5].address
const CONTRACT_ABI_MKP = require("../contracts/MarketPlace.json").abi;
 

export default class App extends React.Component {
  state = {
    web3Provider: null,
    accounts: null,
    networkId: null,
    contract_token: null,
    tokenURI: "ipfs://bafybeifke3m73lk3fhapmewkrmfu2pei7b55gsvoxgengaoesgwh7uwnyq/",
    newItemId: null,
    imageUrl: null,
    contract_mkp: null,
    salePriceEth: '',
    messages: [],
    loading: false,
    tokenident: '',
    valueTokenEth: '',
    newvalueTokenWei: null,
    storageValue: null
  };



  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the network ID
      const networkId = await web3.eth.net.getId();
      const networkIdNumber = Number(networkId);

      // Create the Smart Contract instance
      const contract_token = new web3.eth.Contract(CONTRACT_ABI_TOKEN, CONTRACT_ADDRESS_TOKEN);
      const contract_mkp = new web3.eth.Contract(CONTRACT_ABI_MKP, CONTRACT_ADDRESS_MKP);

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3Provider: web3, accounts, networkIdNumber, contract_token, contract_mkp });

      // --------- TO LISTEN TO EVENTS AFTER EVERY COMPONENT MOUNT ---------
      // this.handleMetamaskEvent()
      // componentDidMount() {
      // this.initializeWeb3();
      this.handleMetamaskEvents();
      // }

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Falla de carga Web3, Cuentas o Contratos. Check la console para mas Detalles.`,
      );
      console.error(error);
    }
  };

  // --------- METAMASK EVENTS ---------
  handleMetamaskEvents = () => {
    window.ethereum.on('accountsChanged', (accounts) => {
      // Actualizar el estado con la nueva cuenta
      alert("Incoming event from Metamask: Account changed 🦊");
      this.setState({ accounts});
      
      window.location.reload();
      // Aquí deberías reconectar los servicios/componentes necesarios
    });

    window.ethereum.on('chainChanged', (chainId) => {
      // Actualizar el estado con la nueva cadena
      alert("Incoming event from Metamask: Chain changed 🦊");
      this.handleChainChanged(chainId);
      window.location.reload();
    });
  }

  handleChainChanged = (chainId) => {
    // Convertir el chainId a un número (opcional, dependiendo de cómo desees usarlo)
    const numericChainId = parseInt(chainId, 16);
    this.setState({ networkId: numericChainId });
    window.location.reload();
    // Aquí deberías actualizar/reiniciar la instancia de web3 y otros componentes relacionados
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
    // const { accounts } = this.state;
    try {
    const nametoken = await contract.methods.name().call();
    const symboltoken = await contract.methods.symbol().call();

    // Save new states
    this.setState({ nametoken, symboltoken })
    } catch (error) {
      console.error("Error al obtener Información : ", error);
      // Manejar el error como sea apropiado para tu aplicación
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

    try {

      this.setState({ loading: true }); // Activar el indicador de carga

      //////// SEPARADOR ////////
      this.setState(prevState => ({
        messages: [...prevState.messages, '[█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓]']
      }))

      //////// INICIANDO EL PROCESO DE MINTEO ////////
      this.setState(prevState => ({
        messages: [...prevState.messages, `[ ${this.getFormattedDateTime()} ] - Iniciando el proceso de minteo...`]
      }))

      ///////// Llamada para crear el Nuevo NFT /////////
      const response = await contract_token.methods.awardItem(accounts[0], tokenURI).send({ from: accounts[0] });

      //////// MINTEO COMPLETADO ////////
      this.setState(prevState => ({
        messages: [...prevState.messages, `[ ${this.getFormattedDateTime()} ] - Minteo completado.`]
      }));

      const newItemId = response.events.Transfer.returnValues.tokenId.toString();

      //////// RECUPERA TOKEN ID ////////
      this.setState(prevState => ({
        newItemId,
        imageUrl: this.convertToHttpUrl(tokenURI),
        messages: [...prevState.messages, `[${this.getFormattedDateTime()}] - TokenID Recuperando`]
      }));

      //////// SEPARADOR ////////
      this.setState(prevState => ({
        messages: [...prevState.messages, '[█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓]']
      }))


    } catch (error) {
      this.setState(prevState => ({
        messages: [...prevState.messages, `[ ${this.getFormattedDateTime()} ] - Error al mintear el NFT: ${error.message}`]
      }));
    } finally {
      this.setState({ loading: false }); // Desactivar el indicador de carga
    }
  };

  // ------------ FUNCION PARA CONVERSION URI ------------
  convertToHttpUrl = (tokenURI) => {
    // Aquí conviertes el tokenURI a una URL accesible si es necesario
    // Por ejemplo, si es una URI de IPFS:
    if (tokenURI.startsWith('ipfs://')) {
      return `https://ipfs.io/ipfs/${tokenURI.slice(7)}`;
    }
    // Otras lógicas de conversión pueden ir aquí
    return tokenURI;
  };

  // ------------ FUNCION PARA APROBAR NFT PARA MARKETPLACE ------------
  aprobarNFT = async (newItemId) => {
    const { accounts, contract_token } = this.state;

    this.setState({ loading: true }); // Activar el indicador de carga

    try {
      //////// SEPARADOR ////////
      this.setState(prevState => ({
        messages: [...prevState.messages, '[█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓]']
      }))

      ///////// INICIO DE PROCESO DE APROBACIÓN AL MARKETPLACE PARA QUE PUEDA TRANSAR EL NFT////////
      this.setState(prevState => ({
        messages: [...prevState.messages, `[ ${this.getFormattedDateTime()} ] - Inicio proceso de Aprobación al Marketplace`]
      }));
      // Llamada para dar aprobación de venta del NFT mediante el contrato CONTRACT_ADDRESS_MKP
      await contract_token.methods.approveToMarketplace(CONTRACT_ADDRESS_MKP, newItemId).send({ from: accounts[0] });

      //////// APROBACIÓN AL MARKETPLACE COMPLETADA ////////
      this.setState(prevState => ({
        messages: [...prevState.messages, `[ ${this.getFormattedDateTime()} ] - Aprobación para el marketplace ${CONTRACT_ADDRESS_MKP} completada para el token ID: ${newItemId}`]
      }));

      //////// SEPARADOR ////////
      this.setState(prevState => ({
        messages: [...prevState.messages, '[█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓]']
      }))
    } catch (error) {
      this.setState(prevState => ({
        messages: [...prevState.messages, `[ ${this.getFormattedDateTime()} ]- Error al Aprobar el NFT en el Marketplace: ${error.message}`]
      }));
    } finally {
      this.setState({ loading: false }); // Desactivar el indicador de carga
    }
  };


  ponerVentaNFT = async (tokenId, priceEth) => {
    const { accounts, contract_mkp } = this.state;

    const priceWei = web3.utils.toWei(priceEth.toString(), 'ether');
    console.log(priceWei)

    this.setState({ loading: true }); // Activar el indicador de carga

    try {
      //////// SEPARADOR ////////
      this.setState(prevState => ({
        messages: [...prevState.messages, '[█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓]']
      }))

      //////// INICIO PUESTA EN VENTA DE NFT ////////
      this.setState(prevState => ({
        messages: [...prevState.messages, `[ ${this.getFormattedDateTime()} ]- Inicio de Puesta en Venta  token ID: ${tokenId} mediante Contrato ${CONTRACT_ADDRESS_MKP} a un precio de ${priceEth} Eth / ${priceWei} Wei`]
      }));

      await contract_mkp.methods.setSale(tokenId, priceWei).send({ from: accounts[0] });


      //////// NFT PUESTO A LA VENTA ////////
      this.setState(prevState => ({
        messages: [...prevState.messages, `[ ${this.getFormattedDateTime()} ]- Puesto a la Venta  token ID: ${tokenId} mediante Contrato ${CONTRACT_ADDRESS_MKP} a un Precio  ${priceEth} Eth / ${priceWei} Wei`]
      }));

      //////// SEPARADOR ////////
      this.setState(prevState => ({
        messages: [...prevState.messages, '[█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓]']
      }))

    } catch (error) {
      this.setState(prevState => ({
        messages: [...prevState.messages, `[ ${this.getFormattedDateTime()} ]- Error al poner a la venta el NFT:' ${error.message}`]
      }));
    } finally {
      this.setState({ loading: false }); // Desactivar el indicador de carga
    }
  };

  consultarPrecioNFT = async (tokenident) => {
    const { contract_mkp } = this.state;

    this.setState({ loading: true });

    try {
      this.setState(prevState => ({
        messages: [...prevState.messages, '[█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓]']
      }));

      // Iniciando recuperación del precio del NFT
      this.setState(prevState => ({
        messages: [...prevState.messages, `[ ${this.getFormattedDateTime()} ]- Iniciando Proceso de Recuperación de Precio de NFT: ${tokenident}`]
      }));

      console.log(tokenident)
      const valueTokenWei = await contract_mkp.methods.getPrice(tokenident).call();
      const valueTokenString = valueTokenWei.toString();
      const valueTokenEth = web3.utils.fromWei(valueTokenString, 'ether');

      // Guardar el precio del NFT en el estado
      this.setState({ valueTokenEth });

      // Precio del NFT recuperado
      this.setState(prevState => ({
        messages: [...prevState.messages, `[ ${this.getFormattedDateTime()} ]- Precio Recuperado de NFT: ${tokenident}, tiene un Precio de ${valueTokenEth} Eth / ${valueTokenWei} Wei`]
      }));
    } catch (error) {
      this.setState(prevState => ({
        messages: [...prevState.messages, `[ ${this.getFormattedDateTime()} ]- Error al Recuperar Precio del NFT: ${error.message}`]
      }));
    } finally {
      this.setState({ loading: false });
    }
  };


  comprarNFT = async (tokenident, precioeth) => {
    const { accounts, contract_mkp } = this.state;

    this.setState({ loading: true });

    try {
      const valueTokenWei = web3.utils.toWei(precioeth, 'ether');

      // Iniciando proceso de compra
      this.setState(prevState => ({
        messages: [...prevState.messages, `[ ${this.getFormattedDateTime()} ]- Iniciando Compra de Token ID: ${tokenident}, a un Precio de ${precioeth} Eth / ${valueTokenWei} Wei`]
      }));

      await contract_mkp.methods.buyToken(tokenident).send({ from: accounts[0], value: valueTokenWei });

      // Proceso de compra finalizado
      this.setState(prevState => ({
        messages: [...prevState.messages, `[ ${this.getFormattedDateTime()} ]- Proceso de Compra Finalizado para Token ID: ${tokenident}, a un Precio de ${precioeth} Eth / ${valueTokenWei} Wei`]
      }));

      // this.setState({
      //   tokenident: '',     // Limpiar el identificador del token
      //   valueTokenEth: null, // Limpiar el precio del token
      //   precioeth: null,
      // });
      // Resetear el precio de venta a vacío después de la compra
      this.setState({ salePriceEth: '' });
    } catch (error) {
      this.setState(prevState => ({
        messages: [...prevState.messages, `[ ${this.getFormattedDateTime()} ]- Error al Comprar NFT: ${error.message}`]
      }));
    } finally {
      this.setState({ loading: false });
    }
  };

 

  /////// R E N D E R //////

  render() {
    // const { newItemId, imageUrl } = this.state;
    const messagesToShow = [...this.state.messages].reverse();

    const Spinner = () => (
      <div className="spinner-container">
        <div className="spinner"></div> 
      </div>
    );

    if (!this.state.web3Provider) {
      return <div className="App-no-web3">
        <h3>No estas conectado a Web3 !!!</h3>
      </div>;
    }
    return (
      <div className="App">
        <div className="main-container">
          <div className="left-section">
            <div className="Contract-header card">
              <h2>INFORMACIÓN DE CONEXION</h2>
              <p><strong>💻 Network connected :</strong> {this.state.networkIdNumber}</p>
              <p><strong>🪙 Wallet Address :</strong> {this.state.accounts[0]}</p>
            </div>

            {this.state.accounts && (
              <div className="Contract-details card">
                  <h2>DETALLES DE CONTRATO</h2>
                  <button id="button" onClick={() => this.getinfoMemoriaUrbanaToken(this.state.contract_token)}>Obtener Información de Contrato</button>
                {this.state.nametoken && <p><strong><b>🌃 Nombre NFTs : </b> </strong>{this.state.nametoken}</p>}
                {this.state.symboltoken && <p><strong><b>✴️ Simbolo NFTs :</b> </strong>{this.state.symboltoken}</p>}
                <p><strong>📜 Contract MemoriaUrbanaToken : </strong>{CONTRACT_ADDRESS_TOKEN}</p>
                <p><strong>📜 Contract MarketPlace : </strong>{CONTRACT_ADDRESS_MKP}</p>
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
              {this.state.newItemId && (
                <div className="item-container">
                 
                  <h3 style={{ margin: 0, margintop: 10, marginRight: 10 }}>ID NFT : [ {this.state.newItemId} ] </h3>
                  {/* Imagen del NFT */}
                  {this.state.imageUrl && (                
                    <img src={this.state.imageUrl} alt="Imagen del NFT" className="small-image" />
                  )}
                  {/* Botón para aprobar el NFT */}
                  <button id="button" onClick={() => this.aprobarNFT(this.state.newItemId)}>
                    Aprobar NFT para Marketplace
                  </button>

                </div>
              )}

              <hr className="separator-line" />

              {/* /////////////////////////// VENDER NFT /////////////////////////// */}
              <div style={{ display: 'flex', alignItems: 'center'}}>
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
                    placeholder="Precio NFT Eth"
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
                    placeholder="Precio NFT Eth"
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

              {/* //////////////////////////// ----COMPRA NFT ---- ///////////////////////////  */ }
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
                    placeholder="Precio NFT Eth"
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