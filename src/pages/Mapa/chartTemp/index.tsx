import InfluxDB from "../../../api/InfluxDB";
import ApexChart, { Props } from "react-apexcharts";
import { influxProps, influxPropsTemp, PoleProps } from "../../../_types/index";
import { useState, useEffect } from 'react';
import { generateColor, distinct_json } from "../../../utils";
import formatDate from "../../../utils/formatDate";
import "./styles.scss"


export default function Chart(pole: any) {
    const [loading, setLoading] = useState<boolean>(true);
    const [tempAssets, setTermpAssets] = useState<influxProps[]>([]);
    const [ambTemp, setAmbTemp] = useState<influxPropsTemp[]>([]);
    const [filter, setFilter] = useState<string>('');
    const [options, setOptions] = useState<Props>({
        type: 'line',
        width: '600px',
        height: 300,
        options: {
            chart: {
                id: 'basic-bar',
                toolbar: {
                    show: false
                },
                zoom: {
                    enabled: false
                },
                animations: {
                    enabled: false
                },
                foreColor: 'white',
                dropShadow: {
                    enabled: true,
                    top: 0,
                    left: 0,
                    blur: 3,
                    opacity: 0.5
                }
            },
            yaxis: {
                labels: {
                    style: {
                        colors: 'white',
                    }
                }
            },
            legend: {
                labels: {
                    colors: 'white'
                }

            },

        }
    })

    const influxInit = () => {

        InfluxDB("SELECT * FROM Temp_Device WHERE device = '" + pole.pole.device + "' AND time > now() - " + filter).then(result => setTermpAssets(result));
        InfluxDB("SELECT * FROM ambTemp WHERE time > now() - " + filter).then(result => setAmbTemp(result));
    }
    useEffect(() => {
        influxInit();
    }, [filter])

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
                style: {
                    colors: 'white',
                }
            }
        }


        setOptions(({ options, ...opt }) => ({ ...opt, series, options: { ...options, xaxis } }));
    }, [tempAssets])



    if (loading) {
        return <h1>Loading...</h1>
    }
    return (
        <div className="chartTemp">
            <div className="dropdown">
                <button className="dropbtn">Exibir: </button>
                <div className="dropdown-content">
                    <a onClick={() => setFilter('1d')}>Últimas 24 horas</a>
                    <a onClick={() => setFilter('30d')}>Últimos 30 dias</a>
                    <a onClick={() => setFilter('60d')}>Últimos 60 dias</a>
                </div>
            </div>
            <ApexChart {...options} />
        </div>
    )
}