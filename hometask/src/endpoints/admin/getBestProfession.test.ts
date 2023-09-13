import {expect} from "chai"
import {debug, localRequest} from "../../utils/test"

it('GET /admin/best-profession', async () => {
    const d = await debug() // TODO

    const result = await localRequest({
        method: 'GET',
        path: '/admin/best-profession?start=2020-08-10&end=2020-09-15',
        profile_id: -1,
    })

    expect(result.success).to.be.deep.equals({
            contractor: { id: 7, fullName: 'Alan Turing' },
            totalEarnings: 2020
        }
    )
})