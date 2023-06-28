export const mintNFTFLow = `
import superflo1 from 0x4afc162bce5d7fb4

transaction(ipfsHash: String, name: String) {

  prepare(acct: AuthAccount) {
    let collection = acct.borrow<&superflo1.Collection>(from: /storage/SuperCoolCollection)
                        ?? panic("This collection does not exist here")

    let nft <- superflo1.createToken(ipfsHash: ipfsHash, metadata: {"name": name})

    collection.deposit(token: <- nft)
  }

  execute {
    log("A user minted an NFT into their account")
  }
}
`
