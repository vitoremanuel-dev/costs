import styles from "./Projeto.module.css";

import Loading from "../layout/Loader";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Container from "../layout/Container";

function Projeto() {
  const { id } = useParams();

  const [projeto, setProjeto] = useState([]);
  const [showProjectForm, setShowProjectForm] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      fetch(`http://localhost:5000/projetos/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setProjeto(data);
        })
        .catch((err) => console.log());
    }, 300);
  }, [id]);

  const toogleProjectForm = () => {
    setShowProjectForm(!showProjectForm);
  };

  return (
    <>
      {projeto?.name ? (
        <div className={styles.project_details}>
          <Container customClass="column">
            <div className={styles.details_container}>
              <h1>Projeto: {projeto?.name}</h1>
              <button onClick={toogleProjectForm} className={styles.btn}>
                {!showProjectForm ? "Editar projeto" : "Fechar"}
              </button>
              {!showProjectForm ? (
                <div className={styles.project_info}>
                  <p>
                    <span>Categoria: </span> {projeto.categorias.name}
                  </p>
                  <p>
                    <span>Total de orçamento: </span> R$ {projeto.budget}
                  </p>
                  <p>
                    <span>Total utilizado: </span> R$ {projeto.cost}
                  </p>
                </div>
              ) : (
                <div className={styles.project_info}>
                  <p>Detalhes do projeto</p>
                </div>
              )}
            </div>
          </Container>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}

export default Projeto;
