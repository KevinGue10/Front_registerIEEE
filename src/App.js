import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
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
      selectedCountry: '',
      countries: [],
      indicativos: '+',
      tdoc:'CC',
      doc:'',
      ndoc:'',
      afiliacion: '',
      correo: '',
      telefono: '',
      ciudad:'',
      direccion:'',
      sexo:'Masculino',
      fechaNacimiento:null,
      oficio: 'Estudiante',
      esMiembroIEEE: false,
      numeroMembresia: '',
      tipoParticipacion: 'Autor',
      tipoAsistencia: 'Presencial',
      extrap1: '',
      extrap2: '',
      impuesto:'',
      pimpuesto: 0,
      cobro: 0,
      mostrarMensajeExito: false, 
      mensaje: '',
      atutoriales:false,
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
      validarname: false,
      selectedNombreApellido: '',
      pgextras:'',
      npgextras:'',
      artextras:'',
      nartextras:'',
      condiciones:false,
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
      cupon:''
    };    
  }
    
  handleSubmit = (event) => {
    event.preventDefault();

    const formData = {
      nombre: this.state.nombre,
      apellidos: this.state.apellidos,
      pais: this.state.selectedCountry,
      ciudad:this.state.ciudad,
      direccion:this.state.direccion,
       sexo: this.state.sexo,
      fechaNacimiento:this.state.fechaNacimiento,
      tdoc:this.state.tdoc,
      doc:this.state.doc,
      afiliacion: this.state.afiliacion,
      correo: this.state.correo,
      telefono: this.state.indicativos+" "+this.state.telefono,
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
      titulo4:this.state.titulo4,
      pimpuesto:this.state.pimpuesto,
      cupon:this.state.cupon
    };
   
  axios.post('http://54.236.126.192:8080/registro', formData)
      .then(response => {
      })
      .catch(error => {
        // Manejar errores, si los hay
        console.error('Error al enviar datos al servidor:', error);
      });

      axios.post('http://54.236.126.192:8080/cobro', formData, {
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

         
        axios.post('http://54.236.126.192:8080/send_email', formData, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((response) => {
            
          })
          .catch((error) => {
            console.error('Error al enviar el email:', error);
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

  handleIndiChange = (event) => {
    this.setState({ selectedIndi: event.target.value });
  };

  handleFechaNacimientoChange = (date) => {
    const meses = [
      "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
    ];
  
    // Obtener el día, el mes y el año de la fecha
    const dia = date.getDate();
    const mes = meses[date.getMonth()];
    const año = date.getFullYear();
  
    // Crear la representación de la fecha en el formato deseado
    const nuevaFecha = `${dia} / ${mes} /  ${año}`;
    this.setState({ fechaNacimiento: nuevaFecha })
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
    axios.post('http://54.236.126.192:8080/proceso_pago', formData)
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
    let formData;
    console.log("El tamaño es :: "+this.state.selectedNombreApellido.length)
    if (this.state.selectedNombreApellido.length!==0){
    formData = {
    nombres: this.state.selectedNombreApellido,
    }
  } else {
    formData = {
      nombres: this.state.nombre+" "+this.state.apellidos,
      } 
    }
    // Realiza la llamada a la API
    axios.post('http://54.236.126.192:8080/consultar_estado_cobro',formData)
      .then(response => {
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
   
  axios.post('http://54.236.126.192:8080/pagos_extras', formData)
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

  handleValidardoc = (event) => {
    event.preventDefault();
    this.state.validarname=true;
    const formData = {
      doc:this.state.ndoc,
    };
    axios.post('http://54.236.126.192:8080/datos_usuarios', formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      // Procesar la respuesta del servidor
      this.setState({ selectedNombreApellido: response.data });
  
      
    })
    .catch(error => {
      // Manejar errores, si los hay
      console.error('Error al enviar datos al servidor:', error);
    }); 

  }


  render() {
    const { numDocuments, articles, selectedCountry, countries} = this.state;
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
              <option key={country.name.common} value={country.callingCodes && country.callingCodes[0]}>
              {country.name.common}
            </option>
            ))}
          </select>
        </label>
          <br />
          <label>
            Ciudad
            <br />
            <input
              type="text"
              name="ciudad"
              value={this.state.ciudad}
              onChange={this.handleInputChange}
              required
            />
          </label>
          <br />
          <label>
            Dirección
            <br />
            <input
              type="text"
              name="direccion"
              value={this.state.direccion}
              onChange={this.handleInputChange}
              required
            />
          </label>
          <br />
          <label>
            Sexo
            <br />
            <select
              name="sexo"
              value={this.state.sexo}
              onChange={this.handleInputChange}
            >
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="No_decir">Prefiero no decirlo</option>
              <option value="Otro">Otro</option>
            </select>
          </label>
          <br />
         
          <label>
          Fecha de nacimiento
          <br />
          <DatePicker
           className="fechaNacimientoPicker"
              selected={this.fechaNacimiento}
              onChange={this.handleFechaNacimientoChange}
              value={this.state.fechaNacimiento}
              dateFormat="dd/MM/yyyy"
              showYearDropdown
              yearDropdownItemNumber={60}
              scrollableYearDropdown
            />

          </label>
          <br />
          <label>
            Tipo de documento
            <br />
            <select
              name="tdoc"
              value={this.state.tdoc}
              onChange={this.handleInputChange}
            >
              <option value="CC">CC</option>
              <option value="CE">CE</option>
              <option value="TI">TI</option>
              <option value="Pasaporte">Pasaporte</option>
            </select>
          </label>
          <br />

          <label>
            Documento de identidad
            <br />
            <input
              type="text"
              name="doc"
              value={this.state.doc}
              onChange={this.handleInputChange}
              required
            />
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
              class='indicativo'
              type="text"
              name="indicativos"
              value={this.state.indicativos}
              onChange={this.handleInputChange}
              required
            />
            <input
              class='telef'
              type="tel"
              name="telefono"
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
          <label className='miembro'>
             
              <input
                type="checkbox"
                name="esMiembroIEEE"
                checked={this.state.esMiembroIEEE}
                onChange={() => this.setState({ esMiembroIEEE: !this.state.esMiembroIEEE })}
              />
               ¿Es Miembro IEEE ? 
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
        <input
          type="radio"
          name="tipoParticipacion"
          value="Poster"
          checked={this.state.tipoParticipacion === 'Poster'}
          onChange={this.handleInputChange}
        />
        Poster
        <br/>
        <input
          type="radio"
          name="tipoParticipacion"
          value="Patrocinador"
          checked={this.state.tipoParticipacion === 'Patrocinador'}
          onChange={this.handleInputChange}
        />
        Patrocinador   
        <input
          type="radio"
          name="tipoParticipacion"
          value="Speaker"
          checked={this.state.tipoParticipacion === 'Speaker'}
          onChange={this.handleInputChange}
        />
        Speaker   
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

        <label>
             <input
               type="checkbox"
               name="atutoriales"
               checked={this.state.atutoriales}
               onChange={() => this.setState({ atutoriales: !this.state.atutoriales })}
             />
              ¿Asistirá a tutoriales?
           </label>
           <br />
        </div>
      )}
        {(this.state.tipoParticipacion === 'Asistente' || this.state.atutoriales) &&(
        
        <div>
         <label>Selecciona los tutoriales por asistir:</label>
         <br />
         <label  className="tutoriales">
            <input
              class="tut"
              type="checkbox"
              name="titulo1"
              checked={this.state.titulo1}
              onChange={() => this.setState({ titulo1: !this.state.titulo1 })}
            />
            9:00: Jose-Ignacio Castillo.
            <p>Information technologies management and competitive intelligence.</p>
          </label>
          <br />
          <label  className="tutoriales">
            <input
              class="tut"
              type="checkbox"
              name="titulo2"
              checked={this.state.titulo2}
              onChange={() => this.setState({ titulo2: !this.state.titulo2 })}
            />
           9:00: Raquel Ronderos
           <p>Tariff structure for wholesale and retail energy markets.</p>
          </label>
          <br />
          <label  className="tutoriales">
            <input
            class="tut"
              type="checkbox"
              name="titulo3"
              checked={this.state.titulo3}
              onChange={() => this.setState({ titulo3: !this.state.titulo3 })}
            />
          15:00: Ana-Karina Rodríguez
          <p>Data analytics: empowering insights and informed decision-making </p>
          </label>
          <br />
          <label  className="tutoriales">
            <input
            class="tut"
              type="checkbox"
              name="titulo4"
              checked={this.state.titulo4}
              onChange={() => this.setState({ titulo4: !this.state.titulo4 })}
            />
             15:00: Ricardo Reis
             <p> Trends on micro and nanoelectronics </p>
          </label>
          <br />
        </div>
      )}
             <label>
              <br />
             <input
               type="checkbox"
               name="impuesto"
               checked={this.state.impuesto}
               onChange={() => this.setState({ impuesto: !this.state.impuesto })}
             />
              ¿Requiere pagar impuestos?
           </label>
           <br />
           {this.state.impuesto && (
              <label>
               Porcentaje a pagar
                <br/>
                <input
                  type="number"
                  name="pimpuesto"
                  value={this.state.pimpuesto}
                  onChange={this.handleInputChange}
                />
              </label>
            )}
            <br />
            <label>
              Código de descuento
            <input
              type="text"
              name="cupon"
              value={this.state.cupon}
              onChange={this.handleInputChange}
            />
             </label>
             <br />
            <label  className="condicion">
             <input
               type="checkbox"
               name="condiciones"
               checked={this.state.condiciones}
               onChange={() => this.setState({ condiciones: !this.state.condiciones })}
               required
             />
              PROTECCIÓN DE DATOS PERSONALES
              <p>
                Con la suscripción y diligenciamiento del presente formulario, usted acepta
                el uso y tratamiento que da la universidad a esta información en consonancia
                con las políticas contenidas en el siguiente link:{" "}
                <a href="http://www.uninorte.edu.co/politica-de-privacidad-de-datos" target="_blank"  style={{ color: 'yellow' }}>
                  www.uninorte.edu.co/politica-de-privacidad-de-datos
                </a>
                , las cuales declara conocer.
              </p>
          
           </label>
            <br />

          <button type="submit">Confirmar</button>

          {this.state.mostrarMensajeExito && (
        <div style={{ color: 'yellow', fontSize: '1.3vw', marginTop: '10px' }}>
          Información guardada exitosamente, continue en la sección de pago
        </div>
       
        )}
         </div> 
          )}

            {this.state.opregistro === 'extra' && (
          <div class="naselect">

            <label>
            Ingrese su Documento de identidad
            <br />
            <input
              type="text"
              name="ndoc"
              value={this.state.ndoc}
              onChange={this.handleInputChange}
              required
            />
          </label>
          <br />
        
          <button type="submit" onClick={this.handleValidardoc}>Validar</button>
          
        {this.state.validarname &&(
          <div>
        {this.state.selectedNombreApellido ? (
          <div>
            <label>
            <h2>Usuario: {this.state.selectedNombreApellido}</h2>
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
        ) : (
          <div>
            <h2 style={{ color: 'white', }}>Usuario no encontrado</h2>
          </div>
        )}
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
            <h1>Sección de pago</h1>
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






