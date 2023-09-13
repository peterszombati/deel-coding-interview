import {Profile, sequelize} from "../../model.ts"
import {getTotalUnpaidAmount} from "./getTotalUnpaidAmount.ts"
import {ErrorResponse} from "../../utils/ErrorResponse.ts"

// TODO
// ABOUT THIS im not sure is it a client to contractor transfer, or why user_id needed if we have profile id?
export function postBalancesDepositUserId(clientId: number, amount: number, RATE: number) {
    return sequelize.transaction(async (t) => {
        // @ts-ignore
        const totalUnpaidAmount = await getTotalUnpaidAmount(clientId, t)

        if (totalUnpaidAmount * RATE < amount) {
            throw new ErrorResponse(500, `amount cant be more than ${(RATE * 100).toFixed(0)}% his total of jobs to pay`)
        }

        // @ts-ignore
        const profile = await Profile.findOne({where: {id: clientId}, transaction: t})

        if (!profile) {
            throw new Error('profile not found based on clientId')
        }

        // @ts-ignore
        profile.balance += amount

        await profile.save({transaction: t});

        return amount
    })
}

