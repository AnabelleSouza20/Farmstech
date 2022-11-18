
import { FormNewActive, NewActiveProps } from "../../_types";
import "./styles.scss";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import useApi from "../../hooks/useApi";

const validationForm = yup.object().shape({
  device: yup.string().required("O NOME é obrigatório"),
  desc: yup.string().required("A REFERÊNCIA é obrigatória"),
  group: yup.string().required("O GRUPO é obrigatório"),
  long: yup.string().required("A LONGITUDE é obrigatória"),
  lat: yup.string().required("A LATITUDE é obrigatória"),
  
});

function NewActive({onClose, assets}:NewActiveProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormNewActive>({
    resolver: yupResolver(validationForm),
  });

  const sendApi = useApi();

  const onSubmit = async (data: any) => {
    const res = await sendApi<{ FL_STATUS: boolean; message: string }>(
      "poles-update-dev/byfront",
      "put",
      data
    );
    if (res?.data?.FL_STATUS) {
      reset();
      toast.success("Ativo Editado com sucesso");
      onClose()
    } else {
      toast.error("ERRO, ativo não foi editado");
    }
  };

  return (
    <main>      
        <div className="cards">
          <h4 className="title">Agendamento</h4>
          <h4 className="assets">{assets?.device}</h4>

          <form className="form" onSubmit={handleSubmit(onSubmit)}>
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

              <label className="label" htmlFor="long">
                Repetir:
              </label>
              <input
                {...register("long")}
                className="input"
                id="long"
                type="text"
              />
              <p className="error-message">{errors.long?.message}</p>
            </div>

            <div className="btn">
              <div>
                <button className="btn-save" type="submit">
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
