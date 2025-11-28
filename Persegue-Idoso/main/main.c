#include <stdio.h>
#include <string.h>
#include <math.h> // Necessário para sqrt, atan, pow, fabs

#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/semphr.h"

#include "nvs_flash.h"
#include "esp_wifi.h"
#include "esp_event.h"
#include "esp_log.h"

#include "wifi_modulo.h"
#include "mqtt_modulo.h"
#include "acelerometro_modulo.h"

static const char *TAG = "CAIU";

// --- Definições baseadas no Artigo [cite: 95, 131, 134] ---
#define MPU_SENSITIVITY 16384.0 // Assumindo escala padrão de +/- 2g
#define GRAVITY 9.81            // Aceleração da gravidade (referência)
#define THRESHOLD_FALL_LOW 0.8  // Limiar inferior (0.8g) para detectar queda livre 
#define THRESHOLD_ANGLE 60.0    // Ângulo em graus para considerar que está deitado 
#define PI 3.14159265


// Estados para a máquina de estados de detecção
typedef enum {
    MONITORING,
    FALL_DETECTED_WAIT,
    CHECK_ORIENTATION
} State_t;

void app_main(void)
{
    // Inicializa NVS
    esp_err_t ret = nvs_flash_init();
    if (ret == ESP_ERR_NVS_NO_FREE_PAGES || ret == ESP_ERR_NVS_NEW_VERSION_FOUND) {
        ESP_ERROR_CHECK(nvs_flash_erase());
        ret = nvs_flash_init();
    }
    ESP_ERROR_CHECK(ret);

    ESP_LOGI(TAG, "Inicializando MPU6050...");
    esp_err_t err = mpu6050_init();
    if (err != ESP_OK) {
        ESP_LOGE(TAG, "Falha ao inicializar MPU6050 (err=0x%x)", err);
    }

    char mensagem[128];
    Mpu6050Data dados_mpu;
    
    // Variáveis de controle do algoritmo
    State_t current_state = MONITORING;
    TickType_t fall_timer_start = 0;

    while (true) {
        // Lê os dados do sensor
        if (mpu6050_read(&dados_mpu) == ESP_OK) {
            
            // 1. Converter Raw data para 'g' (força G)
            float ax_g = dados_mpu.accel_x / MPU_SENSITIVITY;
            float ay_g = dados_mpu.accel_y / MPU_SENSITIVITY;
            float az_g = dados_mpu.accel_z / MPU_SENSITIVITY;

            ESP_LOGI(TAG, "Acelerações (g): Ax=%.2f Ay=%.2f Az=%.2f", ax_g, ay_g, az_g);

            // 2. Calcular Aceleração Líquida (Anet) - Equação (1) do PDF 
            // Anet = raiz(Ax^2 + Ay^2 + Az^2)
            float a_net = sqrt(pow(ax_g, 2) + pow(ay_g, 2) + pow(az_g, 2));

            // 3. Calcular Pitch e Roll (em graus) - Necessário para Equação (2) e lógica [cite: 99, 134]
            // Fórmulas padrão baseadas em acelerômetro
            float roll = atan(ay_g / sqrt(pow(ax_g, 2) + pow(az_g, 2))) * 180.0 / PI;
            float pitch = atan(-ax_g / sqrt(pow(ay_g, 2) + pow(az_g, 2))) * 180.0 / PI;

            // Log para debug (opcional, pode comentar depois)
            //ESP_LOGI(TAG, "Anet: %.2fg | Pitch: %.2f | Roll: %.2f", a_net, pitch, roll);

            // --- ALGORITMO DE DETECÇÃO DE QUEDA (Figura 3 do PDF) [cite: 106] ---

            switch (current_state) {
                case MONITORING:
                    // Passo 1: Detectar Queda Livre (Anet < Limiar)
                    // O texto diz: "during a fall, the Anet will tend towards 0g" 
                    // Se baixar de 0.8g, inicia a suspeita 
                    if (a_net < THRESHOLD_FALL_LOW) {
                        ESP_LOGW(TAG, "POSSÍVEL QUEDA DETECTADA! (Anet=%.2fg)", a_net);
                        current_state = FALL_DETECTED_WAIT;
                        fall_timer_start = xTaskGetTickCount(); // Marca o tempo
                    }
                    break;

                case FALL_DETECTED_WAIT:
                    // Passo 2: Esperar o impacto e estabilização
                    // O artigo sugere checar orientação após um curto período (ex: 2s) 
                    if ((xTaskGetTickCount() - fall_timer_start) > pdMS_TO_TICKS(2000)) {
                        current_state = CHECK_ORIENTATION;
                    }
                    break;

                case CHECK_ORIENTATION:
                    // Passo 3: Verificar Orientação (Roll e Pitch > 60 graus) 
                    // Se o ângulo for alto, indica que a pessoa não está em pé (está caída)
                    if (fabs(pitch) > THRESHOLD_ANGLE || fabs(roll) > THRESHOLD_ANGLE) {
                        
                        // Passo 4: Confirmar Queda (Alarme)
                        // O artigo menciona esperar mais 20s para ver se levanta,
                        // aqui vamos acionar o alerta direto para simplificar o exemplo.
                        
                        ESP_LOGE(TAG, "ALERTA: QUEDA CONFIRMADA! O usuário está caído.");
                        
                        // Monta JSON de alerta
                        snprintf(mensagem, sizeof(mensagem),
                                 "{\"alerta\": \"QUEDA\", \"anet\": %.2f, \"pitch\": %.2f}",
                                 a_net, pitch);
                        
                        // Enviar via MQTT aqui se necessário
                        // mqtt_envia_mensagem("sensores/alarme", mensagem);

                    } else {
                        ESP_LOGI(TAG, "Falso positivo. Usuário recuperou postura vertical.");
                    }
                    
                    // Reseta para monitoramento
                    current_state = MONITORING;
                    break;
            }

        } else {
            ESP_LOGE(TAG, "Erro de leitura do MPU6050");
        }

        // IMPORTANTE: Reduzi o delay para 100ms (10Hz).
        // 1500ms é muito lento para detectar o pico de 0g de uma queda.
        vTaskDelay(pdMS_TO_TICKS(100)); 
    }
}