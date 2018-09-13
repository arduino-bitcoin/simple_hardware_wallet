import bitcoin from 'bitcoinjs-lib';

function clean(str){
  return str.replace(/[^0-9a-z]/gi, '');
}

class InsightAPI {
  constructor(options){
    let defaults = {
      url: "https://test-insight.bitpay.com/api/",
      network: bitcoin.networks.testnet,
    };
    Object.assign(this, defaults, options);
  }

  async balance(address){
    let result = await fetch(this.url + "addr/" + address);
    let json = await result.json();
    return json.balanceSat + json.unconfirmedBalanceSat;
  }

  async transactions(address){
    let result = await fetch(this.url + "addr/" + address);
    let json = await result.json();
    return json.transactions;
  }

  async transactionDetails(transactionId){
    let result = await fetch(this.url + "tx/" + transactionId);
    let json = await result.json();
    return json;
  }

  async utxo(address){
    let result = await fetch(this.url + "addr/" + address + "/utxo");
    let json = await result.json();
    return json;
  }

  async buildTx(my_address, address, amount, fee = 1500){
    // cleaning up random characters
    address = clean(address);
    my_address = clean(my_address);

    let builder = new bitcoin.TransactionBuilder(this.network);

    let utxo = await this.utxo(my_address);
    let total = 0;
    for(let i = 0; i < utxo.length; i++){
      let tx = utxo[i];
      total += tx.satoshis;
      builder.addInput(tx.txid, tx.vout);
      if(total > amount+fee){
        break;
      }
    }
    if(total < amount+fee){
      throw "Not enough funds";
    }
    console.log(address, amount, address.length);
    console.log(my_address, total - amount - fee, my_address.length);

    builder.addOutput(address, amount);
    builder.addOutput(my_address, total - amount - fee); // change
    return builder.buildIncomplete().toHex()
  }

  async broadcast(tx){
    tx = clean(tx);
    console.log("broadcasting tx:", tx);
    const result = await fetch(this.url + "tx/send", {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin", // include, same-origin, *omit
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        redirect: "follow",
        referrer: "no-referrer",
        body: JSON.stringify({ rawtx: tx }),
    })
    const text = await result.text();
    console.log(text);
  }
}

export default InsightAPI;
