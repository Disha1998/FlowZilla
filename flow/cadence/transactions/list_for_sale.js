export const listForSaleTx = `
import SeperNFTMarketplace from 0xa5a0ef4be9f25990

transaction(id: UInt64, price: UFix64) {

  prepare(acct: AuthAccount) {
    let saleCollection = acct.borrow<&SeperNFTMarketplace.SaleCollection>(from: /storage/MySaleCollection)
                            ?? panic("This SaleCollection does not exist")

    saleCollection.listForSale(id: id, price: price)
  }

  execute {
    log("A user listed an NFT for Sale")
  }
}
`