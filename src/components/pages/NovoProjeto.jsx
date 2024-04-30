import { useNavigate } from "react-router-dom";

import FormProjeto from "../projeto/FormProjeto";
import styles from "./NovoProjeto.module.css";

function NovoProjeto() {
  const navigate = useNavigate();

  const createPost = (projeto) => {
    // Inicializando custos e serviços
    projeto.cost = 0;
    projeto.services = [];

    fetch("http://localhost:5000/projetos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projeto),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .then(() => {
        const state = { mensagem: "Projeto criado com sucesso!" };
        navigate("/projetos", { state });
      })
      .catch(console.error());
  };

  return (
    <div className={styles.novoprojeto_container}>
      <h1>Criar Projeto</h1>
      <p>Crie seu projeto para adicionar os serviços</p>
      <FormProjeto btnText="Criar projeto" handleSubmit={createPost} />
    </div>
  );
}

export default NovoProjeto;
