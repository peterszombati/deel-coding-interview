import {debug, localRequest} from "../../utils/test"
import {expect} from "chai"

it('POST /jobs/:job_id/pay', async () => {
    const before = await debug()

    const payableJobs: any = before.Job.filter(i => !i.paid
        && i.price <= (before.Profile.find(p => p.id === i.Contract.ClientId)?.balance || 0)
    ).map(job => ({
        job,
        result: null,
    }))

    // pay payable jobs
    for (const i of payableJobs) {
        i.result = await localRequest({
            method: 'POST',
            path: '/jobs/' + i.job.id + '/pay',
            profile_id: i.job.Contract.ClientId
        })
    }

    const after = await debug()
    const payments: Record<string, number> = {}

    // check affected client balances
    for (const {job: beforeJob, result} of payableJobs) {
        const afterJob = after.Job.find(j => j.id === beforeJob.id)

        expect(beforeJob.paid).to.be.equals(false)
        expect(afterJob.paid).to.be.equals(result.error?.data?.error !== 'Client balance is less than the job price')

        if (!result.success) {
            if (result.error?.data?.error !== 'Client balance is less than the job price') {
                throw new Error('invalid error')
            }
            continue
        }
        if (!payments[`${beforeJob.Contract.ClientId}`]) {
            payments[`${beforeJob.Contract.ClientId}`] = 0
        }
        if (!payments[`${beforeJob.Contract.ContractorId}`]) {
            payments[`${beforeJob.Contract.ContractorId}`] = 0
        }
        payments[`${beforeJob.Contract.ClientId}`] -= beforeJob.price
        payments[`${beforeJob.Contract.ContractorId}`] += beforeJob.price
    }

    for (const [profileId,amount] of Object.entries(payments)) {
        expect(before.Profile.find(i => i.id === parseInt(profileId,10)).balance + amount)
            .to.be.equals(after.Profile.find(i => i.id === parseInt(profileId,10)).balance)
    }

    // check not affected client balances
    for (const profile of before.Profile) {
        if (!payments[`${profile.id}`]) {
            expect(profile.balance).to.be.equals(after.Profile.find(i => i.id === profile.id)?.balance)
        }
    }
})