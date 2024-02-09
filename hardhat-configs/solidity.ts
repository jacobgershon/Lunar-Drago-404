import {solidity_l1_configs} from './solidity.l1';
import {solidity_optimistic_configs} from './solidity.optimistic';

export const solidity_configs = process.env?.OPTIMISTIC == 'true' ? solidity_optimistic_configs : solidity_l1_configs;
