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
                "login": "data/mocks/login/login-contratista.json",
                "logout": "data/mocks/logout/logout.json",
                "home": "data/mocks/home/home-contratista.json"
            }
        }
    }
);