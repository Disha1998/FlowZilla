export const getNFTsScript = `
<<<<<<< HEAD
import SuperCool from 0x659c3f9aa8deed5b
=======
import SuperCool from 0xf7d3f70bbca64a11
>>>>>>> dhruv
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