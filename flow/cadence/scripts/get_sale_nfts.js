export const getSaleNFTsScript = `
import SuperFlo from 0xa5a0ef4be9f25990
import NonFungibleToken from 0x631e88ae7f1d7c20
import SeperNFTMarketplace from 0xa5a0ef4be9f25990

pub fun main(account: Address): {UInt64: SeperNFTMarketplace.SaleItem} {
  let saleCollection = getAccount(account).getCapability(/public/MySaleCollection)
                        .borrow<&SeperNFTMarketplace.SaleCollection{SeperNFTMarketplace.SaleCollectionPublic}>()
                        ?? panic("Could not borrow the user's SaleCollection")

  let collection = getAccount(account).getCapability(/public/SuperCoolCollection) 
                    .borrow<&SuperFlo.Collection{NonFungibleToken.CollectionPublic, SuperFlo.CollectionPublic}>()
                    ?? panic("Can't get the User's collection.")

  let saleIDs = saleCollection.getIDs()

  let returnVals: {UInt64: SeperNFTMarketplace.SaleItem} = {}

  for saleID in saleIDs {
    let price = saleCollection.getPrice(id: saleID)
    let nftRef = collection.borrowEntireNFT(id: saleID)

    returnVals.insert(key: nftRef.id, SeperNFTMarketplace.SaleItem(_price: price, _nftRef: nftRef))
  }

  return returnVals
}
`