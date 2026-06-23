-- MySQL Workbench Synchronization
-- Generated: 2026-06-16 20:53
-- Model: New Model
-- Version: 1.0
-- Project: Name of the project
-- Author: Unknown

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

ALTER SCHEMA `croupier`  DEFAULT CHARACTER SET utf8  DEFAULT COLLATE utf8_general_ci ;

CREATE TABLE IF NOT EXISTS `croupier`.`Usuario` (
  `idUsuario` INT(11) GENERATED ALWAYS AS (),
  `nomeUsuario` VARCHAR(90) NOT NULL,
  `emailUsuario` VARCHAR(90) NOT NULL,
  `senhaUsuario` VARCHAR(90) NOT NULL,
  `dataDeCriacao` DATE GENERATED ALWAYS AS (),
  PRIMARY KEY (`idUsuario`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `croupier`.`GrupoBaralho` (
  `idGrupoBaralho` INT(11) GENERATED ALWAYS AS () VIRTUAL,
  `nomeGrupoDeBaralho` VARCHAR(90) NOT NULL DEFAULT 'Novo Baralho',
  `idUsuarioRelacionado` INT(11) NOT NULL,
  `tag` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`idGrupoBaralho`),
  INDEX `fk_GrupoBaralho_Usuario_idx` (`idUsuarioRelacionado` ASC) VISIBLE,
  CONSTRAINT `fk_GrupoBaralho_Usuario`
    FOREIGN KEY (`idUsuarioRelacionado`)
    REFERENCES `croupier`.`Usuario` (`idUsuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `croupier`.`Baralho` (
  `idBaralho` INT(11) GENERATED ALWAYS AS (),
  `nomeBaralho` VARCHAR(45) NOT NULL,
  `idGrupoBaralhoRelacionado` INT(11) NOT NULL,
  PRIMARY KEY (`idBaralho`),
  INDEX `fk_Baralho_GrupoBaralho1_idx` (`idGrupoBaralhoRelacionado` ASC) VISIBLE,
  CONSTRAINT `fk_Baralho_GrupoBaralho1`
    FOREIGN KEY (`idGrupoBaralhoRelacionado`)
    REFERENCES `croupier`.`GrupoBaralho` (`idGrupoBaralho`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `croupier`.`FlashCard` (
  `idFlashCard` INT(11) GENERATED ALWAYS AS (),
  `pergunta` VARCHAR(200) NOT NULL,
  `resposta` VARCHAR(100) NOT NULL,
  `quantidadeAcerto` INT(11) NOT NULL,
  `quantidadeErro` INT(11) NOT NULL,
  `dificuldade` INT(11) GENERATED ALWAYS AS (0),
  `Baralho_idBaralho` INT(11) NOT NULL,
  PRIMARY KEY (`idFlashCard`),
  INDEX `fk_FlashCard_Baralho1_idx` (`Baralho_idBaralho` ASC) VISIBLE,
  CONSTRAINT `fk_FlashCard_Baralho1`
    FOREIGN KEY (`Baralho_idBaralho`)
    REFERENCES `croupier`.`Baralho` (`idBaralho`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `croupier`.`BaralhoCompartilhaComUsuarios` (
  `idUsuario` INT(11) NOT NULL,
  `idGrupoBaralho` INT(11) NOT NULL,
  `permitirEdicao` TINYINT(4) GENERATED ALWAYS AS (0),
  PRIMARY KEY (`idUsuario`, `idGrupoBaralho`),
  INDEX `fk_Usuario_has_GrupoBaralho_GrupoBaralho1_idx` (`idGrupoBaralho` ASC) VISIBLE,
  INDEX `fk_Usuario_has_GrupoBaralho_Usuario1_idx` (`idUsuario` ASC) VISIBLE,
  CONSTRAINT `fk_Usuario_has_GrupoBaralho_Usuario1`
    FOREIGN KEY (`idUsuario`)
    REFERENCES `croupier`.`Usuario` (`idUsuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Usuario_has_GrupoBaralho_GrupoBaralho1`
    FOREIGN KEY (`idGrupoBaralho`)
    REFERENCES `croupier`.`GrupoBaralho` (`idGrupoBaralho`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `croupier`.`FeedbackGrupoCompartilhado` (
  `idFeedbackGrupoCompartilhado` INT(11) GENERATED ALWAYS AS () VIRTUAL,
  `descricaoFeedback` TEXT(255) NOT NULL,
  `estrelaFeedback` INT(11) NOT NULL,
  `GrupoBaralho_idGrupoBaralho` INT(11) NOT NULL,
  `Usuario_idUsuario` INT(11) NOT NULL,
  PRIMARY KEY (`idFeedbackGrupoCompartilhado`, `GrupoBaralho_idGrupoBaralho`, `Usuario_idUsuario`),
  INDEX `fk_FeedbackGrupoCompartilhado_GrupoBaralho1_idx` (`GrupoBaralho_idGrupoBaralho` ASC) VISIBLE,
  INDEX `fk_FeedbackGrupoCompartilhado_Usuario1_idx` (`Usuario_idUsuario` ASC) VISIBLE,
  CONSTRAINT `fk_FeedbackGrupoCompartilhado_GrupoBaralho1`
    FOREIGN KEY (`GrupoBaralho_idGrupoBaralho`)
    REFERENCES `croupier`.`GrupoBaralho` (`idGrupoBaralho`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_FeedbackGrupoCompartilhado_Usuario1`
    FOREIGN KEY (`Usuario_idUsuario`)
    REFERENCES `croupier`.`Usuario` (`idUsuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

DROP TABLE IF EXISTS `croupier`.`user` ;

DROP TABLE IF EXISTS `croupier`.`_prisma_migrations` ;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
