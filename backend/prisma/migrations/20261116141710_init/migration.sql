-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('ORGANIZER', 'ADMIN') NOT NULL DEFAULT 'ORGANIZER',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tournament` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `maxTeams` INTEGER NOT NULL,
    `format` VARCHAR(191) NOT NULL DEFAULT 'LEAGUE',
    `status` ENUM('DRAFT', 'REGISTRATION_OPEN', 'ONGOING', 'COMPLETED') NOT NULL DEFAULT 'DRAFT',
    `winPoints` INTEGER NOT NULL DEFAULT 2,
    `tiePoints` INTEGER NOT NULL DEFAULT 1,
    `lossPoints` INTEGER NOT NULL DEFAULT 0,
    `organizerId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Tournament_organizerId_idx`(`organizerId`),
    INDEX `Tournament_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Team` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `logo` VARCHAR(191) NULL,
    `captainId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Team_name_idx`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Player` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `age` INTEGER NULL,
    `role` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TournamentTeam` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tournamentId` INTEGER NOT NULL,
    `teamId` INTEGER NOT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `registeredAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `TournamentTeam_status_idx`(`status`),
    UNIQUE INDEX `TournamentTeam_tournamentId_teamId_key`(`tournamentId`, `teamId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TournamentPlayer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tournamentId` INTEGER NOT NULL,
    `teamId` INTEGER NOT NULL,
    `playerId` INTEGER NOT NULL,
    `joinedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `TournamentPlayer_teamId_idx`(`teamId`),
    UNIQUE INDEX `TournamentPlayer_tournamentId_playerId_key`(`tournamentId`, `playerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Match` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tournamentId` INTEGER NOT NULL,
    `homeTeamId` INTEGER NOT NULL,
    `awayTeamId` INTEGER NOT NULL,
    `round` INTEGER NOT NULL,
    `matchDate` DATETIME(3) NULL,
    `venue` VARCHAR(191) NULL,
    `status` ENUM('SCHEDULED', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'SCHEDULED',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Match_tournamentId_round_idx`(`tournamentId`, `round`),
    INDEX `Match_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MatchResult` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `matchId` INTEGER NOT NULL,
    `homeScore` INTEGER NOT NULL,
    `awayScore` INTEGER NOT NULL,
    `outcome` ENUM('WIN', 'TIE', 'DRAW') NOT NULL,
    `winnerTeamId` INTEGER NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `MatchResult_matchId_key`(`matchId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PlayerMatchStat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `matchId` INTEGER NOT NULL,
    `playerId` INTEGER NOT NULL,
    `teamId` INTEGER NOT NULL,
    `runs` INTEGER NOT NULL DEFAULT 0,
    `wickets` INTEGER NOT NULL DEFAULT 0,
    `ballsFaced` INTEGER NOT NULL DEFAULT 0,
    `ballsBowled` INTEGER NOT NULL DEFAULT 0,

    INDEX `PlayerMatchStat_playerId_idx`(`playerId`),
    INDEX `PlayerMatchStat_teamId_idx`(`teamId`),
    UNIQUE INDEX `PlayerMatchStat_matchId_playerId_key`(`matchId`, `playerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Tournament` ADD CONSTRAINT `Tournament_organizerId_fkey` FOREIGN KEY (`organizerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Team` ADD CONSTRAINT `Team_captainId_fkey` FOREIGN KEY (`captainId`) REFERENCES `Player`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TournamentTeam` ADD CONSTRAINT `TournamentTeam_tournamentId_fkey` FOREIGN KEY (`tournamentId`) REFERENCES `Tournament`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TournamentTeam` ADD CONSTRAINT `TournamentTeam_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `Team`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TournamentPlayer` ADD CONSTRAINT `TournamentPlayer_tournamentId_fkey` FOREIGN KEY (`tournamentId`) REFERENCES `Tournament`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TournamentPlayer` ADD CONSTRAINT `TournamentPlayer_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `Team`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TournamentPlayer` ADD CONSTRAINT `TournamentPlayer_playerId_fkey` FOREIGN KEY (`playerId`) REFERENCES `Player`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Match` ADD CONSTRAINT `Match_tournamentId_fkey` FOREIGN KEY (`tournamentId`) REFERENCES `Tournament`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Match` ADD CONSTRAINT `Match_homeTeamId_fkey` FOREIGN KEY (`homeTeamId`) REFERENCES `Team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Match` ADD CONSTRAINT `Match_awayTeamId_fkey` FOREIGN KEY (`awayTeamId`) REFERENCES `Team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MatchResult` ADD CONSTRAINT `MatchResult_matchId_fkey` FOREIGN KEY (`matchId`) REFERENCES `Match`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MatchResult` ADD CONSTRAINT `MatchResult_winnerTeamId_fkey` FOREIGN KEY (`winnerTeamId`) REFERENCES `Team`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlayerMatchStat` ADD CONSTRAINT `PlayerMatchStat_matchId_fkey` FOREIGN KEY (`matchId`) REFERENCES `Match`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlayerMatchStat` ADD CONSTRAINT `PlayerMatchStat_playerId_fkey` FOREIGN KEY (`playerId`) REFERENCES `Player`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlayerMatchStat` ADD CONSTRAINT `PlayerMatchStat_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `Team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
