var Auction = artifacts.require("./Auction.sol");
var MemoriaUrbanaToken = artifacts.require("./MemoriaUrbanaToken.sol");
var MarketPlace = artifacts.require("./MarketPlace.sol");



// module.exports = function(deployer) {
//   deployer.deploy(Auction);
//   deployer.deploy(MemoriaUrbanaToken);
//   deployer.deploy(MarketPlace);
// };


module.exports = function (deployer) {
  deployer.deploy(Auction);

  deployer.deploy(MemoriaUrbanaToken).then(function () {
      // Suponiendo que MarketPlace necesita la dirección de MemoriaUrbanaToken
      return deployer.deploy(MarketPlace, MemoriaUrbanaToken.address);
  });
};