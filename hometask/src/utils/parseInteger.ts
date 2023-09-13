export function parseInteger(value: any): number {
    if (typeof value != 'string') {
        throw new Error('invalid value in parseInteger')
    }
    if (!/^\d+$/g.test(value)) {
        throw new Error('invalid value in parseInteger')
    }
    return parseInt(value, 10)
}