import {expect} from "chai"
import {debug, localRequest} from "../../utils/test"

it('GET /admin/best-clients', async () => {
    const d = await debug() // TODO

    const result = await localRequest({
        method: 'GET',
        path: '/admin/best-clients?start=2020-08-10&end=2020-09-15&limit=3',
        profile_id: -1,
    })

    expect(result.success).to.be.deep.equals([
            { id: 4, fullName: 'Ash Kethcum', paid: 2020 },
            { id: 1, fullName: 'Harry Potter', paid: 442 },
            { id: 2, fullName: 'Mr Robot', paid: 321 }
        ])
})