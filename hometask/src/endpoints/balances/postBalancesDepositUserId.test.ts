import {debug, localRequest} from "../../utils/test"
import {expect} from "chai"

const deposit = (amount: number, profile_id: number) => localRequest({
    method: 'POST',
    path: `/balances/deposit/${profile_id}?amount=${amount}`,
    profile_id: 1
})

it('#0: POST /balances/deposit/:user_id', async () => {
    const before = await debug()

    await deposit(1, 4)

    const after = await debug()

    const beforeBalance = before.Profile.find(i => i.id === 4).balance
    const afterBalance = after.Profile.find(i => i.id === 4).balance

    expect(beforeBalance + 1).to.be.equals(afterBalance)
})

it('#1: POST /balances/deposit/:user_id', async () => {
    const before = await debug()

    await deposit(1, 4)
    await deposit(1, 4)

    const after = await debug()

    const beforeBalance = before.Profile.find(i => i.id === 4).balance
    const afterBalance = after.Profile.find(i => i.id === 4).balance

    expect(beforeBalance + 2).to.be.equals(afterBalance)
})

it('#2: POST /balances/deposit/:user_id', async () => {
    const before = await debug()
    const beforeBalance = before.Profile.find(i => i.id === 4).balance

    const amountToPay = before.Job.filter(i => i.paid === false && i.Contract.status === 'in_progress' && i.Contract.ClientId === 4)
        .map(i => i.price).reduce((a,b) => a + b, 0)
    const result = await deposit(Math.ceil(amountToPay * 0.25) + 1, 4)
    expect(result.error?.data?.error).to.be.equals("amount cant be more than 25% his total of jobs to pay")

    await deposit(1, 4)

    const after = await debug()

    const afterBalance = after.Profile.find(i => i.id === 4).balance

    expect(beforeBalance + 1).to.be.equals(afterBalance)
})