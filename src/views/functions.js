document.addEventListener("DOMContentLoaded", () => {
  history.scrollRestoration = "manual";
  window.scrollTo(0, 0);

  //background dinámico 
  const contenedor = document.querySelector(".contenedor");
  if (contenedor) {
    let backgrounds = [
      'url("/image/museo.jpg")',
      'url("/image/METinterior.jpeg")',
      'url("/image/imagen1.jpg")',
      'url("/image/imagen2.jpeg")',
      'url("/image/imagen3.jpeg")',
      'url("/image/imagen4.jpg")',
      'url("/image/imagen5.jpg")'
    ];
    let indiceBackgroundActual = 0;
    if (indiceBackgroundActual === 0) {
      contenedor.style.setProperty(
        "--background-image",
        'url("/image/fondoNegro2.png")'
      );
    }
    const cambiarBackground = () => {
      console.log("Cambiando fondo a:", backgrounds[indiceBackgroundActual]);
      contenedor.classList.add("fade-out");
      setTimeout(() => {
        contenedor.style.setProperty(
          "--background-image",
          backgrounds[indiceBackgroundActual]
        );
        contenedor.classList.remove("grow");

        setTimeout(() => {
          contenedor.classList.add("grow");
        }, 50);
        contenedor.classList.remove("fade-out");
        contenedor.classList.add("fade-in");
        indiceBackgroundActual =
          (indiceBackgroundActual + 1) % backgrounds.length;
        setTimeout(() => {
          contenedor.classList.remove("fade-in");
        }, 1000);
      }, 1000);
    };

    setInterval(cambiarBackground, 5000);
    
  const buscador = document.querySelector(".buscador");
  const deslizar = document.querySelector(".deslizar");
  if (buscador) {
    const mostrarBuscador = () => {
      if (window.scrollY >= window.innerHeight / 2 - 200) {
        buscador.style.visibility = "visible";
        deslizar.style.visibility = "hidden";
      } else if (window.scrollY < window.innerHeight / 2 - 200) {
        buscador.style.visibility = "hidden";
        deslizar.style.visibility = "visible";
      }
    };

    window.addEventListener("scroll", mostrarBuscador);
  }

 //validación de los campos del formulario
 const form = document.querySelector("form");
 const departamento = document.getElementById("departmentId");
 const clave = document.getElementById("clave");
 const errorClave = document.querySelector(".errorClave");
 const localizacion = document.getElementById("localizacion");
 const errorLocalizacion = document.querySelector(".errorLocalizacion");
 const error = document.querySelector(".error");

 form.addEventListener('submit', (e) => {
   if(departamento.value === '' && clave.value.trim() === '' && localizacion.value.trim() === ''){
     e.preventDefault();
     error.style.display = 'block';
     
   }
   errorClave.innerText ='';
   errorLocalizacion.innerText = '';
   let ex_reg = /^[a-zA-Z]+$/;
   if (clave.value.trim() !== '') {
     if (!ex_reg.test(clave.value)) {
       e.preventDefault();
       errorClave.style.color = '#f00424';
       errorClave.innerText = 'Este campo no admite números.';
     } else if (clave.value.length > 20) {
       e.preventDefault();
       errorClave.style.color = '#f00424';
       errorClave.innerText = 'Este campo admite hasta 20 caracteres.';
     }
   }

   if (localizacion.value.trim() !== '') {
     if (!ex_reg.test(localizacion.value)) {
       e.preventDefault();
       errorLocalizacion.style.color = '#f00424';
       errorLocalizacion.innerText = 'Este campo no admite números.';
     } else if (localizacion.value.length > 10) {
       e.preventDefault();
       errorLocalizacion.style.color = '#f00424';
       errorLocalizacion.innerText = 'Este campo admite hasta 10 caracteres.';
     }
   }
});
departamento.addEventListener('focus', () => {
 error.style.display = 'none';
 errorClave.style.display = 'none';
 errorLocalizacion.style.display = 'none';
});

clave.addEventListener('focus', () => {
 error.style.display = 'none';
 errorClave.innerText = '';
 clave.value = '';
});

localizacion.addEventListener('focus', () => {
 error.style.display = 'none';
 errorLocalizacion.innerText = '';
 localizacion.value = '';
});

} 

//fuera de .contenedor index.pug

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
      top: document.body.scrollHeight + 500,
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

      if (!contenedorDeImagenes) {
        throw new Error("El contenedor de imágenes no existe.");
      }
        contenedorDeImagenes.style.display = "block";
        contenedorAbierto = contenedorDeImagenes;

        const imagenes = contenedorDeImagenes.querySelectorAll( ".carrusel-image img");
        const atras = contenedorDeImagenes.querySelector(".atras");
        const adelante = contenedorDeImagenes.querySelector(".adelante");
        const cerrar = contenedorDeImagenes.querySelector(".cerrar");

        if (imagenes.length === 0) {
          contenedorDeImagenes.style.display = "none";
          contenedorAbierto = null;
          alert('No se pueden mostrar las imagenes adicionales de esta obra.');
          throw new Error("No hay imágenes disponibles para mostrar.");
        }
  

        let indice = 0;
        imagenes.forEach(img => {
          img.addEventListener('error', () => {
            img.src = '/image/sinImagen.jpg';
          })
        })
        imagenes.forEach(img => {
          img.addEventListener('error', () => {
            img.src = '/image/sinImagen.jpg';
          })
        })
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
        
        if (cerrar) {
          cerrar.addEventListener("click", () => {
            contenedorDeImagenes.style.display = "none";
            contenedorAbierto = null;
          });
        } else {
          console.warn("El botón de cerrar no se encontró.");
        }
      
      } catch (error) {
        console.error("Error al abrir el contenedor de imágenes:", error);
      }
      
    });
  });
});
