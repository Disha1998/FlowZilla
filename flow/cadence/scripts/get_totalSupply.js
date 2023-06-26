export const getTotalTokenSupply = `
import SuperFlo from 0xa5a0ef4be9f25990

pub fun main(): UInt64 {
  return SuperFlo.totalSupply
}
`