export const getNFTsScript = `
import SuperFlo from 0xa5a0ef4be9f25990
import NonFungibleToken from 0x631e88ae7f1d7c20

pub fun main(account: Address): [&SuperFlo.NFT] {
  let collection = getAccount(account).getCapability(/public/SuperCoolCollection)
                    .borrow<&SuperFlo.Collection{NonFungibleToken.CollectionPublic, SuperFlo.CollectionPublic}>()
                    ?? panic("Can't get the User's collection.")

  let returnVals: [&SuperFlo.NFT] = []

  let ids = collection.getIDs()
  for id in ids {
    returnVals.append(collection.borrowEntireNFT(id: id))
  }

  return returnVals
}
`