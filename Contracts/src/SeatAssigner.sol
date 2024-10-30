// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Types} from "./Libraries/Types.sol";
import {Errors} from "./Libraries/Errors.sol";
import "./Event.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";



contract SeatAssigner 
{
	

	mapping(address => mapping(uint => uint256)) public seatAssignments; // eventaddress - ticketid - seat

	constructor(/*address eventManager*/){
		// _transferOwnership(eventManager);
	}

	function generateRandomNumber(uint loopCount) public view returns(uint randomNumber) {
		for (uint i = 0; i < loopCount; i++) {
			uint blockValue = uint(blockhash(block.number - i));
			randomNumber= uint(keccak256(abi.encodePacked(blockValue, randomNumber, i )));
		}
	}

	function assignSeats(
		address evtAddress,
		uint ticketCategoryId
	)	public 	
	{
		console.log("Assgning seat start");
		
		uint randomResult = generateRandomNumber(2);

		Event evt = Event(evtAddress);
		Types.TicketCategory memory ticketCategory = evt.getTicketCategory(ticketCategoryId);
		uint[] memory attendees = ticketCategory.soldTickets;
		uint256 totalAttendees = attendees.length;

		for (uint256 i = 0; i < totalAttendees; i++) {
			uint256 seatIndex = 1 + ((randomResult + i) % totalAttendees); //i indexed
			seatAssignments[evtAddress][attendees[i]] = seatIndex;
		}

		
	}

	

	function getSeatAssignment(address evtAddress, uint attendeeTokenId) public view returns (uint256) {
		return seatAssignments[evtAddress][attendeeTokenId];
	}

	
}
