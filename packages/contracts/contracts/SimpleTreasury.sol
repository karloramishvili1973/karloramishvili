// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/**
 * @dev Simple treasury for tests — allows anyone to withdraw (test-only).
 */
contract SimpleTreasury {
  event Deposit(address indexed from, uint256 amount);
  event Withdraw(address indexed to, uint256 amount);

  receive() external payable {
    emit Deposit(msg.sender, msg.value);
  }

  function withdraw(address payable to, uint256 amount) external {
    require(address(this).balance >= amount, 'Insufficient funds');
    to.transfer(amount);
    emit Withdraw(to, amount);
  }
}
