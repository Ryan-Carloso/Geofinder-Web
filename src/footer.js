import React, { useState, useEffect } from 'react';

const Footer = () => {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const styles = {
    navBar: {
      position: 'fixed',
      bottom: 5,
      width: '100%',
      color: '#fff',
      padding: '1rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: "0",
      marginRight: "0",
      marginTop: "0",
    },
    logo: {
      fontSize: `${windowHeight * 0.04}px`, // Adjust font size based on window height
      fontWeight: 'bold',
      marginLeft: "2rem",
      marginRight: "2rem",
      marginTop: "1rem",
    },
    navLinks: {
      display: 'flex',
      gap: '1rem',
      marginLeft: "2rem",
      marginRight: "2rem",
      marginTop: "1rem",
      fontWeight: 700,
      borderRadius: 10,
      backgroundColor: 'rgba(51, 51, 51, 0.5)', // Aqui, 0.5 é a opacidade (50%)

    },
    link: {
      color: '#fff',
      margin: 'auto',
      textDecoration: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '0.25rem',
      transition: 'background-color 0.3s ease',
      fontSize: `${windowHeight * 0.020}px`, // Adjust font size based on window height
    },

  };

  return (
    <nav style={styles.navBar}>
      <div style={styles.navLinks}>
      <a href="##" style={{ ...styles.link, fontSize: 25 }}>GeoFinder</a>
      <a href="https://www.instagram.com/projeto.europa/" style={styles.link}>Instagram</a>
        <a href="https://www.linkedin.com/in/ryan-carlos-491763187/" style={styles.link}>Linkedin</a>
        <a href="mailto:contato.ryaninvestir@gmail.com?" style={styles.link}>mail me</a>

      </div>
    </nav>
  );
};

export default Footer;
