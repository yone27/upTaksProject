import axios from 'axios'
import Swal from 'sweetalert2'
const tasks = document.querySelector('.listado-pendientes')
import { actulizarAvance } from '../functions/advance'

if (tasks) {
    tasks.addEventListener('click', e => {
        if (e.target.classList.contains('fa-check')) {
            const icon = e.target,
                taskId = icon.parentElement.parentElement.dataset.task

            //request hacia tareas
            const url = `${location.origin}/tasks/${taskId}`

            axios.patch(url, { taskId })
                .then(function(res) {
                    if (res.status === 200) {
                        icon.classList.toggle('completo')
                        actulizarAvance()
                    }
                })
        }

        if (e.target.classList.contains('fa-trash')) {
            const htmlTask = e.target.parentElement.parentElement,
                taskId = htmlTask.dataset.task
            Swal.fire({
                title: '¿Deseas brorrar esta tarea?',
                text: "Una tarea eliminada no se puede recuperar",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, borrar',
                cancelButtonText: 'No, cancelar'
            }).then((result) => {
                if (result.value) {
                    const url = `${location.origin}/tasks/${taskId}`

                    axios.delete(url, { params: { taskId } })
                        .then(function(res) {
                            if (res.status === 200) {
                                htmlTask.parentElement.removeChild(htmlTask)

                                Swal.fire(
                                    'Tarea Eliminada',
                                    res.data,
                                    'success'
                                )
                                actulizarAvance()
                            }
                        })
                        .catch(err => console.log(err))
                }
            })
        }
    })
}

export default tasks