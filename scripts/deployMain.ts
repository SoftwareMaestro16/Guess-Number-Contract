import { toNano, Address } from '@ton/core';
import { Main } from '../wrappers/Main';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
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

    await main.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(main.address);

    // run methods on `main`
}
