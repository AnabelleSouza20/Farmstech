import { EditGrupProps, FormNewGroup} from "../../_types";
import "./stylesGroup.scss";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import useApi from "../../hooks/useApi";

const validationForm = yup.object().shape({
  group: yup.string().required("O NOME do grupo é obrigatório"),
});

function NewGroup({onClose, assets}:EditGrupProps) {
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
    const alter = data.group
    const register={"device":assets};
    if(alter === assets){
      const res = await sendApi<{ FL_STATUS: boolean; message: string }>(
        "poles-delete-dev",
        "delete",
        register, 
        false
      );
      
      if (!res?.data?.FL_STATUS) {
        reset();
        onClose();
        toast.success("Ativos deletado com sucesso");
      } else {
        toast.error("Ativos não foi deletado, erro de requisição")
      }
    }else{
      toast.error("Nome do ativos Incorreto")
    }
  };

  return (
    <main>
      <div className="cards-newGroup" id="card-novo">
        <h4 className="title">Deletar Ativo</h4>
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="display-form">
          <label className="label" htmlFor="group">
              Ativo: {assets}<br/>
            </label>
            <label className="label" htmlFor="group">
             <br/> 
             Digite o nome do ativo para ser deletado:
            </label>
            <input
              {...register("group")}
              className="input"
              id="group"
              type="text"
            />
            <p className="error-message">{errors.group?.message}</p>
          </div>
          <div className="btn">
            <div>
              <button className="btn-save" type="submit">
                Deletar
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
