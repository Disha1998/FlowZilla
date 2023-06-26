export const mintNFTFLow = `
import SuperFlo from 0xa5a0ef4be9f25990

transaction(ipfsHash: String, name: String) {

  prepare(acct: AuthAccount) {
    let collection = acct.borrow<&SuperFlo.Collection>(from: /storage/SuperCoolCollection)
                        ?? panic("This collection does not exist here")

    let nft <- SuperFlo.createToken(ipfsHash: ipfsHash, metadata: {"name": name})

    collection.deposit(token: <- nft)
  }

  execute {
    log("A user minted an NFT into their account")
  }
}
`