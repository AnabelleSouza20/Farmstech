export default function distinct_json(json: any[], key: string | number | symbol): any[] {
    return json.map(v => v[key]).filter((value, index, self) => self.indexOf(value) === index)
}