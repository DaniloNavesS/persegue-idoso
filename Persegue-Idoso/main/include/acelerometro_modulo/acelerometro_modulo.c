#include "acelerometro_modulo.h"
#include <stdbool.h>
#include "esp_log.h"
#include "driver/i2c_master.h"

#define TAG "MPU6050"

#define I2C_MASTER_SCL_IO 22      // Pino SCL
#define I2C_MASTER_SDA_IO 21      // Pino SDA
#define I2C_MASTER_PORT I2C_NUM_0 // Porta I2C 0
#define I2C_MASTER_FREQ_HZ 100000 // 100 kHz
#define I2C_MASTER_TIMEOUT_MS 1000

#define MPU6050_ADDR 0x68
#define MPU6050_PWR_MGMT_1 0x6B
#define MPU6050_ACCEL_XOUT_H 0x3B

/* --------------------------------------------------------------------------
 *  Handles globais
 *   - s_i2c_bus_handle: representa o barramento I2C
 *   - s_mpu6050_handle: representa o dispositivo MPU6050 nesse barramento
 * -------------------------------------------------------------------------- */

static i2c_master_bus_handle_t s_i2c_bus_handle = NULL;
static i2c_master_dev_handle_t s_mpu6050_handle = NULL;

/* --------------------------------------------------------------------------
 *  Inicializa o barramento I2C usando a API nova (i2c_new_master_bus)
 * -------------------------------------------------------------------------- */
static esp_err_t i2c_master_init(void)
{
    /* Se o barramento já foi criado antes, não precisamos inicializar de novo */
    if (s_i2c_bus_handle != NULL)
    {
        return ESP_OK;
    }

    /* Estrutura de configuração do barramento (GPIOs, fonte de clock etc.) */
    i2c_master_bus_config_t bus_cfg = {
        .clk_source = I2C_CLK_SRC_DEFAULT, // Usa fonte de clock padrão do I2C
        .i2c_port = I2C_MASTER_PORT,       // Porta (controlador) I2C que vamos usar
        .scl_io_num = I2C_MASTER_SCL_IO,   // Pino SCL
        .sda_io_num = I2C_MASTER_SDA_IO,   // Pino SDA
        .glitch_ignore_cnt = 7,            // Filtro de ruídos (valor típico sugerido)
        .flags = {
            /* Habilita pull-up interno – para protótipo ajuda, mas o ideal é resistor externo */
            .enable_internal_pullup = true,
        },
    };

    /* Cria e inicializa o barramento I2C.
       Se der certo, s_i2c_bus_handle passa a apontar para o barramento. */
    esp_err_t err = i2c_new_master_bus(&bus_cfg, &s_i2c_bus_handle);
    if (err != ESP_OK)
    {
        ESP_LOGE(TAG, "Falha ao criar barramento I2C (err=0x%x)", err);
        return err;
    }

    return ESP_OK;
}

/* --------------------------------------------------------------------------
 *  Inicialização do MPU6050
 * -------------------------------------------------------------------------- */
esp_err_t mpu6050_init(void)
{
    esp_err_t err;

    /* 1) Garante que o barramento I2C está inicializado */
    err = i2c_master_init();
    if (err != ESP_OK)
    {
        ESP_LOGE(TAG, "Falha ao inicializar barramento I2C");
        return err;
    }

    /* 2) Configura os parâmetros do dispositivo MPU6050 no barramento */
    i2c_device_config_t dev_cfg = {
        .dev_addr_length = I2C_ADDR_BIT_LEN_7, // Endereço de 7 bits
        .device_address = MPU6050_ADDR,        // Endereço do MPU6050 (0x68)
        .scl_speed_hz = I2C_MASTER_FREQ_HZ,    // Velocidade do clock para este device
        .scl_wait_us = 0,                      // 0 = valor padrão de espera
    };

    /* 3) Adiciona o MPU6050 ao barramento e obtém um handle para ele */
    err = i2c_master_bus_add_device(s_i2c_bus_handle, &dev_cfg, &s_mpu6050_handle);
    if (err != ESP_OK)
    {
        ESP_LOGE(TAG, "Falha ao adicionar MPU6050 ao barramento I2C (err=0x%x)", err);
        return err;
    }

    /* 4) Escreve no registrador PWR_MGMT_1 para “acordar” o sensor
       Protocolo: [ endereço_registro | valor ] */
    uint8_t cmd[2];
    cmd[0] = MPU6050_PWR_MGMT_1; // Registrador de controle de energia
    cmd[1] = 0x00;               // 0x00 = acorda o MPU6050 (usa clock interno)

    /* i2c_master_transmit envia esse buffer para o slave selecionado */
    err = i2c_master_transmit(
        s_mpu6050_handle,     // Handle do dispositivo MPU6050
        cmd,                  // Buffer com registro + dado
        sizeof(cmd),          // Tamanho do buffer (2 bytes)
        I2C_MASTER_TIMEOUT_MS // Timeout em milissegundos
    );

    if (err == ESP_OK)
    {
        ESP_LOGI(TAG, "MPU6050 inicializado com sucesso (API nova i2c_master)");
    }
    else
    {
        ESP_LOGE(TAG, "MPU6050 nao respondeu na inicializacao (err=0x%x)", err);
    }

    return err;
}

/* --------------------------------------------------------------------------
 *  Leitura dos dados do MPU6050 usando i2c_master_transmit_receive
 * -------------------------------------------------------------------------- */
esp_err_t mpu6050_read(Mpu6050Data *data)
{
    if (s_mpu6050_handle == NULL)
    {
        ESP_LOGE(TAG, "MPU6050 nao foi inicializado antes da leitura");
        return ESP_ERR_INVALID_STATE;
    }

    uint8_t reg_addr = MPU6050_ACCEL_XOUT_H;
    uint8_t raw_data[14];

    /* i2c_master_transmit_receive faz exatamente o padrão "escreve o endereço
       do registrador e em seguida lê N bytes" em uma única transação I2C. */
    esp_err_t err = i2c_master_transmit_receive(
        s_mpu6050_handle,     // Dispositivo MPU6050
        &reg_addr,            // Buffer de escrita: endereço do registrador
        1,                    // Tamanho da escrita (1 byte)
        raw_data,             // Buffer de leitura
        sizeof(raw_data),     // Quantidade de bytes a ler (14)
        I2C_MASTER_TIMEOUT_MS // Timeout
    );

    if (err != ESP_OK)
    {
        ESP_LOGE(TAG, "Erro ao ler dados do MPU6050 (err=0x%x)", err);
        return err;
    }

    /* Monta os valores 16 bits (high << 8 | low) para cada eixo */

    data->accel_x = (int16_t)((raw_data[0] << 8) | raw_data[1]);
    data->accel_y = (int16_t)((raw_data[2] << 8) | raw_data[3]);
    data->accel_z = (int16_t)((raw_data[4] << 8) | raw_data[5]);

    int16_t temp_raw = (int16_t)((raw_data[6] << 8) | raw_data[7]);
    /* Fórmula do datasheet: Temp(°C) = temp_raw / 340 + 36.53 */
    data->temp = (temp_raw / 340.0f) + 36.53f;

    data->gyro_x = (int16_t)((raw_data[8] << 8) | raw_data[9]);
    data->gyro_y = (int16_t)((raw_data[10] << 8) | raw_data[11]);
    data->gyro_z = (int16_t)((raw_data[12] << 8) | raw_data[13]);

    return ESP_OK;
}
