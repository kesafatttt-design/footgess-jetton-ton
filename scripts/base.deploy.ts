//  SPDX-License-Identifier: MIT
//  Copyright :copyright: 2025 TON Studio

import { toNano, TonClient, WalletContractV4, internal } from "@ton/ton"
import { mnemonicToPrivateKey } from "@ton/crypto"
import { buildJettonMinterFromEnv } from "../utils/jetton-helpers"
import { printSeparator } from "../utils/print"
import "dotenv/config"

const main = async () => {
    // خواندن ۲۴ کلمه از .env
    const mnemonics = process.env.MNEMONICS
    
    if (!mnemonics) {
        console.error("Mnemonics is not provided in .env")
        throw new Error("Mnemonics is not provided")
    }

    // پاک کردن علامت کوتیشن و فاصله‌های اضافی
    const cleanMnemonics = mnemonics.replace(/["']/g, "").trim()
    console.log(":memo: Mnemonic words:", cleanMnemonics.split(" ").length)

    const client = new TonClient({
        endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
        apiKey: "b6ff1a02b95caf3cc59de99aeee29061cf73fb7580d6893ba90286593506c8cf",
    })

    const keyPair = await mnemonicToPrivateKey(cleanMnemonics.split(/\s+/))

    // :white_check_mark: استفاده از V4 (همون آدرسی که 2 TON داره)
    const wallet = WalletContractV4.create({
        workchain: 0,
        publicKey: keyPair.publicKey,
    })

    const walletContract = client.open(wallet)
    console.log(":round_pushpin: Wallet Address:", wallet.address.toString())
    console.log(":bulb: باید EQB2FYfg4JlGLM699vDu7gRZSk59Fn5t7X42GCOyT3Uy_1eE باشد")
    
    const seqno = await walletContract.getSeqno()
    console.log(":bar_chart: Current Seqno:", seqno)

    console.log("🛠 Building Jetton Minter...")
    const jettonMinter = await buildJettonMinterFromEnv(wallet.address, "base")
    
    console.log(":round_pushpin: Jetton Minter Address (will be):", jettonMinter.address.toString())

    printSeparator()
    console.log(":outbox_tray: Deploying Jetton Minter...")

    await walletContract.sendTransfer({
        seqno: seqno,
        secretKey: keyPair.secretKey,
        messages: [
            internal({
                to: jettonMinter.address,
                value: toNano("0.2"),
                init: jettonMinter.init,
                bounce: false,
            })
        ],
    })

    printSeparator()
    console.log(":white_check_mark: Deploy transaction sent successfully!")
    console.log(":link: Explorer Link:")
    console.log("https://testnet.tonscan.org/address/" + jettonMinter.address.toString())
}

main().catch(console.error)