export const getNFTsScript = `
import superflo1 from 0x4afc162bce5d7fb4
import NonFungibleToken from 0x631e88ae7f1d7c20

pub fun main(account: Address): [&superflo1.NFT] {
  let collection = getAccount(account).getCapability(/public/SuperCoolCollection)
                    .borrow<&superflo1.Collection{NonFungibleToken.CollectionPublic, superflo1.CollectionPublic}>()
                    ?? panic("Can't get the User's collection.")

  let returnVals: [&superflo1.NFT] = []

  let ids = collection.getIDs()
  for id in ids {
    returnVals.append(collection.borrowEntireNFT(id: id))
  }

  return returnVals
}
`