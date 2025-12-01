#include <stdio.h>
#include <string.h>
#include <math.h> 
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/semphr.h"
#include "nvs_flash.h"
#include "esp_log.h"


#include "wifi_modulo.h"
#include "mqtt_modulo.h"
#include "gps_modulo.h"
#include "acelerometro_modulo.h"

#define TAG "SYSTEM"

#define MPU_SENSITIVITY 16384.0 
#define THRESHOLD_FALL_LOW 0.5
#define THRESHOLD_ANGLE 60.0    
#define PI 3.14159265


typedef enum {
    MONITORING,
    FALL_DETECTED_WAIT,
    CHECK_ORIENTATION
} State_t;

// Semáforos e Mutexes
SemaphoreHandle_t conexaoWifiSemaphore;
SemaphoreHandle_t conexaoMQTTSemaphore;
SemaphoreHandle_t gpsDataMutex;

GpsData last_known_position = {0}; 

void task_conexao_manager(void * params)
{
    while(true) {
        if(xSemaphoreTake(conexaoWifiSemaphore, portMAX_DELAY)) {
            ESP_LOGI(TAG, "Wi-Fi OK. Iniciando MQTT...");
            mqtt_start();
        }
    }
}


void task_gps(void * params)
{
    xSemaphoreTake(conexaoMQTTSemaphore, portMAX_DELAY);
    xSemaphoreGive(conexaoMQTTSemaphore);

    char mqtt_payload[256];

    ESP_LOGI("GPS_TASK", "Iniciando GPS...");
    gps_init();

    while(true) {
        GpsData current_reading;
        bool valid = gps_read(&current_reading);

        if (valid && current_reading.valid) {
            xSemaphoreTake(gpsDataMutex, portMAX_DELAY);
            last_known_position = current_reading;
            xSemaphoreGive(gpsDataMutex);

            ESP_LOGD("GPS_TASK", "Posição atualizada: %.6f, %.6f", current_reading.latitude, current_reading.longitude);

            sprintf(mqtt_payload, 
                                "{"
                                  "\"usuarioId\": \"1\","
                                  "\"latitude\": \"%f\","
                                  "\"longitude\": \"%f\""
                                "}",
                                current_reading.latitude, 
                                current_reading.longitude);


            mqtt_envia_mensagem("usuario/gps", mqtt_payload);

        } else {
            ESP_LOGW("GPS_TASK", "Sem sinal de satélite...");
        }

        vTaskDelay(60000 / portTICK_PERIOD_MS);
    }
}


void task_detector_quedas(void * params)
{
    xSemaphoreTake(conexaoMQTTSemaphore, portMAX_DELAY);
    xSemaphoreGive(conexaoMQTTSemaphore);

    ESP_LOGI("FALL_TASK", "Iniciando MPU6050...");
    if (mpu6050_init() != ESP_OK) {
        ESP_LOGE("FALL_TASK", "Erro crítico: Acelerômetro não iniciou!");
        vTaskDelete(NULL);
    }

    State_t current_state = MONITORING;
    TickType_t fall_timer_start = 0;
    char mqtt_payload[256];
    Mpu6050Data dados_mpu;

    while(true) {
        if (mpu6050_read(&dados_mpu) == ESP_OK) {
            
            float ax_g = dados_mpu.accel_x / MPU_SENSITIVITY;
            float ay_g = dados_mpu.accel_y / MPU_SENSITIVITY;
            float az_g = dados_mpu.accel_z / MPU_SENSITIVITY;

            float a_net = sqrt(pow(ax_g, 2) + pow(ay_g, 2) + pow(az_g, 2));

            float roll = atan(ay_g / (sqrt(pow(ax_g, 2) + pow(az_g, 2)) + 0.001)) * 180.0 / PI;
            float pitch = atan(-ax_g / (sqrt(pow(ay_g, 2) + pow(az_g, 2)) + 0.001)) * 180.0 / PI;

            switch (current_state) {
                case MONITORING:
                    if (a_net < THRESHOLD_FALL_LOW) {
                        ESP_LOGW("FALL_TASK", "Queda livre detectada! (%.2fg). Monitorando impacto...", a_net);
                        fall_timer_start = xTaskGetTickCount();
                        current_state = FALL_DETECTED_WAIT;
                    }
                    break;

                case FALL_DETECTED_WAIT:
                    if ((xTaskGetTickCount() - fall_timer_start) > pdMS_TO_TICKS(2000)) {
                        current_state = CHECK_ORIENTATION;
                    }
                    break;

                case CHECK_ORIENTATION:
                    if (fabs(pitch) > THRESHOLD_ANGLE || fabs(roll) > THRESHOLD_ANGLE) {
                        
                        ESP_LOGE("FALL_TASK", "QUEDA CONFIRMADA! Pitch: %.2f, Roll: %.2f", pitch, roll);
                        
                        GpsData loc_snapshot = {0};
                        xSemaphoreTake(gpsDataMutex, portMAX_DELAY);
                        loc_snapshot = last_known_position;
                        xSemaphoreGive(gpsDataMutex);

                        sprintf(mqtt_payload, "ALERTA QUEDA");

                        mqtt_envia_mensagem("/usuario/queda", mqtt_payload);
                        
                        vTaskDelay(pdMS_TO_TICKS(10000));

                    } else {
                        ESP_LOGI("FALL_TASK", "Usuário se recuperou ou foi alarme falso.");
                    }
                    
                    current_state = MONITORING;
                    break;
            }
        }

        vTaskDelay(pdMS_TO_TICKS(100)); 
    }
}

void app_main(void)
{
    esp_err_t ret = nvs_flash_init();
    if (ret == ESP_ERR_NVS_NO_FREE_PAGES || ret == ESP_ERR_NVS_NEW_VERSION_FOUND) {
        ESP_ERROR_CHECK(nvs_flash_erase());
        ret = nvs_flash_init();
    }
    ESP_ERROR_CHECK(ret);

    conexaoWifiSemaphore = xSemaphoreCreateBinary();
    conexaoMQTTSemaphore = xSemaphoreCreateBinary();
    gpsDataMutex = xSemaphoreCreateMutex();

    wifi_start();

    // Task de Conexão
    xTaskCreate(task_conexao_manager, "ConnManager", 4096, NULL, 5, NULL);
    // Task do GPS (Prioridade baixa, 2)
    xTaskCreate(task_gps, "GpsTask", 4096, NULL, 2, NULL);
    // Task de Queda (Prioridade Alta, 10)
    // xTaskCreate(task_detector_quedas, "FallTask", 4096, NULL, 10, NULL);
}