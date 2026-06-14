SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS `plataformas_db`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `plataformas_db`;

CREATE TABLE users (
  id         INT          NOT NULL AUTO_INCREMENT,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) NOT NULL,
  password   VARCHAR(255) NOT NULL,
  is_admin   BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
);

CREATE TABLE masters (
  id         INT          NOT NULL AUTO_INCREMENT,
  name       VARCHAR(100) NOT NULL,
  specialty  VARCHAR(100) NOT NULL,
  photo_url  VARCHAR(255),
  is_active  BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE services (
  id          INT            NOT NULL AUTO_INCREMENT,
  name        VARCHAR(100)   NOT NULL,
  description TEXT,
  price       DECIMAL(10, 2) NOT NULL,
  duration    INT            NOT NULL COMMENT 'duration in minutes',
  is_active   BOOLEAN        NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE master_services (
  master_id  INT NOT NULL,
  service_id INT NOT NULL,
  PRIMARY KEY (master_id, service_id),
  CONSTRAINT fk_ms_master  FOREIGN KEY (master_id)  REFERENCES masters(id)  ON DELETE CASCADE,
  CONSTRAINT fk_ms_service FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

CREATE TABLE appointments (
  id         INT      NOT NULL AUTO_INCREMENT,
  user_id    INT      NOT NULL,
  master_id  INT      NOT NULL,
  service_id INT      NOT NULL,
  date       DATE     NOT NULL,
  time       TIME     NOT NULL,
  status     ENUM('pending', 'confirmed', 'cancelled', 'completed') NOT NULL DEFAULT 'pending',
  notes      TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_apt_user    FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
  CONSTRAINT fk_apt_master  FOREIGN KEY (master_id)  REFERENCES masters(id)  ON DELETE RESTRICT,
  CONSTRAINT fk_apt_service FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE RESTRICT
);
