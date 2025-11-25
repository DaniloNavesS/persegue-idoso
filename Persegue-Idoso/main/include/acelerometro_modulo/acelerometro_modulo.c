#include "acelerometro_modulo.h"
#include "driver/i2c.h"
#include "esp_log.h"

#define TAG "MPU6050"

#define I2C_MASTER_SCL_IO           22      // Pino SCL
#define I2C_MASTER_SDA_IO           21      // Pino SDA
#define I2C_MASTER_NUM              0       // Porta I2C (0 ou 1)
#define I2C_MASTER_FREQ_HZ          100000
#define I2C_MASTER_TX_BUF_DISABLE   0
#define I2C_MASTER_RX_BUF_DISABLE   0
#define I2C_MASTER_TIMEOUT_MS       1000

#define MPU6050_ADDR                0x68
#define MPU6050_PWR_MGMT_1          0x6B
#define MPU6050_ACCEL_XOUT_H        0x3B


static esp_err_t i2c_master_init(void)
{
    i2c_config_t conf = {
        .mode = I2C_MODE_MASTER,
        .sda_io_num = I2C_MASTER_SDA_IO,
        .scl_io_num = I2C_MASTER_SCL_IO,
        .sda_pullup_en = GPIO_PULLUP_ENABLE,
        .scl_pullup_en = GPIO_PULLUP_ENABLE,
        .master.clk_speed = I2C_MASTER_FREQ_HZ,
    };

    esp_err_t err = i2c_param_config(I2C_MASTER_NUM, &conf);
    if (err != ESP_OK) return err;

    return i2c_driver_install(I2C_MASTER_NUM, conf.mode, I2C_MASTER_RX_BUF_DISABLE, I2C_MASTER_TX_BUF_DISABLE, 0);
}

esp_err_t mpu6050_init(void)
{
    esp_err_t err = i2c_master_init();
    if (err != ESP_OK) {
        ESP_LOGE(TAG, "Falha ao instalar driver I2C");
        return err;
    }

    uint8_t data[2];
    data[0] = MPU6050_PWR_MGMT_1;
    data[1] = 0x00;

    err = i2c_master_write_to_device(I2C_MASTER_NUM, MPU6050_ADDR, data, 2, I2C_MASTER_TIMEOUT_MS / portTICK_PERIOD_MS);
    
    if (err == ESP_OK) {
        ESP_LOGI(TAG, "MPU6050 Inicializado com sucesso!");
    } else {
        ESP_LOGE(TAG, "MPU6050 não encontrado! Verifique as conexões.");
    }
    return err;
}

esp_err_t mpu6050_read(Mpu6050Data *data)
{
    uint8_t raw_data[14];
    uint8_t reg_addr = MPU6050_ACCEL_XOUT_H;

    esp_err_t err = i2c_master_write_read_device(I2C_MASTER_NUM, MPU6050_ADDR, &reg_addr, 1, raw_data, 14, I2C_MASTER_TIMEOUT_MS / portTICK_PERIOD_MS);

    if (err != ESP_OK) {
        ESP_LOGE(TAG, "Erro ao ler sensor");
        return err;
    }

    data->accel_x = (int16_t)(raw_data[0] << 8 | raw_data[1]);
    data->accel_y = (int16_t)(raw_data[2] << 8 | raw_data[3]);
    data->accel_z = (int16_t)(raw_data[4] << 8 | raw_data[5]);
    
    int16_t temp_raw = (int16_t)(raw_data[6] << 8 | raw_data[7]);
    data->temp = (temp_raw / 340.0) + 36.53;

    data->gyro_x = (int16_t)(raw_data[8] << 8 | raw_data[9]);
    data->gyro_y = (int16_t)(raw_data[10] << 8 | raw_data[11]);
    data->gyro_z = (int16_t)(raw_data[12] << 8 | raw_data[13]);

    return ESP_OK;
}