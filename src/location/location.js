export function obtenerUbicacion() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        obtenerDatosUbicacion(lat, lon);
      });
    } else {
      alert("La geolocalización no está soportada por tu navegador.");
    }
  }

  function obtenerDatosUbicacion(lat, lon) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        const ciudad = data.address.city || data.address.village || data.address.town;
        const estado = data.address.state;

        // Combina diferentes campos que pueden contener información sobre la calle
        const posiblesCalles = [
          data.address.road,
          data.address.street,
          data.address.suburb,
          data.address.neighbourhood
        ];

        // Filtra las calles que no son nulas ni indefinidas
        const callesValidas = posiblesCalles.filter(calle => calle !== null && calle !== undefined);

        // Usa la primera calle válida, o muestra un mensaje alternativo si no hay calles válidas
        const calle = callesValidas.length > 0 ? callesValidas[0] : "Calle no disponible";

        const pais = data.address.country;
        const codigoPostal = data.address.postcode || "Código postal no disponible";

        // Muestra la dirección obtenida en el párrafo específico
        const direccionTexto = `Ciudad: ${ciudad}, Estado: ${estado}, Calle: ${calle}, País: ${pais}, Código Postal: ${codigoPostal}`;
        alert(direccionTexto);
      })
      .catch(error => {
        console.error("Error al obtener los datos de la ubicación:", error);
        alert("Error al obtener la dirección del usuario.");
      });
  }