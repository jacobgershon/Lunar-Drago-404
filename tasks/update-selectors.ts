import {task} from 'hardhat/config';
// example: `yarn hardhat update-selectors --executor <address> --helper-name ExecutorHelper1 --helper-address <address> --network <network>`
task('update-selectors')
  .addParam('executor', 'executor address')
  .addParam('helperName', 'helper contract name i.e. ExecutorHelper1')
  .addParam('helperAddress', 'helper contract address')
  .setAction(async (taskArgs, hre) => {
    const {ethers} = hre;
    const {executor, helperName, helperAddress} = taskArgs;

    let {deployer} = await hre.getNamedAccounts();
    const signer = await ethers.getSigner(deployer);

    let iface = await (await ethers.getContractFactory(helperName)).interface;

    let selectors = Object.values(iface.functions)
      .filter((e) => {
        return e.name.startsWith('execute');
      })
      .map((e) => {
        return iface.getSighash(e.name);
      });

    let addr = selectors.map(() => {
      return helperAddress;
    });
    const executorContract = await ethers.getContractAt('AggregationExecutor', executor);
    const tx = await executorContract.connect(signer).updateBatchExecutors(selectors, addr);
    const txReceipt = await tx.wait();
    console.log(`tx hash: ${txReceipt.transactionHash} |\tgas used: ${txReceipt.cumulativeGasUsed}`);
  });
