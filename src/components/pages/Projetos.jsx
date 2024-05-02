import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import Mensagens from "../layout/Mensagens";
import Container from "../layout/Container";
import Loading from "../layout/Loader";
import LinkButton from "../layout/LinkButton";
import CardProjeto from "../projeto/CardProjeto";

import styles from "./Projetos.module.css";

function Projetos() {
  const [projects, setProjects] = useState([]);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [projectMessage, setProjectMessage] = useState('')

  const location = useLocation();
  let mensagem = "";
  if (location.state) {
    mensagem = location.state.mensagem;
  }

  useEffect(() => {
    setTimeout(() => {
      fetch("http://localhost:5000/projetos", {
        method: "GET",
        headers: { "Content-Type": "application.json" },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setProjects(data);
          setRemoveLoading(true);
        })
        .catch(console.error());
    }, 300);
  }, []);

  function removeProject(id) {
    fetch(`http://localhost:5000/projetos/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(data => {
        setProjects(projects.filter((project) => project.id !== id));
        setProjectMessage('Projeto removido com sucesso!')
      })
      .catch(console.error());
  }

  return (
    <div className={styles.projects_container}>
      <div className={styles.title_container}>
        <h1>Meus Projetos</h1>
        <LinkButton to="/novoprojeto" text="Criar projeto" />
      </div>
      {mensagem && <Mensagens msg={mensagem} type="sucesso" />}
      {projectMessage && <Mensagens msg={projectMessage} type='sucesso'/>}
      <Container customClass="start">
        {projects.length > 0 &&
          projects.map((project) => (
            <CardProjeto
              id={project.id}
              name={project.name}
              budget={project.budget}
              category={project?.categorias?.name}
              key={project.id}
              handleRemove={removeProject}
            />
          ))}
        {!removeLoading && <Loading />}
        {removeLoading && projects.length === 0 && (
          <p>Não há projetos cadastrados!</p>
        )}
      </Container>
    </div>
  );
}

export default Projetos;
