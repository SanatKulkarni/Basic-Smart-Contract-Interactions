
document.addEventListener("DOMContentLoaded", async () => {
    if (typeof web3 !== "undefined") {
        web3 = new Web3(window.ethereum);
        await window.eth_requestAccounts;
    } else {
        console.log("No web3 detected. Please use MetaMask or a compatible browser wallet.");
        return;
    }

    const contractAddress = "ENTER_YOUR_CONTRACT_ADDRESS"; 
    const contractAbi = [
        {
            "inputs": [
                {
                    "internalType": "string[]",
                    "name": "candidateNames",
                    "type": "string[]"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "voter",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "candidateIndex",
                    "type": "uint256"
                }
            ],
            "name": "Voted",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "candidates",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "voteCount",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "closeVoting",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getCandidateCount",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getWinner",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "winnerName",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "winnerVotes",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "hasVoted",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "isVotingOpen",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "candidateIndex",
                    "type": "uint256"
                }
            ],
            "name": "vote",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ];

    const electionContract = new web3.eth.Contract(contractAbi, contractAddress);

    const candidateList = document.getElementById("candidateList");
    const candidateSelect = document.getElementById("candidateSelect");
    const voteButton = document.getElementById("voteButton");
    const closeButton = document.getElementById("closeButton");
    const winner = document.getElementById("winner");

    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];

    const getCandidates = async () => {
        const candidateCount = await electionContract.methods.getCandidateCount().call();
        for (let i = 0; i < candidateCount; i++) {
            const candidate = await electionContract.methods.candidates(i).call();
            candidateList.innerHTML += `<li>${candidate.name} - Votes: ${candidate.voteCount}</li>`;
            candidateSelect.innerHTML += `<option value="${i}">${candidate.name}</option>`;
        }
    };

    const refreshCandidates = async () => {
        candidateList.innerHTML = "";
        candidateSelect.innerHTML = "";
        await getCandidates();
    };

    getCandidates();

    voteButton.addEventListener("click", async () => {
        const selectedCandidateIndex = candidateSelect.value;
        await electionContract.methods.vote(selectedCandidateIndex).send({ from: account });
        refreshCandidates();
    });

    closeButton.addEventListener("click", async () => {
        await electionContract.methods.closeVoting().send({ from: account });
        winner.textContent = "Voting closed!";
    });

    winner.addEventListener("click", async () => {
        const winnerInfo = await electionContract.methods.getWinner().call();
        winner.textContent = `Winner: ${winnerInfo[0]} with ${winnerInfo[1]} votes`;
    });
});
