export const getNFTsScript = `
import SuperCool from 0x71bbd2f430c9b437
import NonFungibleToken from 0x631e88ae7f1d7c20

pub fun main(account: Address): [&SuperCool.NFT] {
  let collection = getAccount(account).getCapability(/public/SuperCoolCollection)
                    .borrow<&SuperCool.Collection{NonFungibleToken.CollectionPublic, SuperCool.CollectionPublic}>()
                    ?? panic("Can't get the User's collection.")

  let returnVals: [&SuperCool.NFT] = []

  let ids = collection.getIDs()
  for id in ids {
    returnVals.append(collection.borrowEntireNFT(id: id))
  }

  return returnVals
}
`