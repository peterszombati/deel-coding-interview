import {debug, localRequest} from "../../utils/test"
import {expect} from "chai"

it('GET /jobs/unpaid', async () => {
    const d = await debug()

    for (const i of d.Profile) {
        const result0 = await localRequest({
            method: 'GET',
            path: '/jobs/unpaid',
            profile_id: i.id
        })
        expect(Array.isArray(result0.success)).to.be.equals(true)
        for (const k of result0.success) {
            expect(k.paid).to.be.equals(false)
            expect([k.Contract.ContractorId,k.Contract.ClientId].includes(i.id)).to.be.equals(true)
        }
        const relevantJobs = d.Job.filter(j => j.status === 'in_progress'
            && j.paid === false
            && (j.Contract.ContractorId === i.id || j.Contract.ClientId === i.id))
        for (const k of relevantJobs) {
            expect(!!result0.success.find(j => j.id === k.id)).to.be.equals(true)
        }
    }
})