export const mintNFTFLow = `
import SuperCool from 0xf7d3f70bbca64a11

transaction(ipfsHash: String, name: String) {

  prepare(acct: AuthAccount) {
    let collection = acct.borrow<&SuperCool.Collection>(from: /storage/SuperCoolCollection)
                        ?? panic("This collection does not exist here")

    let nft <- SuperCool.createToken(ipfsHash: ipfsHash, metadata: {"name": name})

    collection.deposit(token: <- nft)
  }

  execute {
    log("A user minted an NFT into their account")
  }
}
`