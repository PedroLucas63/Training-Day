-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_training_participants" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "trainingId" TEXT NOT NULL,
    "participant_id" TEXT NOT NULL,
    CONSTRAINT "training_participants_trainingId_fkey" FOREIGN KEY ("trainingId") REFERENCES "trainings" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "training_participants_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_training_participants" ("id", "participant_id", "trainingId") SELECT "id", "participant_id", "trainingId" FROM "training_participants";
DROP TABLE "training_participants";
ALTER TABLE "new_training_participants" RENAME TO "training_participants";
CREATE TABLE "new_trainings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "creator_id" TEXT NOT NULL,
    "local" TEXT NOT NULL,
    "occurred_in" DATETIME NOT NULL,
    "maximum_participants" INTEGER,
    "password" TEXT,
    CONSTRAINT "trainings_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_trainings" ("creator_id", "id", "local", "maximum_participants", "occurred_in", "password", "title") SELECT "creator_id", "id", "local", "maximum_participants", "occurred_in", "password", "title" FROM "trainings";
DROP TABLE "trainings";
ALTER TABLE "new_trainings" RENAME TO "trainings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
