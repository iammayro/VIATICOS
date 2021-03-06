const pool = require('../database');

/*
 * La información se puede sacar de
 * req.body, req.get, req.params
 * respectivamente.
 */

module.exports = {

    crearViaticoProyecto: async(req, res) => {
        var numero_proyecto = req.body.numero_proyecto;
        var cantidad = req.body.cantidad;
        var status = req.body.status;
        var id_solicitud_viatico = req.body.id_solicitud_viatico;

        var sqlProgram = "INSERT INTO viatico_proyecto SET ?";
        try {
            var valuesProject = {
                numero_proyecto: numero_proyecto,
                cantidad: cantidad,
                status: status,
                id_solicitud_viatico: id_solicitud_viatico,
                fecha_solicitud: new Date()
            };
            const resp = await pool.query(sqlProgram, [valuesProject]);
        } catch (error) {
            return res.json({ ok: false, mensaje: 'Error inesperado' });
        }
        res.json({ ok: true, mensaje: "Proyecto creado" });
    },

    verViaticoProyecto: (req, res) => {
        const { id } = req.params;
        try {
            pool.query('SELECT * FROM viatico_proyecto WHERE id = ?', [id], (errorProyecto, proyecto) => {
                if (errorProyecto) return res.json({ ok: false, mensaje: errorProyecto });
                if (proyecto.length < 1) return res.json({ ok: false, mensaje: "no existe el proyecto" });
                pool.query('SELECT * FROM solicitud_viatico WHERE id = ?', [id], (errorViatico, viatico) => {
                    if (errorViatico) return res.json({ ok: false, mensaje: 'Error al obtener la solicitud del viatico' });
                    let json = {
                        proyecto
                    };
                    res.json({ ok: true, body: proyecto[0] });
                });
            });
        } catch (error) {
            return res.json({ ok: false, mensaje: 'Error inesperado'});
        }
    },

    modificarViaticoProyecto: (req, res) => {
        try {
            pool.query('UPDATE viatico_proyecto SET ? WHERE id = ?', [{
                id_solicitud_viatico: req.body.id_solicitud_viatico,
                numero_proyecto: req.body.numero_proyecto,
                cantidad: req.body.cantidad,
                status: req.body.status,
            }, req.body.id_proyecto], (errorModificar, modificarProyecto) => {
                if (errorModificar) return res.json({ ok: false, mensaje: "error al modificar" });
                res.json({ ok: true, mensaje: "proyecto modificado exitosamente" });
            });
        } catch (e) {
            return res.json({ ok: false, mensaje: 'Error inesperado' });
        }
    },

    eliminarProyecto: (req, res) => {
        var idProyecto = req.params;
        pool.query('DELETE FROM viatico_proyecto WHERE id_solicitud_viatico = ?', [idProyecto], (error, results) => {
            if (error) return res.json({ ok: false, mensaje: 'Error al borrar el proyecto' });
            res.json({ ok: true, results, mensaje: 'Proyecto eliminado' });
        });
    },
    // Cosas extra como subir archivos etc
}