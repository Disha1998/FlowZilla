export const mintNFTFLow = `
import SuperCool from 0x659c3f9aa8deed5b

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