import { Address, toNano } from "@ton/ton"
// @ts-ignore
const { ExtendedJettonMinter } = require("../wrappers/ExtendedJettonMinter")

async function main() {
    const walletAddress = Address.parse("EQB2FYfg4JlGLM699vDu7gRZSk59Fn5t7X42GCOyT3Uy_1eE")

    console.log("Trying to load mint message...")
    try {
        const message = ExtendedJettonMinter.loadMintMessage(
            walletAddress,
            toNano("10"),
            toNano("0.05"),
            null
        )
        console.log("Message built successfully:")
        console.log(message.toString())
    } catch (e: any) {
        console.log("Error building message:", e.message)
    }
}

main().catch(console.error)