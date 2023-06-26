import * as fcl from "@onflow/fcl";

// export async function checkIsInitialized(addr) {
//     return fcl.query({
//       cadence: IS_INITIALIZED,
//       args: (arg, t) => [arg(addr, t.Address)],
//     });
//   }



export const checkIsInitialized = `

import SuperCool from 0xf7d3f70bbca64a11

pub fun main(account: Address): Bool {
    let capability = getAccount(account).getCapability<&SuperCool.Collection{SuperCool.CollectionPublic}>(/public/SuperCoolCollection)
    return capability.check()
}
`;

