// @ts-ignore
const { Mint, MintMessage, storeMint } = require("../output/Jetton_JettonMinter")

async function main() {
    console.log("=== Mint type ===")
    console.log(Mint)
    console.log("\n=== MintMessage type ===")
    console.log(MintMessage)
    console.log("\n=== storeMint function ===")
    console.log(storeMint.toString())
}

main().catch(console.error)