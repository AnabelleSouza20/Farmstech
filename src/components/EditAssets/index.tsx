
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
          <h4 className="title">Editar Ativo</h4>

          <form className="form" onSubmit={handleSubmit(onSubmit)}>
            <div className="display-form">
              <label className="label" htmlFor="device">
                Nome:
              </label>
              <input
                {...register("device")}
                className="input"
                value={assets?.device}
                id="device"
                type="text"
              />
              <p className="error-message">{errors.device?.message}</p>
              
              <label className="label" htmlFor="desc">
                Referência:
              </label>
              <input
                {...register("desc")}
                className="input"
                defaultValue={assets?.desc}
                id="desc"
                type="text"
              />
              <p className="error-message">{errors.desc?.message}</p>

              <label className="label" htmlFor="group">
                Grupo:
              </label>
              <input
                {...register("group")}
                className="input"
                defaultValue={assets?.group}
                id="group"
                type="text"
              />
              <p className="error-message">{errors.group?.message}</p>

              <label className="label" htmlFor="long">
                Longitude:
              </label>
              <input
                {...register("long")}
                className="input"
                defaultValue={assets?.long}
                id="long"
                type="text"
              />
              <p className="error-message">{errors.long?.message}</p>

              <label className="label" htmlFor="alt">
                Latitude:
              </label>
              <input
                {...register("lat")}
                className="input"
                defaultValue={assets?.lat}
                id="lat"
                type="text"
              />
              <p className="error-message">{errors.lat?.message}</p>

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
