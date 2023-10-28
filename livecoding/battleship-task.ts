export function battleship(inp: (0|1)[][]) {
    // @ts-ignore
    const map: (0|1)[][] = Array.from(inp)
    const ships: { start: { y: number, x: number}, end: { y: number, x: number }}[] = []

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map.length; x++) {
            if (map[y][x] === 1) {
                const result = findShip(y, x, map)
                if (result.y) {
                    ships.push({
                        start: {
                            y, x,
                        },
                        end: {
                            y: result.y,
                            x: x,
                        },
                    })
                } else if (result.x) {
                    ships.push({
                        start: {
                            y, x,
                        },
                        end: {
                            y: y,
                            x: result.x,
                        },
                    })
                    x = result.x
                } else {
                    ships.push({
                        start: { y, x },
                        end: { y, x },
                    })
                }
            }
        }
    }
    return ships
}

function findShip(
    _y: number,
    _x: number,
    map: (0|1|null)[][],
): { y?: number, x?: number } {
    if (map.length - 1 > _y) {
        let y = _y + 1
        for (; y < map.length; y++) {
            if (map[y][_x] !== 1) {
                y--
                break
            }
            map[y][_x] = 0
        }
        if (y > _y) {
            return { y: Math.min(map.length - 1) }
        }
    }
    if (map[_y].length - 1 > _x) {
        let x = _x + 1
        for (; x < map[_y].length; x++) {
            if (map[_y][x] !== 1) {
                x--
                break
            }
            map[_y][x] = 0
        }
        if (x > _x) {
            return { x: Math.min(map[_y].length - 1, x) }
        }
    }
    return {}
}
