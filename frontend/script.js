document.getElementById('formulario').addEventListener('submit', async (e) => {
  e.preventDefault();
  const datos = Object.fromEntries(new FormData(e.target));

  const carreras = {
    '5k': { nombre: 'Carrera 5K', precio: 100, id: '5k' },
    '10k': { nombre: 'Carrera 10K', precio: 150, id: '10k' }
  };

  const carreraSeleccionada = carreras[datos.carreraId];

  if (!carreraSeleccionada) {
    alert('Seleccioná una carrera válida.');
    return;
  }

  try {
    const res = await fetch('https://inscripciones-backend.onrender.com/crear-preferencia', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...datos, carrera: carreraSeleccionada }),
    });

    const json = await res.json();

    if (!res.ok) {
      console.error('Respuesta no OK:', json);
      alert('Error al generar el enlace de pago. Intentá de nuevo.');
      return;
    }

    if (!json.init_point) {
      console.error('No se recibió init_point:', json);
      alert('Error al generar el enlace de pago. Intentá de nuevo.');
      return;
    }

    window.location.href = json.init_point;
  } catch (err) {
    console.error('Error en fetch:', err);
    alert('Error al conectar con el servidor. Verificá tu conexión.');
  }
});