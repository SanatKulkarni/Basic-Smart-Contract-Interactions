// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Election {
    address public owner;
    bool public isVotingOpen;
    
    struct Candidate {
        string name;
        uint256 voteCount;
    }
    
    Candidate[] public candidates;
    mapping(address => bool) public hasVoted;
    
    event Voted(address indexed voter, uint256 indexed candidateIndex);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }
    
    modifier onlyDuringVoting() {
        require(isVotingOpen, "Voting is closed");
        _;
    }
    
    constructor(string[] memory candidateNames) {
        owner = msg.sender;
        isVotingOpen = true;
        
        for (uint256 i = 0; i < candidateNames.length; i++) {
            candidates.push(Candidate(candidateNames[i], 0));
        }
    }
    
    function getCandidateCount() public view returns (uint) {
    return candidates.length;
    }


    function closeVoting() public onlyOwner {
        isVotingOpen = false;
    }
    
    function vote(uint256 candidateIndex) public onlyDuringVoting {
        require(candidateIndex < candidates.length, "Invalid candidate index");
        require(!hasVoted[msg.sender], "You have already voted");
        
        candidates[candidateIndex].voteCount++;
        hasVoted[msg.sender] = true;
        
        emit Voted(msg.sender, candidateIndex);
    }
    
    function getWinner() public view returns (string memory winnerName, uint256 winnerVotes) {
        uint256 maxVotes = 0;
        uint256 winnerIndex = 0;
        
        for (uint256 i = 0; i < candidates.length; i++) {
            if (candidates[i].voteCount > maxVotes) {
                maxVotes = candidates[i].voteCount;
                winnerIndex = i;
            }
        }
        
        return (candidates[winnerIndex].name, candidates[winnerIndex].voteCount);
    }
}
