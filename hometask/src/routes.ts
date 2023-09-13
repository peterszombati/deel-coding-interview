import {getProfile} from "./middleware/getProfile.ts";
import {handler} from "./utils/handler.ts";
import {getContractsByProfileId} from "./endpoints/contracts/getContractsByProfileId.ts";
import {getJobsUnpaid} from "./endpoints/jobs/getJobsUnpaid.ts";
import {postJobsPay} from "./endpoints/jobs/postJobsPay.ts";
import {ErrorResponse} from "./utils/ErrorResponse.ts";
import {postBalancesDepositUserId} from "./endpoints/balances/postBalancesDepositUserId.ts";
import {parseDateTime} from "./utils/parseDateTime.ts";
import {getBestProfession} from "./endpoints/admin/getBestProfession.ts";
import {parseInteger} from "./utils/parseInteger.ts";
import {getBestClients} from "./endpoints/admin/getBestClients.ts";
import {getContractById} from "./endpoints/contracts/getContractById.ts";

export default (app) => {
    app.get('/contracts/:id', getProfile, async (req, res) => {
        handler(res, getContractById(req.params.id, req.profile.id))
    })

    app.get('/contracts', getProfile, (req, res) => {
        // @ts-ignore
        handler(res, getContractsByProfileId(req.profile.id))
    })

    app.get('/jobs/unpaid', getProfile, (req, res) => {
        // @ts-ignore
        handler(res, getJobsUnpaid(req.profile.id))
    })

    app.post('/jobs/:job_id/pay', getProfile, (req, res) => {
        // @ts-ignore
        handler(res, postJobsPay(req.profile.id, req.params.job_id))
    })

    app.post('/balances/deposit/:user_id', getProfile, (req, res) => {
        handler(res, (async () => {
            let amount: number
            try {
                amount = parseInteger(req.query.amount)
            } catch (e) {
                throw new ErrorResponse(400, 'invalid query parameter')
            }
            return await postBalancesDepositUserId(req.params.user_id, amount, 0.25)
        })())
    })

    app.get('/admin/best-profession', (req, res) => {
        handler(res, (async () => {
            let params
            try {
                params = {
                    start: parseDateTime(req.query.start),
                    end: parseDateTime(req.query.end)
                }
            } catch (e) {
                throw new ErrorResponse(400, 'invalid query parameter')
            }

            return await getBestProfession(params)
        })())
    })

    app.get('/admin/best-clients', (req, res) => {
        handler(res, (async () => {
            let params
            try {
                params = {
                    start: parseDateTime(req.query.start),
                    end: parseDateTime(req.query.end),
                    limitCount: parseInteger(req.query.limit || '2'),
                }
            } catch (e) {
                throw new ErrorResponse(400, 'invalid query parameter')
            }

            return await getBestClients(params)
        })())
    })
}