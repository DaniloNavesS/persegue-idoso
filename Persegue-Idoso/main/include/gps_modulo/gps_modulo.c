#include "gps_modulo.h"
#include "driver/uart.h"
#include "esp_log.h"
#include "string.h"
#include "stdlib.h"

#define TAG_GPS "GPS"

#define UART_PORT_NUM      UART_NUM_2
#define GPS_TX_PIN         17
#define GPS_RX_PIN         16
#define BUF_SIZE           1024

static float convert_nmea_to_decimal(float nmea_val) {
    int degrees = (int)(nmea_val / 100);
    float minutes = nmea_val - (degrees * 100);
    return degrees + (minutes / 60.0f);
}

void gps_init(void) {
    uart_config_t uart_config = {
        .baud_rate = 9600,
        .data_bits = UART_DATA_8_BITS,
        .parity    = UART_PARITY_DISABLE,
        .stop_bits = UART_STOP_BITS_1,
        .flow_ctrl = UART_HW_FLOWCTRL_DISABLE,
        .source_clk = UART_SCLK_DEFAULT,
    };

    ESP_ERROR_CHECK(uart_driver_install(UART_PORT_NUM, BUF_SIZE * 2, 0, 0, NULL, 0));
    ESP_ERROR_CHECK(uart_param_config(UART_PORT_NUM, &uart_config));
    ESP_ERROR_CHECK(uart_set_pin(UART_PORT_NUM, GPS_TX_PIN, GPS_RX_PIN, UART_PIN_NO_CHANGE, UART_PIN_NO_CHANGE));
    
    ESP_LOGI(TAG_GPS, "GPS UART Iniciada");
}

bool gps_read(GpsData *data) {
    uint8_t *buffer = (uint8_t *) malloc(BUF_SIZE);
    int len = uart_read_bytes(UART_PORT_NUM, buffer, BUF_SIZE - 1, 100 / portTICK_PERIOD_MS);
    
    if (len > 0) {
        buffer[len] = '\0'; // Finaliza string
        
        char *start = strstr((char*)buffer, "$GPGGA");
        if (start != NULL) {
            

            char lat_str[15] = {0}, lon_str[15] = {0};
            char ns_ind = 0, ew_ind = 0;
            int quality = 0, sats = 0;
            float alt = 0.0;
            float raw_lat = 0.0, raw_lon = 0.0;

            int count = sscanf(start, "$GPGGA,%*f,%f,%c,%f,%c,%d,%d,%*f,%f", 
                               &raw_lat, &ns_ind, &raw_lon, &ew_ind, &quality, &sats, &alt);

            if (count >= 5 && quality > 0) { 
                
                data->latitude = convert_nmea_to_decimal(raw_lat);
                if (ns_ind == 'S') data->latitude *= -1;

                data->longitude = convert_nmea_to_decimal(raw_lon);
                if (ew_ind == 'W') data->longitude *= -1;

                data->altitude = alt;
                data->satelites = sats;
                data->valid = true;
                
                free(buffer);
                return true;
            }
        }
    }
    
    data->valid = false;
    free(buffer);
    return false;
}