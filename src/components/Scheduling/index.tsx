
import { FormNewActive, NewActiveProps } from "../../_types";
import "./styles.scss";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import useApi from "../../hooks/useApi";
import { PoleProps, ScheduleProps } from "../../_types";
import { useEffect, useState } from "react";
import axios from "axios";


//Validação das informações
const validationForm = yup.object().shape({
  device: yup.string().required("Data obrigatória"),
  desc: yup.string().required("Hora inicial obrigatória"),
  group: yup.string().required("Hora final obrigatória"),
 
});

/*
GET - http://52.226.69.167:5002/schedule-status-dev

POST - http://52.226.69.167:5002/schedule-create-dev

"device": "teste2", "data": "2022-11-08", "scheduleStart": "20:25:21", "scheduleEnd": "20:25:21", "status": false

DELETE - http://52.226.69.167:5002/schedule-delete-dev

"device": "teste"

PUT - http://52.226.69.167:5002/schedule-update-dev

"alter": "teste2", "device": "teste21", "data": "2022-11-08", "scheduleStart": "20:25:21", "scheduleEnd": "20:25:21", "status": false
*/

function NewActive({ onClose, assets, pole }: NewActiveProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormNewActive>({
    resolver: yupResolver(validationForm),
  });
  const [ScheduleData, setScheduleData] = useState<ScheduleProps>({} as ScheduleProps);
  const [selectedPole, setSelectedPole] = useState<PoleProps>({} as PoleProps);
  const sendApi = useApi();

  //get schedule-status-dev using axios
  const getSchedule = async () => {
    const response = await axios.get(
      "schedule-status-dev"
    );
    setScheduleData(response.data);
  };

  getSchedule();
  console.log(ScheduleData);
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
              {...register("device")}
              className="input"
              id="device"
              type="date"
            />
            <p className="error-message">{errors.device?.message}</p>

            <label className="label" htmlFor="desc">
              Inicio:
            </label>
            <input
              {...register("desc")}
              className="input"
              id="desc"
              type="time"
            />
            <p className="error-message">{errors.desc?.message}</p>

            <label className="label" htmlFor="group">
              Fim:
            </label>
            <input
              {...register("group")}
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
              <div>
                <button className="btn-save" type="submit"
                onClick={() => {
                  toast.success("Agendamento realizado com sucesso!");
                }}
                >
                  Salvar
                </button>
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

export default NewActive;
