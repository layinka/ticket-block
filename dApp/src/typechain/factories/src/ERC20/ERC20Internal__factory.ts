/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  ERC20Internal,
  ERC20InternalInterface,
} from "../../../src/ERC20/ERC20Internal";

const _abi = [
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class ERC20Internal__factory {
  static readonly abi = _abi;
  static createInterface(): ERC20InternalInterface {
    return new utils.Interface(_abi) as ERC20InternalInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ERC20Internal {
    return new Contract(address, _abi, signerOrProvider) as ERC20Internal;
  }
}
