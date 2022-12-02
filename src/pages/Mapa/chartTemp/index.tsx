import InfluxDB from "../../../api/InfluxDB";
import ApexChart, { Props } from "react-apexcharts";
import { influxProps, influxPropsTemp, PoleProps } from "../../../_types/index";
import { useState, useEffect } from 'react';
import { generateColor, distinct_json } from "../../../utils";
import formatDate from "../../../utils/formatDate";


export default function Chart(pole: any) {
    const [loading, setLoading] = useState<boolean>(true);
    const [tempAssets, setTermpAssets] = useState<influxProps[]>([]);
    const [ambTemp, setAmbTemp] = useState<influxPropsTemp[]>([]);
    const [options, setOptions] = useState<Props>({
        type: 'line',
        width: '600px',
        height: 300,
        options:{
              yaxis: {
                labels: {
                    style:{
                        colors: 'white',
                    }
                }
            },
            legend: {
               labels:{
                colors: 'white'
               }

            },

       }
    })

    const influxInit = () => {

        InfluxDB("SELECT * FROM Temp_Device WHERE device = '" + pole.pole.device + "' AND time > now() - 365d").then(result =>  setTermpAssets(result) );
        InfluxDB("SELECT * FROM ambTemp WHERE time > now() - 365d").then(result =>  setAmbTemp(result) );
    }

    useEffect(() => {
        const loadPageData = async () => {
            try {
                influxInit();
                const influxRequest = setInterval(() => influxInit(), 10 * 6000);
                return () => clearInterval(influxRequest);
            } catch {
                console.error('Erro ao buscar dados')
            } finally {
                setLoading(false);
            }
        }
        loadPageData()
    }, [pole])
    
        

    console.log(ambTemp);

    const tempAmpGraph: influxProps[] = ambTemp.map(data => {
        return {
            time: data.time,
            device: 'AMBIENTE',
            value: data.ambTemp
        }
    })
    Object.assign(tempAssets, tempAmpGraph)

    useEffect(() => {
        const distinct_times = distinct_json(tempAssets, "time");
        const distinct_devices = distinct_json(tempAssets, "device");
        const series = distinct_devices.map(device => {
            return {
                name: device,
                color: generateColor(),
                data: distinct_times.map(time => {
                    const info = tempAssets.find(d => d.time === time && d.device === device)
                    return info?.value || 0
                })
            };
        });
        
        const xaxis = {
            categories: distinct_times.map((time: string) => formatDate(new Date(time), "DD/MM HH:ss")),
            labels: {
                style:{
                    colors: 'white',
                }
            }
        }


        setOptions(({options,...opt}) => ({ ...opt, series, options: {...options, xaxis}}));
    }, [tempAssets])



    if (loading) {
        return <h1>Loading...</h1>
    }
    return (
        <>
            <ApexChart {...options} />
        </>
    )
}