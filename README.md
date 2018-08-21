# Simple hardware wallet for Arduino

A minimalistic hardware wallet working with electrum transactions.

This sketch is a simple demo that shows how to use [arduino-bitcoin](https://github.com/arduino-bitcoin/arduino-bitcoin) library to build your own hardware wallet.

It should be used only for educational or testing purposes as default Arduino boards are not secure, their firmware can be updated from the computer and this process doesn't require any user interaction.

A manual on how to make it more secure will follow.

## Required hardware

- [Adafruit M0 Adalogger board with SD card](https://www.adafruit.com/product/2796)
- [Adafruit OLED screen](https://www.adafruit.com/product/2900)
- [Headers](https://www.adafruit.com/product/2886)
- Soldering station to solder the headers and pins
- USB cable
- SD card (16 GB or less work fine, not sure about larger)

If you don't have an OLED screen you can try it out with [serial only wallet](./arduino/serial_only_wallet/serial_only_wallet.ino).

## Uploading firmware

Follow the manuals from Adafruit to set up the board and OLED screen:

- [Adding the board to Arduino IDE](https://learn.adafruit.com/adafruit-feather-m0-adalogger/setup)
- [Installing OLED library](https://learn.adafruit.com/adafruit-oled-featherwing/featheroled-library)
- Install [arduino-bitcoin](https://github.com/arduino-bitcoin/arduino-bitcoin) library
- Upload [the sketch](./arduino/hardware_wallet/hardware_wallet.ino) to the board

## Setting up

Put a `xprv.txt` file on the SD card with your xprv key (for testnet it will start with tprv). You can generate one [here](https://iancoleman.io/bip39/).

Communication with the wallet happens over USB. Open Serial Monitor in the Arduino IDE and type commands.

Keys are stored UNENCRYPTED AS A PLAIN TEXT on SD card.

Available commands:

- `xpub` - returns a master public key that you can import to electrum or any other watch-only wallet
- `addr <n>`, for example `addr 5` - returns a receiving address derived from xpub `/0/n/`, also shows it on the OLED screen
- `changeaddr <n>` - returns a change address derived from xpub `/1/n/` and shows it on the OLED screen
- `sign_tx <unsigned_tx_from_electrum>` - parses unsigned transaction, asks user for confirmation showing outputs one at a time. User can scroll to another output with button B, confirm with button A and cancel with button C. If user confirmed, wallet will sign a transaction and send it back via serial in hex format. This transaction can be broadcasted to the network from electrum console using `broadcast("<signed_tx>")` command or just go to [blockcypher](https://live.blockcypher.com/btc-testnet/pushtx/) and broadcast it there.

## Future development

This sketch will evolve, we would love to add:

- native segwit and segwit nested in p2sh support
- generation of a new key
- encryption of the key on the SD card
- mnemonic support
- [PSBT](https://github.com/bitcoin/bips/blob/master/bip-0174.mediawiki) support
- multisig support
- electrum plugin
