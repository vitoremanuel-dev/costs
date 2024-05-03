import { parse, v4 as uuidv4 } from "uuid";

import styles from "./Projeto.module.css";

import Loading from "../layout/Loader";
import FormProjeto from "../projeto/FormProjeto";
import Container from "../layout/Container";
import Mensagens from "../layout/Mensagens";
import ServiceForm from "../service/ServiceForm";
import ServiceCard from "../service/ServiceCard";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function Projeto() {
  const { id } = useParams();

  const [projeto, setProjeto] = useState([]);
  const [services, setServices] = useState([]);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [mensagem, setMensagem] = useState();
  const [type, setType] = useState();

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
          setServices(data.services);
        })
        .catch((err) => console.log());
    }, 300);
  }, [id]);

  const editProject = (projeto) => {
    setMensagem("");

    if (projeto.budget < projeto.cost) {
      setMensagem("O orçamento não pode ser menor que o custo do projeto!");
      setType("erro");
      return false;
    }

    fetch(`http://localhost:5000/projetos/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "applcation/json",
      },
      body: JSON.stringify(projeto),
    })
      .then((res) => res.json())
      .then((data) => {
        setProjeto(data);
        setShowProjectForm(false);
        setMensagem("Projeto atualizado");
        setType("sucesso");
      })
      .catch((err) => console.log(err));
  };

  const toogleProjectForm = () => {
    setShowProjectForm(!showProjectForm);
  };

  const toogleServiceForm = () => {
    setShowServiceForm(!showServiceForm);
  };

  const createService = (projeto) => {
    setMensagem("");
    const lastService = projeto.services[projeto.services.length - 1];

    lastService.id = uuidv4();

    const lastServiceCost = lastService.cost;

    const newCost = parseFloat(projeto.cost) + parseFloat(lastServiceCost);

    if (newCost > parseFloat(projeto.budget)) {
      setMensagem("Orçamento ultrapassado, verifique o valor do serviço");
      setType("erro");
      projeto.services.pop();
      return false;
    }

    projeto.cost = newCost;

    fetch(`http://localhost:5000/projetos/${projeto.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projeto),
    })
      .then((res) => res.json())
      .then((data) => {
        setShowServiceForm(false);
      })
      .catch((err) => console.log(err));
  };

  const removeService = (id, cost) => {
    setMensagem("");

    const servicesUpdated = projeto.services.filter(
      (service) => service.id !== id
    );

    const projectUpdated = projeto;

    projectUpdated.services = servicesUpdated;
    projectUpdated.cost = parseFloat(projectUpdated.cost) - parseFloat(cost);

    fetch(`http://localhost:5000/projetos/${projectUpdated.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projectUpdated),
    })
      .then((res) => res.json)
      .then((data) => {
        setProjeto(projectUpdated);
        setServices(servicesUpdated);
        setMensagem("Serviço removido com sucesso");
        setType("sucesso");
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      {projeto?.name ? (
        <div className={styles.project_details}>
          <Container customClass="column">
            {mensagem && <Mensagens type={type} msg={mensagem} />}
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
                  <FormProjeto
                    handleSubmit={editProject}
                    btnText="Concluir"
                    projectData={projeto}
                  />
                </div>
              )}
            </div>
            <div className={styles.service_form_container}>
              <h2>Adicione um serviço:</h2>
              <button onClick={toogleServiceForm} className={styles.btn}>
                {!showServiceForm ? "Adicionar serviço" : "Fechar"}
              </button>
              <div className={styles.project_info}>
                {showServiceForm && (
                  <ServiceForm
                    handleSubmit={createService}
                    btnText="Adicionar serviço"
                    projectData={projeto}
                  />
                )}
              </div>
            </div>
            <h2>Serviços</h2>
            <Container customClass="start">
              {services.length > 0 &&
                services.map((service) => (
                  <ServiceCard
                    id={service.id}
                    name={service.name}
                    cost={service.cost}
                    description={service.description}
                    key={service.id}
                    handleRemove={removeService}
                  />
                ))}
              {services.length === 0 && <p>Não há serviços cadastrados!</p>}
            </Container>
          </Container>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}

export default Projeto;
