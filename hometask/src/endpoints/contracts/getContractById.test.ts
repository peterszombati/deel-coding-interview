import {expect} from "chai"
import {debug, localRequest} from "../../utils/test"

it('GET /contracts/:id', async () => {
    const d = await debug()

    for (const i of d.Contract.slice(0, 10)) {
        const result0 = await localRequest({
            method: 'GET',
            path: '/contracts/' + i.id,
            profile_id: i.Client.id
        })
        const result1 = await localRequest({
            method: 'GET',
            path: '/contracts/' + i.id,
            profile_id: i.Contractor.id
        })
        const result2 = await localRequest({
            method: 'GET',
            path: '/contracts/' + i.id,
            profile_id: d.Profile.find(k => k.id !== i.Contractor.id && k.id !== i.Client.id)?.id || (i.Contractor.id + i.Client.id),
        })
        expect(i.id).to.be.equals(result0?.success?.id)
        expect(i.id).to.be.equals(result1?.success?.id)
        expect(404).to.be.equals(result2?.error?.res.statusCode)
    }
})