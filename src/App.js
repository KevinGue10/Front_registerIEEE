import React, { Component } from 'react';
import logo from './img/logo.png'
import foto1 from './img/back.png'
import precio from './img/precio.png'
import axios from 'axios';
class ConferenceForm extends Component {
constructor(props) {
    super(props);
    this.state = {
      opregistro:'',
      nombre: '',
      apellidos: '',
      selectedCountry: '', // Estado para almacenar el país seleccionado
      countries: [], // Estado para almacenar la lista de países
      afiliacion: '',
      correo: '',
      telefono: '',
      oficio: 'Estudiante',
      esMiembroIEEE: false,
      numeroMembresia: '',
      tipoParticipacion: 'Autor',
      tipoAsistencia: 'Presencial',
      extrap1: '',
      extrap2: '',
      cobro: 0,
      mostrarMensajeExito: false, 
      mensaje: '',
      titulo1:false,
      titulo2:false,
      titulo3:false,
      titulo4:false,
      numDocuments: 1,
      articles: [
        {
          articleNumber: '', 
          pages: '',
        },
      ],
      nombresApellidos: [],
      selectedNombreApellido: '',
      pgextras:'',
      npgextras:'',
      artextras:'',
      nartextras:'',
      mostrarEstado:false,
      mostrarEstado2:false,
      mostrarEstado3:false,
      mostrarBtnFactura:false,
      mostrarFactura: false,
      datosNombre:'',
      datosMontoUS:'',
      datosMontoCOP:'',
      datosFecha:'',
      datosMetodo:'',
      datosReferencia:'',
      datosDescripcion:'',
    };
  }


  handleSubmit = (event) => {
    event.preventDefault();

    const formData = {
      nombre: this.state.nombre,
      apellidos: this.state.apellidos,
      pais: this.state.selectedCountry,
      afiliacion: this.state.afiliacion,
      correo: this.state.correo,
      telefono: this.state.telefono,
      oficio: this.state.oficio,
      tipoParticipacion: this.state.tipoParticipacion,
      tipoAsistencia:this.state.tipoAsistencia,
      esMiembroIEEE: this.state.esMiembroIEEE,
      numeroMembresia: this.state.numeroMembresia,
      numArt:this.state.numDocuments,
      articulos:this.state.articles,
      titulo1:this.state.titulo1,
      titulo2:this.state.titulo2,
      titulo3:this.state.titulo3,
      titulo4:this.state.titulo4
    };
    console.log("boton presionado")
  axios.post('http://3.91.51.108:8080/registro', formData)
      .then(response => {
        // Procesar la respuesta del servidor
        console.log('Respuesta del servidor:', response.data);
      })
      .catch(error => {
        // Manejar errores, si los hay
        console.error('Error al enviar datos al servidor:', error);
      });

      axios.post('http://localhost:8080/cobro', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          // Almacena el valor de cobro en el estado
          this.setState({ cobro: response.data.cobro });
        })
        .catch((error) => {
          console.error('Error al obtener el valor de cobro:', error);
        });


        this.setState({ mostrarMensajeExito: true });

