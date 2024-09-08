import { toNano, Address } from '@ton/core';
import { Main } from '../wrappers/Main';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    try {
        const main = provider.open(Main.createFromConfig({
            owner: provider.sender().address as Address,
            secretNumber: 0n,
            prizeAmount: 300000000n,
            tonBet: 20000000n,
            minNum: 1n,
            maxNum: 3n,
            isLocked: 0,
            isGuessed: 0
        }, await compile('Main')));

        await main.sendChangeTonBet(provider.sender(), toNano("0.02"), toNano("0.3"));
        await provider.waitForDeploy(main.address);

        console.log('Change owner request sent');
    } catch (error) {
        console.error('Failed to change owner:', error);
    }
}