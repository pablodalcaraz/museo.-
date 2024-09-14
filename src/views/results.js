document.addEventListener('DOMContentLoaded', () => {
    
    const body = document.body;
    const modoGuardado = localStorage.getItem('modo');
    if (modoGuardado === 'dark') {
        body.classList.add('dark');
    }
    const contReseults = document.querySelector('.cont-resultados');
    //flechas de scroll subir y bajar con click y scroll
    const bajar = document.querySelector(".bajar");
    const subir = document.querySelector(".subir");
  
    const cambiarConScroll = () => {
      let alturaPantalla = document.body.scrollHeight - window.innerHeight - 200;
      if (window.scrollY >= alturaPantalla) {
        bajar.style.display = "none";
        subir.style.display = "block";
      } else if (window.scrollY <= 200) {
        subir.style.display = "none";
        bajar.style.display = "block";
      }
    };
    window.addEventListener("scroll", cambiarConScroll);
    cambiarConScroll();
  
    bajar.addEventListener("click", () => {
      window.scrollTo({
        top: document.body.scrollHeight ,
        behavior: "smooth"
      });
      bajar.style.display = "none";
      subir.style.display = "block";
    });
    subir.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
      subir.style.display = "none";
      bajar.style.display = "block";
    });
    //animación flechas 
    bajar.style.transition = "transform 3s ease";
    subir.style.transition = "transform 3s ease";
    setInterval(() => {
      bajar.style.transform = "scale(1.3)";
      subir.style.transform = "scale(1.3)";
  
      setTimeout(() => {
        bajar.style.transform = "scale(1)";
        subir.style.transform = "scale(1)";
      }, 1000);
    }, 2000);
  
    //Contenedor de imagenes adicionales
    let contenedorAbierto = null;
    const botones = document.querySelectorAll(".ver-imagenes");
    botones.forEach(boton => {
      boton.addEventListener("click", () => {
        try {
          const objectId = boton.getAttribute("data-id");
          const contenedorDeImagenes = document.querySelector(
            `.imagen_adicional[data-id="${objectId}"]`
          );
          if (contenedorAbierto) {
            return;
          }
  
          contenedorDeImagenes.style.display = "block";
          contenedorAbierto = contenedorDeImagenes;
  
          const imagenes = contenedorDeImagenes.querySelectorAll(
            ".carrusel-image img"
          );
          const atras = contenedorDeImagenes.querySelector(".atras");
          const adelante = contenedorDeImagenes.querySelector(".adelante");
          const cerrar = contenedorDeImagenes.querySelector(".cerrar");
  
          let indice = 0;
          const mostrarImagen = indice => {
            imagenes.forEach((img, i) => {
              img.style.display = i === indice ? "block" : "none";
            });
          };
  
          if (imagenes.length > 1) {
            adelante.style.display = "block";
            atras.style.display = "block";
          }
          atras.addEventListener("click", () => {
            indice = indice === 0 ? imagenes.length - 1 : indice - 1;
            mostrarImagen(indice);
          });
          adelante.addEventListener("click", () => {
            indice = indice === imagenes.length - 1 ? 0 : indice + 1;
            mostrarImagen(indice);
          });
          mostrarImagen(indice);
  
          cerrar.addEventListener("click", () => {
            contenedorDeImagenes.style.display = "none";
            contenedorAbierto = null;
          });
        } catch (error) {
          console.error("Error al abrir el contenedor de imágenes:", error);
        }
      });
    });
    if(contReseults){
        contReseults.style.display = 'block';
    }
})