        // Después de cierto tiempo, ocultar el mensaje
        setTimeout(() => {
          this.setState({ mostrarMensajeExito: false });
        }, 10000); 
    
  }
  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }
  componentDidMount() {
    // Realiza una solicitud a la API para obtener la lista de países
    fetch('https://restcountries.com/v3.1/all')
    .then((response) => response.json())
    .then((data) => {
      // Ordena la lista de países por nombre común
      const sortedCountries = data.sort((a, b) => a.name.common.localeCompare(b.name.common));
      this.setState({ countries: sortedCountries });
    })
    .catch((error) => {
      console.error('Error al cargar la lista de países', error);
    });
  }

  handleArticleInputChange = (index, fieldName, value) => {
    this.setState((prevState) => {
      const articles = [...prevState.articles];
      //articles[index][fieldName] = value;
      //return { articles };
      // Asegurarse de que el objeto para este artículo exista
    if (!articles[index]) {
      articles[index] = {
        title: '',
        articleNumber: '',
        pages: '',
      };
    }

    articles[index][fieldName] = value;
    return { articles };
    });
  };
  handleCountryChange = (event) => {
    this.setState({ selectedCountry: event.target.value });
  };


  handlePagar = (event) => {
    event.preventDefault();

    const formData = {
      nombre: this.state.nombre,
      apellidos: this.state.apellidos,
      pais: this.state.pais,
      afiliacion: this.state.afiliacion,
      correo: this.state.correo,
      telefono: this.state.telefono,
      oficio: this.state.oficio,
      tipoParticipacion: this.state.tipoParticipacion,
      esMiembroIEEE: this.state.esMiembroIEEE,
      numeroMembresia: this.state.numeroMembresia,
      tipoAsistencia:this.state.tipoAsistencia,
      numArt:this.state.numDocuments,
      articulos:this.state.articles,
      titulo1:this.state.titulo1,
      titulo2:this.state.titulo2,
      titulo3:this.state.titulo3,
      titulo4:this.state.titulo4
    };
    axios.post('http://localhost:8080/proceso_pago', formData)
    .then(async (response) => {

      // Verificar si la respuesta es exitosa
      if (response.status === 200) {
        // Obtener la URL de checkout desde la respuesta
        const checkoutURL = response.data.checkoutURL;
       
        // Abrir una nueva pestaña o ventana con la URL de checkout
        window.open(checkoutURL, "_blank");
      } else {
        console.error('Error en el proceso de pago:', response.statusText);
      }
    })
    .catch(error => {
      console.error('Error al enviar datos al servidor:', error);
    });

    this.setState({ mostrarEstado: true });
    this.llamarEstado();

    // Llama a la API cada 30 segundos durante 20 minutos
    this.interval = setInterval(() => {
      this.llamarEstado();
    }, 20000);
  
    // Detén la llamada a la API después de 20 minutos (20 minutos = 1200000 milisegundos)
    setTimeout(() => {
      clearInterval(this.interval);
      
    }, 1200000);
  };
  
  llamarEstado = () => {
    const formData = {
      nombre: this.state.nombre,
      apellidos: this.state.apellidos,
    }
    // Realiza la llamada a la API
    axios.post('http://localhost:8080/consultar_estado_cobro',formData)
      .then(response => {
      console.log("La respuesta es: ",response.data.cobroest)
        if(response.data.cobroest.state===  3){
          this.setState({ mostrarEstado: false });
          this.setState({ mostrarEstado2: true });
          this.setState({ mostrarBtnFactura: true });  
          this.setState({ datosNombre: response.data.cobroest.payer_name});
          this.setState({ datosMontoCOP: response.data.cobroest.amount});
          this.setState({ datosMontoUS: response.data.cobroest.amountUS });
          this.setState({ datosMetodo: response.data.cobroest.payment_method });
          this.setState({ datosFecha:  convertirTimestampAFechaHora(response.data.cobroest.date_payed)});
          this.setState({ datosReferencia: response.data.cobroest.reference_cobru});
          this.setState({ datosDescripcion: response.data.cobroest.description });
      } if(response.data.cobroest.state===  2){
        this.setState({ mostrarEstado: false });
        this.setState({ mostrarEstado3: true });
        this.setState({ mostrarBtnFactura: false });  

      }
        
      })
      .catch(error => {
        console.error('Error al obtener estado de cobro:', error);
      });    
  }

  handleSelectChange = (event) => {
    const value = event.target.value;
    this.setState({ opregistro: value });

    // Realizar la llamada a la API si se selecciona "Realizar pago extra"
    
    if (value === 'extra') {
   
      axios.get('http://172.31.35.242:8080/datos_usuarios')
        .then(response => {
          this.setState({ nombresApellidos: response.data });
          // Realizar acciones adicionales según la respuesta de la API
        })
        .catch(error => {
          console.error('Error al obtener datos de usuarios:', error);
        });
    }
  };

  handleSelectName = (event) => {
    const value = event.target.value;
    this.setState({ selectedNombreApellido: value });
  }
  handleEnvioextra = (event) => {
    event.preventDefault();

    const formData = {
      npgextras: this.state.npgextras,
      nartextras: this.state.nartextras
    };
   
  axios.post('http://localhost:8080/pagos_extras', formData)
      .then(response => {
        // Procesar la respuesta del servidor
        this.setState({ cobro: response.data.cobro });
      })
      .catch(error => {
        // Manejar errores, si los hay
        console.error('Error al enviar datos al servidor:', error);
      });

      
  }

  handleFactura = () => {
    this.setState({ mostrarFactura: true });
  };



  render() {
    const { numDocuments, articles, selectedCountry, countries } = this.state;
    return (
      
      
  <div>  
    <header className="header">
      <div className="logo-container">
     <img src={logo} alt="Logo" className="logo"/>
      </div>
      <div className="register">
       Registro conferencia IEEE C3
      </div>
    </header>
    <div class="contenido">
      <div class="formulario">
        <form onSubmit={this.handleSubmit}>
        
        
        <label>
           
            <br />
            <select
              name="opregistro"
              value={this.state.opregistro}
              onChange={this.handleSelectChange}
            ><option value="">Seleccione una opción</option>
              <option value="registro">Registro nuevo</option>
              <option value="extra">Realizar pago extra</option>
            </select>
          </label>
          <br />
          {this.state.opregistro === 'registro' && (
             <div>
        <label>
            Nombres
            <br />
            <input
              type="text"
              name="nombre"
              value={this.state.nombre}
              onChange={this.handleInputChange}
              required
            />
          </label>
          <br />
         
          <label>
            Apellidos
            <br />
            <input
              type="text"
              name="apellidos"
              value={this.state.apellidos}
              onChange={this.handleInputChange}
              required
            />
          </label>
          <br />
          <label>
          País
          <br />
          <select
            name="selectedCountry"
            value={selectedCountry}
            onChange={this.handleCountryChange}
            required
          >
            <option value="">Selecciona un país</option>
            {countries.map((country) => (
              <option key={country.cca2} value={country.name.common}>
                {country.name.common}
              </option>
            ))}
          </select>
        </label>
          <br />

          <label>
            Afiliación institucional
            <br />
            <input
              type="text"
              name="afiliacion"
              value={this.state.afiliacion}
              onChange={this.handleInputChange}
              required
            />
          </label>
          <br />

          <label>
            Correo electrónico
            <br />
            <input
              type="email"
              name="correo"
              value={this.state.correo}
              onChange={this.handleInputChange}
              required
            />
          </label>
          <br />

          <label>
            Teléfono
            <br />
            <input
              type="tel"
              name="telefono"
              placeholder='+xx xxxxxxxxxx'
              value={this.state.telefono}
              onChange={this.handleInputChange}
              required
            />
          </label>
          <br />

          <label>
            Oficio
            <br />
            <select
              name="oficio"
              value={this.state.oficio}
              onChange={this.handleInputChange}
            >
              <option value="Estudiante">Estudiante</option>
              <option value="Profesional">Profesional</option>
            </select>
          </label>
          <br />
          <label>
              Miembro IEEE
              <input
                type="checkbox"
                name="esMiembroIEEE"
                checked={this.state.esMiembroIEEE}
                onChange={() => this.setState({ esMiembroIEEE: !this.state.esMiembroIEEE })}
              />
            </label>
            <br />

            {this.state.esMiembroIEEE && (
              <label>
                Número de Membresía IEEE
                <br />
                <input
                  type="text"
                  name="numeroMembresia"
                  value={this.state.numeroMembresia}
                  onChange={this.handleInputChange}
                />
              </label>
            )}
            <br />

            <label>
        Tipo de participación
        <br />
        <input
          type="radio"
          name="tipoParticipacion"
          value="Autor"
          checked={this.state.tipoParticipacion === 'Autor'}
          onChange={this.handleInputChange}
        />
        Autor   
        <input
          type="radio"
          name="tipoParticipacion"
          value="Asistente"
          checked={this.state.tipoParticipacion === 'Asistente'}
          onChange={this.handleInputChange}
        />
        Asistente
      </label>
      <br />
      <label>
        Tipo de Asitencia
        <br />
        <input
          type="radio"
          name="tipoAsistencia"
          value="Presencial"
          checked={this.state.tipoAsistencia === 'Presencial'}
          onChange={this.handleInputChange}
        />
        Presencial   
        <input
          type="radio"
          name="tipoAsistencia"
          value="Virtual"
          checked={this.state.tipoAsistencia === 'Virtual'}
          onChange={this.handleInputChange}
        />
        Virtual
      </label>
      {this.state.tipoParticipacion === 'Autor' && (
        <div>
      <div>
        <label>
          Número de artículos a presentar
          <br />
          <input
            type="number"
            name="numDocuments"
            value={numDocuments}
            onChange={this.handleInputChange}
          />
        </label>
        <br />

        {Array.from({ length: numDocuments }).map((_, index) => (
          <div key={index}>
            <label>
              Número del artículo {index + 1}
              <br />
              <input
                type="text"
                name={`articles[${index}].articleNumber`}
                value={articles[index] ? articles[index].articleNumber : ''}
                onChange={(event) =>
                  this.handleArticleInputChange(
                    index,
                    'articleNumber',
                    event.target.value // Se cambió el nombre del campo
                  )
                }
                required
              />
            </label>
            <br />
            <label>
              Cantidad de páginas del artículo {index + 1}
              <br />
              <input
                type="number"
                name={`articles[${index}].pages`}
                value={articles[index] ? articles[index].pages : ''}
                onChange={(event) =>
                  this.handleArticleInputChange(
                    index,
                    'pages',
                    event.target.value
                  )
                }
                required
              />
            </label>
            <br />
          </div>
        ))}
      </div>
        </div>
      )}
       {this.state.tipoParticipacion === 'Asistente' && (
        <div class="tutoriales">
         
          <label>
            Selecciona los tutoriales por asistir:
          <br />
            <input
              type="checkbox"
              name="titulo1"
              checked={this.state.titulo1}
              onChange={() => this.setState({ titulo1: !this.state.titulo1 })}
            />
            9:00: INFORMATION TECHNOLOGIES MANAGEMENT AND COMPETITIVE INTELLIGENCE. By: Jose-Ignacio Castillo.
            
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              name="titulo2"
              checked={this.state.titulo2}
              onChange={() => this.setState({ titulo2: !this.state.titulo2 })}
            />
           9:00: TARIFF STRUCTURE FOR WHOLESALE AND RETAIL ENERGY MARKETS. By: Raquel Ronderos.
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              name="titulo3"
              checked={this.state.titulo3}
              onChange={() => this.setState({ titulo3: !this.state.titulo3 })}
            />
          15:00: DATA ANALYTICS: EMPOWERING INSIGHTS AND INFORMED DECISION-MAKING. By: Ana-Karina Rodríguez.

          </label>
          <br />
          <label>
            <input
              type="checkbox"
              name="titulo4"
              checked={this.state.titulo4}
              onChange={() => this.setState({ titulo4: !this.state.titulo4 })}
            />
             15:00:  TRENDS ON MICRO AND NANOELECTRONICS. By: Ricardo Reis.
          </label>
          <br />
        </div>
      )}

          <button type="submit">Confirmar</button>

          {this.state.mostrarMensajeExito && (
        <div style={{ color: 'yellow', fontSize: '12px', marginTop: '10px' }}>
          Información guardada exitosamente
        </div>
       
        )}
         </div> 
          )}

        {this.state.opregistro === 'extra' && (
          <div class="naselect">

          <label >
          Selecciona nombre y apellido:
          <select
            value={this.state.selectedNombreApellido}
            onChange={this.handleSelectName}
          >
            <option value="">Selecciona...</option>
            {this.state.nombresApellidos.map((nombreApellido, index) => (
              <option key={index} value={nombreApellido}>{nombreApellido}</option>
            ))}
          </select>
        </label>
        
        {this.state.selectedNombreApellido && (
          <div>
            <label>
            Selecciona los items extras
          <br />
            <input
              type="checkbox"
              name="pgextras"
              checked={this.state.pgextras}
              onChange={() => this.setState({ pgextras: !this.state.pgextras })}
            />
              Paginas extras             
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              name="artextras"
              checked={this.state.artextras}
              onChange={() => this.setState({ artextras: !this.state.artextras })}
            />
            Articulos extras
          </label>
          <br />

          {this.state.pgextras === true && (
        <div>
           <label>
         Cantidad de páginas del artículo 
         <br />
         <input
           type="number"
           name="npgextras"
           value={this.state.npgextras}
           onChange={this.handleInputChange}
           required
         />
       </label>   
       <br />
       </div>   
          )}
        {this.state.artextras === true && (
          <div> 
         <label>
         Cantidad de articulos extras
         <br />
         <input
           type="number"
           name="nartextras"
           value={this.state.nartextras}
           onChange={this.handleInputChange}
           required
         />
       </label> 
       <br /> 
       </div>         
      )}  
          <button type="submit" onClick={this.handleEnvioextra}>Confirmar</button>

          </div>
        )}
            
          </div>

          )}

        </form>
      </div>
         <div class="fotos">   
        <img src={foto1} alt="foto" className="conferencia"/>

        <div class="cobro">
        
          <div class="datocobro">
            <h2>El total a pagar es: </h2>
            <h2> {this.state.cobro} USD </h2>
            <div class="botones">
            <button class='pago' onClick={this.handlePagar} type="submit">Pagar</button>
           

          {this.state.mostrarBtnFactura && (
            <div>
             <button  class="factura_boton" onClick={this.handleFactura} type="submit">Generar Resumen</button>
           </div>
            )}
            </div>

            <div class="estadopago">
            {this.state.mostrarEstado && (
              <div>Procesando pago</div>
                )}
            {this.state.mostrarEstado2 && (
              <div> Pago realizado correctamente</div>
                )}
             {this.state.mostrarEstado3 && (
              <div style={{ color: 'red',}}> Error en el pago </div>
                )}
           </div>
           
          </div>
          <div class="logprecio">
          <img src={precio} alt="foto" className="preciolog"/>
          </div>
        </div>

        {this.state.mostrarFactura && (
            <div class="factura">
              <h2>Pago Realizado</h2>
             <div class="resumen">
                <p><strong>Nombre:</strong> {this.state.datosNombre}</p>
                <p><strong>Monto COP:</strong> {this.state.datosMontoCOP}$</p>
                <p><strong>Monto USD:</strong> {this.state.datosMontoUS}$</p>
                <p><strong>Método de pago:</strong> {this.state.datosMetodo}</p>
                <p><strong>Fecha:</strong> {this.state.datosFecha}</p>
                <p><strong>Referencia cobru:</strong> {this.state.datosReferencia}</p>
                <p><strong>Descripción:</strong> {this.state.datosDescripcion}</p>
             </div>
           </div>
            )}
        </div>

      
    </div>
  </div>
        );
  }
}

export default ConferenceForm;

function convertirTimestampAFechaHora(timestamp) {
  const date = new Date(timestamp);

  // Obtener los componentes de la fecha y hora
  const dia = date.getDate();
  const mes = date.getMonth() + 1; // Los meses van de 0 a 11
  const año = date.getFullYear();
  const horas = date.getHours();
  const minutos = date.getMinutes();
  const segundos = date.getSeconds();
  let  fechaFormateada
  let horaFormateada
  if((horas-5)<0){
     fechaFormateada = `${año}-${mes < 10 ? '0' : ''}${mes}-${dia < 10 ? '0' : ''}${dia}`;
     horaFormateada = `${horas < 10 ? '' : ''}${horas+19}:${minutos < 10 ? '0' : ''}${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;
  } else {
     fechaFormateada = `${año}-${mes < 10 ? '0' : ''}${mes}-${dia < 10 ? '0' : ''}${dia}`;
     horaFormateada = `${horas < 10 ? '0' : ''}${horas-5}:${minutos < 10 ? '0' : ''}${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;
  }
  
  // Formatear la fecha y hora
  

  return `${fechaFormateada} ${horaFormateada}`;
}


