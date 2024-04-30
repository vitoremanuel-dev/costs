import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import Mensagens from "../layout/Mensagens";
import Container from "../layout/Container";
import LinkButton from "../layout/LinkButton";
import CardProjeto from "../projeto/CardProjeto";

import styles from "./Projetos.module.css";

function Projetos() {
  const [projects, setProjects] = useState([]);

  const location = useLocation();
  let mensagem = "";
  if (location.state) {
    mensagem = location.state.mensagem;
  }

  useEffect(() => {
    fetch("http://localhost:5000/projetos", {
      method: "GET",
      headers: { "Content-Type": "application.json" },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setProjects(data);
      })
      .catch(console.error());
  }, []);

  return (
    <div className={styles.projects_container}>
      <div className={styles.title_container}>
        <h1>Meus Projetos</h1>
        <LinkButton to="/novoprojeto" text="Criar projeto" />
      </div>
      {mensagem && <Mensagens msg={mensagem} type="sucesso" />}
      <Container customClass="start">
        {projects.length > 0 &&
          projects.map((project) => (
            <CardProjeto
              id={project.id}
              name={project.name}
              budget={project.budget}
              category={project?.categorias?.name}
              key={project.id}
            />
          ))}
      </Container>
    </div>
  );
}

export default Projetos;
