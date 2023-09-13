import {Contract, Job, Profile} from "../../model.ts"
import {col, fn, literal, Op} from "sequelize"

export async function getBestClients({start, end, limitCount}: {
    start: Date
    end: Date
    limitCount: number
}) {
    const result = await Job.findAll({
        attributes: [
            'Contract.ClientId',
            [fn('SUM', col('price')), 'totalPayments'],
        ],
        include: [
            {
                model: Contract,
                include: [{
                    model: Profile,
                    as: 'Client',
                }],
            },
        ],
        where: {
            paid: true,
            paymentDate: {
                [Op.between]: [start, end],
            },
        },
        group: ['Contract.ClientId'],
        order: [[literal('totalPayments'), 'DESC']],
        limit: limitCount,
    })

    return result.map((row) => ({
        // @ts-ignore
        id: row.Contract.Client.id,
        // @ts-ignore
        fullName: `${row.Contract.Client.firstName} ${row.Contract.Client.lastName}`,
        paid: row.getDataValue('totalPayments'),
    }))
}