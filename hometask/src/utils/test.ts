import {Contract, Job, Profile} from "../model"
import {simpleJsonRequest} from "./simpleHttpRequest"

export async function debug() {
    return {
        // @ts-ignore
        Profile: await Profile.findAll(),
        Job: await Job.findAll({
            include: Contract
        }),
        Contract: await Contract.findAll({
            include: ['Client', 'Contractor']
        })
    }
}

export function localRequest({method, profile_id, path}: {
    method: 'GET' | 'POST'
    profile_id?: any
    path: string
}) {
    return simpleJsonRequest({
        hostname: 'localhost',
        port: 3001,
        method,
        path,
        headers: {
            'profile_id': profile_id
        },
        timeout: 0,
    }).then(success => ({
        success
    })).catch(e => ({
        error: e
    })).then(result => {
        console.log('request:'+JSON.stringify({method,profile_id,path,response: result.error ? 'error' : 'success'}))
        return result
    })
}