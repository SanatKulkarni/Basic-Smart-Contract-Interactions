document.addEventListener('DOMContentLoaded', async () => {
    if (typeof web3 !== 'undefined') {
        web3 = new Web3(window.ethereum);
    } else {
        console.error("No web3 provider found. Please install MetaMask.");
        return;
    }

    const contractAddress = '0xCC272B2C4a5Bb080CE7ab6e7F945d06F45300461';
    const contractABI = [
        {
            "inputs": [],
            "name": "get",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "pure",
            "type": "function"
        }
    ];

    const contract = new web3.eth.Contract(contractABI, contractAddress);

    const getMessageButton = document.getElementById('getMessageButton');
    const messageElement = document.getElementById('message');

    getMessageButton.addEventListener('click', async () => {
        try {
            const message = await contract.methods.get().call();
            messageElement.textContent = message;
        } catch (error) {
            console.error(error);
        }
    });
});
