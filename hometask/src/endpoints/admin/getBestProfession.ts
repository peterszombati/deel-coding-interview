import {Contract, Job, Profile} from "../../model.ts"
import {col, fn, literal, Op} from "sequelize"

export async function getBestProfession({start, end}: {
    start: Date,
    end: Date
}) {
    const result = await Job.findAll({
        attributes: [
            'Contract.ContractorId',
            [fn('SUM', col('price')), 'totalEarnings'],
        ],
        include: [
            {
                model: Contract,
                include: [{
                    model: Profile,
                    as: 'Contractor',
                }],
            },
        ],
        where: {
            paid: true,
            paymentDate: {
                [Op.between]: [start, end],
            },
        },
        group: ['ContractorId'],
        order: [[literal('totalEarnings'), 'DESC']],
        limit: 1,
    })

    if (result.length > 0) {
        // @ts-ignore
        const contractorId = result[0].Contract.ContractorId
        const totalEarnings = result[0].getDataValue('totalEarnings')
        const contractor = await Profile.findByPk(contractorId)

        return {
            contractor: {
                // @ts-ignore
                id: contractor.id,
                // @ts-ignore
                fullName: `${contractor.firstName} ${contractor.lastName}`
            },
            totalEarnings,
        }
    }

    return null
}