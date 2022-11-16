import { FormNewActive } from "../../_types";
import "./stylesNewActive.scss";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import useApi from "../../hooks/useApi";

const validationForm = yup.object().shape({
  device: yup.string().required("O NOME é obrigatório"),
  long: yup.string().required("A LONGITUDE é obrigatória"),
  lat: yup.string().required("A LATITUDE é obrigatória"),
  group: yup.string().required("O GRUPO é obrigatório"),
  desc: yup.string().required("A REFERÊNCIA é obrigatória"),
});

type NewActiveProps = {
  onClose: () => void;
};

function NewActive({ onClose }: NewActiveProps) {
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
      "poles-register",
      "post",
      data
    );
    if (res?.data?.FL_STATUS) {
      reset();
      onClose();
      toast.success("Ativo cadastrado com sucesso");
    } else {
      toast.error("ERRO, ativo não cadastrado");
    }
  };

  return (
    <main>      
        <div className="cards">
          <h4 className="title">Cadastrar Novo Ativo</h4>

        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="display-form">
            <label className="label" htmlFor="device">
              Nome:
            </label>
            <input
              {...register("device")}
              className="input"
              id="device"
              type="text"
            />
            <p className="error-message">{errors.device?.message}</p>

            <label className="label" htmlFor="long">
              Longitude:
            </label>
            <input
              {...register("long")}
              className="input"
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
              id="lat"
              type="text"
            />
            <p className="error-message">{errors.lat?.message}</p>

            <label className="label" htmlFor="group">
              Grupo:
            </label>
            <input
              {...register("group")}
              className="input"
              id="group"
              type="text"
            />
            <p className="error-message">{errors.group?.message}</p>

            <label className="label" htmlFor="desc">
              Referência:
            </label>
            <input
              {...register("desc")}
              className="input"
              id="desc"
              type="text"
            />
            <p className="error-message">{errors.desc?.message}</p>
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
