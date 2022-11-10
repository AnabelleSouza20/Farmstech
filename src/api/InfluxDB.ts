type InfluxResponseItem = {"series": {"columns": Array<[]>, "name": string, "values": Array<[]>}[], "statement_id": number}
type InfluxResponse = {"results": InfluxResponseItem[]}

function serialize(obj: Array<{}> | any): string {
    let params = [];
    for (const p in obj) {
        if (obj.hasOwnProperty(p)) {
            params.push(`${encodeURIComponent(p)}=${encodeURIComponent(obj[p])}`);
        }
    }
    return params.join("&");
}
export default async function InfluxDB(query: string){
    function format_influx_serie_data(response: InfluxResponseItem){
        if(!response.hasOwnProperty("series")){ return []; }
        if(!response.series.length){ return []; }

        return response.series.map(serie => {
            if(serie.hasOwnProperty("columns") && serie.hasOwnProperty("values")){
                let obj__: any = [];
                serie.values.forEach((val: any) => {
                    let temp__: any = {};
                    serie.columns.forEach((col: any, index: number) => temp__[col] = val[index]);
                    obj__.push(temp__)
                });
                return obj__;
            }
            return null;
        }).filter(i => i)[0];
    }
    function getPropsFetch(data?: any){
        return {
            method: 'GET',
            body: data || null,
            headers: {
                'Content-Type': 'application/json'
            }
        }
    }
    function get_influx_base_url(query: string): string {
        const PARAMS = {
            "pretty": true, 
            "db": process.env.REACT_APP_INFLUXDB_DATABASE,
            "u": process.env.REACT_APP_INFLUXDB_DATABASE_USER,
            "p": process.env.REACT_APP_INFLUXDB_DATABASE_PASSWORD,
            "q": query
        };
        return `${process.env.REACT_APP_INFLUXDB_IP}/query?${serialize(PARAMS)}`;
    }
    
    return await fetch(get_influx_base_url(query), getPropsFetch()).then(res => res.json()).then((response: InfluxResponse) => format_influx_serie_data(response.results[0]) ).catch(() => ([]));
}

