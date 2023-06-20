export const getSaleNFTsScript = `
import SuperCool from 0x71bbd2f430c9b437
import NonFungibleToken from 0x631e88ae7f1d7c20
import NFTMarketplace from 0x71bbd2f430c9b437

pub fun main(account: Address): {UInt64: NFTMarketplace.SaleItem} {
  let saleCollection = getAccount(account).getCapability(/public/MySaleCollection)
                        .borrow<&NFTMarketplace.SaleCollection{NFTMarketplace.SaleCollectionPublic}>()
                        ?? panic("Could not borrow the user's SaleCollection")

  let collection = getAccount(account).getCapability(/public/SuperCoolCollection) 
                    .borrow<&SuperCool.Collection{NonFungibleToken.CollectionPublic, SuperCool.CollectionPublic}>()
                    ?? panic("Can't get the User's collection.")

  let saleIDs = saleCollection.getIDs()

  let returnVals: {UInt64: NFTMarketplace.SaleItem} = {}

  for saleID in saleIDs {
    let price = saleCollection.getPrice(id: saleID)
    let nftRef = collection.borrowEntireNFT(id: saleID)

    returnVals.insert(key: nftRef.id, NFTMarketplace.SaleItem(_price: price, _nftRef: nftRef))
  }

  return returnVals
}
`