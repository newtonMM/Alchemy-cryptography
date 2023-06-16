import { useState } from "react";
import server from "./server";
import {secp256k1} from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak"
import { utf8ToBytes } from "ethereum-cryptography/utils"
import {toHex} from "ethereum-cryptography/utils"


function Transfer({ address, setBalance,privateAdd }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
 

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();
    const message ={
      amount:sendAmount,
      privateKey: recipient
    }
  
 const hash = await hashMessage(message)
 const signature = secp256k1.sign(hash, privateAdd)
 const pubAdd = signature.recoverPublicKey(hash).toHex()

    const transaction ={
      hash:hash,
      signature:JSON.parse(JSON.stringify(signature, (key, value) => typeof value === 'bigint' ? value.toString() : value)),
      publicAdress:pubAdd,
      recipient:recipient,
      amount:sendAmount
    }

    try {
      const {
        data: { balance },
      } = 
      await server.post(`send`, transaction
       
      );
      setBalance(balance);
    } catch (ex) {
      // console.log(ex)
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;

function hashMessage (message){
  const hashMes = keccak256(Uint8Array.from(message))
  return toHex(hashMes)


}