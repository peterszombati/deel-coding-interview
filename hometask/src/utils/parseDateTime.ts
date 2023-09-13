export function parseDateTime(value: any): Date {
    if (typeof value != 'string') {
        throw new Error('invalid value in parseDateTime')
    }
    const d = new Date(value)
    if (isNaN(d.getTime())) {
        throw new Error('invalid value in parseDateTime')
    }
    return d
}