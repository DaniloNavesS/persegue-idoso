idf_component_register(SRCS "main.c"
                            "include/wifi_modulo/wifi_modulo.c"
                            "include/mqtt_modulo/mqtt_modulo.c"
                            "include/acelerometro_modulo/acelerometro_modulo.c"
                       PRIV_REQUIRES spi_flash esp_wifi nvs_flash esp_event mqtt driver
                       INCLUDE_DIRS "."
                                    "include/wifi_modulo"
                                    "include/mqtt_modulo"
                                    "include/acelerometro_modulo")
