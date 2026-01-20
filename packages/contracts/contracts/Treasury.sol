// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title Treasury
 * @dev Simple treasury contract intended to be controlled by a TimelockController.
 * All withdrawal actions must be executed by the timelock (governance) to ensure
 * that proposals pass and are time-delayed before execution.
 */
contract Treasury {
    address public timelock;

    event Deposit(address indexed from, uint256 amount);
    event Withdraw(address indexed to, uint256 amount);
    event ERC20Withdraw(address indexed token, address indexed to, uint256 amount);

    modifier onlyTimelock() {
        require(msg.sender == timelock, "Only timelock");
        _;
    }

    constructor(address _timelock) {
        timelock = _timelock;
    }

    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }

    /**
     * @dev Withdraw native ETH to `to`. Callable only by the timelock.
     */
    function withdraw(address payable to, uint256 amount) external onlyTimelock {
        require(address(this).balance >= amount, "Insufficient funds");
        (bool success, ) = to.call{value: amount}("");
        require(success, "ETH transfer failed");
        emit Withdraw(to, amount);
    }

    /**
     * @dev Withdraw ERC20 tokens to `to`. Callable only by the timelock.
     */
    function withdrawERC20(address token, address to, uint256 amount) external onlyTimelock {
        IERC20(token).transfer(to, amount);
        emit ERC20Withdraw(token, to, amount);
    }

    /**
     * @dev Allow the timelock (governance) to update the timelock address.
     */
    function updateTimelock(address newTimelock) external onlyTimelock {
        timelock = newTimelock;
    }
}
