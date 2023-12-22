// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import './UsernameAccountFactory.sol';
import '@thirdweb-dev/contracts/prebuilts/account/non-upgradeable/Account.sol';

contract UsernameAccount is Account {
    constructor(
        IEntryPoint _entrypoint,
        address _factory
    ) Account(_entrypoint, _factory) {
        _disableInitializers();
    }

    function register(
        string calldata _username
    ) external {
        require(msg.sender == address(this), "Only the account itself can register");
        UsernameAccountFactory(factory).onRegistered(_username);
    }
}