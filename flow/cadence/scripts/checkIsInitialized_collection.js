import * as fcl from "@onflow/fcl";

// export async function checkIsInitialized(addr) {
//     return fcl.query({
//       cadence: IS_INITIALIZED,
//       args: (arg, t) => [arg(addr, t.Address)],
//     });
//   }



export const checkIsInitialized = `

import SuperFlo from 0xa5a0ef4be9f25990

pub fun main(account: Address): Bool {
    let capability = getAccount(account).getCapability<&SuperFlo.Collection{SuperFlo.CollectionPublic}>(/public/SuperCoolCollection)
    return capability.check()
}
`;

