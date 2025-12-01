#ifndef GPS_MODULO_H
#define GPS_MODULO_H

#include <stdint.h>
#include <stdbool.h>
#include "esp_err.h"

typedef struct {
    float latitude;
    float longitude;
    float altitude;
    int satelites;
    bool valid; 
} GpsData;

void gps_init(void);
bool gps_read(GpsData *data);

#endif