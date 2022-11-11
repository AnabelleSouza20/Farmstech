import { FormNewGroup } from "../../_types";
import "./stylesGroup.scss";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import useApi from "../../hooks/useApi";


const validationForm = yup.object().shape({
  groupName: yup.string().required("O NOME do grupo é obrigatório"),
  long: yup.string().required("A LONGITUDE é obrigatória"),
  lat: yup.string().required("A LATITUDE é obrigatória"),
  group: yup.string().required("O GRUPO é obrigatório"),
  desc: yup.string().required("A REFERÊNCIA é obrigatória"),
});

type NewGroupProps = {
  onClose: () => void;
};

function NewGroup({ onClose }: NewGroupProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormNewGroup>({
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
      toast.success("Grupo cadastrado com sucesso");
    } else {
      toast.error("ERRO, Grupo não cadastrado");
    }
  };

  return (
    <main>
      <div className="cards">
        <h4 className="title">Cadastrar Novo Grupo</h4>

        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="display-form">
            <label className="label" htmlFor="groupName">
              Nome do grupo:
            </label>
            <input
              {...register("groupName")}
              className="input"
              id="groupName"
              type="text"
            />
            <p className="error-message">{errors.groupName?.message}</p>

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

export default NewGroup;
