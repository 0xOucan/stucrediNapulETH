//SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "./DeployHelpers.s.sol";
import { DeployStuCredi } from "./DeployStuCredi.s.sol";

/**
 * @notice Main deployment script for StuCredi contracts
 * @dev Run this when you want to deploy the StuCredi system
 *
 * Example: yarn deploy # runs this script(without`--file` flag)
 */
contract DeployScript is ScaffoldETHDeploy {
    function run() external {
        // Deploys all StuCredi contracts sequentially
        DeployStuCredi deployStuCredi = new DeployStuCredi();
        deployStuCredi.run();

        // Deploy another contract
        // DeployMyContract myContract = new DeployMyContract();
        // myContract.run();
    }
}
