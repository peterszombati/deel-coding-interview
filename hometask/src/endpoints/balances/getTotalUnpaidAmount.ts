import {Contract, Job} from "../../model.ts"
import {col, fn, Transaction} from "sequelize"

export function getTotalUnpaidAmount(clientId: number, transaction: Transaction | null | undefined) {
    // @ts-ignore
    return Job.findOne({
        where: {
            paid: false
        },
        include: {
            model: Contract,
            where: {
                ClientId: clientId,
                status: 'in_progress'
            }
        },
        attributes: [
            [fn('SUM', col('price')), 'totalAmount']
        ],
        transaction,
    }).then(result => result?.getDataValue('totalAmount'))
}