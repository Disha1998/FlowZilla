export const unlistFromSaleTx = `
import supermarketplace1 from 0x4afc162bce5d7fb4

transaction(id: UInt64) {

  prepare(acct: AuthAccount) {
    let saleCollection = acct.borrow<&supermarketplace1.SaleCollection>(from: /storage/MySaleCollection)
                            ?? panic("This SaleCollection does not exist")

    saleCollection.unlistFromSale(id: id)
  }

  execute {
    log("A user unlisted an NFT for Sale")
  }
}

`