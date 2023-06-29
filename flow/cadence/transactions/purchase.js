export const purchaseTx = `
import superflo1 from 0x4afc162bce5d7fb4
import NonFungibleToken from 0x631e88ae7f1d7c20
import supermarketplace1 from 0x4afc162bce5d7fb4
import FlowToken from 0x7e60df042a9c0868

transaction(account: Address, id: UInt64) {

  prepare(acct: AuthAccount) {
    let saleCollection = getAccount(account).getCapability(/public/MySaleCollection)
                        .borrow<&supermarketplace1.SaleCollection{supermarketplace1.SaleCollectionPublic}>()
                        ?? panic("Could not borrow the user's SaleCollection")

    let recipientCollection = getAccount(acct.address).getCapability(/public/SuperCoolCollection) 
                    .borrow<&superflo1.Collection{NonFungibleToken.CollectionPublic}>()
                    ?? panic("Can't get the User's collection.")

    let price = saleCollection.getPrice(id: id)

    let payment <- acct.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)!.withdraw(amount: price) as! @FlowToken.Vault

    saleCollection.purchase(id: id, recipientCollection: recipientCollection, payment: <- payment)
  }

  execute {
    log("A user purchased an NFT")
  }
}

`