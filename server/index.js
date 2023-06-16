const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const {secp256k1} = require('ethereum-cryptography/secp256k1')
const{toHex} = require('ethereum-cryptography/utils')
const {hexToBytes} = require('ethereum-cryptography/utils')

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
  const {hash, signature, publicAdress,recipient,amount } = req.body
  signature.r = BigInt(signature.r);
	signature.s = BigInt(signature.s);
  if(balances[publicAdress] < amount){
    const error = new Error ("insuffcient balance")
    throw error
  }
  
  console.log(balances[recipient])
  console.log(publicAdress)
  
  

  setInitialBalance(publicAdress);
  setInitialBalance(recipient);

  if (balances[publicAdress] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[publicAdress] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[publicAdress] });
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
