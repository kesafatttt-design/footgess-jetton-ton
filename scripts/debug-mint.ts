// @ts-ignore
const { ExtendedJettonMinter } = require("../wrappers/ExtendedJettonMinter")
// @ts-ignore
const { JettonMinter } = require("../output/Jetton_JettonMinter")

async function main() {
    console.log("=== Available methods on ExtendedJettonMinter ===")
    console.log(Object.getOwnPropertyNames(ExtendedJettonMinter.prototype))
    console.log("\n=== Static methods ===")
    console.log(Object.getOwnPropertyNames(ExtendedJettonMinter))
    
    console.log("\n=== Available methods on JettonMinter (output) ===")
    console.log(Object.getOwnPropertyNames(JettonMinter.prototype))
    console.log("\n=== Static methods ===")
    console.log(Object.getOwnPropertyNames(JettonMinter))
}

main().catch(console.error)