const contractAddress = "ENTER_YOUR_CONTRACT_ADDRESS";
const contractAbi = "./sampleAbi.json";

let infoSpace;
let web3;
let contract;
let account;

window.addEventListener("load", () => {
  infoSpace = document.querySelector(".info");

  document.querySelector(".start").addEventListener("click", async () => {
    if (contractAddress === "" || contractAbi === "") {
      printResult(
        `Make sure to set the variables contractAddress and contractAbi in ./index.js first. Check out README.md for more info.`
      );
      return;
    }

    if (typeof ethereum === "undefined") {
      printResult(
        `Metamask not connected. Make sure you have the Metamask plugin, you are logged in to your MetaMask account, and you are using a server or a localhost (simply opening the html in a browser won't work).`
      );
      return;
    }

    web3 = new Web3(window.ethereum);

    await connectWallet();
    await connectContract(contractAbi, contractAddress);
    await getBalance(account);
    await balanceOf(account);
    const transferAmount = web3.utils.toWei("1");
    listenToTransferEvent(account, contractAddress, transferAmount);
    await transfer(contractAddress, transferAmount);
  });
});

const printResult = (text) => {
  infoSpace.innerHTML += `<li>${text}</li>`;
};

const readableAddress = (address) => {
  return `${address.slice(0, 5)}...${address.slice(address.length - 4)}`;
};

const getJson = async (path) => {
  const response = await fetch(path);
  const data = await response.json();
  return data;
};

const connectWallet = async () => {
  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  account = accounts[0];
  printResult(`Connected account: ${readableAddress(account)}`);
};

