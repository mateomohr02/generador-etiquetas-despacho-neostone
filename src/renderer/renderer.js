const pantallaBusqueda = document.getElementById('pantalla-busqueda');
const pantallaPreview = document.getElementById('pantalla-preview');

const inputPedido = document.getElementById('input-pedido');
const btnBuscar = document.getElementById('btn-buscar');
const mensajeError = document.getElementById('mensaje-error');

const btnVolver = document.getElementById('btn-volver');
const btnImprimirTodas = document.getElementById('btn-imprimir-todas');
const previewTitulo = document.getElementById('preview-titulo');
const mensajeErrorPreview = document.getElementById('mensaje-error-preview');
const mensajeImprimirTodas = document.getElementById('mensaje-imprimir-todas');
const listaEtiquetas = document.getElementById('lista-etiquetas');

let etiquetasRenderizadas = [];

function mostrarBusqueda() {
    pantallaPreview.classList.add('oculto');
    pantallaBusqueda.classList.remove('oculto');
    listaEtiquetas.innerHTML = '';
    mensajeErrorPreview.textContent = '';
    mensajeImprimirTodas.textContent = '';
    etiquetasRenderizadas = [];
}

function mostrarPreview(pedido, etiquetas) {
    pantallaBusqueda.classList.add('oculto');
    pantallaPreview.classList.remove('oculto');
    previewTitulo.textContent = `Pedido ${pedido} — ${etiquetas.length} etiqueta(s)`;
    renderEtiquetas(etiquetas);
}

function renderEtiquetas(etiquetas) {
    listaEtiquetas.innerHTML = '';
    etiquetasRenderizadas = [];

    etiquetas.forEach((etiqueta) => {
        const wrapper = document.createElement('div');

        const card = document.createElement('div');
        card.className = 'etiqueta-card';
        card.innerHTML = `
            <span class="etiqueta-contador">${etiqueta.bulto}/${etiqueta.totalBultos}</span>
            <div class="etiqueta-cliente">${etiqueta.cliente}</div>
            <div class="etiqueta-fila-superior">
                <span class="etiqueta-poblacion">${etiqueta.poblacion}</span>
                <span class="etiqueta-id-label">ID: <span class="etiqueta-id-valor">${etiqueta.id}</span></span>
            </div>
            <div class="etiqueta-pedido">
                N. DE PEDIDO: <span class="etiqueta-pedido-valor">${etiqueta.pedido}</span>
            </div>
            <div class="etiqueta-descripcion">${etiqueta.descripcion}</div>
            <span class="etiqueta-accesorios">Accesorios</span>
            <div class="etiqueta-medidas">
                <span>L&nbsp;&nbsp;${etiqueta.medidaLDisplay}</span>
                <span>H&nbsp;${etiqueta.medidaHDisplay}</span>
                <span>P&nbsp;&nbsp;${etiqueta.medidaPDisplay}</span>
            </div>
            <div class="etiqueta-qr">
                <img src="${etiqueta.qrImageDataUrl}" alt="QR ${etiqueta.pedido} #${etiqueta.id}" />
            </div>
        `;

        const mensajeImprimir = document.createElement('p');
        mensajeImprimir.className = 'etiqueta-imprimir-msg';

        const acciones = document.createElement('div');
        acciones.className = 'etiqueta-acciones';

        const btnImprimir = document.createElement('button');
        btnImprimir.textContent = 'Imprimir';
        btnImprimir.addEventListener('click', () => imprimirEtiqueta(etiqueta, mensajeImprimir));

        acciones.appendChild(btnImprimir);

        wrapper.appendChild(card);
        wrapper.appendChild(acciones);
        wrapper.appendChild(mensajeImprimir);
        listaEtiquetas.appendChild(wrapper);

        etiquetasRenderizadas.push({ etiqueta, mensajeEl: mensajeImprimir });
    });
}

async function imprimirTodas() {
    if (etiquetasRenderizadas.length === 0) {
        return;
    }

    btnImprimirTodas.disabled = true;
    mensajeImprimirTodas.textContent = `Imprimiendo 0/${etiquetasRenderizadas.length}...`;

    let exitosas = 0;
    for (let i = 0; i < etiquetasRenderizadas.length; i++) {
        const { etiqueta, mensajeEl } = etiquetasRenderizadas[i];
        const ok = await imprimirEtiqueta(etiqueta, mensajeEl);
        if (ok) exitosas++;
        mensajeImprimirTodas.textContent = `Imprimiendo ${i + 1}/${etiquetasRenderizadas.length}...`;
    }

    mensajeImprimirTodas.textContent = `Impresas ${exitosas}/${etiquetasRenderizadas.length}.`;
    btnImprimirTodas.disabled = false;
}

// La impresión real (ZPL + Zebra por USB) se implementa en la Etapa 5.
// Por ahora el endpoint existe pero devuelve "no implementado".
async function imprimirEtiqueta(etiqueta, mensajeEl) {
    mensajeEl.textContent = 'Imprimiendo...';
    try {
        const response = await fetch(`${window.neostoneApi.apiBaseUrl}/etiquetas/imprimir`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(etiqueta)
        });
        const data = await response.json();
        mensajeEl.textContent = response.ok ? 'Impreso.' : (data.error || 'No se pudo imprimir.');
        return response.ok;
    } catch (error) {
        mensajeEl.textContent = 'No se pudo conectar con la API interna.';
        console.error(error);
        return false;
    }
}

async function buscarPedido() {
    const codigoPedido = inputPedido.value.trim();
    mensajeError.textContent = '';

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

        mostrarPreview(data.pedido, data.etiquetas);
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
btnVolver.addEventListener('click', mostrarBusqueda);
btnImprimirTodas.addEventListener('click', imprimirTodas);
