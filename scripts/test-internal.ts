// @ts-ignore
const { storeJettonTransferInternal } = require("../output/Jetton_JettonMinter")

async function main() {
    console.log("=== storeJettonTransferInternal ===")
    console.log(storeJettonTransferInternal.toString())
}

main().catch(console.error)