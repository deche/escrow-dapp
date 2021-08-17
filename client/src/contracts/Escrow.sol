// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Escrow {
    address public arbiter;
    address payable public beneficiary;
    address public depositor;

    bool public isApproved;

    constructor(address _arbiter, address payable _beneficiary) payable {
        arbiter = _arbiter;
        beneficiary = _beneficiary;
        depositor = msg.sender;
    }

    event Approved(uint256);

    function approve() external {
        require(msg.sender == arbiter);
        uint256 balance = address(this).balance;
        beneficiary.transfer(balance);
        emit Approved(balance);
        isApproved = true;
    }
}
