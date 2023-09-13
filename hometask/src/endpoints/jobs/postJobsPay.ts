import {Contract, Job, Profile, sequelize} from "../../model.ts"
import {ErrorResponse} from "../../utils/ErrorResponse.ts"

export function postJobsPay(clientId: number, jobId: number) {
    return sequelize.transaction(async(t) => {
        // @ts-ignore
        const job = await Job.findByPk(jobId, {include: {model: Contract,where: {
                    ClientId: clientId
                }},transaction: t})
        if (!job) {
            throw new ErrorResponse(500,'Job not found')
        }
        // @ts-ignore
        if (job.paid) {
            throw new ErrorResponse(500,'Job has already been paid')
        }
        // @ts-ignore
        const client = await Profile.findByPk(job.Contract.ClientId, { transaction: t})
        // @ts-ignore
        const contractor = await Profile.findByPk(job.Contract.ContractorId, { transaction: t})

        if (!client || !contractor) {
            throw new ErrorResponse(500,'Invalid client or contractor')
        }

        // @ts-ignore
        if (client.balance < job.price) {
            throw new ErrorResponse(500,'Client balance is less than the job price')
        }
        // @ts-ignore
        const amountToAdd = job.price
        // @ts-ignore
        contractor.balance += amountToAdd
        // @ts-ignore
        client.balance -= amountToAdd

        // @ts-ignore
        job.paid = true
        await Promise.all([
            contractor.save({transaction: t}),
            client.save({transaction: t}),
            job.save({transaction: t}),
        ])
        // @ts-ignore
        return job.price
    })
}

