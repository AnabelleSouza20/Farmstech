import { EditGrupProps, FormNewGroup, FormEditGroup } from "../../_types";
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
    const register={'group':assets, 'alter':alter}
    console.log(register)
    const res = await sendApi<{ FL_STATUS: boolean; message: string }>(
      "groups-update-dev",
      "put",
      register
    );
    const errorMessage = res?.data?.message
    if (res?.data?.FL_STATUS) {
      reset();
      onClose();
      toast.success("Grupo alterado com sucesso");
    } else {
      if(errorMessage === "Not registered. Data DUPLICATE"){
        toast.error("Esse GRUPO já existe.! \n Por favor insira outro nome");
      }else{
        toast.error("Grupo não foi alterado" + errorMessage)
      }
    }
  };

  return (
    <main>
      <div className="cards-newGroup" id="card-novo">
        <h4 className="title">Editar Grupo</h4>

        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="display-form">
          <label className="label" htmlFor="group">
              Nome atual: {assets}<br/>
            </label>
            <label className="label" htmlFor="group">
             <br/> 
             Digite o novo nome:
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
