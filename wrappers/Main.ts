import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode, toNano } from '@ton/core';

export type MainConfig = {
    owner: Address;
    secretNumber: bigint;
    prizeAmount: bigint;
    tonBet: bigint;
    minNum: bigint;
    maxNum: bigint;
    isLocked: number;
    isGuessed: number;
};

export function mainConfigToCell(config: MainConfig): Cell {
    return beginCell()
        .storeAddress(config.owner)
        .storeUint(config.secretNumber, 64)
        .storeUint(config.prizeAmount, 64)
        .storeUint(config.tonBet, 64)
        .storeUint(config.minNum, 64)
        .storeUint(config.maxNum, 64)
        .storeUint(config.isLocked, 1)
        .storeUint(config.isGuessed, 1)
    .endCell();
}

export class Main implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Main(address);
    }

    static createFromConfig(config: MainConfig, code: Cell, workchain = 0) {
        const data = mainConfigToCell(config);
        const init = { code, data };
        return new Main(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendLock(provider: ContractProvider, via: Sender) {
        await provider.internal(via, {
            value: toNano("0.02"),
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x878f9b0e, 32)
            .endCell(),
        });
    }

    async sendUnlock(provider: ContractProvider, via: Sender) {
        await provider.internal(via, {
            value: toNano("0.02"),
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x6ae4b0ef, 32)
            .endCell(),
        });
    }

    async sendWithdraw(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0xb5de5f9e, 32)
            .endCell(),
        });
    }

    async sendChangeOwner(provider: ContractProvider, via: Sender, value: bigint, newOwner: Address) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x93b05b31, 32)
                .storeAddress(newOwner)
            .endCell(),
        });
    }

    async sendChangePrizeAmount(provider: ContractProvider, via: Sender, value: bigint, newPrizeAmount: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x48fdf769, 32)
                .storeUint(newPrizeAmount, 64)
            .endCell(),
        });
    }

    async sendChangeTonBet(provider: ContractProvider, via: Sender, value: bigint, newTonBet: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x3d33d731, 32)
                .storeUint(newTonBet, 64)
            .endCell(),
        });
    }

    async sendChangeRandomNumbers(provider: ContractProvider, via: Sender, value: bigint, newMinNum: bigint, newMaxNum: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x71247654, 32)
                .storeUint(newMinNum, 64)
                .storeUint(newMaxNum, 64)
            .endCell(),
        });
    }

    async sendSetSecretNumber(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x22699, 32)
            .endCell(),
        });
    }

    async sendGuessNumber(provider: ContractProvider, via: Sender, value: bigint, number: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x869a3ca7, 32)
                .storeUint(number, 64)
            .endCell(),
        });
    }

    async getOwner(provider: ContractProvider): Promise<Address> {
        const res = (await provider.get('get_owner', [])).stack;
        return res.readAddress();
    }

    async getIsLocked(provider: ContractProvider): Promise<number> {
        const res = (await provider.get('get_is_locked', [])).stack;
        return res.readNumber();
    }

    async getIsGuessed(provider: ContractProvider): Promise<number> {
        const res = (await provider.get('get_is_guessed', [])).stack;
        return res.readNumber();
    }

    // async getSecretNumber(provider: ContractProvider): Promise<number> {
    //     const res = (await provider.get('get_secret_number', [])).stack;
    //     return res.readNumber();
    // }

    async getPrizeAmount(provider: ContractProvider): Promise<number> {
        const res = (await provider.get('get_prize_amount', [])).stack;
        return res.readNumber();
    }

    async getTonBet(provider: ContractProvider): Promise<number> {
        const res = (await provider.get('get_ton_bet', [])).stack;
        return res.readNumber();
    }

    async getMinNum(provider: ContractProvider): Promise<number> {
        const res = (await provider.get('get_min_num', [])).stack;
        return res.readNumber();
    }

    async getMaxNum(provider: ContractProvider): Promise<number> {
        const res = (await provider.get('get_max_num', [])).stack;
        return res.readNumber();
    }

}
