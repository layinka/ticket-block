import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {parseEther} from 'ethers/lib/utils';
import {readFileSync, writeFileSync} from 'fs';
import {join} from 'path';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
	const {ethers, deployments, getNamedAccounts, network} = hre;
	const {deploy} = deployments;

	const {deployer} = await getNamedAccounts();
	let contract_owner = await ethers.getSigner(deployer);

	// await deploy('Nft', {
	// 	from: deployer,
	// 	args: [],
	// 	log: true,
	// 	autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
	// });
	console.log('deploying faucet')
	const faucet = await deploy('Faucet', {
		from: deployer,
		contract: 'Faucet',
		args: [],
		log: true,
		autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
	});
	console.log('deployed faucet')
	const faucetContract = await ethers.getContract('Faucet');

	// const c = [
	// 	{
	// 		name: 'Mock FTM',
	// 		symbol: 'mFTM',
	// 	},
	// 	{
	// 		name: 'pTicketBlck',
	// 		symbol: 'pTick',
	// 	},
	// 	{
	// 		name: 'Mock USD Tether',
	// 		symbol: 'mUSDT',
	// 	},
	// 	{
	// 		name: 'Mock Circle USD',
	// 		symbol: 'mUSDC',
	// 	},
	// ];

	//Fantom
	const c = [
		
		{
			name: 'TicketBlock',
			symbol: 'TKB',
		},
		{
			name: 'AURORA',
			symbol: 'AURORA',
		},
		{
			name: 'USDC',
			symbol: 'USDC',
		}

	];

	const logTickets = [];
	logTickets.push({
		currency: 'ETH',
		address: '0x0000000000000000000000000000000000000000'
	})

	// logTickets.push({
	// 	currency: 'USDC',
	// 	address: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75'
	// })

	// logTickets.push({
	// 	currency: 'AURORA',
	// 	address: '0xAd84341756Bf337f5a0164515b1f6F993D194E1f'
	// })
	for (let index = 0; index < c.length; index++) {
		const element = c[index];
		const dr = await deploy(`TestToken-${element.name}`, {
			from: deployer,
			contract:'TestToken',
			args: [element.name, element.symbol],
			log: true,
			autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
		});

		const token = await ethers.getContractAt('TestToken', dr.address, contract_owner);

		const tx = await token.transfer(faucet.address, ethers.utils.parseEther('10000000'));
		await tx.wait();

		logTickets.push({
			currency: element.symbol,
			address: dr.address,
		});
	}

	writeFileSync(
		join(__dirname, '/../tokens-deployed/', (network.config.chainId?.toString() ?? '') + '_tokens.json'),
		JSON.stringify(logTickets, null, 2),
		{
			flag: 'w',
		}
	);

	console.log(JSON.stringify(logTickets, null, 2));
};
export default func;
func.tags = ['tokens'];
