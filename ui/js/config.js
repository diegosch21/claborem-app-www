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
                "personal": "http://www.c-laborem.com.ar/certronic/appMovil/contratista/tablaEmpleados.php",
                "contratos": "http://www.c-laborem.com.ar/certronic/appMovil/contratista/tablaContratos.php",
                "worker": "http://www.c-laborem.com.ar/certronic/appMovil/contratista/datosEmpleado.php",
                "contract" : "http://www.c-laborem.com.ar/certronic/appMovil/contratista/datosContrato.php",
                "vehiculos": "http://www.c-laborem.com.ar/certronic/appMovil/contratista/tablaVehiculos.php",
                "maquinarias": "http://www.c-laborem.com.ar/certronic/appMovil/contratista/tablaMaquinarias.php",
                "contratistas": "http://www.c-laborem.com.ar/certronic/appMovil/contratista/tablaContratistas.php",
                "vehiculo": "http://www.c-laborem.com.ar/certronic/appMovil/contratista/datosVehiculo.php",
                "maquinaria": "http://www.c-laborem.com.ar/certronic/appMovil/contratista/datosMaquinaria.php",
                "contratista": "http://www.c-laborem.com.ar/certronic/appMovil/contratista/datosContratista.php"

            }
        }
    }
);