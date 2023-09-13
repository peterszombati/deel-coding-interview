import {Contract} from "../../model.ts"
import {Op} from "sequelize"

export async function getContractsByProfileId(profileId: number) {
    return Contract.findAll({
        where: {
            [Op.not]: [
                {status: 'terminated'},
            ],
            [Op.or]: [
                //@ts-ignore
                {ContractorId: profileId},
                //@ts-ignore
                {ClientId: profileId}
            ]
        }
    })
}