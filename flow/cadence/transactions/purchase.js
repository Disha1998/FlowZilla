export const purchaseTx = `
import SuperFlo from 0xa5a0ef4be9f25990
import NonFungibleToken from 0x631e88ae7f1d7c20
import SeperNFTMarketplace from 0xa5a0ef4be9f25990
import FlowToken from 0x7e60df042a9c0868

transaction(account: Address, id: UInt64) {

  prepare(acct: AuthAccount) {
    let saleCollection = getAccount(account).getCapability(/public/MySaleCollection)
                        .borrow<&SeperNFTMarketplace.SaleCollection{SeperNFTMarketplace.SaleCollectionPublic}>()
                        ?? panic("Could not borrow the user's SaleCollection")

    let recipientCollection = getAccount(acct.address).getCapability(/public/SuperCoolCollection) 
                    .borrow<&SuperFlo.Collection{NonFungibleToken.CollectionPublic}>()
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