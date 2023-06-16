import server from "./server";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";

function Wallet({
  address,
  setAddress,
  balance,
  setBalance,
  privateKey,
  setPrivateKey,
}) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    const address = toHex(secp256k1.getPublicKey(privateKey));
    setAddress();
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input
          placeholder="Private Key"
          value={privateKey}
          onChange={onChange}
        ></input>
      </label>
      <label>
        Public Key
        <p>{address}</p>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
