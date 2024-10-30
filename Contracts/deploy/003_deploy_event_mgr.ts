import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {parseEther} from 'ethers/lib/utils';
import {readFileSync} from 'fs';
import {join} from 'path';
import { getChainId } from 'hardhat';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
	const {ethers, deployments, getNamedAccounts, network} = hre;
	const {deploy} = deployments;

	const {deployer, simpleERC20Beneficiary: buyer} = await getNamedAccounts();

	// const ticketMarket = await ethers.getContract('TicketMarket');

	const tkbEventManagerDeplyment = await deploy('TKBEventManager', {
		from: deployer,
		contract: 'EventManager',
		args: [
			/*ticketMarket.address*/
			ethers.utils.parseEther('0.00001')
		],
		log: true,
		autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
	});

	// await deploy('EventHelper', {
	// 	from: deployer,
	// 	args: [
	// 		/*ticketMarket.address*/
	// 	],
	// 	log: true,
	// 	autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
	// });

	// await deploy('SeatAssigner', {
	// 	from: deployer,
	// 	args: [
	// 		// '0xab18414CD93297B0d12ac29E63Ca20f515b3DB46', //wrapper
	// 		// '0x779877A7B0D9E8603169DdbD7836e478b4624789',
	// 	],
	// 	log: true,
	// 	autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
	// });

	const evtMgrContract = await ethers.getContractAt('EventManager', tkbEventManagerDeplyment.address);

	let tx = await evtMgrContract.createNewEvent('TicketBlock Launch', 'TBLCKL', {
		date: Math.floor(Date.parse('Dec 6, 2024') / 1000),
		id: 0,
		desc: 'Ticketblock launch',
		email: 'info@ticketblock.com',
		eventType: 0,
		logo: 'https://picsum.photos/id/102/1280/960',
		maxCapacity: 20,
		name: 'TicketBlock Launch',
		orgName: 'TicketBlock',
		owner: '0x0000000000000000000000000000000000000000',
		ticketsSold: 0,
		website: 'http://ticketblock.com',
	}, {
		value: parseEther('0.00001')
	});

	await tx.wait();

	const evtAddress = await evtMgrContract.eventAt(1);

	const evtContract = await ethers.getContractAt('Event', evtAddress);

	// const ticketPrices = [
	// 	{
	// 		currency: 'mLink',
	// 		address: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
	// 	},
	// 	{
	// 		currency: 'mTick',
	// 		address: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
	// 	},
	// 	{
	// 		currency: 'mUSDT',
	// 		address: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
	// 	},
	// 	{
	// 		currency: 'mUSDC',
	// 		address: '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853',
	// 	},
	// ];

	const tokenJson = readFileSync(
		join(__dirname, '/../tokens-deployed/', (network.config.chainId?.toString() ?? '') + '_tokens.json'),
		'utf-8'
	);
	let ticketPrices: any[] = JSON.parse(tokenJson);

	//aurora test
	let ticketPricesAuroraTestnet = [
		{
			price: parseEther('0.009'),
			"currency": "ETH",
			"address": "0x0000000000000000000000000000000000000000"
		},
		{
			price: parseEther('200'),
			"currency": "TKB",
			"address": "0x3537BC4C1890e528e484DD8DE335C17E9195F1d7"
		},
		{
			price: parseEther('100'),
			"currency": "AURORA",
			"address": "0xBc22E20975E980E484f617f3053680fb01E2e62A"
		},
		{
			price: parseEther('20'),
			"currency": "USDC",
			"address": "0x6ff45859D2728D7449C8Fc988c981b8EebF22E6d"
		}
	]

	if((await getChainId())=='1313161555'){
		console.log('will use aurora testnet')
		ticketPrices=ticketPricesAuroraTestnet
	}

	const txCat = await evtContract.addTicketCategory(
		'TicketBlock Launch VIP',
		'https://place-hold.it/200?text=vip',
		10,
		//@ts-ignore
		ticketPrices.map((v: any, ix) => {
			console.log('c is ', v);
			let returnedV =  {
				price: v.price? v.price : parseEther('20'),
				currency: v.address, //  this.ticketPricesFormArray.controls[ix].get('currency')?.value,
			};
			console.log('returnedV is ', returnedV);
			return returnedV;
			// return {
			//   currency: TicketCurrencies[ix].address, //  this.ticketPricesFormArray.controls[ix].get('currency')?.value,
			//   amount: parseEther(this.ticketPricesFormArray.controls[ix].get('amount')?.value.toString())
			// }
		}),
		false,
		'0x0000000000000000000000000000000000000000',
		[
			{name: '', value: ''},
			{name: '', value: ''},
			{name: '', value: ''},
			{name: '', value: ''},
		]
	);

	await txCat.wait();

	console.log('buyer is ', buyer);

	// const evtBuyerContract = await (
	// 	await ethers.getContractAt('Event', evtAddress)
	// ).connect(await ethers.getSigner(buyer));

	// console.log('about to approve');

	// const tokenContract = await ethers.getContractAt('TestToken', ticketPrices[0].address);
	// let t1x = await tokenContract.transfer(buyer, ethers.utils.parseEther('200'));
	// await t1x.wait();

	// const buyerTokenContract = await (
	// 	await ethers.getContractAt('TestToken', ticketPrices[0].address)
	// ).connect(await ethers.getSigner(buyer));

	// let txAllow = await buyerTokenContract.approve(evtAddress, parseEther('1000'));
	// await txAllow.wait();

	// console.log('approved');

	// console.log('ticketPrices is ', ticketPrices);
	// try {
	// 	let txBuyTicket = await evtBuyerContract.buyTicket(
	// 		0,
	// 		1,
	// 		ticketPrices[0].address,
	// 		'https://test-tb.heirtrust.com/tickets/metadata/31337-0-4312023115918',

	// 		{
	// 			value: parseEther('0.105').toString()
	// 		}
	// 	);
	// 	await txBuyTicket.wait();
	// 	console.log('bought');
	// } catch (err) {
	// 	console.error('Error Buying ticket: ', err);
	// }
};
export default func;
func.tags = ['EventManager'];
func.dependencies = ['TicketMarket'];
