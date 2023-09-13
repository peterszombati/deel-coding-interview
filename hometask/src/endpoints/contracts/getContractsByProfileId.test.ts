import {expect} from "chai"
import {debug, localRequest} from "../../utils/test"

it('GET /contracts', async () => {
    const d = await debug()

    for (const i of d.Profile) {
        const result0 = await localRequest({
            method: 'GET',
            path: '/contracts',
            profile_id: i.id
        })
        expect(Array.isArray(result0.success)).to.be.equals(true)
        for (const k of result0.success) {
            expect(k.status).to.be.not.equals('terminated')
        }
    }
})