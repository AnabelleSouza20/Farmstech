import { PoleProps } from "./../../../_types";
import "./styles.scss";

export interface PopoverProps {
    onClick?: (lamp: string, { device }: PoleProps, state: boolean) => void
    pole?: PoleProps
}
const Popover = ({ pole }: PopoverProps) => {
    const teste = () => {
        console.log("clicou!", new Date());
    }
    return (
        <main className="bg-primary p-3">
            <header className="mb-3 text-align-center">
                <h1 className='title'>{pole?.device}</h1>
                <h4>{pole?.desc}</h4>
            </header>

            <section className="mb-3">
                <div className="d-flex align-items-center">
                    <h3>1ª Lampâda:</h3>
                    <button onClick={teste}>
                        {pole?.lamp1 ? 'Apagar' : 'Acender'}
                    </button>
                    {/* Lamp 1: <button type='button' className='itembtn' onClick={() => pole && onClick('lamp1', pole, !pole.lamp1)}>{pole?.lamp1 ? 'Desligar' : 'Ligar'}</button> */}
                </div>
                {/* <h3 className='lamp'>
                        Lamp 2: <button type='button' className='itembtn' onClick={() => pole && onClick('lamp2', pole, !pole.lamp2)}>{pole?.lamp2 ? 'Desligar' : 'Ligar'}</button>
                    </h3>
                    <h3 className='lamp'>
                        Lamps:  <button type='button' className='itembtn' onClick={() => pole && onClick('allLamps', pole, (pole.lamp1 && pole.lamp2))}>{!(pole?.lamp1 && pole?.lamp2) ? "Desligar tudo" : "Ligar tudo"}</button>
                    </h3> */}
            </section>
            <section className="mb-3">
                <ul>
                    <li>
                        <strong className='itensnome'>Latitude:</strong> <span>{pole?.lat}</span>
                    </li>
                    <li>
                        <strong className='itensnome'>Longitude:</strong> <span>{pole?.long}</span>
                    </li>
                    <li>
                        <strong className='itensnome'>Temperatura do Ativo:</strong> <span>{pole?.tempESP}</span>
                    </li>
                </ul>
            </section>
        </main>
    );
}

export default Popover;