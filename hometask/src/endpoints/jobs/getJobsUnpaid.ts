import {Contract, Job} from "../../model.ts"
import {Op} from "sequelize"

export async function getJobsUnpaid(profileId: number) {
    return Job.findAll({
        where: {
            paid: false,
        },
        include: {
            model: Contract,
            where: {
                status: 'in_progress',
                [Op.or]: [
                    { ContractorId: profileId },
                    { ClientId: profileId }
                ],
            }
        }
    });
}