const inputPedido = document.getElementById('input-pedido');
const btnBuscar = document.getElementById('btn-buscar');
const mensajeError = document.getElementById('mensaje-error');
const resultadoDebug = document.getElementById('resultado-debug');

// Etapa 1: solo valida que Búsqueda -> API -> preview de datos (mock) funciona de punta a punta.
// La pantalla de Preview real (con la etiqueta visual y el QR) se construye en una etapa posterior.
async function buscarPedido() {
    const codigoPedido = inputPedido.value.trim();
    mensajeError.textContent = '';
    resultadoDebug.textContent = '';

    if (!codigoPedido) {
        mensajeError.textContent = 'Ingresá un número de pedido.';
        return;
    }

    try {
        const response = await fetch(`${window.neostoneApi.apiBaseUrl}/etiquetas/preview/${encodeURIComponent(codigoPedido)}`);
        const data = await response.json();

        if (!response.ok) {
            mensajeError.textContent = data.error || 'Error consultando el pedido.';
            return;
        }

        resultadoDebug.textContent = JSON.stringify(data, null, 2);
    } catch (error) {
        mensajeError.textContent = 'No se pudo conectar con la API interna.';
        console.error(error);
    }
}

btnBuscar.addEventListener('click', buscarPedido);
inputPedido.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        buscarPedido();
    }
});
