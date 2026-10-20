import { toNano, TonClient, WalletContractV4, Address, beginCell, internal } from "@ton/ton"
import { mnemonicToPrivateKey } from "@ton/crypto"
import "dotenv/config"

// @ts-ignore
const { ExtendedJettonMinter } = require("../wrappers/ExtendedJettonMinter")

async function main() {
    const mnemonics = process.env.MNEMONICS!.replace(/["']/g, "").trim()
    const API_KEY = "b6ff1a02b95caf3cc59de99aeee29061cf73fb7580d6893ba90286593506c8cf"
    const JETTON_MASTER_ADDRESS = "EQAsvPtrunihEHCmp42a63dTQEYzscpNxcq4b3oNZB17NZWZ"

    const client = new TonClient({
        endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
        apiKey: API_KEY,
        timeout: 60000,
    })

    const keyPair = await mnemonicToPrivateKey(mnemonics.split(/\s+/))
    const wallet = WalletContractV4.create({ workchain: 0, publicKey: keyPair.publicKey })
    const walletContract = client.open(wallet)

    console.log("Wallet:", wallet.address.toString())

    // ?. ”«Œ ‰ ﬁ—«—œ«œ (›ﬁÿ »—«Ì œ” —”Ì »Â  «»⁄ loadMintMessage)
    const jettonMinter = new ExtendedJettonMinter(Address.parse(JETTON_MASTER_ADDRESS))

    // ?. ”«Œ  »œ‰Â ÅÌ«„ »« «” ›«œÂ «“ loadMintMessage ŒÊœ Å—ÊéÂ
    // Å«—«„ —Â«: mintAmount, receiver, sender, responseDestination, forwardTonAmount, forwardPayload
    const body = jettonMinter.loadMintMessage(
        toNano("10"),                 // „ﬁœ«—  Êò‰
        wallet.address,               // êÌ—‰œÂ (ŒÊœ )
        wallet.address,               // sender
        Address.parse(JETTON_MASTER_ADDRESS), // responseDestination (¬œ—” ﬁ—«—œ«œ)
        toNano("0.05"),               // forwardTonAmount
        null                          // forwardPayload
    )

    console.log("Sending transaction to contract...")

    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            const seqno = await walletContract.getSeqno()
            await walletContract.sendTransfer({
                seqno: seqno,
                secretKey: keyPair.secretKey,
                messages: [
                    internal({
                        to: Address.parse(JETTON_MASTER_ADDRESS),
                        value: toNano("0.3"), // ò«—„“œ ò· (0.3 > 0.05)
                        body: body,
                        bounce: true,
                    })
                ],
            })
            console.log("SUCCESS! Mint transaction sent. Wait 30s and check explorer.")
            break;
        } catch (error: any) {
            console.log("Network error (attempt " + attempt + "/3). Waiting 5 seconds...")
            if (attempt === 3) throw error
            await new Promise(r => setTimeout(r, 5000))
        }
    }
}

main().catch(console.error)