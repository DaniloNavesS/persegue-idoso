CREATE TABLE gps_area_segura (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    pontos JSONB NOT NULL,
    ativo BOOLEAN NOT NULL
);
