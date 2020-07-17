import Swal from 'sweetalert2'
import axios from 'axios'

const btnDelete = document.getElementById('eliminar-proyecto')
if (btnDelete) {
    btnDelete.addEventListener('click', e => {
        const projectUrl = e.target.dataset.projectUrl
        Swal.fire({
            title: '¿Deseas brorrar este proyecto?',
            text: "Un proyecto eliminado no se puede recuperar",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, borrar',
            cancelButtonText: 'No, cancelar'
        }).then((result) => {
            if (result.value) {
                // enviar petición con axion
                const url = `${location.origin}/projects/${projectUrl}`

                axios.delete(url, { params: { projectUrl } })
                    .then(function(res) {

                        console.log(res);

                        Swal.fire(
                            'Borrador',
                            res.data,
                            'success'
                        )
                        window.location = `${location.origin}`;

                    })
                    .catch(() => {
                        Swal.fire({
                            type: 'error',
                            title: 'Hubo un error',
                            text: 'No se pudo eliminar el proyecto'
                        })
                    })
            }
        })
    })
}
export default btnDelete