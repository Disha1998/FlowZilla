export const getSaleNFTsScript = `
import superflo1 from 0x4afc162bce5d7fb4
import NonFungibleToken from 0x631e88ae7f1d7c20
import supermarketplace1 from 0x4afc162bce5d7fb4

pub fun main(account: Address): {UInt64: supermarketplace1.SaleItem} {
  let saleCollection = getAccount(account).getCapability(/public/MySaleCollection)
                        .borrow<&supermarketplace1.SaleCollection{supermarketplace1.SaleCollectionPublic}>()
                        ?? panic("Could not borrow the user's SaleCollection")

  let collection = getAccount(account).getCapability(/public/SuperCoolCollection) 
                    .borrow<&superflo1.Collection{NonFungibleToken.CollectionPublic, superflo1.CollectionPublic}>()
                    ?? panic("Can't get the User's collection.")

  let saleIDs = saleCollection.getIDs()

  let returnVals: {UInt64: supermarketplace1.SaleItem} = {}

  for saleID in saleIDs {
    let price = saleCollection.getPrice(id: saleID)
    let nftRef = collection.borrowEntireNFT(id: saleID)

    returnVals.insert(key: nftRef.id, supermarketplace1.SaleItem(_price: price, _nftRef: nftRef))
  }

  return returnVals
}
`