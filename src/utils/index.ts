export function distinct_json(json: any[], key: string | number | symbol): any[] {
    return json.map(v => v[key]).filter((value, index, self) => self.indexOf(value) === index)
}
export function generateColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';

    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
}