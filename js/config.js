"use strict";

 angular.module("AppConfig", [])

.constant("config", {
        "TAG":"Production Configuration File",
        "mocks" : {
          "menu" : {
              "enable":true
          }
        },
        "api":{
            "methods":{
                "login": "http://www.c-laborem.com.ar/certronic/appMovil/login.php",
                "logout": "data/mocks/logout/logout.json",
                "home": "http://www.c-laborem.com.ar/certronic/appMovil/contratista/home.php",
                "contratos": "http://www.c-laborem.com.ar/certronic/appMovil/contratista/tablaContratos.php",
                "contrato" : "http://www.c-laborem.com.ar/certronic/appMovil/contratista/datosContrato.php",
                "contratistas": "http://www.c-laborem.com.ar/certronic/appMovil/contratista/tablaContratistas.php",
                "contratista": "http://www.c-laborem.com.ar/certronic/appMovil/contratista/datosContratista.php",
                "personal": "http://www.c-laborem.com.ar/certronic/appMovil/contratista/tablaEmpleados.php",
                "empleado": "http://www.c-laborem.com.ar/certronic/appMovil/contratista/datosEmpleado.php",
                "vehiculos": "http://www.c-laborem.com.ar/certronic/appMovil/contratista/tablaVehiculos.php",
                "vehiculo": "http://www.c-laborem.com.ar/certronic/appMovil/contratista/datosVehiculo.php",
                "maquinarias": "http://www.c-laborem.com.ar/certronic/appMovil/contratista/tablaMaquinarias.php",
                "maquinaria": "http://www.c-laborem.com.ar/certronic/appMovil/contratista/datosMaquinaria.php",
                "reportes": "http://www.c-laborem.com.ar/certronic/appMovil/contratista/reportes.php",

                "homePlanta": "http://www.c-laborem.com.ar/certronic/appMovil/planta/homePlanta.php",
                "contratosPlanta": "http://www.c-laborem.com.ar/certronic/appMovil/planta/tablaContratos.php",
                "contratoPlanta" : "http://www.c-laborem.com.ar/certronic/appMovil/planta/datosContrato.php",
                "contratistasPlanta": "http://www.c-laborem.com.ar/certronic/appMovil/planta/tablaContratistas.php",
                "contratistaPlanta": "http://www.c-laborem.com.ar/certronic/appMovil/planta/datosContratista.php",
                "personalPlanta": "http://www.c-laborem.com.ar/certronic/appMovil/planta/tablaEmpleados.php",
                "empleadoPlanta": "http://www.c-laborem.com.ar/certronic/appMovil/planta/datosEmpleado.php",
                "vehiculosPlanta": "http://www.c-laborem.com.ar/certronic/appMovil/planta/tablaVehiculos.php",
                "vehiculoPlanta": "http://www.c-laborem.com.ar/certronic/appMovil/planta/datosVehiculo.php",
                "maquinariasPlanta": "http://www.c-laborem.com.ar/certronic/appMovil/planta/tablaMaquinarias.php",
                "maquinariaPlanta": "http://www.c-laborem.com.ar/certronic/appMovil/planta/datosMaquinaria.php"
                
            }
        }
    }
);