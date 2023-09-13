import {Contract} from "../../model.ts"
import {Op} from "sequelize"
import {ErrorResponse} from "../../utils/ErrorResponse.ts"

export async function getContractById(contractId: number, profileId: number) {
    // @ts-ignore
    const contract = await Contract.findOne({
        where: {
            id: contractId,
            [Op.or]: [
                //@ts-ignore
                {ContractorId: profileId},
                //@ts-ignore
                {ClientId: profileId}
            ]
        }
    })
    if (!contract) {
        throw new ErrorResponse(404,'Not Found')
    }
    return contract
}