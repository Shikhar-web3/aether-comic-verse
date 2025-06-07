
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title CollaborationManager
 * @dev Manages collaborative comic projects and permissions
 * Features:
 * - Multi-creator projects
 * - Permission management
 * - Voting mechanisms
 * - Revenue sharing agreements
 */
contract CollaborationManager is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

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
        uint256 revenueShare; // Basis points (100 = 1%)
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

    // State variables
    Counters.Counter private _projectIdCounter;
    Counters.Counter private _voteIdCounter;

    mapping(uint256 => Project) public projects;
    mapping(uint256 => mapping(address => Collaborator)) public collaborators;
    mapping(uint256 => mapping(uint256 => Vote)) public votes;
    mapping(uint256 => uint256[]) public projectVotes;
    mapping(address => uint256[]) public userProjects;

    uint256 public constant VOTE_DURATION = 7 days;
    uint256 public constant MIN_VOTE_THRESHOLD = 51; // 51% to pass

    // Modifiers
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

    /**
     * @dev Create a new collaborative project
     * @param title Project title
     * @param description Project description
     */
    function createProject(
        string memory title,
        string memory description
    ) public returns (uint256) {
        require(bytes(title).length > 0, "Title required");

        uint256 projectId = _projectIdCounter.current();
        _projectIdCounter.increment();

        projects[projectId].title = title;
        projects[projectId].description = description;
        projects[projectId].creator = msg.sender;
        projects[projectId].status = ProjectStatus.Active;
        projects[projectId].createdAt = block.timestamp;
        projects[projectId].collaboratorCount = 0;

        userProjects[msg.sender].push(projectId);

        emit ProjectCreated(projectId, msg.sender, title);
        return projectId;
    }

    /**
     * @dev Invite a collaborator to a project
     * @param projectId Project identifier
     * @param collaboratorAddress Address of the collaborator
     * @param role Role of the collaborator
     * @param revenueShare Revenue share in basis points
     * @param permissions Array of permissions to grant
     */
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

        // Set permissions
        for (uint256 i = 0; i < permissions.length; i++) {
            collaborator.permissions[permissions[i]] = true;
        }

        emit CollaboratorInvited(projectId, collaboratorAddress, role);
    }

    /**
     * @dev Accept collaboration invitation
     * @param projectId Project identifier
     */
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

    /**
     * @dev Reject collaboration invitation
     * @param projectId Project identifier
     */
    function rejectInvitation(uint256 projectId) public validProject(projectId) {
        Collaborator storage collaborator = collaborators[projectId][msg.sender];
        require(collaborator.invitationStatus == InvitationStatus.Pending, "No pending invitation");

        collaborator.invitationStatus = InvitationStatus.Rejected;
    }

    /**
     * @dev Create a vote for project decisions
     * @param projectId Project identifier
     * @param description Vote description
     * @param proposalData Encoded proposal data
     */
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

    /**
     * @dev Cast a vote on a proposal
     * @param projectId Project identifier
     * @param voteId Vote identifier
     * @param voteChoice True for yes, false for no
     */
    function castVote(
        uint256 projectId,
        uint256 voteId,
        bool voteChoice
    ) public validProject(projectId) onlyCollaborator(projectId) {
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

    /**
     * @dev Execute a vote if it has passed
     * @param projectId Project identifier
     * @param voteId Vote identifier
     */
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

    /**
     * @dev Update revenue share for a collaborator
     * @param projectId Project identifier
     * @param collaboratorAddress Collaborator address
     * @param newShare New revenue share in basis points
     */
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

    /**
     * @dev Update project status
     * @param projectId Project identifier
     * @param newStatus New project status
     */
    function updateProjectStatus(
        uint256 projectId,
        ProjectStatus newStatus
    ) public validProject(projectId) onlyProjectCreator(projectId) {
        projects[projectId].status = newStatus;
    }

    /**
     * @dev Grant permission to a collaborator
     * @param projectId Project identifier
     * @param collaboratorAddress Collaborator address
     * @param permission Permission to grant
     */
    function grantPermission(
        uint256 projectId,
        address collaboratorAddress,
        Permission permission
    ) public validProject(projectId) hasPermission(projectId, Permission.Admin) {
        require(projects[projectId].isCollaborator[collaboratorAddress], "Not a collaborator");
        collaborators[projectId][collaboratorAddress].permissions[permission] = true;
    }

    /**
     * @dev Revoke permission from a collaborator
     * @param projectId Project identifier
     * @param collaboratorAddress Collaborator address
     * @param permission Permission to revoke
     */
    function revokePermission(
        uint256 projectId,
        address collaboratorAddress,
        Permission permission
    ) public validProject(projectId) hasPermission(projectId, Permission.Admin) {
        require(projects[projectId].isCollaborator[collaboratorAddress], "Not a collaborator");
        collaborators[projectId][collaboratorAddress].permissions[permission] = false;
    }

    // View functions
    
    /**
     * @dev Get project information
     * @param projectId Project identifier
     */
    function getProject(uint256 projectId) public view validProject(projectId) returns (
        string memory title,
        string memory description,
        address creator,
        ProjectStatus status,
        uint256 createdAt,
        uint256 collaboratorCount
    ) {
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

    /**
     * @dev Get collaborator information
     * @param projectId Project identifier
     * @param collaboratorAddress Collaborator address
     */
    function getCollaborator(uint256 projectId, address collaboratorAddress) public view returns (
        string memory role,
        uint256 revenueShare,
        InvitationStatus invitationStatus,
        uint256 joinedAt
    ) {
        Collaborator storage collaborator = collaborators[projectId][collaboratorAddress];
        return (
            collaborator.role,
            collaborator.revenueShare,
            collaborator.invitationStatus,
            collaborator.joinedAt
        );
    }

    /**
     * @dev Check if an address has a specific permission
     * @param projectId Project identifier
     * @param collaboratorAddress Collaborator address
     * @param permission Permission to check
     */
    function hasPermission(
        uint256 projectId,
        address collaboratorAddress,
        Permission permission
    ) public view validProject(projectId) returns (bool) {
        if (projects[projectId].creator == collaboratorAddress) {
            return true;
        }
        return collaborators[projectId][collaboratorAddress].permissions[permission];
    }

    /**
     * @dev Get vote information
     * @param projectId Project identifier
     * @param voteId Vote identifier
     */
    function getVote(uint256 projectId, uint256 voteId) public view returns (
        string memory description,
        address proposer,
        uint256 createdAt,
        uint256 expiresAt,
        VoteStatus status,
        uint256 yesVotes,
        uint256 noVotes
    ) {
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

    /**
     * @dev Get all collaborators for a project
     * @param projectId Project identifier
     */
    function getProjectCollaborators(uint256 projectId) public view validProject(projectId) returns (address[] memory) {
        return projects[projectId].collaboratorList;
    }

    /**
     * @dev Get all votes for a project
     * @param projectId Project identifier
     */
    function getProjectVotes(uint256 projectId) public view validProject(projectId) returns (uint256[] memory) {
        return projectVotes[projectId];
    }

    /**
     * @dev Get projects for a user
     * @param user User address
     */
    function getUserProjects(address user) public view returns (uint256[] memory) {
        return userProjects[user];
    }

    /**
     * @dev Get total number of projects
     */
    function getTotalProjects() public view returns (uint256) {
        return _projectIdCounter.current();
    }
}
