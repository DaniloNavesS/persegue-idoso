idf_component_register(SRCS "hello_world_main.c" "include/wifi_modulo/wifi_modulo.c"
                       PRIV_REQUIRES spi_flash esp_wifi nvs_flash esp_event
                       INCLUDE_DIRS "."
                                    "include/wifi_modulo")
