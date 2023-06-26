export const setupUserTx = `
import SuperFlo from 0xa5a0ef4be9f25990
import NonFungibleToken from 0x631e88ae7f1d7c20
import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868
import SeperNFTMarketplace from 0xa5a0ef4be9f25990

transaction {

  prepare(acct: AuthAccount) {

      acct.save(<- SuperFlo.createEmptyCollection(), to: /storage/SuperCoolCollection)
    acct.link<&SuperFlo.Collection{SuperFlo.CollectionPublic, NonFungibleToken.CollectionPublic}>(/public/SuperCoolCollection, target: /storage/SuperCoolCollection)
    acct.link<&SuperFlo.Collection>(/private/SuperCoolCollection, target: /storage/SuperCoolCollection)

    let SuperCoolCollection = acct.getCapability<&SuperFlo.Collection>(/private/SuperCoolCollection)
    let FlowTokenVault = acct.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver)

    acct.save(<- SeperNFTMarketplace.createSaleCollection(SuperCoolCollection: SuperCoolCollection, FlowTokenVault: FlowTokenVault), to: /storage/MySaleCollection)
    acct.link<&SeperNFTMarketplace.SaleCollection{SeperNFTMarketplace.SaleCollectionPublic}>(/public/MySaleCollection, target: /storage/MySaleCollection)
}

  execute {
    log("A user stored a Collection and a SaleCollection inside their account")
  }
}

`


