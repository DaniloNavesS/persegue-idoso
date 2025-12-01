export interface packetBot {
    alerta: string;
    localizacao: {
        lat: number;
        lon: number;
        valid: boolean;
    };
}