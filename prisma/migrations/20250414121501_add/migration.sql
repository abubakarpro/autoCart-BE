-- AlterTable
CREATE SEQUENCE adreport_count_seq;
ALTER TABLE "AdReport" ALTER COLUMN "count" SET DEFAULT nextval('adreport_count_seq');
ALTER SEQUENCE adreport_count_seq OWNED BY "AdReport"."count";

-- AlterTable
CREATE SEQUENCE userreport_count_seq;
ALTER TABLE "UserReport" ALTER COLUMN "count" SET DEFAULT nextval('userreport_count_seq');
ALTER SEQUENCE userreport_count_seq OWNED BY "UserReport"."count";
