import { task } from 'hardhat/config';

task('deploy', 'Deploys erc1155', async (args, hre) => {
  const owner = (await hre.ethers.getSigners())[0];

  await hre.run('compile');

  console.log(`deploying with ${await owner.getAddress()}`);
});
