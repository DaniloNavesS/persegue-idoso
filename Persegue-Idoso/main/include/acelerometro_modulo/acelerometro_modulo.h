#ifndef ACELEROMETRO_MODULO_H
#define ACELEROMETRO_MODULO_H

#include <stdint.h>
#include "esp_err.h"

typedef struct {
    int16_t accel_x;
    int16_t accel_y;
    int16_t accel_z;
    int16_t gyro_x;
    int16_t gyro_y;
    int16_t gyro_z;
    float temp;
} Mpu6050Data;

esp_err_t mpu6050_init(void);
esp_err_t mpu6050_read(Mpu6050Data *data);

#endif