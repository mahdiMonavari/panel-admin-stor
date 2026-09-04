/*
  Warnings:

  - A unique constraint covering the columns `[name,type]` on the table `Attribute` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Attribute_name_type_key" ON "Attribute"("name", "type");
