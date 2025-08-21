CREATE DATABASE IF NOT EXISTS counter CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE counter;

CREATE TABLE IF NOT EXISTS events (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  button ENUM('plus','minus') NOT NULL,
  pressed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_pressed_at (pressed_at),
  INDEX idx_button (button)
);
