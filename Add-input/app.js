
const contractAddress = 'ENTER_YOUR_CONTRACT_ADDRESS';

const abi = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "a",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "b",
				"type": "uint256"
			}
		],
		"name": "addNumbers",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	}
];

const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');
const contract = new web3.eth.Contract(abi, contractAddress);

const addButton = document.getElementById('addButton');
const number1Input = document.getElementById('number1');
const number2Input = document.getElementById('number2');
const resultOutput = document.getElementById('result');

addButton.addEventListener('click', async () => {
    const number1 = Number(number1Input.value);
    const number2 = Number(number2Input.value);

    try {
        const result = await contract.methods.addNumbers(number1, number2).call();
        resultOutput.textContent = `Result: ${result}`;
    } catch (error) {
        console.error(error);
        resultOutput.textContent = 'An error occurred.';
    }
});
