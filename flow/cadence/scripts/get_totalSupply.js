export const getTotalTokenSupply = `
import superflo1 from 0x4afc162bce5d7fb4

pub fun main(): UInt64 {
  return superflo1.totalSupply
}
`