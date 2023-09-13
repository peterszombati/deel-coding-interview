import * as http from 'http'
import * as https from 'https'

const responseHandler = (resolve: (result: { res: http.IncomingMessage, data: Buffer }) => void, reject: (e: any) => void, res: http.IncomingMessage) => {
    const buffer: Buffer[] = []

    res.on('data', (d) => {
        buffer.push(d)
    })

    res.on('end', () => {
        const {statusCode} = res

        if (statusCode && statusCode >= 200 && statusCode < 300) {
            resolve({res, data: Buffer.concat(buffer)})
        } else {
            const e = new Error(JSON.stringify({statusCode:res.statusCode}))
            // @ts-ignore
            e.res = res
            // @ts-ignore
            e.data = Buffer.concat(buffer)
            reject(e)
        }
    })
}

export const simpleHttpRequest = (options: https.RequestOptions): Promise<{ res: http.IncomingMessage, data: Buffer }> => {
    return new Promise((resolve, reject) => {
        http.request(options, (res) => {
            responseHandler(resolve, reject, res)
        }).on('error', (e) => {
            reject(e)
        }).end()
    })
}

export const simpleJsonRequest = (options: https.RequestOptions): Promise<any> => {
    return simpleHttpRequest(options).then(res => JSON.parse(res.data.toString()))
        .catch(e => {
            if (e?.data) {
                try {
                    e.data = JSON.parse(e.data.toString())
                } catch (e) {}
            }
            throw e
        })
}