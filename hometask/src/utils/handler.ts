export function handler(res, promise: Promise<any>) {
    promise.then(result => {
        res.json(result)
    }).catch(e => {
        if (e.statusCode === undefined) {
            res.status(500).json({error:'Internal Server Error'})
        } else {
            res.status(e.statusCode).json({error:e.message})
        }
    })
}