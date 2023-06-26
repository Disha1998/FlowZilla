export const unlistFromSaleTx = `
import SeperNFTMarketplace from 0xa5a0ef4be9f25990

transaction(id: UInt64) {

  prepare(acct: AuthAccount) {
    let saleCollection = acct.borrow<&SeperNFTMarketplace.SaleCollection>(from: /storage/MySaleCollection)
                            ?? panic("This SaleCollection does not exist")

    saleCollection.unlistFromSale(id: id)
  }

  execute {
    log("A user unlisted an NFT for Sale")
  }
}

`