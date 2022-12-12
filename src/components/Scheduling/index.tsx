import react from "react";
import { FormNewActive, NewActiveProps } from "../../_types";
import "./styles.scss";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import useApi from "../../hooks/useApi";
import { PoleProps } from "../../_types";
import { useEffect, useState } from "react";
import axios from "axios";
import { CircularProgress } from "@mui/material";

/*
GET - http://52.226.69.167:5002/schedule-status-dev

POST - http://52.226.69.167:5002/schedule-create-dev

"device": "teste2", "data": "2022-11-08", "scheduleStart": "20:25:21", "scheduleEnd": "20:25:21", "status": false

DELETE - http://52.226.69.167:5002/schedule-delete-dev

"device": "teste"

PUT - http://52.226.69.167:5002/schedule-update-dev

"alter": "teste2", "device": "teste21", "data": "2022-11-08", "scheduleStart": "20:25:21", "scheduleEnd": "20:25:21", "status": false
*/

function Scheduling({ onClose, assets, pole }: NewActiveProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormNewActive>({
  });
  const [SchedulesData , setScheduleData] = useState<any>();
  const [selectedPole, setSelectedPole] = useState<PoleProps>({} as PoleProps);
  const [selectDate, setSelectDate] = useState<string>("");
  const [alreadyScheduled, setAlreadyScheduled] = useState<boolean>(false);
  const [scheduleStart, setScheduleStart] = useState<string>("");
  const [scheduleEnd, setScheduleEnd] = useState<string>("");
  const [status, setStatus] = useState<boolean>(false);
  const [isLoading1, setIsLoading1] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const sendApi = useApi();

  //get schedule-status-dev using axios
  const getSchedule = async () => {
    const response = await axios.get(
      "http://52.226.69.167:5002/schedule-status-dev"
    );
    setScheduleData(response.data.data);
  };
  useEffect(() => {
    getSchedule();
  }, []);
  // to-do: atualizar essa função com o useApi
  const newSchedule = async () => {
    const response = await axios.post(
      "http://52.226.69.167:5002/schedule-create-dev",
      {
        device: pole?.device,
        data: selectDate,
        scheduleStart: scheduleStart,
        scheduleEnd: scheduleEnd,
        status: false,
      }
    );
    //limpar os campos
    setSelectDate("");
    setScheduleStart("");
    setScheduleEnd("");

    if (response?.data && response.data.FL_STATUS) {
      toast.success("Agendamento atualizado com sucesso!");
      setIsLoading1(false);
    } else {
      toast.error("Erro ao atualizar agendamento!");
    }  };

  const updateSchedule = async () => {
    const response = await axios.put(
        "http://52.226.69.167:5002/schedule-update-dev",
        {
          alter: pole?.device,
          device: pole?.device,
          data: selectDate,
          scheduleStart: scheduleStart,
          scheduleEnd: scheduleEnd,
          status: false,
        }
      );
      //limpar os campos
      setSelectDate("");
      setScheduleStart("");
      setScheduleEnd("");
      
      if (response?.data && response.data.FL_STATUS) {
        toast.success("Agendamento atualizado com sucesso!");
        setIsLoading2(false);
      } else {
        toast.error("Erro ao atualizar agendamento!");
      }
  };

  //find the pole on the ScheduleData, if it exists, setAlreadyScheduled to true
  const findPole = () => {
    const poleFound = SchedulesData?.find( (item: any) => item?.device === pole?.device);
    if (poleFound) {
      setAlreadyScheduled(true);
    } else {
      setAlreadyScheduled(false);
    }
  };
  useEffect(() => {
    findPole();
  }, [SchedulesData]);

  //check if the date is valid, can't be in the past
  const checkDate = ( date: string ) => {
    const today = new Date();
    const dateToCheck = new Date(date);
    if (dateToCheck < today) {
      return false;
    } else {
      return true;
    }
  };

 
  return (
    <main>
      <div className="cards">
        <h4 className="title">Agendamento</h4>
        <form className="form">
          <div className="display-form">
            <label className="label" htmlFor="device">
              Data:
            </label>
            <input
              onChange={(e) => setSelectDate(e.target.value)}
              className="input"
              id="device"
              type="date"
            />
            <p className="error-message">{errors.device?.message}</p>

            <label className="label" htmlFor="desc">
              Inicio:
            </label>
            <input
              onChange={(e) => setScheduleStart(e.target.value + ":00")}
              className="input"
              id="desc"
              type="time"
            />
            <p className="error-message">{errors.desc?.message}</p>

            <label className="label" htmlFor="group">
              Fim:
            </label>
            <input
              onChange={(e) => setScheduleEnd(e.target.value + ":00")}
              className="input"
              id="group"
              type="time"
            />
            <p className="error-message">{errors.group?.message}</p>
            </div>

            {/* <div className= "demo-simple-select-label">
              <select>
                <option value={1}>Segunda-Feira</option>
                <option value={2}>Terça-Feira</option>
                <option value={3}>Quarta-Feira</option>
                <option value={4}>Quinta-Feira</option>
                <option value={5}>Sexta-Feira</option>
                <option value={6}>Sábado</option>
                <option value={7}>Domingo</option>
              </select>
            </div> */}

            <div className="btn">
              {/* renderização condicional do botão de salvar/atualizar */}
              <div>
                {alreadyScheduled ? (
                  isLoading2 ? (
                  <CircularProgress /> 
                ) : (
                <button className="btn-save"
                
                onClick={(e) => {
                  e.preventDefault();
                  if (!checkDate(selectDate)) {
                    toast.error("Data inválida!");
                  } else if (scheduleStart > scheduleEnd) {
                    toast.error("Horário inválido!");
                  } else {

                   setIsLoading2(true);
                  updateSchedule();
                }}}
                >
                  Atualizar
  
                </button>
              )
              ) : (
                <button className="btn-save"
                
                onClick={(e) => {
                  setIsLoading1(true);
                  e.preventDefault();
                  newSchedule();
                }}
                >
                  Salvar
                </button>
              )}
              </div>
                
              <div>
                <button className="btn-cancel" onClick={onClose}>
                  Cancelar
                </button>
              </div>
            </div>
        </form>
      </div>

    </main>
  );
}


export default Scheduling;
