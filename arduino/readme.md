# Arduino code

We tried to make the architecture of the wallet modular such that if you want to use hardware different from what we assume, you could do it with as little efford as possible.

Arduino sketch is splitted into parts:

- Main sketch ([`hardware_wallet.ino`](./hardware_wallet/hardware_wallet.ino))
- Config file ([`config.h`](./hardware_wallet/config.h))
- User interface ([`ui.h`](./hardware_wallet/ui.h) and [`ui.cpp`](./hardware_wallet/ui.cpp))
- Communication with the host ([`host.h`](./hardware_wallet/host.h) and [`host.cpp`](./hardware_wallet/host.cpp))
- Storage ([`storage.h`](./hardware_wallet/storage.h) and [`storage.cpp`](./hardware_wallet/storage.cpp))
- Wallet logic ([`wallet.h`](./hardware_wallet/wallet.h) and [`wallet.cpp`](./hardware_wallet/wallet.cpp))

We plan to support different hardware, some of them are already supported.

Possible user interfaces:

- [x] Serial communication (any type of Stream should work)
- [x] OLED + buttons
- [ ] Touchscreen

Possible communication channels with the host:

- [x] Serial communication with hex commands (also any type of Stream)
- [ ] Serial communication with binary commands
- [ ] Bluetooth communication (should be adapted due to buffer limits)

Storage options:

- [x] SD card
- [ ] Secure key storage chip
- [ ] EEPROM (what 32-bit MCU have EEPROM?)

Wallet logic:

- [x] one master HD key with 3 derived hd wallets - bip 44, 49, 84

Ideally if you are using one of the options above you just need to edit [config.h](./hardware_wallet/config.h) file and you are good to go. If you are using custom hardware just write corresponding classes.
