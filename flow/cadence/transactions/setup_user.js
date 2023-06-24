export const setupUserTx = `
import SuperCool from 0xf7d3f70bbca64a11
import NonFungibleToken from 0x631e88ae7f1d7c20
import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868
import NFTMarketplace from 0xf7d3f70bbca64a11

transaction {

  prepare(acct: AuthAccount) {
    let superCoolCollectionRef = acct.borrow<&SuperCool.Collection>(from: /storage/SuperCoolCollection)

    if (superCoolCollectionRef == nil) {
      acct.save(<- SuperCool.createEmptyCollection(), to: /storage/SuperCoolCollection)
    }
    acct.link<&SuperCool.Collection{SuperCool.CollectionPublic, NonFungibleToken.CollectionPublic}>(/public/SuperCoolCollection, target: /storage/SuperCoolCollection)
    acct.link<&SuperCool.Collection>(/private/SuperCoolCollection, target: /storage/SuperCoolCollection)
    
    let mySaleCollectionRef = acct.borrow<&NFTMarketplace.SaleCollection>(from: /storage/MySaleCollection)

    if (mySaleCollectionRef == nil) {

    let SuperCoolCollection = acct.getCapability<&SuperCool.Collection>(/private/SuperCoolCollection)
    let FlowTokenVault = acct.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver)

    acct.save(<- NFTMarketplace.createSaleCollection(SuperCoolCollection: SuperCoolCollection, FlowTokenVault: FlowTokenVault), to: /storage/MySaleCollection)
    acct.link<&NFTMarketplace.SaleCollection{NFTMarketplace.SaleCollectionPublic}>(/public/MySaleCollection, target: /storage/MySaleCollection)
  }
}

  execute {
    log("A user stored a Collection and a SaleCollection inside their account")
  }
}

`