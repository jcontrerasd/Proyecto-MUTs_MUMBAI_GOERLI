var MemoriaUrbanaToken = artifacts.require("./MemoriaUrbanaToken.sol");
var MarketPlace = artifacts.require("./MarketPlace.sol");

// El deploy debe ser anidado, dado que el contrato Marketplace requiere el contrato con el que
// estará vinculado

module.exports = function (deployer) {

  deployer.deploy(MemoriaUrbanaToken).then(function () {
      // Suponiendo que MarketPlace necesita la dirección de MemoriaUrbanaToken
      return deployer.deploy(MarketPlace, MemoriaUrbanaToken.address);
  });
};