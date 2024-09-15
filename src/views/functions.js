document.addEventListener("DOMContentLoaded", () => {
  history.scrollRestoration = "manual";
  window.scrollTo(0, 0);
  
  
  //modo claro/oscuro
  const body = document.body;
  const claro = document.getElementById('ligth');
  const oscuro = document.getElementById('dark');
  const modoGuardado = localStorage.getItem('modo') || 'ligth';
  
  if (modoGuardado === 'dark') {
    body.classList.add('dark');
    oscuro.style.display = 'none';
    claro.style.display = 'block';
  } else {
    body.classList.remove('dark');
    claro.style.display = 'none';
    oscuro.style.display = 'block';
  }

    oscuro.addEventListener('click',() => {
      body.classList.add('dark');
      oscuro.style.display = 'none';
      claro.style.display = 'block';
      localStorage.setItem('modo','dark');
    })
  claro.addEventListener('click',() => {
      body.classList.remove('dark');
      claro.style.display = 'none';
      oscuro.style.display = 'block'
      localStorage.setItem('modo','ligth');
  })


  //background dinámico
  const contenedor = document.querySelector(".contenedor");
    let backgrounds = [
      'url("/image/imagen7.jpg")',
      'url("/image/museo.jpg")',
      'url("/image/METinterior.jpeg")',
      'url("/image/imagen6.jpg")',
      'url("/image/imagen1.jpg")',
      'url("/image/imagen2.jpeg")',
      'url("/image/imagen8.jpg")',
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
    const localizacion = document.getElementById("location");
    const errorLocalizacion = document.querySelector(".errorLocalizacion");
    const error = document.querySelector(".error");

    form.addEventListener("submit", e => {
      if (
        departamento.value === "" &&
        clave.value.trim() === "" &&
        localizacion.value.trim() === ""
      ) {
        e.preventDefault();
        error.style.visibility = "visible";
      }
     departamento.addEventListener('focus', () => {
      error.style.visibility = 'hidden';
      errorClave.style.visibility = "hidden";
      errorLocalizacion.style.visibility = "hidden";
      clave.value = '';
      localizacion.value = '';
     }) 
     
    errorClave.innerText = '';
    errorLocalizacion.innerText = '';
  
      let ex_reg = /^[a-zA-Z]+$/;
      if (clave.value.trim() !== "") {
        if (!ex_reg.test(clave.value)) {
          e.preventDefault();
          errorClave.style.color = "#f00424";
          errorClave.innerText = 'Este campo no admite núemeros.';
          errorClave.style.visibility = 'visible';
        } else if (clave.value.length > 20) {
          e.preventDefault();
          errorClave.style.color = "#f00424";
          errorClave.innerText = 'Este campo admite hasta 20 caracteres. '
          errorClave.style.visibility = 'visible';
        }
      }

      if (localizacion.value.trim() !== "") {
        if (!ex_reg.test(localizacion.value)) {
          e.preventDefault();
          errorLocalizacion.style.color = "#f00424";
          errorLocalizacion.innerText= 'Este campo no admite núemeros.';
          errorLocalizacion.style.visibility = 'visible';
        } else if (localizacion.value.length > 10) {
          e.preventDefault();
          errorLocalizacion.style.color = "#f00424";
          errorLocalizacion.innerText = 'Este campo admite hasta 20 caracteres.';
          errorLocalizacion.style.visibility = 'visible';
        }
      }
    });

    clave.addEventListener("focus", () => {
      error.style.visibility = "hidden";
      errorClave.style.visibility = "hidden";
      errorLocalizacion.style.visibility = "hidden";
      clave.value = '';
      localizacion.value = '';
    });

    localizacion.addEventListener("focus", () => {
      error.style.visibility = "hidden";
      errorClave.style.visibility = "hidden";
      errorLocalizacion.style.visibility = "hidden";
      clave.value = '';
      localizacion.value = '';
    });
});
