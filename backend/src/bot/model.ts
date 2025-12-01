export interface packetBot {
    alerta: string;
    dados: {
        accel_g: number;
        pitch: number;
        roll: number;
    };
    localizacao: {
        lat: number;
        lon: number;
        valid: boolean;
    };
}