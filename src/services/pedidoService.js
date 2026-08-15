const { getPool, sql } = require('../database/sqlServer');

// Mapeo confirmado contra datos reales (pedido S1-00498, ver historial de verificación):
//   pedido            = tpedido.codigo_pedido (== tpresupuesto.codigo)
//   cliente           = tClienteVarios.nombre, vía idClienteVarios (tpedido o tpresupuesto)
//   poblacion         = tpoblacion.nombre, vía tClienteVarios.pobFiscal = tpoblacion.CP
//   id (por módulo)   = tpresupuestoLineas.idEscena  (confirmado contra datos reales,
//                        corrige una deducción anterior que usaba tpresupuestoLineas.codigo)
//   descripcion       = primera línea de tpresupuestoLineas.descripcion
//   medidaL/H/P       = tdespieceLineaPresupuesto.medida1/2/3, fila cuyo familia+articulo
//                        coincide con el familia+articulo de la línea padre

function primeraLinea(texto) {
    if (!texto) return '';
    return texto.split(/\r?\n/)[0].trim();
}

async function buscarPedido(codigoPedido) {
    const pool = await getPool();

    const headerResult = await pool.request()
        .input('codigoPedido', sql.VarChar(25), codigoPedido)
        .query(`
            SELECT
                pe.codigo_pedido AS codigoPedido,
                pr.codigo AS codigoPresupuesto,
                cv.nombre AS cliente,
                po.nombre AS poblacion
            FROM tpedido pe
            LEFT JOIN tpresupuesto pr ON pr.codigo = pe.codigoPresupuesto
            LEFT JOIN tClienteVarios cv ON cv.idClienteVarios = COALESCE(pe.idClienteVarios, pr.idClienteVarios)
            LEFT JOIN tpoblacion po ON po.CP = cv.pobFiscal
            WHERE pe.codigo_pedido = @codigoPedido
        `);

    const header = headerResult.recordset[0];
    if (!header) {
        return null;
    }

    const lineasResult = await pool.request()
        .input('codigoPresupuesto', sql.VarChar(25), header.codigoPresupuesto)
        .query(`
            SELECT
                pl.idEscena AS id,
                pl.descripcion AS descripcion,
                d.medida1 AS medidaL,
                d.medida2 AS medidaH,
                d.medida3 AS medidaP
            FROM tpresupuestoLineas pl
            INNER JOIN tdespieceLineaPresupuesto d
                ON d.presupuesto = pl.codigoPresupuesto
               AND d.lineaPresupuesto = pl.codigo
               AND d.familia = pl.familia
               AND d.articulo = pl.articulo
            WHERE pl.codigoPresupuesto = @codigoPresupuesto
            ORDER BY pl.codigo
        `);

    const modulos = lineasResult.recordset.map((linea) => ({
        id: linea.id,
        descripcion: primeraLinea(linea.descripcion),
        medidaL: linea.medidaL,
        medidaH: linea.medidaH,
        medidaP: linea.medidaP
    }));

    return {
        pedido: header.codigoPedido,
        cliente: header.cliente,
        poblacion: header.poblacion,
        modulos
    };
}

module.exports = {
    buscarPedido
};
