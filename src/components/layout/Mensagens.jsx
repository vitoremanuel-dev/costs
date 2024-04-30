import { useState, useEffect } from "react";

import styles from "./Mensagens.module.css";

function Mensagens({ type, msg }) {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    if (!msg) {
      setVisivel(false);
      return;
    }

    setVisivel(true);

    const timer = setTimeout(() => {
      setVisivel(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [msg]);

  return (
    <>
      {visivel && (
        <div className={`${styles.mensagens} ${styles[type]}`}>{msg}</div>
      )}
    </>
  );
}

export default Mensagens;
