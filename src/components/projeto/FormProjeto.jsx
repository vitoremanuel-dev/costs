import { useState, useEffect } from "react";

import Input from "../form/Input";
import Select from "../form/Select";
import SubmitButton from "../form/SubmitButton";

import styles from "./FormProjeto.module.css";

function FormProjeto({ btnText, handleSubmit, projectData }) {
  const [categorias, setCategorias] = useState([]);
  const [project, setProject] = useState(projectData || {});

  useEffect(() => {
    fetch("http://localhost:5000/categorias", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCategorias(data);
      })
      .catch(console.error());
  }, []);

  const submit = (e) => {
    e.preventDefault();
    handleSubmit(project);
  };

  function handleChange(e) {
    setProject({ ...project, [e.target.name]: e.target.value });
  }

  function handleCategory(e) {
    setProject({
      ...project,
      categorias: {
        id: e.target.value,
        name: e.target.options[e.target.selectedIndex].text,
      },
    });
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <Input
        type="text"
        text="Nome do projeto"
        name="name"
        placeholder="Insira um nome do projeto"
        handleOnChange={handleChange}
        value={project.name ? project.name : ""}
      />
      <Input
        type="number"
        text="Orçamento do projeto"
        name="budget"
        placeholder="Insira o orçamento total"
        handleOnChange={handleChange}
        value={project.budget ? project.budget : ""}
      />
      <Select
        name="category_id"
        text="Selecione a categoria"
        options={categorias}
        handleOnChange={handleCategory}
        value={project.categorias ? project.categorias.id : ""}
      />
      <SubmitButton text={btnText} />
    </form>
  );
}

export default FormProjeto;
