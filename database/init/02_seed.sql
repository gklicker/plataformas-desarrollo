SET NAMES utf8mb4;

USE `plataformas_db`;

-- Admin user (password: admin1234)
INSERT INTO users (name, email, password, is_admin) VALUES
('Administrador', 'admin@cortearte.com', '$2b$10$bDFzeuLYVo98gGzR4KiZwuP6uQzNysSI6gGD8RUpdkA8VQLmrypce', TRUE);

-- Masters
INSERT INTO masters (name, specialty, photo_url) VALUES
('Carlos Mendez',  'Corte de cabello y barba',  NULL),
('Sofia Herrera',  'Coloración y peinado',       NULL),
('Lucas Romero',   'Corte clásico y afeitado',   NULL);

-- Services
INSERT INTO services (name, description, price, duration) VALUES
('Corte de cabello',    'Corte personalizado para todo tipo de cabello',       1500.00, 30),
('Corte y barba',       'Corte de cabello más arreglo de barba completo',      2200.00, 45),
('Afeitado clásico',    'Afeitado con navaja y toalla caliente',               1200.00, 30),
('Coloración completa', 'Tintura completa con productos profesionales',         3500.00, 90),
('Mechas o rayitos',    'Técnica de mechas o balayage',                        4000.00, 120),
('Peinado',             'Peinado para eventos o uso diario',                   1000.00, 30);

-- Master → Services mapping
INSERT INTO master_services (master_id, service_id) VALUES
(1, 1), (1, 2), (1, 3),
(2, 1), (2, 4), (2, 5), (2, 6),
(3, 1), (3, 2), (3, 3);
