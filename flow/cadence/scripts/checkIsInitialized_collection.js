import * as fcl from "@onflow/fcl";

// export async function checkIsInitialized(addr) {
//     return fcl.query({
//       cadence: IS_INITIALIZED,
//       args: (arg, t) => [arg(addr, t.Address)],
//     });
//   }



export const checkIsInitialized = `

import superflo1 from 0x4afc162bce5d7fb4

pub fun main(account: Address): Bool {
    let capability = getAccount(account).getCapability<&superflo1.Collection{superflo1.CollectionPublic}>(/public/SuperCoolCollection)
    return capability.check()
}
`;

