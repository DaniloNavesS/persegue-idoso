#include <stdio.h>
#include <string.h>
#include "nvs_flash.h"
#include "esp_wifi.h"
#include "esp_event.h"
#include "esp_log.h"
#include "freertos/semphr.h"

// Seus módulos
#include "wifi_modulo.h"
#include "mqtt_modulo.h"
#include "acelerometro_modulo.h"

SemaphoreHandle_t conexaoWifiSemaphore;
SemaphoreHandle_t conexaoMQTTSemaphore;

void conectadoWifi(void * params)
{
  while(true)
  {
    if(xSemaphoreTake(conexaoWifiSemaphore, portMAX_DELAY))
    {
      ESP_LOGI("Main", "Wifi Conectado. Iniciando MQTT...");
      mqtt_start();
    }
  }
}

void trataComunicacaoComServidor(void * params)
{
  char mensagem[128]; 
  
  // Aguarda o MQTT conectar
  if(xSemaphoreTake(conexaoMQTTSemaphore, portMAX_DELAY))
  {
    ESP_LOGI("Main", "MQTT Conectado. Iniciando MPU6050...");

    // <--- 2. Inicializa o sensor aqui
    if (mpu6050_init() != ESP_OK) {
        ESP_LOGE("Main", "Falha no MPU6050! Reiniciando task...");
        vTaskDelete(NULL); // Ou trata o erro como preferir
    }

    while(true)
    {
       Mpu6050Data dados_mpu;

       if(mpu6050_read(&dados_mpu) == ESP_OK) 
       {

           sprintf(mensagem, "{\"ax\": %d, \"ay\": %d, \"az\": %d, \"temp\": %.2f}", 
                   dados_mpu.accel_x, 
                   dados_mpu.accel_y, 
                   dados_mpu.accel_z, 
                   dados_mpu.temp);
           
           mqtt_envia_mensagem("sensores/mpu6050", mensagem);
           
           ESP_LOGI("Main", "Dados enviados: %s", mensagem);
       } 
       else 
       {
           ESP_LOGE("Main", "Erro de leitura I2C");
       }

       vTaskDelay(3000 / portTICK_PERIOD_MS);
    }
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
    
    wifi_start();

    xTaskCreate(&conectadoWifi,  "Conexão MQTT", 4096, NULL, 1, NULL);
    xTaskCreate(&trataComunicacaoComServidor, "Envio Dados", 4096, NULL, 1, NULL);
}