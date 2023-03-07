import React,{useState,useEffect} from 'react'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import './App.css'

function App() {

  const URL="http://localhost/bd/"

  const [data, setData] = useState([])
  const [modalOpenInsertar, setModalOpenInsertar] = useState(false)
  const [modalOpenEditar, setModalOpenEditar] = useState(false)
  const [modalOpenEliminar, setModalOpenEliminar] = useState(false)
  const [registroSeleccionado, setRegistroSeleccionado] = useState({
    id:"",
    nombre: "",
    apellidos: "",
    ciudad: ""
  })


  
  const idSeleccionado = (registro, metodo) => {
    setRegistroSeleccionado(registro);
    console.log(registro);

    (metodo === "editar") ? toggleModalEditar() : toggleModalEliminar()
    console.log(modalOpenEditar);
    
  }



  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegistroSeleccionado((prevState) => ({
      ...prevState,
     [name]:value 
    }))
    console.log(registroSeleccionado);
  }


  const toggleModalInsertar = () => {
    setModalOpenInsertar(!modalOpenInsertar)
    
  }

  const toggleModalEditar = () => {
    setModalOpenEditar(!modalOpenEditar)
    
  }

  const toggleModalEliminar= () => {
    setModalOpenEliminar(!modalOpenEliminar)
    
  }

  
  const queryGet = async () => {
    await axios.get(URL)
      .then(response => {
        console.log(response.data);
        setData(response.data)
    })
  }

  const queryPost = async () => {
    let formData=new FormData()
    // para mandar POST en axios hay que crear un form-data, por lo que lo creamos debajo y añadimos el nuevo registro
    formData.append("nombre", registroSeleccionado.nombre);
    formData.append("apellidos", registroSeleccionado.apellidos);
    formData.append("ciudad", registroSeleccionado.ciudad);
    // añadimos al POST el atributo METHOD creado en el index.php ya que REQUEST_METHOD suele fallar para PUT y DELETE,
    // por lo que es más sencillo gestionar estos métodos del CRUD a través del valor de este atributo enviado en el form-data
    formData.append("METHOD", "POST");
    await axios.post(URL,formData)
      .then(response => {
        setData(data.concat(response.data))
        toggleModalInsertar()
      }).catch (error=> {
        console.log(error)
      })
    
  }



  
  const queryPut = async () => {

    let formData=new FormData()
    // para mandar POST en axios hay que crear un form-data, por lo que lo creamos debajo y añadimos el nuevo registro
    formData.append("nombre", registroSeleccionado.nombre);
    formData.append("apellidos", registroSeleccionado.apellidos);
    formData.append("ciudad", registroSeleccionado.ciudad);
    // añadimos al POST el atributo METHOD creado en el index.php ya que REQUEST_METHOD suele fallar para PUT y DELETE,
    // por lo que es más sencillo gestionar estos métodos del CRUD a través del valor de este atributo enviado en el form-data
    formData.append("METHOD", "PUT");
    await axios.post(URL,formData,{params:{id:registroSeleccionado.id}})
      .then(response => {
        let datosActualizados = data;
        datosActualizados.map((registro) => {
    if (registro.id === registroSeleccionado.id) {
      registro.nombre = registroSeleccionado.nombre
      registro.apellidos = registroSeleccionado.apellidos
      registro.ciudad=registroSeleccionado.ciudad
      
    }
        })
        setData(datosActualizados)
        toggleModalEditar()
      }).catch (error=> {
        console.log(error)
      })
    
  }


  
  
  const queryDelete = async () => {

    let formData=new FormData()
    // para mandar POST en axios hay que crear un form-data, por lo que lo creamos debajo y añadimos el nuevo registro
    // añadimos al POST el atributo METHOD creado en el index.php ya que REQUEST_METHOD suele fallar para PUT y DELETE,
    // por lo que es más sencillo gestionar estos métodos del CRUD a través del valor de este atributo enviado en el form-data
    formData.append("METHOD", "DELETE");
    await axios.post(URL,formData,{params:{id:registroSeleccionado.id}})
      .then(response => {
        setData(data.filter(seleccionado=>seleccionado.id!==registroSeleccionado.id))
        toggleModalEliminar()
    
      }).catch (error=> {
          console.log(error)
        })

  }






  useEffect(() => {
    queryGet()
  }, [])
  

  return (
    <div style={{textAlign:"center"}}>
        <br />
      <button className='btn btn-success' onClick={toggleModalInsertar }>Insertar NUEVO REGISTRO</button>
      <br />
      <br />

      <table className='table table-striped'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Ciudad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          { data.map(row => (
            <tr key={ row.id }>
              <td>{ row.id }</td>
              <td>{ row.nombre }</td>
              <td>{ row.apellidos }</td>
              <td>{ row.ciudad }</td>
              <td>
                <button className='btn btn-primary' onClick={()=>idSeleccionado(row,"editar")}>Editar</button> {"  "}
                <button className='btn btn-danger'  onClick={()=>idSeleccionado(row,"eliminar")}>Eliminar</button>
              </td>
              
            </tr>
          ))}
        </tbody>
      </table>


      <Modal isOpen={modalOpenInsertar}>
        <ModalHeader>Insertar Nuevo Registro</ModalHeader>
        <ModalBody>
          <div className='form-group'>
            <label>Nombre:</label>
            <br />
            <input type="text" className='form-control' name='nombre' onChange={handleChange} />
            <br />
            <label>Apellidos:</label>
            <br />
            <input type="text" className='form-control'  name='apellidos' onChange={handleChange} />
            <br />
            <label>Ciudad:</label>
            <br />
            <input type="text" className='form-control'  name='ciudad' onChange={handleChange} />
            <br />

          </div>
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-primary' onClick={queryPost}>Insertar</button>
          <button className='btn btn-danger' onClick={toggleModalInsertar}>Cancelar</button>
        </ModalFooter>


      </Modal>


      <Modal isOpen={modalOpenEditar}>
        <ModalHeader>Editar Registro</ModalHeader>
        <ModalBody>
          <div className='form-group'>
            <label>Nombre:</label>
            <br />
            <input type="text" className='form-control' name='nombre' onChange={ handleChange } value={registroSeleccionado && registroSeleccionado.nombre } />
            <br />
            <label>Apellidos:</label>
            <br />
            <input type="text" className='form-control'  name='apellidos' onChange={handleChange} value={registroSeleccionado && registroSeleccionado.apellidos } />
            <br />
            <label>Ciudad:</label>
            <br />
            <input type="text" className='form-control'  name='ciudad' onChange={handleChange} value={registroSeleccionado && registroSeleccionado.ciudad } />
            <br />

          </div>
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-primary' onClick={queryPut}>Insertar</button>
          <button className='btn btn-danger' onClick={toggleModalEditar}>Cancelar</button>
        </ModalFooter>


      </Modal>


      

      <Modal isOpen={modalOpenEliminar}>
        <ModalBody>
          ¿Quieres eliminar el registro {registroSeleccionado && registroSeleccionado.nombre} ?
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-danger' onClick={ queryDelete }>Eliminar</button>
          <button className='btn btn-secondary' onClick={toggleModalEliminar}>Cancelar</button>
        </ModalFooter>
      </Modal>



      
    </div>
  )
}

export default App
