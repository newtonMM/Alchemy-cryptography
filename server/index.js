const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const {secp256k1} = require('ethereum-cryptography/secp256k1')
const{toHex} = require('ethereum-cryptography/utils')
const {hexToBytes, utf8ToBytes,bytesToHex, } = require('ethereum-cryptography/utils')

app.use(cors());
app.use(express.json());

const balances = {
  "0375f8d36edd5eaae19994ecbd1f6dc83ab7d58413317fdb15930cd292c22f202c": 100,
  "026ea971837d699a70dcd929e10788832bd99ee402361bf101fe8ab34e257988e1": 50,
  "0277bcc760447f20e2d4e8e5539bef287da628f65fbe743ab9122c055afbf80e15": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  console.log(address)
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const {hash, signature,privateKey,recipient,amount } = req.body
  console.log(signature)
  signature.r = BigInt(signature.r);
	signature.s = BigInt(signature.s);

  secp256k1.verify(signature,)
  console.log(signature)
  const publicKey = toHex(Buffer.from(secp256k1.getPublicKey(privateKey)))
// const BytespublicKey = utf8ToBytes(publicKey)
console.log(publicKey)

 
  if(balances[publicKey] < amount){
    const error = new Error ("insuffcient balance")
    throw error
  }
  
  console.log(balances[recipient])
  console.log(publicKey)
  const pbKey = secp256k1.getPublicKey(privateKey)
  
  

  setInitialBalance(publicKey);
  setInitialBalance(recipient);

  if (balances[publicKey] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[publicKey] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[publicKey] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
