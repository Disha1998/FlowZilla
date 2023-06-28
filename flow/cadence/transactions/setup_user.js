export const setupUserTx = `
import superflo1 from 0x4afc162bce5d7fb4
import NonFungibleToken from 0x631e88ae7f1d7c20
import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868
import supermarketplace1 from 0x4afc162bce5d7fb4

transaction {

  prepare(acct: AuthAccount) {

      acct.save(<- superflo1.createEmptyCollection(), to: /storage/SuperCoolCollection)
    acct.link<&superflo1.Collection{superflo1.CollectionPublic, NonFungibleToken.CollectionPublic}>(/public/SuperCoolCollection, target: /storage/SuperCoolCollection)
    acct.link<&superflo1.Collection>(/private/SuperCoolCollection, target: /storage/SuperCoolCollection)

    let SuperCoolCollection = acct.getCapability<&superflo1.Collection>(/private/SuperCoolCollection)
    let FlowTokenVault = acct.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver)

    acct.save(<- supermarketplace1.createSaleCollection(SuperCoolCollection: SuperCoolCollection, FlowTokenVault: FlowTokenVault), to: /storage/MySaleCollection)
    acct.link<&supermarketplace1.SaleCollection{supermarketplace1.SaleCollectionPublic}>(/public/MySaleCollection, target: /storage/MySaleCollection)
}

  execute {
    log("A user stored a Collection and a SaleCollection inside their account")
  }
}

`


