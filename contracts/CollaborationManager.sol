// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
@title CollaborationManager
@dev Manages collaborative comic projects and permissions
*/
contract CollaborationManager is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    constructor() Ownable(msg.sender) {}

    // Events
    event ProjectCreated(uint256 indexed projectId, address indexed creator, string title);
    event CollaboratorInvited(uint256 indexed projectId, address indexed collaborator, string role);
    event InvitationAccepted(uint256 indexed projectId, address indexed collaborator);
    event VoteCreated(uint256 indexed projectId, uint256 indexed voteId, string description);
    event VoteCast(uint256 indexed projectId, uint256 indexed voteId, address indexed voter, bool vote);
    event VoteExecuted(uint256 indexed projectId, uint256 indexed voteId, bool result);
    event RevenueShareUpdated(uint256 indexed projectId, address indexed collaborator, uint256 newShare);

    // Enums
    enum ProjectStatus { Active, Paused, Completed, Cancelled }
    enum InvitationStatus { Pending, Accepted, Rejected }
    enum VoteStatus { Active, Executed, Expired }
    enum Permission { Read, Write, Admin, Vote }

    // Structs
    struct Project {
        string title;
        string description;
        address creator;
        ProjectStatus status;
        uint256 createdAt;
        uint256 collaboratorCount;
        mapping(address => bool) isCollaborator;
        address[] collaboratorList;
    }

    struct Collaborator {
        address collaboratorAddress;
        string role;
        uint256 revenueShare;
        mapping(Permission => bool) permissions;
        InvitationStatus invitationStatus;
        uint256 joinedAt;
    }

    struct Vote {
        string description;
        string proposalData;
        address proposer;
        uint256 createdAt;
        uint256 expiresAt;
        VoteStatus status;
        uint256 yesVotes;
        uint256 noVotes;
        mapping(address => bool) hasVoted;
        mapping(address => bool) vote;
    }

    Counters.Counter private _projectIdCounter;
    Counters.Counter private _voteIdCounter;

    mapping(uint256 => Project) public projects;
    mapping(uint256 => mapping(address => Collaborator)) public collaborators;
    mapping(uint256 => mapping(uint256 => Vote)) public votes;
    mapping(uint256 => uint256[]) public projectVotes;
    mapping(address => uint256[]) public userProjects;

    uint256 public constant VOTE_DURATION = 7 days;
    uint256 public constant MIN_VOTE_THRESHOLD = 51;

    modifier onlyProjectCreator(uint256 projectId) {
        require(projects[projectId].creator == msg.sender, "Not project creator");
        _;
    }

    modifier onlyCollaborator(uint256 projectId) {
        require(projects[projectId].isCollaborator[msg.sender], "Not a collaborator");
        _;
    }

    modifier hasPermission(uint256 projectId, Permission permission) {
        require(
            projects[projectId].creator == msg.sender ||
            collaborators[projectId][msg.sender].permissions[permission],
            "Insufficient permissions"
        );
        _;
    }

    modifier validProject(uint256 projectId) {
        require(projectId < _projectIdCounter.current(), "Invalid project ID");
        _;
    }

    modifier activeProject(uint256 projectId) {
        require(projects[projectId].status == ProjectStatus.Active, "Project not active");
        _;
    }

    function createProject(string memory title, string memory description) public returns (uint256) {
        require(bytes(title).length > 0, "Title required");

        uint256 projectId = _projectIdCounter.current();
        _projectIdCounter.increment();

        Project storage project = projects[projectId];
        project.title = title;
        project.description = description;
        project.creator = msg.sender;
        project.status = ProjectStatus.Active;
        project.createdAt = block.timestamp;

        userProjects[msg.sender].push(projectId);

        emit ProjectCreated(projectId, msg.sender, title);
        return projectId;
    }

    function inviteCollaborator(
        uint256 projectId,
        address collaboratorAddress,
        string memory role,
        uint256 revenueShare,
        Permission[] memory permissions
    ) public validProject(projectId) hasPermission(projectId, Permission.Admin) {
        require(collaboratorAddress != address(0), "Invalid collaborator address");
        require(!projects[projectId].isCollaborator[collaboratorAddress], "Already a collaborator");
        require(revenueShare <= 10000, "Invalid revenue share");

        Collaborator storage collaborator = collaborators[projectId][collaboratorAddress];
        collaborator.collaboratorAddress = collaboratorAddress;
        collaborator.role = role;
        collaborator.revenueShare = revenueShare;
        collaborator.invitationStatus = InvitationStatus.Pending;

        for (uint256 i = 0; i < permissions.length; i++) {
            collaborator.permissions[permissions[i]] = true;
        }

        emit CollaboratorInvited(projectId, collaboratorAddress, role);
    }

    function acceptInvitation(uint256 projectId) public validProject(projectId) {
        Collaborator storage collaborator = collaborators[projectId][msg.sender];
        require(collaborator.invitationStatus == InvitationStatus.Pending, "No pending invitation");

        collaborator.invitationStatus = InvitationStatus.Accepted;
        collaborator.joinedAt = block.timestamp;

        projects[projectId].isCollaborator[msg.sender] = true;
        projects[projectId].collaboratorList.push(msg.sender);
        projects[projectId].collaboratorCount++;

        userProjects[msg.sender].push(projectId);

        emit InvitationAccepted(projectId, msg.sender);
    }

    function rejectInvitation(uint256 projectId) public validProject(projectId) {
        Collaborator storage collaborator = collaborators[projectId][msg.sender];
        require(collaborator.invitationStatus == InvitationStatus.Pending, "No pending invitation");

        collaborator.invitationStatus = InvitationStatus.Rejected;
    }

    function createVote(
        uint256 projectId,
        string memory description,
        string memory proposalData
    ) public validProject(projectId) hasPermission(projectId, Permission.Vote) returns (uint256) {
        require(bytes(description).length > 0, "Description required");

        uint256 voteId = _voteIdCounter.current();
        _voteIdCounter.increment();

        Vote storage vote = votes[projectId][voteId];
        vote.description = description;
        vote.proposalData = proposalData;
        vote.proposer = msg.sender;
        vote.createdAt = block.timestamp;
        vote.expiresAt = block.timestamp + VOTE_DURATION;
        vote.status = VoteStatus.Active;

        projectVotes[projectId].push(voteId);

        emit VoteCreated(projectId, voteId, description);
        return voteId;
    }

    function castVote(uint256 projectId, uint256 voteId, bool voteChoice)
        public validProject(projectId) onlyCollaborator(projectId)
    {
        Vote storage vote = votes[projectId][voteId];
        require(vote.status == VoteStatus.Active, "Vote not active");
        require(block.timestamp < vote.expiresAt, "Vote expired");
        require(!vote.hasVoted[msg.sender], "Already voted");

        vote.hasVoted[msg.sender] = true;
        vote.vote[msg.sender] = voteChoice;

        if (voteChoice) {
            vote.yesVotes++;
        } else {
            vote.noVotes++;
        }

        emit VoteCast(projectId, voteId, msg.sender, voteChoice);
    }

    function executeVote(uint256 projectId, uint256 voteId) public validProject(projectId) {
        Vote storage vote = votes[projectId][voteId];
        require(vote.status == VoteStatus.Active, "Vote not active");
        require(block.timestamp >= vote.expiresAt, "Vote still active");

        uint256 totalVotes = vote.yesVotes + vote.noVotes;
        bool passed = false;

        if (totalVotes > 0) {
            uint256 yesPercentage = (vote.yesVotes * 100) / totalVotes;
            passed = yesPercentage >= MIN_VOTE_THRESHOLD;
        }

        vote.status = VoteStatus.Executed;

        emit VoteExecuted(projectId, voteId, passed);
    }

    function updateRevenueShare(
        uint256 projectId,
        address collaboratorAddress,
        uint256 newShare
    ) public validProject(projectId) hasPermission(projectId, Permission.Admin) {
        require(newShare <= 10000, "Invalid revenue share");
        require(projects[projectId].isCollaborator[collaboratorAddress], "Not a collaborator");

        collaborators[projectId][collaboratorAddress].revenueShare = newShare;

        emit RevenueShareUpdated(projectId, collaboratorAddress, newShare);
    }

    function updateProjectStatus(uint256 projectId, ProjectStatus newStatus)
        public validProject(projectId) onlyProjectCreator(projectId)
    {
        projects[projectId].status = newStatus;
    }

    function grantPermission(
        uint256 projectId,
        address collaboratorAddress,
        Permission permission
    ) public validProject(projectId) hasPermission(projectId, Permission.Admin) {
        require(projects[projectId].isCollaborator[collaboratorAddress], "Not a collaborator");
        collaborators[projectId][collaboratorAddress].permissions[permission] = true;
    }

    function revokePermission(
        uint256 projectId,
        address collaboratorAddress,
        Permission permission
    ) public validProject(projectId) hasPermission(projectId, Permission.Admin) {
        require(projects[projectId].isCollaborator[collaboratorAddress], "Not a collaborator");
        collaborators[projectId][collaboratorAddress].permissions[permission] = false;
    }

    // View Functions

    function getProject(uint256 projectId)
        public view validProject(projectId)
        returns (
            string memory title,
            string memory description,
            address creator,
            ProjectStatus status,
            uint256 createdAt,
            uint256 collaboratorCount
        )
    {
        Project storage project = projects[projectId];
        return (
            project.title,
            project.description,
            project.creator,
            project.status,
            project.createdAt,
            project.collaboratorCount
        );
    }

    function getCollaborator(uint256 projectId, address collaboratorAddress)
        public view
        returns (
            string memory role,
            uint256 revenueShare,
            InvitationStatus invitationStatus,
            uint256 joinedAt
        )
    {
        Collaborator storage collaborator = collaborators[projectId][collaboratorAddress];
        return (
            collaborator.role,
            collaborator.revenueShare,
            collaborator.invitationStatus,
            collaborator.joinedAt
        );
    }

    function checkPermission(
        uint256 projectId,
        address collaboratorAddress,
        Permission permission
    ) public view validProject(projectId) returns (bool) {
        if (projects[projectId].creator == collaboratorAddress) {
            return true;
        }
        return collaborators[projectId][collaboratorAddress].permissions[permission];
}


    function getVote(uint256 projectId, uint256 voteId)
        public view
        returns (
            string memory description,
            address proposer,
            uint256 createdAt,
            uint256 expiresAt,
            VoteStatus status,
            uint256 yesVotes,
            uint256 noVotes
        )
    {
        Vote storage vote = votes[projectId][voteId];
        return (
            vote.description,
            vote.proposer,
            vote.createdAt,
            vote.expiresAt,
            vote.status,
            vote.yesVotes,
            vote.noVotes
        );
    }

    function getProjectCollaborators(uint256 projectId)
        public view validProject(projectId)
        returns (address[] memory)
    {
        return projects[projectId].collaboratorList;
    }

    function getProjectVotes(uint256 projectId)
        public view validProject(projectId)
        returns (uint256[] memory)
    {
        return projectVotes[projectId];
    }

    function getUserProjects(address user) public view returns (uint256[] memory) {
        return userProjects[user];
    }

    function getTotalProjects() public view returns (uint256) {
        return _projectIdCounter.current();
    }
}
