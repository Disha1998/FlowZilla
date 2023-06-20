import * as fcl from "@onflow/fcl";
import * as types from "@onflow/types";

fcl
  .config()
  .put("app.detail.title", "SuperCool")
  .put(
    "app.detail.icon",
    "https://assets-global.website-files.com/5f734f4dbd95382f4fdfa0ea/6395e6749db8fe00a41cc279_flow-flow-logo.svg"
  )
  .put("accessNode.api", "https://access-testnet.onflow.org")
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")
  .put("0xDeployer", process.env.deployerAddress)
  .put("0xStandard", process.env.standardAddress);
